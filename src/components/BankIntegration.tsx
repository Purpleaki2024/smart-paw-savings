import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Banknote, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Sync, 
  Eye,
  EyeOff,
  Unlink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { PlaidLink, PlaidLinkOnSuccess, PlaidLinkOptions } from 'react-plaid-link';

type BankAccount = Database['public']['Tables']['bank_accounts']['Row'];

// Mock Plaid configuration - In production, you'd get this from your backend
const PLAID_CONFIG = {
  token: 'link_sandbox_12345', // This would come from your backend
  environment: 'sandbox' as const,
  clientName: 'Smart Paw Savings',
  products: ['transactions'] as const,
  countryCodes: ['GB'] as const,
};

export default function BankAccountIntegration() {
  const [showBalance, setShowBalance] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch user's bank accounts
  const { data: bankAccounts, isLoading } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BankAccount[];
    },
  });

  // Generate link token for Plaid
  useEffect(() => {
    const generateLinkToken = async () => {
      try {
        // In a real implementation, you'd call your backend to generate the link token
        // For demo purposes, we'll use a mock token
        setLinkToken('link_sandbox_demo_token');
      } catch (error) {
        console.error('Error generating link token:', error);
        toast.error('Failed to initialize bank connection');
      }
    };

    generateLinkToken();
  }, []);

  // Handle successful Plaid link
  const handlePlaidSuccess: PlaidLinkOnSuccess = useCallback(
    async (public_token: string, metadata) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // In a real implementation, you'd send the public_token to your backend
        // to exchange it for an access_token and store account information
        
        // For demo purposes, we'll create a mock bank account
        const { error } = await supabase
          .from('bank_accounts')
          .insert({
            user_id: user.id,
            plaid_account_id: metadata.accounts[0]?.id || 'demo_account',
            plaid_access_token: 'access_token_demo', // This would be from your backend
            account_name: metadata.accounts[0]?.name || 'Demo Bank Account',
            account_type: metadata.accounts[0]?.subtype || 'checking',
            balance: 1000.00,
            currency: 'GBP',
          });

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
        toast.success('Bank account connected successfully!');
      } catch (error) {
        console.error('Error saving bank account:', error);
        toast.error('Failed to save bank account connection');
      }
    },
    [queryClient]
  );

  // Sync transactions mutation
  const syncTransactionsMutation = useMutation({
    mutationFn: async (accountId: string) => {
      // In a real implementation, this would trigger a sync with Plaid
      // For demo purposes, we'll create some sample transactions
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const sampleTransactions = [
        {
          user_id: user.id,
          bank_account_id: accountId,
          amount: -45.99,
          description: 'Premium Pet Food',
          merchant_name: 'Pets at Home',
          transaction_date: new Date().toISOString().split('T')[0],
          is_pet_expense: true,
          ai_confidence_score: 0.95,
        },
        {
          user_id: user.id,
          bank_account_id: accountId,
          amount: -120.00,
          description: 'Veterinary Consultation',
          merchant_name: 'City Vets',
          transaction_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          is_pet_expense: true,
          ai_confidence_score: 0.98,
        },
      ];

      const { error } = await supabase
        .from('transactions')
        .upsert(sampleTransactions);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transactions synced successfully!');
    },
    onError: (error) => {
      toast.error('Failed to sync transactions: ' + error.message);
    },
  });

  // Disconnect account mutation
  const disconnectAccountMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase
        .from('bank_accounts')
        .update({ is_active: false })
        .eq('id', accountId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
      toast.success('Bank account disconnected');
    },
    onError: (error) => {
      toast.error('Failed to disconnect account: ' + error.message);
    },
  });

  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess: handlePlaidSuccess,
    onExit: (error, metadata) => {
      if (error) {
        console.error('Plaid Link exit error:', error);
        toast.error('Failed to connect bank account');
      }
    },
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bank Accounts</h1>
          <p className="text-gray-600">
            Connect your bank accounts to automatically track pet expenses
          </p>
        </div>
        {linkToken && (
          <PlaidLink {...config}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Bank Account
            </Button>
          </PlaidLink>
        )}
      </div>

      {/* Security Notice */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          Your banking information is secured with bank-level encryption. We use Plaid's 
          secure infrastructure and never store your banking credentials.
        </AlertDescription>
      </Alert>

      {/* Connected Accounts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Connected Accounts</h2>
        
        {bankAccounts?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Banknote className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bank accounts connected
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Connect your bank account to automatically categorize expenses and 
                get AI-powered savings recommendations for your pet care.
              </p>
              {linkToken && (
                <PlaidLink {...config}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Your First Account
                  </Button>
                </PlaidLink>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bankAccounts?.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Banknote className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{account.account_name}</CardTitle>
                        <CardDescription className="capitalize">
                          {account.account_type} • Last synced: {' '}
                          {new Date(account.last_synced).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Balance</p>
                        <p className="text-2xl font-bold">
                          {showBalance ? (
                            `£${account.balance?.toFixed(2) || '0.00'}`
                          ) : (
                            '••••••'
                          )}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBalance(!showBalance)}
                      >
                        {showBalance ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => syncTransactionsMutation.mutate(account.id)}
                        disabled={syncTransactionsMutation.isPending}
                      >
                        <Sync className="h-4 w-4 mr-2" />
                        Sync
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => disconnectAccountMutation.mutate(account.id)}
                        disabled={disconnectAccountMutation.isPending}
                      >
                        <Unlink className="h-4 w-4 mr-2" />
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Features Info */}
      <Card>
        <CardHeader>
          <CardTitle>What happens when you connect your bank?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Sync className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Automatic Expense Tracking</h4>
                <p className="text-sm text-gray-600">
                  We'll automatically categorize your pet-related expenses using AI
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Smart Savings Recommendations</h4>
                <p className="text-sm text-gray-600">
                  Get personalized suggestions to save money on pet care
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Budget Alerts</h4>
                <p className="text-sm text-gray-600">
                  Receive notifications when you're close to budget limits
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
