import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Shield, 
  Star, 
  Check, 
  X, 
  Search,
  Heart,
  Phone,
  Globe,
  ChevronRight,
  Calculator,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type InsuranceProvider = Database['public']['Tables']['insurance_providers']['Row'];
type InsuranceQuote = Database['public']['Tables']['insurance_quotes']['Row'];
type Pet = Database['public']['Tables']['pets']['Row'];

interface ProviderWithQuotes extends InsuranceProvider {
  quotes?: InsuranceQuote[];
}

export default function InsuranceComparisonNew() {
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [coverageFilter, setCoverageFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  
  const [quoteForm, setQuoteForm] = useState({
    pet_id: '',
    coverage_type: '',
    deductible: '100',
    coverage_limit: '5000',
  });

  const queryClient = useQueryClient();

  // Fetch pets
  const { data: pets } = useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Pet[];
    },
  });

  // Fetch insurance providers
  const { data: providers, isLoading } = useQuery({
    queryKey: ['insurance-providers', coverageFilter],
    queryFn: async () => {
      let query = supabase
        .from('insurance_providers')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (coverageFilter !== 'all') {
        query = query.contains('coverage_types', [coverageFilter]);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as InsuranceProvider[];
    },
  });

  // Fetch user's quotes
  const { data: userQuotes } = useQuery({
    queryKey: ['insurance-quotes', selectedPet],
    queryFn: async () => {
      let query = supabase
        .from('insurance_quotes')
        .select(`
          *,
          insurance_providers(name, rating),
          pets(name)
        `)
        .order('created_at', { ascending: false });

      if (selectedPet) {
        query = query.eq('pet_id', selectedPet);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  // Generate quote mutation
  const generateQuoteMutation = useMutation({
    mutationFn: async (quote: typeof quoteForm) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate mock quotes for all providers
      const quotes = providers?.map(provider => {
        // Mock pricing calculation based on pet details and coverage
        const basePremium = Math.random() * 50 + 20; // £20-70 base
        const deductibleMultiplier = 1 - (parseInt(quote.deductible) / 1000) * 0.3;
        const limitMultiplier = 1 + (parseInt(quote.coverage_limit) / 10000) * 0.5;
        
        const monthlyPremium = basePremium * deductibleMultiplier * limitMultiplier;
        const annualPremium = monthlyPremium * 12 * 0.9; // 10% discount for annual

        return {
          user_id: user.id,
          pet_id: quote.pet_id,
          provider_id: provider.id,
          coverage_type: quote.coverage_type,
          monthly_premium: parseFloat(monthlyPremium.toFixed(2)),
          annual_premium: parseFloat(annualPremium.toFixed(2)),
          deductible: parseFloat(quote.deductible),
          coverage_limit: parseFloat(quote.coverage_limit),
          coverage_percentage: 80, // Standard 80% coverage
          quote_data: {
            generated_at: new Date().toISOString(),
            valid_days: 30,
          },
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending'
        };
      }) || [];

      const { error } = await supabase
        .from('insurance_quotes')
        .insert(quotes);

      if (error) throw error;
      return quotes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-quotes'] });
      setIsQuoteDialogOpen(false);
      setQuoteForm({
        pet_id: '',
        coverage_type: '',
        deductible: '100',
        coverage_limit: '5000',
      });
      toast.success('Quotes generated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to generate quotes: ' + error.message);
    },
  });

  const handleGenerateQuotes = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quoteForm.pet_id || !quoteForm.coverage_type) {
      toast.error('Please fill in all required fields');
      return;
    }

    generateQuoteMutation.mutate(quoteForm);
  };

  // Filter quotes by price
  const filteredQuotes = userQuotes?.filter(quote => {
    if (priceFilter === 'all') return true;
    const monthly = quote.monthly_premium || 0;
    
    switch (priceFilter) {
      case 'low':
        return monthly <= 30;
      case 'medium':
        return monthly > 30 && monthly <= 60;
      case 'high':
        return monthly > 60;
      default:
        return true;
    }
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insurance Comparison</h1>
          <p className="text-gray-600">
            Compare pet insurance providers and find the best coverage for your pet
          </p>
        </div>
        <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calculator className="h-4 w-4 mr-2" />
              Get Quotes
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleGenerateQuotes}>
              <DialogHeader>
                <DialogTitle>Get Insurance Quotes</DialogTitle>
                <DialogDescription>
                  Get personalized quotes from multiple insurance providers
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pet" className="text-right">
                    Pet *
                  </Label>
                  <Select
                    value={quoteForm.pet_id}
                    onValueChange={(value) => setQuoteForm({ ...quoteForm, pet_id: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select your pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets?.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.name} ({pet.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="coverage" className="text-right">
                    Coverage *
                  </Label>
                  <Select
                    value={quoteForm.coverage_type}
                    onValueChange={(value) => setQuoteForm({ ...quoteForm, coverage_type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select coverage type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accident">Accident Only</SelectItem>
                      <SelectItem value="illness">Accident & Illness</SelectItem>
                      <SelectItem value="wellness">Comprehensive + Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deductible" className="text-right">
                    Deductible
                  </Label>
                  <Select
                    value={quoteForm.deductible}
                    onValueChange={(value) => setQuoteForm({ ...quoteForm, deductible: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">£50</SelectItem>
                      <SelectItem value="100">£100</SelectItem>
                      <SelectItem value="250">£250</SelectItem>
                      <SelectItem value="500">£500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="limit" className="text-right">
                    Coverage Limit
                  </Label>
                  <Select
                    value={quoteForm.coverage_limit}
                    onValueChange={(value) => setQuoteForm({ ...quoteForm, coverage_limit: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2000">£2,000</SelectItem>
                      <SelectItem value="5000">£5,000</SelectItem>
                      <SelectItem value="10000">£10,000</SelectItem>
                      <SelectItem value="15000">£15,000</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={generateQuoteMutation.isPending}>
                  {generateQuoteMutation.isPending ? 'Generating...' : 'Get Quotes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedPet} onValueChange={setSelectedPet}>
              <SelectTrigger>
                <SelectValue placeholder="All Pets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Pets</SelectItem>
                {pets?.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={coverageFilter} onValueChange={setCoverageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Coverage Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coverage Types</SelectItem>
                <SelectItem value="accident">Accident Only</SelectItem>
                <SelectItem value="illness">Accident & Illness</SelectItem>
                <SelectItem value="wellness">Comprehensive + Wellness</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Price Ranges" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Price Ranges</SelectItem>
                <SelectItem value="low">Under £30/month</SelectItem>
                <SelectItem value="medium">£30-60/month</SelectItem>
                <SelectItem value="high">Over £60/month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Your Quotes */}
      {filteredQuotes && filteredQuotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Quotes</CardTitle>
            <CardDescription>Personalized insurance quotes for your pets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {filteredQuotes.map((quote) => (
                <div key={quote.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{quote.insurance_providers?.name}</h4>
                        <p className="text-sm text-gray-600">{quote.pets?.name} • {quote.coverage_type}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(quote.insurance_providers?.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {quote.insurance_providers?.rating?.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="space-y-1">
                        <p className="text-lg font-bold">£{quote.monthly_premium?.toFixed(2)}/month</p>
                        <p className="text-sm text-gray-600">£{quote.annual_premium?.toFixed(2)}/year</p>
                        <Badge variant="outline" className="text-xs">
                          {quote.coverage_percentage}% coverage
                        </Badge>
                      </div>
                      <Button size="sm" className="mt-2">
                        Select Plan
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Deductible:</span>
                      <span className="ml-1 font-medium">£{quote.deductible?.toFixed(0)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Coverage Limit:</span>
                      <span className="ml-1 font-medium">
                        {quote.coverage_limit === 999999 ? 'Unlimited' : `£${quote.coverage_limit?.toLocaleString()}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Valid Until:</span>
                      <span className="ml-1 font-medium">
                        {new Date(quote.valid_until || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insurance Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Providers</CardTitle>
          <CardDescription>Compare features and ratings of pet insurance companies</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {providers?.map((provider) => (
                <div key={provider.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{provider.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(provider.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {provider.rating?.toFixed(1)} ({provider.reviews_count?.toLocaleString()} reviews)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {provider.coverage_types?.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {provider.website_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={provider.website_url} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-1" />
                            Website
                          </a>
                        </Button>
                      )}
                      {provider.contact_info && (
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
