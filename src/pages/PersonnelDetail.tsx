import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Shield, Mail, Phone, MapPin, Calendar, FileText, Award, Package, AlertCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PersonnelDetail = () => {
  const { id } = useParams();

  // Mock data - will be replaced with real data
  const personnel = {
    id: "1",
    firstName: "John",
    middleName: "Michael",
    lastName: "Martinez",
    dob: "1990-05-15",
    pid: "ZS-2024-001",
    mobile: "+1 (555) 123-4567",
    email: "john.martinez@zimmersec.com",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    postal: "10001",
    emergencyName: "Maria Martinez",
    emergencyRelation: "Spouse",
    emergencyPhone: "+1 (555) 987-6543",
    
    govId: "DL-123456789",
    securityLicense: "SG-2024-ABC123",
    licenseExpiry: "2026-12-31",
    driverLicense: "NY-987654321",
    driverClass: "Class B",
    
    hireDate: "2024-01-15",
    role: "Security Guard",
    status: "Active",
    site: "Downtown Corporate Plaza",
    shift: "Mon-Fri 9AM-5PM",
    compensation: "$25/hour",
    
    firearmPermit: "yes",
    firearmExpiry: "2025-08-20",
    firstAidExpiry: "2025-03-10",
    defensiveTacticsDate: "2024-02-15",
    specializedTraining: "CCTV Monitoring, Access Control Systems, Executive Protection",
    
    jacketSize: "L",
    shirtSize: "M",
    pantsSize: "32",
    bootsSize: "10",
    equipmentSerials: "Radio: R-12345\nBody Camera: BC-67890\nKeys: K-Set-3",
    accessCardId: "AC-001-ZS",
    
    bloodType: "O+",
    performanceReviewDates: "2024-07-15",
  };

  const checkLicenseExpiry = (expiryDate: string) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 90) return "expiring";
    return "valid";
  };

  const licenseStatus = checkLicenseExpiry(personnel.licenseExpiry);

  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-primary mt-0.5" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );

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
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to List
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Hero Section with Photos */}
          <Card className="overflow-hidden border-primary/20">
            <div className="bg-gradient-hero h-32" />
            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col md:flex-row gap-6 -mt-16">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-lg border-4 border-card bg-muted flex items-center justify-center shadow-glow-red">
                    <Shield className="h-16 w-16 text-primary" />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 mt-16 md:mt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold">{`${personnel.firstName} ${personnel.middleName} ${personnel.lastName}`}</h2>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className="bg-primary hover:bg-primary/90">
                          {personnel.pid}
                        </Badge>
                        <Badge variant={personnel.status === "Active" ? "default" : "secondary"}>
                          {personnel.status}
                        </Badge>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{personnel.role}</span>
                      </div>
                    </div>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>

                  {licenseStatus === "expiring" && (
                    <div className="mt-4 flex items-center gap-2 text-warning">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Security license expires soon</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Visual Identification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Face Photo</p>
                  <div className="aspect-square rounded-lg border border-border bg-muted flex items-center justify-center">
                    <Shield className="h-16 w-16 text-primary/50" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Full Body (Front)</p>
                  <div className="aspect-square rounded-lg border border-border bg-muted flex items-center justify-center">
                    <Shield className="h-16 w-16 text-primary/50" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Full Body (Side)</p>
                  <div className="aspect-square rounded-lg border border-border bg-muted flex items-center justify-center">
                    <Shield className="h-16 w-16 text-primary/50" />
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
                <InfoItem icon={Phone} label="Mobile" value={personnel.mobile} />
                <InfoItem icon={MapPin} label="Address" value={`${personnel.address}, ${personnel.city}, ${personnel.state} ${personnel.postal}`} />
                <InfoItem icon={Calendar} label="Date of Birth" value={new Date(personnel.dob).toLocaleDateString()} />
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium mb-3 text-primary">Emergency Contact</p>
                  <div className="space-y-3 pl-4">
                    <InfoItem icon={Phone} label="Name" value={personnel.emergencyName} />
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Relationship</p>
                        <p className="font-medium">{personnel.emergencyRelation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{personnel.emergencyPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
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
                <InfoItem icon={Calendar} label="Hire Date" value={new Date(personnel.hireDate).toLocaleDateString()} />
                <InfoItem icon={Shield} label="Job Title" value={personnel.role} />
                <InfoItem icon={MapPin} label="Current Site" value={personnel.site} />
                <InfoItem icon={Calendar} label="Shift Schedule" value={personnel.shift} />
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Compensation</p>
                    <p className="font-medium">{personnel.compensation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Licenses & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Licenses & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Security License</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{personnel.securityLicense}</p>
                      {licenseStatus === "expiring" && (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning text-xs">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Expires: {new Date(personnel.licenseExpiry).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <InfoItem icon={FileText} label="Government ID" value={personnel.govId} />
                <InfoItem icon={FileText} label="Driver's License" value={`${personnel.driverLicense} (${personnel.driverClass})`} />
                
                {personnel.firearmPermit === "yes" && (
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Firearm Permit</p>
                      <p className="font-medium">Licensed</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires: {new Date(personnel.firearmExpiry).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">First Aid/CPR</p>
                    <p className="text-xs text-muted-foreground">
                      Expires: {new Date(personnel.firstAidExpiry).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training & Equipment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Training & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2 text-primary">Specialized Training</p>
                  <p className="text-sm">{personnel.specializedTraining}</p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium mb-2 text-primary">Uniform Sizes</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Jacket:</span> {personnel.jacketSize}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shirt:</span> {personnel.shirtSize}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pants:</span> {personnel.pantsSize}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Boots:</span> {personnel.bootsSize}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium mb-2 text-primary">Assigned Equipment</p>
                  <div className="text-sm whitespace-pre-line bg-muted p-3 rounded">
                    {personnel.equipmentSerials}
                  </div>
                  <p className="text-sm mt-2">
                    <span className="text-muted-foreground">Access Card:</span> {personnel.accessCardId}
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Blood Type:</span>
                    <Badge variant="outline" className="ml-2">{personnel.bloodType}</Badge>
                  </div>
                </div>
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
