import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import ExpenseTracking from "@/components/ExpenseTracking";
import InsuranceComparison from "@/components/InsuranceComparison";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "expenses":
        return <ExpenseTracking />;
      case "insurance":
        return <InsuranceComparison />;
      case "pets":
        return <div className="text-center py-12"><h2 className="text-2xl font-bold">My Pets - Coming Soon</h2></div>;
      case "analytics":
        return <div className="text-center py-12"><h2 className="text-2xl font-bold">Analytics - Coming Soon</h2></div>;
      case "settings":
        return <div className="text-center py-12"><h2 className="text-2xl font-bold">Settings - Coming Soon</h2></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
