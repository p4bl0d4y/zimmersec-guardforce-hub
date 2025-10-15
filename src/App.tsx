import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PersonnelList from "./pages/PersonnelList";
import PersonnelDetail from "./pages/PersonnelDetail";
import RegisterPersonnel from "./pages/RegisterPersonnel";
import EditPersonnel from "./pages/EditPersonnel";
import InventoryList from "./pages/InventoryList";
import InventoryDetail from "./pages/InventoryDetail";
import AddInventory from "./pages/AddInventory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PersonnelList />} />
          <Route path="/personnel/:id" element={<PersonnelDetail />} />
          <Route path="/personnel/:id/edit" element={<EditPersonnel />} />
          <Route path="/register" element={<RegisterPersonnel />} />
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/inventory/:id" element={<InventoryDetail />} />
          <Route path="/inventory/add" element={<AddInventory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
