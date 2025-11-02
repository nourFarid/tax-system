import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTranslate from "../Hooks/Translation/useTranslate";

const Setup = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  useEffect(() => {
    // fetchAgents();
  }, []);
  const objTitle = {
    DocumentType: t("Document Type"),
    TaxType: t("Tax Type"),
    StatementType: t("Statement Type"),
    Item: t("Item"),
    ItemType: t("Item Type"),
    TransactionNature: t("Transaction Nature"),
    Customer: t("Customer"),
    Supplier: t("Supplier"),
    FiscalYear: t("Fiscal Year"),
    Preview: t("Preview")
};
  /* if (loading)
    return <p className="text-center mt-5 text-gray-500">Loading...</p>;

  if (error)
    return <p className="text-center mt-5 text-red-500">{error}</p>;

  const handleEdit = (row) => {
    alert(`Edit ${row.agentName}`);
  };
  const handleShow = (row) => {
    alert(`Agent Name: ${row.agentName}\nAvailable: ${row.available}`);
  };

  const handleDelete = (row) => {
    setAgents((prev) => prev.filter((r) => r.agentId !== row.agentId));
  }; */

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div onClick={() => navigate("/DocumentType")} className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg rounded-2xl border-0 p-4 h-36 flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-file-earmark-medical-fill opacity-25 text-7xl"></i>
          </div>
          <div className="details text-right">
            <h1 className="text-3xl font-bold">{objTitle.DocumentType}</h1>
            <h4 className="mt-1 text-gray-200 text-base">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/TaxType")} className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg rounded-2xl border-0 p-4 h-36 flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-cash-stack opacity-25 text-7xl"></i>
          </div>
          <div className="details text-right">
            <h1 className="text-3xl font-bold">{objTitle.TaxType}</h1>
            <h4 className="mt-1 text-gray-200 text-base">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/StatementType")} className="bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg rounded-2xl border-0 p-4 h-36 flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-paperclip opacity-25 text-7xl"></i>
          </div>
          <div className="details text-right">
            <h1 className="text-3xl font-bold">{objTitle.StatementType}</h1>
            <h4 className="mt-1 text-gray-200 text-base">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/Item")} className="bg-gradient-to-br from-blue-500 to-sky-600 text-white shadow-lg rounded-2xl border-0 p-4 h-36 flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-stack-overflow opacity-25 text-7xl"></i>
          </div>
          <div className="details text-right">
            <h1 className="text-3xl font-bold">{objTitle.Item}</h1>
            <h4 className="mt-1 text-gray-200 text-base">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/ItemType")} className="bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg rounded-2xl border-0 p-4 h-36 flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-justify opacity-25 text-7xl"></i>
          </div>
          <div className="details text-right">
            <h1 className="text-3xl font-bold">{objTitle.ItemType}</h1>
            <h4 className="mt-1 text-gray-200 text-base">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/TransactionNature")} className="bg-gradient-to-br from-fuchsia-500 to-purple-700 text-white shadow-lg rounded-2xl border-0 p-4 h-36 flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-calculator-fill opacity-25 text-7xl"></i>
          </div>
          <div className="details text-right">
            <h1 className="text-3xl font-bold">{objTitle.TransactionNature}</h1>
            <h4 className="mt-1 text-gray-200 text-base">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/Customer")} className="bg-gradient-to-br from-green-500 to-lime-600 text-white shadow-lg rounded-2xl border-0 p-4 h-36 flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-person-fill opacity-25 text-7xl"></i>
          </div>
          <div className="details text-right">
            <h1 className="text-3xl font-bold">{objTitle.Customer}</h1>
            <h4 className="mt-1 text-gray-200 text-base">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/Supplier")} className="bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-lg rounded-2xl border-0 p-4 h-36 flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-buildings-fill opacity-25 text-7xl"></i>
          </div>
          <div className="details text-right">
            <h1 className="text-3xl font-bold">{objTitle.Supplier}</h1>
            <h4 className="mt-1 text-gray-200 text-base">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/FiscalYear")} className="bg-gradient-to-r from-red-600 to-red-400 text-white shadow-lg rounded-2xl p-5 h-36 flex items-center cursor-pointer transform transition duration-500 hover:scale-105 hover:from-red-500 hover:to-red-300">
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-bank2 opacity-25 text-7xl"></i>
          </div>
          <div className="details text-right">
            <h1 className="text-2xl font-bold">{objTitle.FiscalYear}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
