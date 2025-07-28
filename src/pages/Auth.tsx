import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Heart, PawPrint } from 'lucide-react';

export default function AuthPage() {
  const [gdprConsent, setGdprConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setShowConsent(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleConsentSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          gdpr_consent: gdprConsent,
          marketing_consent: marketingConsent,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        });

      if (error) throw error;

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  };

  if (showConsent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <PawPrint className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to Smart Paw Savings!</CardTitle>
            <CardDescription>
              We need your consent to provide our services in compliance with GDPR regulations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="gdpr-consent"
                  checked={gdprConsent}
                  onCheckedChange={setGdprConsent}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="gdpr-consent" className="text-sm font-medium">
                    Data Processing Consent (Required)
                  </Label>
                  <p className="text-sm text-gray-600">
                    I consent to the processing of my personal data to provide pet expense tracking, 
                    savings recommendations, and related services. You can withdraw this consent at any time.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketing-consent"
                  checked={marketingConsent}
                  onCheckedChange={setMarketingConsent}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="marketing-consent" className="text-sm font-medium">
                    Marketing Communications (Optional)
                  </Label>
                  <p className="text-sm text-gray-600">
                    I consent to receive marketing communications about new features, 
                    savings opportunities, and pet care tips.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Your data is encrypted and securely stored</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Heart className="h-4 w-4" />
                <span>We never sell your personal information</span>
              </div>
            </div>

            <Button 
              onClick={handleConsentSubmit} 
              disabled={!gdprConsent}
              className="w-full"
            >
              Continue to Dashboard
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our{' '}
              <a href="/privacy" className="underline">Privacy Policy</a> and{' '}
              <a href="/terms" className="underline">Terms of Service</a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <PawPrint className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Smart Paw Savings</CardTitle>
          <CardDescription>
            Track your pet expenses and discover savings opportunities with AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#10b981',
                    brandAccent: '#059669',
                  },
                },
              },
            }}
            providers={['google', 'github']}
            redirectTo={window.location.origin}
          />
        </CardContent>
      </Card>
    </div>
  );
}
