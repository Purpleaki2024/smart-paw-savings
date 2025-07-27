import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, TrendingUp } from "lucide-react";

const InsuranceComparison = () => {
  const insuranceOptions = [
    {
      id: 1,
      provider: "PetPlan UK",
      monthlyPrice: 28.99,
      currentPlan: true,
      coverage: "Comprehensive",
      excess: "£99",
      maxClaim: "£12,000",
      rating: 4.2,
      features: ["Accident & Illness", "Third Party Liability", "Death from Illness", "Dental Cover"],
      pros: ["Established brand", "Good customer service", "Quick claims"],
      cons: ["Higher excess", "Price increases with age"]
    },
    {
      id: 2,
      provider: "Bought By Many",
      monthlyPrice: 19.99,
      recommended: true,
      coverage: "Comprehensive",
      excess: "£69",
      maxClaim: "£15,000",
      rating: 4.6,
      features: ["Accident & Illness", "Behavioural Treatment", "Complementary Treatment", "Online Vet Consultations"],
      pros: ["Excellent value", "Lower excess", "Covers behaviour therapy"],
      cons: ["Newer provider", "Limited vet network"]
    },
    {
      id: 3,
      provider: "Agria Pet Insurance",
      monthlyPrice: 35.50,
      coverage: "Premium",
      excess: "£149",
      maxClaim: "£25,000",
      rating: 4.1,
      features: ["Accident & Illness", "Hereditary Conditions", "Travel Cover", "Boarding Fees"],
      pros: ["Highest coverage limit", "Covers hereditary conditions", "Travel protection"],
      cons: ["Most expensive", "High excess", "Complex claims process"]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Pet Insurance Comparison</h2>
        <p className="text-muted-foreground">AI-powered recommendations based on your pet's profile and spending patterns</p>
      </div>

      {/* AI Recommendation Banner */}
      <Card className="border-accent bg-gradient-to-r from-accent/5 to-accent/10">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent rounded-full">
              <TrendingUp className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-accent">AI Recommendation</h3>
              <p className="text-sm text-muted-foreground">
                Based on Max's breed (Golden Retriever) and Luna's age (2 years), switching to Bought By Many could save you £108 annually while providing better coverage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {insuranceOptions.map((option) => (
          <Card key={option.id} className={`relative ${option.recommended ? 'ring-2 ring-accent' : ''} ${option.currentPlan ? 'ring-2 ring-primary' : ''}`}>
            {option.recommended && (
              <Badge className="absolute -top-2 left-4 bg-accent hover:bg-accent">
                AI Recommended
              </Badge>
            )}
            {option.currentPlan && (
              <Badge className="absolute -top-2 left-4 bg-primary hover:bg-primary">
                Current Plan
              </Badge>
            )}
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{option.provider}</CardTitle>
                  <CardDescription>{option.coverage} Coverage</CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="text-sm font-medium">{option.rating}</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">
                £{option.monthlyPrice}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Excess:</span>
                  <div className="font-medium">{option.excess}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Max Claim:</span>
                  <div className="font-medium">{option.maxClaim}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Features Included</h4>
                <ul className="space-y-1">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="h-3 w-3 text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div>
                  <h5 className="text-sm font-medium text-success">Pros</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {option.pros.map((pro, index) => (
                      <li key={index}>• {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-destructive">Cons</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {option.cons.map((con, index) => (
                      <li key={index}>• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button 
                className={`w-full ${option.currentPlan ? 'bg-muted text-muted-foreground' : option.recommended ? 'bg-accent hover:bg-accent/90' : ''}`}
                disabled={option.currentPlan}
              >
                {option.currentPlan ? 'Current Plan' : option.recommended ? 'Switch & Save £108/year' : 'Get Quote'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Savings Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Annual Savings Calculator</CardTitle>
          <CardDescription>See how much you could save by switching providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">£347.88</div>
              <div className="text-sm text-muted-foreground">Current Annual Cost</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">£239.88</div>
              <div className="text-sm text-muted-foreground">With Recommended Plan</div>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-accent">£108.00</div>
              <div className="text-sm text-muted-foreground">Annual Savings</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsuranceComparison;