import { Link } from "react-router-dom";
import { Shield, Plus, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock inventory data
const mockInventory = [
  { id: "1", name: "Security Jacket", totalQuantity: 10, assignedQuantity: 7, category: "Uniform" },
  { id: "2", name: "Radio Transceiver", totalQuantity: 15, assignedQuantity: 12, category: "Equipment" },
  { id: "3", name: "Tactical Flashlight", totalQuantity: 20, assignedQuantity: 15, category: "Equipment" },
  { id: "4", name: "Body Camera", totalQuantity: 8, assignedQuantity: 8, category: "Equipment" },
  { id: "5", name: "Duty Belt", totalQuantity: 12, assignedQuantity: 9, category: "Uniform" },
  { id: "6", name: "Security Badge Holder", totalQuantity: 25, assignedQuantity: 18, category: "Accessories" },
];

const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = mockInventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailableQuantity = (total: number, assigned: number) => total - assigned;

  const getStockStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return { status: "Out of Stock", variant: "destructive" as const };
    if (percentage <= 20) return { status: "Low Stock", variant: "outline" as const, className: "bg-warning/10 text-warning border-warning" };
    return { status: "In Stock", variant: "outline" as const, className: "bg-success/10 text-success border-success" };
  };

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
                <p className="text-sm text-muted-foreground">Inventory Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost">Personnel</Button>
              </Link>
              <Link to="/inventory/add">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Search and Stats */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search inventory by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-foreground">{mockInventory.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Stock</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockInventory.reduce((acc, item) => acc + item.totalQuantity, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Item Name</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold text-center">Total</TableHead>
                  <TableHead className="font-semibold text-center">Assigned</TableHead>
                  <TableHead className="font-semibold text-center">Available</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const available = getAvailableQuantity(item.totalQuantity, item.assignedQuantity);
                  const stockStatus = getStockStatus(available, item.totalQuantity);
                  
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <Link to={`/inventory/${item.id}`} className="hover:text-primary transition-colors flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-center font-semibold">{item.totalQuantity}</TableCell>
                      <TableCell className="text-center">{item.assignedQuantity}</TableCell>
                      <TableCell className="text-center">
                        <span className={available === 0 ? "text-destructive font-semibold" : "font-semibold"}>
                          {available}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant} className={stockStatus.className}>
                          {available === 0 && <AlertCircle className="h-3 w-3 mr-1" />}
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/inventory/${item.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No inventory items found</p>
            </div>
          )}
        </div>
      </main>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
    </div>
  );
};

export default InventoryList;
