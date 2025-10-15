import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Package, Edit, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Mock data
const mockInventoryItem = {
  id: "1",
  name: "Security Jacket",
  category: "Uniform",
  description: "High-visibility security jacket with reflective strips and Zimmersec branding. Suitable for all-weather patrol duties.",
  totalQuantity: 10,
  assignedQuantity: 7,
  manufacturer: "SecureWear Pro",
  model: "SW-J-2024",
  serialPrefix: "ZS-JKT-",
};

const mockAssignedTo = [
  { personnelId: "ZS-2024-001", name: "John Smith", quantity: 1, assignedDate: "2024-01-15" },
  { personnelId: "ZS-2024-002", name: "Sarah Johnson", quantity: 1, assignedDate: "2024-01-20" },
  { personnelId: "ZS-2024-005", name: "Michael Chen", quantity: 2, assignedDate: "2024-02-01" },
  { personnelId: "ZS-2024-008", name: "Emily Rodriguez", quantity: 1, assignedDate: "2024-02-10" },
  { personnelId: "ZS-2024-012", name: "David Kim", quantity: 2, assignedDate: "2024-02-15" },
];

const InventoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = mockInventoryItem; // In real app, fetch by id

  const available = item.totalQuantity - item.assignedQuantity;
  const usagePercentage = (item.assignedQuantity / item.totalQuantity) * 100;

  const getStockStatus = () => {
    const percentage = (available / item.totalQuantity) * 100;
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
            <Link to="/inventory">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Inventory
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Item Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/20">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">{item.name}</h2>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{item.category}</Badge>
                  <Badge variant={stockStatus.variant} className={stockStatus.className}>
                    {available === 0 && <AlertCircle className="h-3 w-3 mr-1" />}
                    {stockStatus.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Item
              </Button>
              <Button variant="outline" className="gap-2 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Low Stock Alert */}
          {available === 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This item is out of stock. All units are currently assigned. Consider ordering more.
              </AlertDescription>
            </Alert>
          )}

          {available > 0 && usagePercentage >= 80 && (
            <Alert className="border-warning bg-warning/10">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                Low stock alert: Only {available} unit{available !== 1 ? 's' : ''} remaining ({Math.round((available / item.totalQuantity) * 100)}% available)
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
                  <p className="text-3xl font-bold text-foreground">{item.totalQuantity}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Assigned</p>
                  <p className="text-3xl font-bold text-primary">{item.assignedQuantity}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <p className="text-sm text-muted-foreground mb-1">Available</p>
                  <p className="text-3xl font-bold text-success">{available}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{item.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Manufacturer</p>
                    <p className="font-medium">{item.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p className="font-medium">{item.model}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Serial Number Prefix</p>
                <p className="font-mono font-medium">{item.serialPrefix}</p>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Personnel */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned to Personnel ({mockAssignedTo.length})</CardTitle>
              <CardDescription>Security personnel currently using this item</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Personnel ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAssignedTo.map((assignment) => (
                    <TableRow key={assignment.personnelId}>
                      <TableCell className="font-mono text-sm">{assignment.personnelId}</TableCell>
                      <TableCell className="font-medium">
                        <Link to={`/personnel/${assignment.personnelId}`} className="hover:text-primary transition-colors">
                          {assignment.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center font-semibold">{assignment.quantity}</TableCell>
                      <TableCell>{new Date(assignment.assignedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
