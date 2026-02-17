import './App.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import i18n from "./i18n";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HandleAuth from './HandleAuth';
import { getUserRoles } from "./Hooks/Services/Storage.js"
import ProtectedRoute from './Hooks/Services/ProtectedRoute.js';
const Layout = lazy(() => import('./Components/Layout/Layout'));
const ExamplePage = lazy(() => import('./Pages/ExamplePage'));
const Setup = lazy(() => import('./Pages/Setup'));
const DocumentType = lazy(() => import('./Pages/DocumentType'));
const Document41 = lazy(() => import('./Pages/Document41'));
const Purchase = lazy(() => import('./Pages/Purchase'));
const AddPurchase = lazy(() => import('./Pages/AddPurchase'));
const EditPurchase = lazy(() => import('./Pages/EditPurchase'));
const Sales = lazy(() => import('./Pages/Sales'));
const AddSales = lazy(() => import('./Pages/AddSales'));
const EditSales = lazy(() => import('./Pages/EditSales'));
const TaxType = lazy(() => import('./Pages/TaxType'));
const StatementType = lazy(() => import('./Pages/StatementType'));
const ItemType = lazy(() => import('./Pages/ItemType'));
const NatureOfTransaction = lazy(() => import('./Pages/NatureOfTransaction'));
const FiscalYear = lazy(() => import('./Pages/FiscalYear'));
const InfoFiscalYear = lazy(() => import('./Pages/InfoFiscalYear'));
const Supplier = lazy(() => import('./Pages/Supplier'));
const Customer = lazy(() => import('./Pages/Customer'));
const Item = lazy(() => import('./Pages/Item'));
const User = lazy(() => import('./Pages/User'));
const Departments = lazy(() => import('./Pages/Departments'));
const Position = lazy(() => import('./Pages/Position'));
const Auth = lazy(() => import('./Pages/Auth'));
const InvalidDocuments = lazy(() => import('./Pages/InvalidDocuments'));
const ResetPassword = lazy(() => import('./Pages/ResetPassword'));
const NotFound = lazy(() => import('./NotFound'));

function App() {
  const lang = useSelector((state) => state.language.lang);
  const roles = getUserRoles();

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />;

        {/* Routes with Sidebar */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/Purchase" element={<Purchase />} />
                <Route path="/InvalidDocuments" element={<InvalidDocuments />} />
                <Route path="/Purchase/Add" element={<AddPurchase />} />
                <Route path="/Sales" element={<Sales />} />
                <Route path="/Sales/Add" element={<AddSales />} />
                <Route path="/Sales/UpdateSale/:id" element={<EditSales />} />
                <Route path="/Purchase/UpdatePurchase/:id/:docItemId" element={<EditPurchase />} />
                <Route path="/Purchase/UpdatePurchase/:id" element={<EditPurchase />} />
                <Route path="/Setup" element={<Setup />} />
                <Route path="/Document41" element={<Document41 />} />
                <Route path="/Setup/DocumentType" element={<DocumentType />} />
                <Route path="/ExamplePage" element={<ExamplePage />} />
                <Route path="/Setup/Item" element={<Item />} />
                <Route path="/Setup/Supplier" element={<Supplier />} />
                <Route path="/Setup/Customer" element={<Customer />} />
                {roles.includes("Admin") && 
                <Route path="/Setup/StatementType" element={<StatementType />} />}
                {roles.includes("Admin") && 
                <Route path="/Setup/TaxType" element={<TaxType />} />}
                {roles.includes("Admin") && 
                <Route path="/Setup/ItemType" element={<ItemType />} />}
                {roles.includes("Admin") && 
                <Route path="/Setup/TransactionNature" element={<NatureOfTransaction />} />}
                {roles.includes("Admin") && 
                <Route path="/Setup/FiscalYear" element={<FiscalYear />} />}
                {roles.includes("Admin") &&
                <Route path="/Setup/User" element={<User />} />}
                {roles.includes("Admin") &&
                <Route path="/Setup/Departments" element={<Departments />} />}
                {roles.includes("Admin") &&
                <Route path="/Setup/Position" element={<Position />} />}
                {roles.includes("Admin") &&
                <Route path="/Setup/FiscalYear/Info/:id" element={<InfoFiscalYear />} />}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ProtectedRoute>

        } />
      </Routes>
    </Router>
  );
}

export default App;
