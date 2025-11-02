import './App.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import i18n from "./i18n";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import ExamplePage from './Pages/ExamplePage';
import Setup from './Pages/Setup';
import DocumentType from './Pages/DocumentType'

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
              <Route path="/Purchase" element={""} />
              <Route path="/Invoice" element={""} />
              <Route path="/Setup" element={<Setup/>} />
              {/* <Route path="/Document41" element={<Document41/>} /> */}
              <Route path="/DocumentType" element={<DocumentType/>} />
              <Route path="/ExamplePage" element={<ExamplePage/>} />
              {/* Add other routes */}
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
