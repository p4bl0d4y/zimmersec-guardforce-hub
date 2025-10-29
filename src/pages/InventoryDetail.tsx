import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Package, Edit, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const InventoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInventory();
    }
  }, [id]);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      });
      navigate("/inventory");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading inventory details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Inventory item not found</p>
      </div>
    );
  }

  const usagePercentage = (item.assigned_quantity / item.total_quantity) * 100;

  const getStockStatus = () => {
    const percentage = (item.available_quantity / item.total_quantity) * 100;
    if (percentage === 0) return { status: "Out of Stock", variant: "destructive" as const };
    if (percentage <= 20) return { status: "Low Stock", variant: "outline" as const, className: "bg-warning/10 text-warning border-warning" };
    return { status: "In Stock", variant: "outline" as const, className: "bg-success/10 text-success border-success" };
  };

  const stockStatus = getStockStatus();

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
                <p className="text-sm text-muted-foreground">Inventory Item Details</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/inventory/${id}/edit`}>
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Item
                </Button>
              </Link>
              <Link to="/inventory">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Inventory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Item Header */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/20">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">{item.name}</h2>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{item.category}</Badge>
                  <Badge variant={stockStatus.variant} className={stockStatus.className}>
                    {item.available_quantity === 0 && <AlertCircle className="h-3 w-3 mr-1" />}
                    {stockStatus.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/inventory/${id}/edit`}>
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Item
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {item.name}. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive hover:bg-destructive/90">
                      {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Low Stock Alert */}
          {item.available_quantity === 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This item is out of stock. All units are currently assigned. Consider ordering more.
              </AlertDescription>
            </Alert>
          )}

          {item.available_quantity > 0 && usagePercentage >= 80 && (
            <Alert className="border-warning bg-warning/10">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                Low stock alert: Only {item.available_quantity} unit{item.available_quantity !== 1 ? 's' : ''} remaining ({Math.round((item.available_quantity / item.total_quantity) * 100)}% available)
              </AlertDescription>
            </Alert>
          )}

          {/* Stock Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Overview</CardTitle>
              <CardDescription>Current inventory status and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Total Quantity</p>
                  <p className="text-3xl font-bold text-foreground">{item.total_quantity}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Assigned</p>
                  <p className="text-3xl font-bold text-primary">{item.assigned_quantity}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <p className="text-sm text-muted-foreground mb-1">Available</p>
                  <p className="text-3xl font-bold text-success">{item.available_quantity}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Usage Rate</span>
                  <span className="font-semibold">{Math.round(usagePercentage)}%</span>
                </div>
                <Progress value={usagePercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Item Details */}
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>Specifications and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {item.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{item.description}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.manufacturer && (
                  <div>
                    <p className="text-sm text-muted-foreground">Manufacturer</p>
                    <p className="font-medium">{item.manufacturer}</p>
                  </div>
                )}
                {item.model && (
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p className="font-medium">{item.model}</p>
                  </div>
                )}
              </div>
              {item.serial_prefix && (
                <div>
                  <p className="text-sm text-muted-foreground">Serial Number Prefix</p>
                  <p className="font-mono font-medium">{item.serial_prefix}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
    </div>
  );
};

export default InventoryDetail;
