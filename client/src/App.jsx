import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrandProvider } from "./context/BrandContext";
import Layout from "./components/layout/Layout";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetail from "./pages/InvoiceDetail";
import InvoiceCreate from "./pages/InvoiceCreate";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrandProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<InvoiceList />} />
            <Route path="/invoices/new" element={<InvoiceCreate />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
            <Route path="/invoices/:id/edit" element={<InvoiceCreate />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </BrandProvider>
  );
}

export default App;