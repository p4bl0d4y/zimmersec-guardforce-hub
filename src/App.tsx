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
import EditInventory from "./pages/EditInventory";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><PersonnelList /></ProtectedRoute>} />
          <Route path="/personnel/:id" element={<ProtectedRoute><PersonnelDetail /></ProtectedRoute>} />
          <Route path="/personnel/:id/edit" element={<ProtectedRoute><EditPersonnel /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute><RegisterPersonnel /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><InventoryList /></ProtectedRoute>} />
          <Route path="/inventory/:id" element={<ProtectedRoute><InventoryDetail /></ProtectedRoute>} />
          <Route path="/inventory/:id/edit" element={<ProtectedRoute><EditInventory /></ProtectedRoute>} />
          <Route path="/inventory/add" element={<ProtectedRoute><AddInventory /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
