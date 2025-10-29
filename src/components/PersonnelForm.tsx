import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Upload, X } from "lucide-react";

interface PersonnelFormProps {
  personnelId?: string | null;
}

export const PersonnelForm = ({ personnelId }: PersonnelFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    employee_id: "",
    email: "",
    phone: "",
    date_of_birth: "",
    date_hired: "",
    position: "",
    department: "",
    status: "active",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    notes: "",
  });

  useEffect(() => {
    if (personnelId) {
      fetchPersonnelData();
    }
  }, [personnelId]);

  const fetchPersonnelData = async () => {
    try {
      const { data, error } = await supabase
        .from("personnel")
        .select("*")
        .eq("id", personnelId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          full_name: data.full_name,
          employee_id: data.employee_id,
          email: data.email || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          date_hired: data.date_hired || "",
          position: data.position || "",
          department: data.department || "",
          status: data.status || "active",
          address: data.address || "",
          emergency_contact_name: data.emergency_contact_name || "",
          emergency_contact_phone: data.emergency_contact_phone || "",
          notes: data.notes || "",
        });
        if (data.avatar_url) {
          setAvatarPreview(data.avatar_url);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (userId: string, personnelId: string) => {
    if (!avatarFile) return null;

    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${personnelId}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('personnel-avatars')
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('personnel-avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let avatar_url = avatarPreview;

      if (personnelId) {
        // Upload new avatar if changed
        if (avatarFile) {
          avatar_url = await uploadAvatar(user.id, personnelId);
        }

        const { error } = await supabase
          .from("personnel")
          .update({
            ...formData,
            avatar_url,
          })
          .eq("id", personnelId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Personnel record updated successfully",
        });
        navigate(`/personnel/${personnelId}`);
      } else {
        // Create new personnel
        const { data: newPersonnel, error } = await supabase
          .from("personnel")
          .insert({
            user_id: user.id,
            ...formData,
          })
          .select()
          .single();

        if (error) throw error;

        // Upload avatar for new personnel
        if (avatarFile && newPersonnel) {
          avatar_url = await uploadAvatar(user.id, newPersonnel.id);
          await supabase
            .from("personnel")
            .update({ avatar_url })
            .eq("id", newPersonnel.id);
        }

        toast({
          title: "Success",
          description: "Personnel registered successfully",
        });
        navigate("/");
      }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {personnelId ? "Edit Personnel" : "Register New Personnel"}
        </h2>
        <Button type="submit" disabled={loading} className="gap-2">
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Personnel"}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Avatar Upload */}
        <div className="space-y-2">
          <Label htmlFor="avatar">Profile Photo</Label>
          <div className="flex items-center gap-4">
            {avatarPreview && (
              <div className="relative">
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload a profile photo for this employee
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee_id">Employee ID *</Label>
            <Input
              id="employee_id"
              placeholder="ZS-2024-001"
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_hired">Date Hired</Label>
            <Input
              id="date_hired"
              type="date"
              value={formData.date_hired}
              onChange={(e) => setFormData({ ...formData, date_hired: e.target.value })}
            />
          </div>
        </div>

        {/* Employment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="leave">Leave of Absence</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
            <Input
              id="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
            <Input
              id="emergency_contact_phone"
              type="tel"
              value={formData.emergency_contact_phone}
              onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            placeholder="Additional information about this employee..."
          />
        </div>
      </div>
    </form>
  );
};
