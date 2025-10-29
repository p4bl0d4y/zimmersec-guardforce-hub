import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Mail, Phone, MapPin, Calendar, FileText, Edit, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PersonnelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [personnel, setPersonnel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPersonnel();
    }
  }, [id]);

  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from("personnel")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPersonnel(data);
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
        .from("personnel")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Personnel record deleted successfully",
      });
      navigate("/");
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
        <p className="text-muted-foreground">Loading personnel details...</p>
      </div>
    );
  }

  if (!personnel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Personnel not found</p>
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | null }) => (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-primary mt-0.5" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "—"}</p>
      </div>
    </div>
  );

  const getStatusVariant = (status: string | null) => {
    switch (status) {
      case "active": return "default";
      case "onboarding": return "secondary";
      case "leave": return "outline";
      case "terminated": return "destructive";
      default: return "default";
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
                <p className="text-sm text-muted-foreground">Personnel Details</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/inventory">
                <Button variant="ghost">Inventory</Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to List
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Hero Section */}
          <Card className="overflow-hidden border-primary/20">
            <div className="bg-gradient-hero h-32" />
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col md:flex-row gap-6 -mt-16">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  {personnel.avatar_url ? (
                    <img
                      src={personnel.avatar_url}
                      alt={personnel.full_name}
                      className="w-32 h-32 rounded-lg border-4 border-card shadow-glow-red object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-lg border-4 border-card bg-muted flex items-center justify-center shadow-glow-red">
                      <Shield className="h-16 w-16 text-primary" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 mt-16 md:mt-4">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-3xl font-bold">{personnel.full_name}</h2>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <Badge className="bg-primary hover:bg-primary/90">
                          {personnel.employee_id}
                        </Badge>
                        <Badge variant={getStatusVariant(personnel.status)}>
                          {getStatusLabel(personnel.status)}
                        </Badge>
                        {personnel.position && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{personnel.position}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/personnel/${id}/edit`}>
                        <Button className="gap-2 bg-primary hover:bg-primary/90">
                          <Edit className="h-4 w-4" />
                          Edit
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
                              This will permanently delete {personnel.full_name}'s record. This action cannot be undone.
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
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem icon={Mail} label="Email" value={personnel.email} />
                <InfoItem icon={Phone} label="Phone" value={personnel.phone} />
                <InfoItem icon={MapPin} label="Address" value={personnel.address} />
                <InfoItem icon={Calendar} label="Date of Birth" value={personnel.date_of_birth ? new Date(personnel.date_of_birth).toLocaleDateString() : null} />
                
                {(personnel.emergency_contact_name || personnel.emergency_contact_phone) && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-3 text-primary">Emergency Contact</p>
                      <div className="space-y-3 pl-4">
                        <InfoItem icon={Phone} label="Name" value={personnel.emergency_contact_name} />
                        <InfoItem icon={Phone} label="Phone" value={personnel.emergency_contact_phone} />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem icon={Calendar} label="Date Hired" value={personnel.date_hired ? new Date(personnel.date_hired).toLocaleDateString() : null} />
                <InfoItem icon={Shield} label="Position" value={personnel.position} />
                <InfoItem icon={MapPin} label="Department" value={personnel.department} />
                {personnel.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Notes</p>
                      <p className="text-sm whitespace-pre-line bg-muted p-3 rounded">{personnel.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
    </div>
  );
};

export default PersonnelDetail;
