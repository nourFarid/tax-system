import './App.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import i18n from "./i18n";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import ExamplePage from './Pages/ExamplePage';
import Setup from './Pages/Setup';
import DocumentType from './Pages/DocumentType'
import Document41 from './Pages/Document41'
import Purchase from './Pages/Purchase'
import AddPurchase from './Pages/AddPurchase'
import AddDocument41 from './Pages/AddDocument41'
import Sales from './Pages/Sales'
import AddSales from './Pages/AddSales'
import TaxType from './Pages/TaxType';
import StatementType from './Pages/StatementType';
import ItemType from './Pages/ItemType';
import NatureOfTransaction from './Pages/NatureOfTransaction';
import FiscalYear from './Pages/FiscalYear';
import Supplier from './Pages/Supplier';
import Customer from './Pages/Customer';
import Item from './Pages/Item';

function App() {
  const lang = useSelector((state) => state.language.lang)

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Auth />} /> */}
        
        {/* Routes with Sidebar */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/Purchase" element={<Purchase/>} />
              <Route path="/Purchase/Add" element={<AddPurchase/>} />
              <Route path="/Sales" element={<Sales/>} />
              <Route path="/Sales/Add" element={<AddSales/>} />
              <Route path="/Setup" element={<Setup/>} />
              <Route path="/Document41" element={<Document41/>} />
              <Route path="/Document41/Add" element={<AddDocument41/>} />
              <Route path="/Setup/DocumentType" element={<DocumentType/>} />
              <Route path="/ExamplePage" element={<ExamplePage/>} />
              <Route path="/StatementType" element={<StatementType/>} />;
              <Route path="/TaxType" element={<TaxType/>} />;
              <Route path="/ItemType" element={<ItemType/>} />;
              <Route path="/TransactionNature" element={<NatureOfTransaction/>} />;
              <Route path="/FiscalYear" element={<FiscalYear/>} />;
              <Route path="/Supplier" element={<Supplier/>} />;
              <Route path="/Customer" element={<Customer/>} />;
              <Route path="/Item" element={<Item/>} />;
              
              {/* Add other routes */}
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
