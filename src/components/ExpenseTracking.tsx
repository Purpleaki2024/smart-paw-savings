import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  PlusCircle,
  BarChart3,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

const ExpenseTracking = () => {
  const expenseCategories = [
    { name: "Food & Treats", spent: 145.50, budget: 150, color: "text-success" },
    { name: "Veterinary Care", spent: 89.00, budget: 100, color: "text-info" },
    { name: "Grooming", spent: 45.90, budget: 60, color: "text-warning" },
    { name: "Insurance", spent: 28.99, budget: 30, color: "text-primary" },
    { name: "Toys & Accessories", spent: 73.01, budget: 50, color: "text-destructive" },
  ];

  const recentTransactions = [
    {
      id: 1,
      date: "2024-01-15",
      merchant: "Pets at Home",
      category: "Food & Treats",
      amount: 24.99,
      aiSuggestion: "Switch to bulk buying for 15% savings",
      status: "suggestion"
    },
    {
      id: 2,
      date: "2024-01-14",
      merchant: "The Vet Practice",
      category: "Veterinary Care",
      amount: 89.00,
      aiSuggestion: "Regular check-up - on schedule",
      status: "good"
    },
    {
      id: 3,
      date: "2024-01-13",
      merchant: "Amazon Pet Supplies",
      category: "Toys & Accessories",
      amount: 18.50,
      aiSuggestion: "Consider DIY toys for 60% savings",
      status: "suggestion"
    },
    {
      id: 4,
      date: "2024-01-12",
      merchant: "Grooming Salon",
      category: "Grooming",
      amount: 45.90,
      aiSuggestion: "Book monthly for 20% discount",
      status: "applied"
    }
  ];

  const aiInsights = [
    {
      type: "saving",
      title: "Bulk Food Purchase Opportunity",
      description: "Buying 20kg food bags instead of 5kg can save £8.50 per month",
      potential: "£102/year",
      confidence: 95
    },
    {
      type: "warning",
      title: "Toy Budget Exceeded",
      description: "You've spent 146% of your toy budget this month",
      potential: "£23 over budget",
      confidence: 100
    },
    {
      type: "optimization",
      title: "Insurance Review Due",
      description: "Annual policy review could reduce premiums by £8/month",
      potential: "£96/year",
      confidence: 87
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Expense Tracking</h2>
        <p className="text-muted-foreground">Smart insights and automated savings for your pet expenses</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Monthly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£382.40</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingDown className="inline h-3 w-3 text-success mr-1" />
                  12% less than last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-success">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Savings</CardTitle>
                <TrendingDown className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">£47.20</div>
                <p className="text-xs text-muted-foreground">Applied automatically</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                <BarChart3 className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">£73.50</div>
                <p className="text-xs text-muted-foreground">Available this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Track spending across different pet care categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories.map((category) => {
                  const percentage = Math.min((category.spent / category.budget) * 100, 100);
                  const isOverBudget = category.spent > category.budget;
                  
                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{category.name}</span>
                          {isOverBudget && (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`font-medium ${isOverBudget ? 'text-destructive' : category.color}`}>
                            £{category.spent.toFixed(2)}
                          </span>
                          <span className="text-muted-foreground"> / £{category.budget.toFixed(2)}</span>
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${isOverBudget ? '[&>div]:bg-destructive' : ''}`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{percentage.toFixed(0)}% of budget used</span>
                        {!isOverBudget && (
                          <span>£{(category.budget - category.spent).toFixed(2)} remaining</span>
                        )}
                        {isOverBudget && (
                          <span className="text-destructive">
                            £{(category.spent - category.budget).toFixed(2)} over budget
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>AI-analyzed expense history with savings suggestions</CardDescription>
              </div>
              <Button className="bg-accent hover:bg-accent/90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{transaction.merchant}</h4>
                        <span className="font-semibold">£{transaction.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{transaction.date}</span>
                        <Badge variant="secondary">{transaction.category}</Badge>
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        {transaction.status === "suggestion" && (
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        )}
                        {transaction.status === "good" && (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        )}
                        {transaction.status === "applied" && (
                          <CheckCircle2 className="h-4 w-4 text-info" />
                        )}
                        <span className="text-sm text-muted-foreground">{transaction.aiSuggestion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <Card key={index} className={`border-l-4 ${
                insight.type === 'saving' ? 'border-l-success' :
                insight.type === 'warning' ? 'border-l-warning' :
                'border-l-info'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <Badge variant={
                      insight.type === 'saving' ? 'default' :
                      insight.type === 'warning' ? 'destructive' :
                      'secondary'
                    }>
                      {insight.confidence}% confident
                    </Badge>
                  </div>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-semibold ${
                      insight.type === 'saving' ? 'text-success' :
                      insight.type === 'warning' ? 'text-warning' :
                      'text-info'
                    }`}>
                      {insight.potential}
                    </span>
                    <Button variant={insight.type === 'warning' ? 'destructive' : 'default'}>
                      {insight.type === 'saving' ? 'Apply Suggestion' :
                       insight.type === 'warning' ? 'Review Budget' :
                       'Learn More'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Management</CardTitle>
              <CardDescription>Set and track spending limits for each category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {expenseCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{category.name}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Spent: £{category.spent.toFixed(2)}</span>
                          <span>Budget: £{category.budget.toFixed(2)}</span>
                        </div>
                        <Progress value={(category.spent / category.budget) * 100} className="h-2" />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-4">
                      Adjust
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseTracking;