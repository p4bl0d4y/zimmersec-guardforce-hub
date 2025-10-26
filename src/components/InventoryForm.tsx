import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface InventoryFormProps {
  inventoryId?: string | null;
}

export const InventoryForm = ({ inventoryId }: InventoryFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    manufacturer: "",
    model: "",
    serial_prefix: "",
    total_quantity: "",
  });

  useEffect(() => {
    if (inventoryId) {
      fetchInventoryData();
    }
  }, [inventoryId]);

  const fetchInventoryData = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("id", inventoryId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name,
          category: data.category,
          description: data.description || "",
          manufacturer: data.manufacturer || "",
          model: data.model || "",
          serial_prefix: data.serial_prefix || "",
          total_quantity: data.total_quantity.toString(),
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const inventoryData = {
        user_id: user.id,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        manufacturer: formData.manufacturer,
        model: formData.model,
        serial_prefix: formData.serial_prefix,
        total_quantity: parseInt(formData.total_quantity),
        available_quantity: parseInt(formData.total_quantity),
      };

      if (inventoryId) {
        const { error } = await supabase
          .from("inventory")
          .update(inventoryData)
          .eq("id", inventoryId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Inventory item updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("inventory")
          .insert(inventoryData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Inventory item added successfully",
        });
      }

      navigate("/inventory");
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
          {inventoryId ? "Edit Inventory Item" : "Add New Inventory Item"}
        </h2>
        <Button type="submit" disabled={loading} className="gap-2">
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Item"}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Uniform">Uniform</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serial_prefix">Serial Number Prefix</Label>
            <Input
              id="serial_prefix"
              placeholder="ZS-ITM-"
              value={formData.serial_prefix}
              onChange={(e) => setFormData({ ...formData, serial_prefix: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total_quantity">Total Quantity *</Label>
          <Input
            id="total_quantity"
            type="number"
            min="0"
            value={formData.total_quantity}
            onChange={(e) => setFormData({ ...formData, total_quantity: e.target.value })}
            required
          />
        </div>
      </div>
    </form>
  );
};
