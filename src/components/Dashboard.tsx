import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp, PiggyBank, Heart, AlertCircle, DollarSign } from "lucide-react";

const Dashboard = () => {
  return (
    import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PiggyBank, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  CreditCard,
  Heart,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type SavingsOpportunity = Database['public']['Tables']['savings_opportunities']['Row'];
type Pet = Database['public']['Tables']['pets']['Row'];
type Budget = Database['public']['Tables']['budgets']['Row'];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const [selectedPet, setSelectedPet] = useState<string>('all');

  // Fetch user's pets
  const { data: pets } = useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Pet[];
    },
  });

  // Fetch recent transactions
  const { data: transactions } = useQuery({
    queryKey: ['transactions', selectedPet],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          expense_categories(name, icon, color),
          pets(name)
        `)
        .order('transaction_date', { ascending: false })
        .limit(10);

      if (selectedPet !== 'all') {
        query = query.eq('pet_id', selectedPet);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch savings opportunities
  const { data: savingsOpportunities } = useQuery({
    queryKey: ['savings-opportunities', selectedPet],
    queryFn: async () => {
      let query = supabase
        .from('savings_opportunities')
        .select(`
          *,
          pets(name),
          expense_categories(name, icon)
        `)
        .eq('status', 'pending')
        .order('potential_savings', { ascending: false })
        .limit(5);

      if (selectedPet !== 'all') {
        query = query.eq('pet_id', selectedPet);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch budgets and spending
  const { data: budgets } = useQuery({
    queryKey: ['budgets', selectedPet],
    queryFn: async () => {
      let query = supabase
        .from('budgets')
        .select(`
          *,
          expense_categories(name, icon, color)
        `)
        .eq('is_active', true);

      if (selectedPet !== 'all') {
        query = query.eq('pet_id', selectedPet);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Budget[];
    },
  });

  // Calculate spending by category for chart
  const spendingByCategory = transactions?.reduce((acc, transaction) => {
    const category = transaction.expense_categories?.name || 'Other';
    const amount = Math.abs(transaction.amount);
    
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value += amount;
    } else {
      acc.push({ name: category, value: amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]) || [];

  // Calculate total spending and savings
  const totalSpending = transactions?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
  const totalSavings = savingsOpportunities?.reduce((sum, s) => sum + (s.potential_savings || 0), 0) || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Track your pet expenses and discover savings opportunities</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Pet Filter */}
      <div className="flex space-x-2">
        <Button
          variant={selectedPet === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedPet('all')}
        >
          All Pets
        </Button>
        {pets?.map((pet) => (
          <Button
            key={pet.id}
            variant={selectedPet === pet.id ? 'default' : 'outline'}
            onClick={() => setSelectedPet(pet.id)}
          >
            {pet.name}
          </Button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalSpending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalSavings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 inline mr-1" />
              From AI recommendations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pets</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pets?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered pets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingsOpportunities?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              New savings found
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Your pet expenses breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {spendingByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>How you're doing against your budgets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets?.slice(0, 4).map((budget) => {
              const spent = transactions
                ?.filter(t => t.category_id === budget.category_id)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
              const progress = (spent / budget.amount) * 100;

              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{budget.name}</span>
                    <span className="text-sm text-muted-foreground">
                      £{spent.toFixed(2)} / £{budget.amount.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions & Savings Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest pet expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions?.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <span className="text-lg">
                        {transaction.expense_categories?.icon || '💳'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {transaction.pets?.name || 'General'} • {transaction.expense_categories?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£{Math.abs(transaction.amount).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Savings Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Savings Opportunities</CardTitle>
            <CardDescription>AI-powered recommendations to save money</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savingsOpportunities?.map((opportunity) => (
                <div key={opportunity.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{opportunity.title}</h4>
                      <p className="text-sm text-gray-600">{opportunity.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {opportunity.savings_type?.replace('_', ' ')}
                        </Badge>
                        {opportunity.pets?.name && (
                          <Badge variant="outline">{opportunity.pets.name}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        Save £{opportunity.potential_savings?.toFixed(2)}
                      </p>
                      <Button size="sm" className="mt-2">
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {(!savingsOpportunities || savingsOpportunities.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No savings opportunities available at the moment.</p>
                  <p className="text-sm">Connect your bank account to get AI-powered recommendations.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
  );
};

export default Dashboard;