import { useState } from "react";
import { PersonnelTable } from "@/components/PersonnelTable";
import { PersonnelForm } from "@/components/PersonnelForm";
import { Shield } from "lucide-react";

const Index = () => {
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-primary shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent shadow-glow-blue">
              <Shield className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Zimmersec HRMS</h1>
              <p className="text-sm text-muted-foreground">Security Personnel Management System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Personnel List - Left Side */}
          <div className="lg:col-span-5">
            <PersonnelTable
              onSelectPerson={setSelectedPersonnelId}
              selectedId={selectedPersonnelId}
            />
          </div>

          {/* Registration/Detail Form - Right Side */}
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-border bg-card shadow-card p-6">
              <PersonnelForm personnelId={selectedPersonnelId} />
            </div>
          </div>
        </div>
      </main>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
    </div>
  );
};

export default Index;
