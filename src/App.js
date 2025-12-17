import './App.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import i18n from "./i18n";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const Layout = lazy(() => import('./Components/Layout/Layout'));
const ExamplePage = lazy(() => import('./Pages/ExamplePage'));
const Setup = lazy(() => import('./Pages/Setup'));
const DocumentType = lazy(() => import('./Pages/DocumentType'));
const Document41 = lazy(() => import('./Pages/Document41'));
const Purchase = lazy(() => import('./Pages/Purchase'));
const AddPurchase = lazy(() => import('./Pages/AddPurchase'));
const UpdatePurchase = lazy(() => import('./Pages/UpdatePurchase'));
const AddDocument41 = lazy(() => import('./Pages/AddDocument41'));
const EditDocument41 = lazy(() => import('./Pages/EditDocument41'));
const Sales = lazy(() => import('./Pages/Sales'));
const AddSales = lazy(() => import('./Pages/AddSales'));
const UpdateSales = lazy(() => import('./Pages/UpdateSales'));
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
const Auth = lazy(() => import('./Pages/Auth'));

function App() {
  const lang = useSelector((state) => state.language.lang)

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        {/* Routes with Sidebar */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/Purchase" element={<Purchase/>} />
              <Route path="/Purchase/Add" element={<AddPurchase/>} />
              <Route path="/Sales" element={<Sales/>} />
              <Route path="/Sales/Add" element={<AddSales/>} />
              <Route path="/Sales/UpdateSale/:id" element={<UpdateSales />} />
              <Route path="/Purchase/UpdatePurchase/:id" element={<UpdatePurchase />} />
              <Route path="/Setup" element={<Setup/>} />
              <Route path="/Document41" element={<Document41/>} />
              <Route path="/Document41/Add" element={<AddDocument41/>} />
              <Route path="/Document41/UpdateDocument41/:id" element={<EditDocument41/>} />
              <Route path="/Setup/DocumentType" element={<DocumentType/>} />
              <Route path="/ExamplePage" element={<ExamplePage/>} />
              <Route path="/Setup/StatementType" element={<StatementType/>} />;
              <Route path="/Setup/TaxType" element={<TaxType/>} />;
              <Route path="/Setup/ItemType" element={<ItemType/>} />;
              <Route path="/Setup/TransactionNature" element={<NatureOfTransaction/>} />;
              <Route path="/Setup/FiscalYear" element={<FiscalYear/>} />;
              <Route path="/Setup/Supplier" element={<Supplier/>} />;
              <Route path="/Setup/Customer" element={<Customer/>} />;
              <Route path="/Setup/Item" element={<Item/>} />;
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
