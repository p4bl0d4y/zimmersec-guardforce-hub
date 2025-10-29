-- Fix critical RLS vulnerability: restrict all data to the admin user only
-- Currently SELECT policies allow any authenticated user to view all records

DROP POLICY IF EXISTS "Authenticated users can view personnel" ON public.personnel;
DROP POLICY IF EXISTS "Authenticated users can view inventory" ON public.inventory;
DROP POLICY IF EXISTS "Authenticated users can view assignments" ON public.inventory_assignments;

-- Create secure policies that only allow the admin (record owner) to view data
CREATE POLICY "Admin can view their personnel records" 
ON public.personnel FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admin can view their inventory records" 
ON public.inventory FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admin can view their assignment records" 
ON public.inventory_assignments FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);