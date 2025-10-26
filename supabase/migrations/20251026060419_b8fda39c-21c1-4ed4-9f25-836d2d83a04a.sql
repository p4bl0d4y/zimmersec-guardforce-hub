-- Create personnel table for security employees
CREATE TABLE public.personnel (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  employee_id text NOT NULL UNIQUE,
  email text,
  phone text,
  date_of_birth date,
  date_hired date,
  position text,
  department text,
  status text DEFAULT 'active',
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  notes text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create inventory table
CREATE TABLE public.inventory (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  description text,
  manufacturer text,
  model text,
  serial_prefix text,
  total_quantity integer NOT NULL DEFAULT 0,
  available_quantity integer NOT NULL DEFAULT 0,
  assigned_quantity integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create inventory assignments table (links personnel to inventory)
CREATE TABLE public.inventory_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  personnel_id uuid NOT NULL REFERENCES public.personnel(id) ON DELETE CASCADE,
  inventory_id uuid NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  serial_number text,
  assigned_date timestamp with time zone NOT NULL DEFAULT now(),
  return_date timestamp with time zone,
  status text DEFAULT 'assigned',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for personnel (admin can do everything)
CREATE POLICY "Authenticated users can view personnel" 
ON public.personnel FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert personnel" 
ON public.personnel FOR INSERT 
TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update personnel" 
ON public.personnel FOR UPDATE 
TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete personnel" 
ON public.personnel FOR DELETE 
TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for inventory
CREATE POLICY "Authenticated users can view inventory" 
ON public.inventory FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert inventory" 
ON public.inventory FOR INSERT 
TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update inventory" 
ON public.inventory FOR UPDATE 
TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete inventory" 
ON public.inventory FOR DELETE 
TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for inventory assignments
CREATE POLICY "Authenticated users can view assignments" 
ON public.inventory_assignments FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert assignments" 
ON public.inventory_assignments FOR INSERT 
TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update assignments" 
ON public.inventory_assignments FOR UPDATE 
TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete assignments" 
ON public.inventory_assignments FOR DELETE 
TO authenticated USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_personnel_updated_at
BEFORE UPDATE ON public.personnel
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_assignments_updated_at
BEFORE UPDATE ON public.inventory_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for personnel avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('personnel-avatars', 'personnel-avatars', true);

-- Storage policies for personnel avatars
CREATE POLICY "Authenticated users can view avatars" 
ON storage.objects FOR SELECT 
TO authenticated
USING (bucket_id = 'personnel-avatars');

CREATE POLICY "Authenticated users can upload avatars" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'personnel-avatars');

CREATE POLICY "Authenticated users can update avatars" 
ON storage.objects FOR UPDATE 
TO authenticated
USING (bucket_id = 'personnel-avatars');

CREATE POLICY "Authenticated users can delete avatars" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'personnel-avatars');

-- Function to update inventory quantities when assignments change
CREATE OR REPLACE FUNCTION public.update_inventory_quantities()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.inventory 
    SET assigned_quantity = assigned_quantity + NEW.quantity,
        available_quantity = available_quantity - NEW.quantity
    WHERE id = NEW.inventory_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.inventory 
    SET assigned_quantity = assigned_quantity - OLD.quantity + NEW.quantity,
        available_quantity = available_quantity + OLD.quantity - NEW.quantity
    WHERE id = NEW.inventory_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.inventory 
    SET assigned_quantity = assigned_quantity - OLD.quantity,
        available_quantity = available_quantity + OLD.quantity
    WHERE id = OLD.inventory_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-update inventory quantities
CREATE TRIGGER update_inventory_quantities_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.inventory_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_inventory_quantities();