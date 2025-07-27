import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp, PiggyBank, Heart, AlertCircle, DollarSign } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">£127.50</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£382.40</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Pets</CardTitle>
            <Heart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Max & Luna</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Smart Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Pending actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Tracking */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PiggyBank className="h-5 w-5 text-accent" />
              <span>AI Expense Tracking</span>
            </CardTitle>
            <CardDescription>Your pet expenses analyzed by our AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Premium Dog Food</h4>
                  <p className="text-sm text-muted-foreground">Sainsbury's • £45.99</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    -£12.50 saved
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">AI found cheaper option</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Vet Insurance</h4>
                  <p className="text-sm text-muted-foreground">Current Provider • £28.99/month</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-warning/10 text-warning">
                    -£8.00 available
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">Better plan found</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Grooming Supplies</h4>
                  <p className="text-sm text-muted-foreground">Pets at Home • £23.50</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-info/10 text-info">
                    DIY option
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">Save £15 monthly</p>
                </div>
              </div>
            </div>

            <Button className="w-full mt-4 bg-accent hover:bg-accent/90">
              View All Expenses
            </Button>
          </CardContent>
        </Card>

        {/* Smart Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Smart Alerts</CardTitle>
            <CardDescription>AI-powered recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-success" />
                  <h4 className="text-sm font-medium text-success">Savings Opportunity</h4>
                </div>
                <p className="text-xs text-muted-foreground">Switch to bulk food ordering and save £25/month</p>
                <Button size="sm" variant="outline" className="mt-2 text-success border-success hover:bg-success/10">
                  Apply Now
                </Button>
              </div>

              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <h4 className="text-sm font-medium text-warning">Vet Reminder</h4>
                </div>
                <p className="text-xs text-muted-foreground">Max's annual check-up due in 2 weeks</p>
                <Button size="sm" variant="outline" className="mt-2 text-warning border-warning hover:bg-warning/10">
                  Book Now
                </Button>
              </div>

              <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="h-4 w-4 text-info" />
                  <h4 className="text-sm font-medium text-info">Care Tip</h4>
                </div>
                <p className="text-xs text-muted-foreground">Weekly brushing can reduce grooming costs by 40%</p>
                <Button size="sm" variant="outline" className="mt-2 text-info border-info hover:bg-info/10">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Savings Goal</CardTitle>
          <CardDescription>Track your progress toward saving £150 this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">£127.50 / £150.00</span>
            </div>
            <Progress value={85} className="h-2" />
            <p className="text-xs text-muted-foreground">85% complete • £22.50 to go</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;