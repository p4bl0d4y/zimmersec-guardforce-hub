import { useState } from "react";
import { Search, UserPlus, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  name: string;
  pid: string;
  site: string;
  status: "Active" | "Leave of Absence" | "Terminated" | "Onboarding";
  role: string;
}

interface PersonnelTableProps {
  onSelectPerson: (id: string | null) => void;
  selectedId: string | null;
}

export const PersonnelTable = ({ onSelectPerson, selectedId }: PersonnelTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - will be replaced with real data
  const mockPersonnel: Personnel[] = [
    {
      id: "1",
      name: "John Martinez",
      pid: "ZS-2024-001",
      site: "Downtown Corporate Plaza",
      status: "Active",
      role: "Security Guard"
    },
    {
      id: "2",
      name: "Sarah Chen",
      pid: "ZS-2024-002",
      site: "Industrial Park West",
      status: "Active",
      role: "Patrol Officer"
    },
    {
      id: "3",
      name: "Michael Thompson",
      pid: "ZS-2023-087",
      site: "Tech Campus North",
      status: "Leave of Absence",
      role: "Supervisor"
    },
  ];

  const filteredPersonnel = mockPersonnel.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.pid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: Personnel["status"]) => {
    switch (status) {
      case "Active":
        return "default";
      case "Onboarding":
        return "secondary";
      case "Leave of Absence":
        return "outline";
      case "Terminated":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search personnel by name, ID, or site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => onSelectPerson(null)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          New Personnel
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Personnel ID</TableHead>
              <TableHead>Current Site</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPersonnel.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No personnel found
                </TableCell>
              </TableRow>
            ) : (
              filteredPersonnel.map((person) => (
                <TableRow
                  key={person.id}
                  onClick={() => onSelectPerson(person.id)}
                  className={`cursor-pointer transition-colors ${
                    selectedId === person.id ? "bg-accent/20" : "hover:bg-muted/50"
                  }`}
                >
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell className="font-mono text-sm">{person.pid}</TableCell>
                  <TableCell>{person.site}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-accent" />
                      {person.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(person.status)}>
                      {person.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
