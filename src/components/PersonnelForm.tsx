import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, AlertCircle, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PersonnelFormProps {
  personnelId: string | null;
}

export const PersonnelForm = ({ personnelId }: PersonnelFormProps) => {
  const [formData, setFormData] = useState({
    // Personal & Contact
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    pid: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postal: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",

    // Identification
    govId: "",
    securityLicense: "",
    licenseExpiry: "",
    driverLicense: "",
    driverClass: "",

    // Employment
    hireDate: "",
    role: "",
    status: "",
    site: "",
    shift: "",
    compensation: "",

    // Training
    firearmPermit: "no",
    firearmExpiry: "",
    firstAidExpiry: "",
    defensiveTacticsDate: "",
    specializedTraining: "",

    // Equipment
    jacketSize: "",
    shirtSize: "",
    pantsSize: "",
    bootsSize: "",
    equipmentSerials: "",
    accessCardId: "",

    // Records
    disciplinaryNotes: "",
    performanceReviewDates: "",
    medicalConditions: "",
    bloodType: "",
  });

  const [photos, setPhotos] = useState({
    face: null as File | null,
    bodyFront: null as File | null,
    bodySide: null as File | null,
  });

  const handlePhotoUpload = (type: keyof typeof photos, file: File | null) => {
    setPhotos(prev => ({ ...prev, [type]: file }));
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

  const licenseStatus = checkLicenseExpiry(formData.licenseExpiry);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {personnelId ? "Personnel Details" : "New Personnel Registration"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {personnelId ? `ID: ${formData.pid || "N/A"}` : "Fill in all required information"}
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Personnel
        </Button>
      </div>

      {licenseStatus === "expiring" && (
        <Alert variant="default" className="border-warning bg-warning/10">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground">
            Security license expires in less than 90 days
          </AlertDescription>
        </Alert>
      )}

      {licenseStatus === "expired" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Security license has expired
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="identification">ID & Licenses</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        {/* Personal & Contact Details */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic personnel details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pid">Personnel ID *</Label>
                  <Input
                    id="pid"
                    placeholder="ZS-YYYY-XXX"
                    value={formData.pid}
                    onChange={(e) => setFormData({ ...formData, pid: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Phone *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Residential Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Code *</Label>
                  <Input
                    id="postal"
                    value={formData.postal}
                    onChange={(e) => setFormData({ ...formData, postal: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Person to contact in case of emergency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Contact Name *</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelation">Relationship *</Label>
                  <Input
                    id="emergencyRelation"
                    value={formData.emergencyRelation}
                    onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Phone Number *</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Identification & Licensing */}
        <TabsContent value="identification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Identification Documents</CardTitle>
              <CardDescription>Government ID and professional licenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="govId">Government ID/Passport Number *</Label>
                  <Input
                    id="govId"
                    value={formData.govId}
                    onChange={(e) => setFormData({ ...formData, govId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="securityLicense">Security Guard License Number *</Label>
                  <Input
                    id="securityLicense"
                    value={formData.securityLicense}
                    onChange={(e) => setFormData({ ...formData, securityLicense: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">License Expiration Date *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="licenseExpiry"
                      type="date"
                      value={formData.licenseExpiry}
                      onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                      className="flex-1"
                    />
                    {licenseStatus === "expiring" && (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
                        Expiring Soon
                      </Badge>
                    )}
                    {licenseStatus === "expired" && (
                      <Badge variant="destructive">
                        Expired
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverLicense">Driver's License Number</Label>
                  <Input
                    id="driverLicense"
                    value={formData.driverLicense}
                    onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverClass">Driver's License Class</Label>
                <Input
                  id="driverClass"
                  value={formData.driverClass}
                  onChange={(e) => setFormData({ ...formData, driverClass: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employment & Assignment */}
        <TabsContent value="employment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
              <CardDescription>Job role, assignment, and compensation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date *</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Job Title/Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="security-guard">Security Guard</SelectItem>
                      <SelectItem value="patrol-officer">Patrol Officer</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Employment Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="leave">Leave of Absence</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site">Current Site Assignment *</Label>
                  <Select value={formData.site} onValueChange={(value) => setFormData({ ...formData, site: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="downtown">Downtown Corporate Plaza</SelectItem>
                      <SelectItem value="industrial">Industrial Park West</SelectItem>
                      <SelectItem value="tech">Tech Campus North</SelectItem>
                      <SelectItem value="retail">Retail Complex South</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shift">Shift Schedule</Label>
                  <Input
                    id="shift"
                    placeholder="e.g., Mon-Fri 9AM-5PM"
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compensation">Compensation *</Label>
                  <Input
                    id="compensation"
                    placeholder="e.g., $25/hour"
                    value={formData.compensation}
                    onChange={(e) => setFormData({ ...formData, compensation: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training & Certifications */}
        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training & Certifications</CardTitle>
              <CardDescription>Professional training and qualification records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firearmPermit">Firearm Permit Status</Label>
                  <Select value={formData.firearmPermit} onValueChange={(value) => setFormData({ ...formData, firearmPermit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes - Permitted</SelectItem>
                      <SelectItem value="no">No Permit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.firearmPermit === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="firearmExpiry">Firearm Permit Expiration</Label>
                    <Input
                      id="firearmExpiry"
                      type="date"
                      value={formData.firearmExpiry}
                      onChange={(e) => setFormData({ ...formData, firearmExpiry: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstAidExpiry">First Aid/CPR Certification Expiry</Label>
                  <Input
                    id="firstAidExpiry"
                    type="date"
                    value={formData.firstAidExpiry}
                    onChange={(e) => setFormData({ ...formData, firstAidExpiry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defensiveTacticsDate">Defensive Tactics Training Date</Label>
                  <Input
                    id="defensiveTacticsDate"
                    type="date"
                    value={formData.defensiveTacticsDate}
                    onChange={(e) => setFormData({ ...formData, defensiveTacticsDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specializedTraining">Specialized Training</Label>
                <Textarea
                  id="specializedTraining"
                  placeholder="CCTV Monitoring, Access Control, Executive Protection, etc."
                  value={formData.specializedTraining}
                  onChange={(e) => setFormData({ ...formData, specializedTraining: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment & Uniform */}
        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uniform Sizing</CardTitle>
              <CardDescription>Standard uniform measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jacketSize">Jacket</Label>
                  <Input
                    id="jacketSize"
                    placeholder="e.g., L"
                    value={formData.jacketSize}
                    onChange={(e) => setFormData({ ...formData, jacketSize: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shirtSize">Shirt</Label>
                  <Input
                    id="shirtSize"
                    placeholder="e.g., M"
                    value={formData.shirtSize}
                    onChange={(e) => setFormData({ ...formData, shirtSize: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pantsSize">Pants</Label>
                  <Input
                    id="pantsSize"
                    placeholder="e.g., 32"
                    value={formData.pantsSize}
                    onChange={(e) => setFormData({ ...formData, pantsSize: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bootsSize">Boots</Label>
                  <Input
                    id="bootsSize"
                    placeholder="e.g., 10"
                    value={formData.bootsSize}
                    onChange={(e) => setFormData({ ...formData, bootsSize: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Equipment</CardTitle>
              <CardDescription>Tracking for issued items and access credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="equipmentSerials">Equipment Serial Numbers</Label>
                <Textarea
                  id="equipmentSerials"
                  placeholder="Radio: R-12345&#10;Body Camera: BC-67890&#10;Keys: K-Set-3"
                  value={formData.equipmentSerials}
                  onChange={(e) => setFormData({ ...formData, equipmentSerials: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessCardId">Key/Access Card ID</Label>
                <Input
                  id="accessCardId"
                  value={formData.accessCardId}
                  onChange={(e) => setFormData({ ...formData, accessCardId: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Records & Compliance */}
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personnel Records</CardTitle>
              <CardDescription>Performance, disciplinary, and health records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="disciplinaryNotes">Disciplinary Notes</Label>
                <Textarea
                  id="disciplinaryNotes"
                  placeholder="Date, type, and description of any incidents"
                  value={formData.disciplinaryNotes}
                  onChange={(e) => setFormData({ ...formData, disciplinaryNotes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="performanceReviewDates">Annual Performance Review Dates</Label>
                <Input
                  id="performanceReviewDates"
                  placeholder="e.g., 2024-06-15, 2023-06-12"
                  value={formData.performanceReviewDates}
                  onChange={(e) => setFormData({ ...formData, performanceReviewDates: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions/Allergies (Restricted Access)</Label>
                <Textarea
                  id="medicalConditions"
                  placeholder="Sensitive medical information"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                  rows={2}
                  className="border-warning/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type (Emergency Reference)</Label>
                <Select value={formData.bloodType} onValueChange={(value) => setFormData({ ...formData, bloodType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos */}
        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Identification</CardTitle>
              <CardDescription>Required photos for ID badges and uniform compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <PhotoUploadField
                label="Profile Photo - Face *"
                description="High-resolution headshot for ID badge"
                photo={photos.face}
                onUpload={(file) => handlePhotoUpload("face", file)}
              />
              <PhotoUploadField
                label="Profile Photo - Full Body (Front) *"
                description="Full uniform view from front"
                photo={photos.bodyFront}
                onUpload={(file) => handlePhotoUpload("bodyFront", file)}
              />
              <PhotoUploadField
                label="Profile Photo - Full Body (Side) *"
                description="Full uniform view from side"
                photo={photos.bodySide}
                onUpload={(file) => handlePhotoUpload("bodySide", file)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface PhotoUploadFieldProps {
  label: string;
  description: string;
  photo: File | null;
  onUpload: (file: File | null) => void;
}

const PhotoUploadField = ({ label, description, photo, onUpload }: PhotoUploadFieldProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onUpload(file);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
      {photo ? (
        <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-secondary/50">
          <img
            src={URL.createObjectURL(photo)}
            alt={label}
            className="h-24 w-24 object-cover rounded"
          />
          <div className="flex-1">
            <p className="font-medium">{photo.name}</p>
            <p className="text-sm text-muted-foreground">
              {(photo.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpload(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Click to upload photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};
