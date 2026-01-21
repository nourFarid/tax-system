import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTranslate from "../Hooks/Translation/useTranslate";
import Position from "./Position";

const Setup = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();

  useEffect(() => {
    // fetch data if needed
  }, []);

  const objTitle = {
    DocumentType: t("Document Type"),
    TaxType: t("Tax Type"),
    StatementType: t("Statement Type"),
    Item: t("Items"),
    ItemType: t("Item Type"),
    TransactionNature: t("Transaction Nature"),
    Customer: t("Customer"),
    Supplier: t("Supplier"),
    FiscalYear: t("Fiscal Year"),
    User: t("Users"),
    Departments: t("Departments"),
    Position: t("Position"),
    Preview: t("Preview"),
  };

  const cardClass =
    "text-white shadow-lg rounded-2xl border-0 p-4 min-h-36 h-auto flex items-center hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden";

  const textClass =
    "details text-right whitespace-normal break-words overflow-hidden w-2/3";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        onClick={() => navigate("/Setup/DocumentType")}
        className={`bg-gradient-to-br from-indigo-500 to-purple-600 ${cardClass}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-file-earmark-medical-fill opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.DocumentType}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      {/* <div
        onClick={() => navigate("/Setup/TaxType")}
        className={`bg-gradient-to-br from-emerald-500 to-teal-600 ${cardClass}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-cash-stack opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.TaxType}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div> */}

      <div
        onClick={() => navigate("/Setup/StatementType")}
        className={`bg-gradient-to-br from-rose-500 to-pink-600 ${cardClass}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-paperclip opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.StatementType}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/Setup/Item")} className={`bg-gradient-to-br from-blue-500 to-sky-600 ${cardClass}`}>
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-stack-overflow opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.Item}</h1>
            <h4 className="mt-1 text-gray-00 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div
        onClick={() => navigate("/Setup/ItemType")}
        className={`bg-gradient-to-br from-amber-500 to-orange-600 ${cardClass}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-justify opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.ItemType}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/Setup/TransactionNature")} className={`bg-gradient-to-br from-fuchsia-500 to-purple-700 ${cardClass}`} >
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-calculator-fill opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.TransactionNature}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/Setup/Customer")} className={`bg-gradient-to-br from-green-500 to-lime-600 ${cardClass}`}>
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-person-fill opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.Customer}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/Setup/Supplier")} className={`bg-gradient-to-br bg-gradient-to-br from-rose-400 to-pink-500 ${cardClass}`}>
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-buildings-fill opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.Supplier}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/Setup/FiscalYear")} className={`bg-gradient-to-br from-red-600 to-red-400 ${cardClass}`}>
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-bank2 opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.FiscalYear}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/Setup/User")} className={`bg-gradient-to-br from-cyan-500 to-blue-600 ${cardClass}`}>
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-people-fill opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.User}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/Setup/Departments")} className={`bg-gradient-to-br from-violet-500 to-indigo-600 ${cardClass}`}>
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-diagram-3-fill opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.Departments}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>

      <div onClick={() => navigate("/Setup/Position")} className={`bg-gradient-to-br from-cyan-500 to-blue-600 ${cardClass}`}>
        <div className="flex items-center justify-between w-full">
          <div className="visual">
            <i className="bi bi-people-fill opacity-25 text-7xl"></i>
          </div>
          <div className={textClass}>
            <h1 className="text-2xl font-bold leading-tight">{objTitle.Position}</h1>
            <h4 className="mt-1 text-gray-200 text-sm">{objTitle.Preview}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
