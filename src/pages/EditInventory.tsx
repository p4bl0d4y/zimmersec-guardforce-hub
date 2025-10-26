import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InventoryForm } from "@/components/InventoryForm";

const EditInventory = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-hero shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary shadow-glow-red">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Zimmersec HRMS</h1>
                <p className="text-sm text-muted-foreground">Edit Inventory Item</p>
              </div>
            </div>
            <Link to={`/inventory/${id}`}>
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Details
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Card className="max-w-4xl mx-auto p-6">
          <InventoryForm inventoryId={id} />
        </Card>
      </main>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
    </div>
  );
};

export default EditInventory;
