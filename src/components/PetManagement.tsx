import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Plus, 
  Heart, 
  Calendar,
  Weight,
  Ruler,
  Stethoscope,
  Edit,
  Trash2,
  Camera,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

type Pet = Database['public']['Tables']['pets']['Row'];

const PET_TYPES = [
  'Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Guinea Pig', 'Reptile', 'Other'
];

const COMMON_BREEDS = {
  Dog: ['Labrador', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Poodle', 'Chihuahua', 'Mixed Breed'],
  Cat: ['British Shorthair', 'Persian', 'Maine Coon', 'Siamese', 'Ragdoll', 'Bengal', 'Mixed Breed'],
  Bird: ['Budgie', 'Canary', 'Cockatiel', 'Parrot', 'Finch', 'Lovebird'],
  Rabbit: ['Holland Lop', 'Netherland Dwarf', 'Mini Rex', 'Lionhead', 'English Angora'],
  Fish: ['Goldfish', 'Betta', 'Angelfish', 'Guppy', 'Tetra', 'Molly'],
};

export default function PetManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  
  const [petForm, setPetForm] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    weight: '',
    medical_conditions: '',
    dietary_requirements: '',
    avatar_url: '',
  });

  const queryClient = useQueryClient();

  // Fetch pets
  const { data: pets, isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Pet[];
    },
  });

  // Add pet mutation
  const addPetMutation = useMutation({
    mutationFn: async (pet: typeof petForm) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const petData = {
        user_id: user.id,
        name: pet.name,
        type: pet.type.toLowerCase(),
        breed: pet.breed || null,
        age: pet.age ? parseInt(pet.age) : null,
        weight: pet.weight ? parseFloat(pet.weight) : null,
        medical_conditions: pet.medical_conditions 
          ? pet.medical_conditions.split(',').map(c => c.trim()).filter(c => c)
          : null,
        dietary_requirements: pet.dietary_requirements
          ? pet.dietary_requirements.split(',').map(r => r.trim()).filter(r => r)
          : null,
        avatar_url: pet.avatar_url || null,
      };

      const { data, error } = await supabase
        .from('pets')
        .insert(petData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Pet added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add pet: ' + error.message);
    },
  });

  // Update pet mutation
  const updatePetMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Pet> }) => {
      const { data, error } = await supabase
        .from('pets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      setEditingPet(null);
      resetForm();
      toast.success('Pet updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update pet: ' + error.message);
    },
  });

  // Delete pet mutation
  const deletePetMutation = useMutation({
    mutationFn: async (petId: string) => {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove pet: ' + error.message);
    },
  });

  const resetForm = () => {
    setPetForm({
      name: '',
      type: '',
      breed: '',
      age: '',
      weight: '',
      medical_conditions: '',
      dietary_requirements: '',
      avatar_url: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!petForm.name || !petForm.type) {
      toast.error('Please fill in the required fields');
      return;
    }

    if (editingPet) {
      const updates = {
        name: petForm.name,
        type: petForm.type.toLowerCase(),
        breed: petForm.breed || null,
        age: petForm.age ? parseInt(petForm.age) : null,
        weight: petForm.weight ? parseFloat(petForm.weight) : null,
        medical_conditions: petForm.medical_conditions 
          ? petForm.medical_conditions.split(',').map(c => c.trim()).filter(c => c)
          : null,
        dietary_requirements: petForm.dietary_requirements
          ? petForm.dietary_requirements.split(',').map(r => r.trim()).filter(r => r)
          : null,
        avatar_url: petForm.avatar_url || null,
      };
      
      updatePetMutation.mutate({ id: editingPet.id, updates });
    } else {
      addPetMutation.mutate(petForm);
    }
  };

  const startEditing = (pet: Pet) => {
    setEditingPet(pet);
    setPetForm({
      name: pet.name,
      type: pet.type,
      breed: pet.breed || '',
      age: pet.age?.toString() || '',
      weight: pet.weight?.toString() || '',
      medical_conditions: pet.medical_conditions?.join(', ') || '',
      dietary_requirements: pet.dietary_requirements?.join(', ') || '',
      avatar_url: pet.avatar_url || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setEditingPet(null);
    resetForm();
  };

  const calculateAge = (age: number | null) => {
    if (!age) return 'Unknown';
    if (age < 1) return `${Math.round(age * 12)} months`;
    return `${age} ${age === 1 ? 'year' : 'years'}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
          <p className="text-gray-600">Manage your pet profiles and information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingPet ? 'Edit Pet' : 'Add New Pet'}
                </DialogTitle>
                <DialogDescription>
                  {editingPet 
                    ? 'Update your pet\'s information' 
                    : 'Add a new pet to track expenses and get personalized recommendations'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your pet's name"
                    value={petForm.name}
                    onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type *
                  </Label>
                  <Select
                    value={petForm.type}
                    onValueChange={(value) => setPetForm({ ...petForm, type: value, breed: '' })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PET_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {petForm.type && COMMON_BREEDS[petForm.type as keyof typeof COMMON_BREEDS] && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="breed" className="text-right">
                      Breed
                    </Label>
                    <Select
                      value={petForm.breed}
                      onValueChange={(value) => setPetForm({ ...petForm, breed: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select breed (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_BREEDS[petForm.type as keyof typeof COMMON_BREEDS]?.map((breed) => (
                          <SelectItem key={breed} value={breed}>
                            {breed}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">
                    Age (years)
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 2.5"
                    value={petForm.age}
                    onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-right">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 15.5"
                    value={petForm.weight}
                    onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="medical" className="text-right mt-2">
                    Medical Conditions
                  </Label>
                  <Textarea
                    id="medical"
                    placeholder="Allergies, chronic conditions, etc. (comma separated)"
                    value={petForm.medical_conditions}
                    onChange={(e) => setPetForm({ ...petForm, medical_conditions: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="dietary" className="text-right mt-2">
                    Dietary Requirements
                  </Label>
                  <Textarea
                    id="dietary"
                    placeholder="Special diet, food allergies, etc. (comma separated)"
                    value={petForm.dietary_requirements}
                    onChange={(e) => setPetForm({ ...petForm, dietary_requirements: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="avatar" className="text-right">
                    Photo URL
                  </Label>
                  <Input
                    id="avatar"
                    placeholder="https://example.com/pet-photo.jpg"
                    value={petForm.avatar_url}
                    onChange={(e) => setPetForm({ ...petForm, avatar_url: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={addPetMutation.isPending || updatePetMutation.isPending}
                >
                  {editingPet 
                    ? (updatePetMutation.isPending ? 'Updating...' : 'Update Pet')
                    : (addPetMutation.isPending ? 'Adding...' : 'Add Pet')
                  }
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pets?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pets added yet
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Add your first pet to start tracking expenses and getting personalized 
              savings recommendations.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Pet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets?.map((pet) => (
            <Card key={pet.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                      {pet.avatar_url ? (
                        <img 
                          src={pet.avatar_url} 
                          alt={pet.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <Heart className="h-8 w-8 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{pet.name}</h3>
                      <p className="text-gray-600 capitalize">
                        {pet.breed ? `${pet.breed} ${pet.type}` : pet.type}
                      </p>
                      {pet.age && (
                        <p className="text-sm text-gray-500">
                          {calculateAge(pet.age)} old
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(pet)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePetMutation.mutate(pet.id)}
                      disabled={deletePetMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {pet.weight && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Weight className="h-4 w-4 text-gray-400" />
                      <span>{pet.weight} kg</span>
                    </div>
                  )}

                  {pet.medical_conditions && pet.medical_conditions.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Stethoscope className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Medical Conditions:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pet.medical_conditions.slice(0, 3).map((condition, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                        {pet.medical_conditions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{pet.medical_conditions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {pet.dietary_requirements && pet.dietary_requirements.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Dietary Requirements:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {pet.dietary_requirements.slice(0, 2).map((requirement, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {requirement}
                          </Badge>
                        ))}
                        {pet.dietary_requirements.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{pet.dietary_requirements.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Added {format(new Date(pet.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
