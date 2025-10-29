import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, UserPlus, Shield, Eye, Package, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Personnel {
  id: string;
  full_name: string;
  employee_id: string;
  position: string | null;
  department: string | null;
  status: string | null;
  avatar_url: string | null;
}

const PersonnelList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from("personnel")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPersonnel(data || []);
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

  const filteredPersonnel = personnel.filter(person =>
    person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.position && person.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (person.department && person.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusVariant = (status: string | null) => {
    switch (status) {
      case "active":
        return "default";
      case "onboarding":
        return "secondary";
      case "leave":
        return "outline";
      case "terminated":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string | null) => {
    if (!status) return "Active";
    return status.charAt(0).toUpperCase() + status.slice(1);
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
                <p className="text-sm text-muted-foreground">Security Personnel Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/inventory">
                <Button variant="ghost" className="gap-2">
                  <Package className="h-4 w-4" />
                  Inventory
                </Button>
              </Link>
              <Link to="/register">
                <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-glow-red">
                  <UserPlus className="h-4 w-4" />
                  Register New Personnel
                </Button>
              </Link>
              <Button onClick={signOut} variant="ghost" className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Personnel Directory</h2>
            <p className="text-muted-foreground">View and manage all registered security personnel</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search personnel by name, ID, position, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-lg border border-border bg-card shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Loading personnel...
                    </TableCell>
                  </TableRow>
                ) : filteredPersonnel.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {searchTerm ? "No personnel found matching your search" : "No personnel registered yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPersonnel.map((person) => (
                    <TableRow
                      key={person.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">{person.full_name}</TableCell>
                      <TableCell className="font-mono text-sm">{person.employee_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-primary" />
                          {person.position || "—"}
                        </div>
                      </TableCell>
                      <TableCell>{person.department || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(person.status)}>
                          {getStatusLabel(person.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/personnel/${person.id}`}>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
    </div>
  );
};

export default PersonnelList;
