import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import axiosInstance from "../Axios/AxiosInstance";
import AsyncSelect from "react-select/async";

const AddSales = () => {
  const { t } = useTranslate();
  const strDocDir = document.documentElement.dir;

  const breadcrumbItems = [
    { label: t("Sales"), link: "/Sales", active: false },
    { label: t("Add"), link: "", active: true },
  ];

  // ==========================
  // STATE
  // ==========================
  const [objItem, setObjItem] = useState(null);
  const [objCustomer, setObjCustomer] = useState(null);

  const [objSale, setObjSale] = useState({
    DocumentTypeId: -1,
    InvoiceNumber: "",
    InvoiceDate: "",
    ItemId: -1,
    StatementTypeId: "",
    ItemTypeId: -1,
    CustomerId: -1,
    Price: 0,
    amount: 1,
    Tax: 14,
    Discount: 0,
  });

  // ==========================
  // FUNCTIONS (API)
  // ==========================
  const arrItem = async (strInput) => {
    if (strInput.length < 2) return [];

    const res = await axiosInstance.post("Item/ListAll", {
      NameCode: strInput,
    });

    return res.data.data.map((x) => ({
      label: x.name,
      value: x.id,
    }));
  };

  const arrCustomer = async (strInput) => {
    if (strInput.length < 2) return [];

    const res = await axiosInstance.post("CustomerSupplier/ListAll", {
      NameIdentity: strInput,
      IsCustomer: true,
    });

    return res.data.data.map((x) => ({
      label: `[${x.taxRegistrationNumber ?? "-"}] ${x.name}`,
      value: x.id,
      objCustomer: x,
    }));
  };

  // ==========================
  // RESET
  // ==========================
  const reset = () => {
    setObjSale({
      DocumentTypeId: -1,
      InvoiceNumber: "",
      InvoiceDate: "",
      ItemId: -1,
      StatementTypeId: "",
      ItemTypeId: -1,
      CustomerId: -1,
      Price: 0,
      amount: 1,
      Tax: 14,
      Discount: 0,
    });
    setObjItem(null);
    setObjCustomer(null);
  };

  // ==========================
  // ADD SALE (POST)
  // ==========================
  const Add = async () => {
    try {
      const response = await axiosInstance.post("Sales/Add", objSale);

      if (response.data.result) {
        alert(response.data.message);
        reset();
      }
    } catch (err) {
      alert("Error in API!");
      console.log(err);
    }
  };

  // ==========================
  // CALCULATIONS
  // ==========================
  const totalAmount = objSale.Price * objSale.amount;
  const taxAmount = (totalAmount * objSale.Tax) / 100;
  const netAmount = totalAmount + taxAmount - objSale.Discount;

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      {/* ------------------ Main Info ------------------ */}
      <div className="border rounded p-3 mb-2 bg-white shadow-lg">
        <div className="row p-4">
          <div className="col-md-4">
            <h1>
              <strong className="text-primary">{t("Sales")}</strong>
            </h1>
          </div>
        </div>

        {/* Customer - Tax - Document */}
        <div className="row p-4">
          <div className="col-md-4">
            <label>{t("Customer")}</label>
            <AsyncSelect
              cacheOptions
              defaultOptions={false}
              loadOptions={arrCustomer}
              value={objCustomer}
              onChange={(option) => {
                setObjCustomer(option);
                setObjSale({ ...objSale, CustomerId: option.value });
              }}
            />
          </div>

          <div className="col-md-4">
            <label>{t("Tax Type")}</label>
            <select
              className="mt-2 form-control"
              value={objSale.Tax}
              onChange={(e) =>
                setObjSale({ ...objSale, Tax: Number(e.target.value) })
              }
            >
              <option value={14}>14%</option>
              <option value={0}>0%</option>
            </select>
          </div>

          <div className="col-md-4">
            <label>{t("Document Type")}</label>
            <select
              className="mt-2 form-control"
              value={objSale.DocumentTypeId}
              onChange={(e) =>
                setObjSale({
                  ...objSale,
                  DocumentTypeId: Number(e.target.value),
                })
              }
            >
              <option value={-1}>{t("Document Type")}</option>
              <option value={1}>فاتورة</option>
              <option value={2}>اشعار خصم</option>
            </select>
          </div>
        </div>

        {/* Invoice */}
        <div className="row p-4">
          <div className="col-md-4">
            <label>{t("Invoice Number")}</label>
            <input
              type="text"
              className="mt-2 form-control"
              value={objSale.InvoiceNumber}
              onChange={(e) =>
                setObjSale({ ...objSale, InvoiceNumber: e.target.value })
              }
            />
          </div>

          <div className="col-md-4">
            <label>{t("Invoice Date")}</label>
            <input
              type="date"
              className="mt-2 form-control"
              value={objSale.InvoiceDate}
              onChange={(e) =>
                setObjSale({ ...objSale, InvoiceDate: e.target.value })
              }
            />
          </div>

          <div className="col-md-4">
            <label>{t("Statement Type")}</label>
            <select
              className="mt-2 form-control"
              value={objSale.StatementTypeId}
              onChange={(e) =>
                setObjSale({
                  ...objSale,
                  StatementTypeId: e.target.value,
                })
              }
            >
              <option value="">{t("Statement Type")}</option>
              <option value="Cash">كاش</option>
              <option value="Credit">آجل</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------ Items ------------------ */}
      <div className="border rounded p-3 mb-2 bg-white shadow-lg mt-5">
        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Item")}</label>
            <AsyncSelect
              cacheOptions
              loadOptions={arrItem}
              value={objItem}
              onChange={(option) => {
                setObjItem(option);
                setObjSale({ ...objSale, ItemId: option.value });
              }}
            />
          </div>

          <div className="col-md-2">
            <label>{t("Price")}</label>
            <input
              type="number"
              className="mt-2 form-control"
              value={objSale.Price}
              onChange={(e) =>
                setObjSale({ ...objSale, Price: Number(e.target.value) })
              }
            />
          </div>

          <div className="col-md-2">
            <label>{t("Amount")}</label>
            <input
              type="number"
              className="mt-2 form-control"
              value={objSale.amount}
              onChange={(e) =>
                setObjSale({ ...objSale, amount: Number(e.target.value) })
              }
            />
          </div>

          <div className="col-md-2">
            <label>{t("Discount")}</label>
            <input
              type="number"
              className="mt-2 form-control"
              value={objSale.Discount}
              onChange={(e) =>
                setObjSale({ ...objSale, Discount: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Summary */}
        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-2 border border-black me-3 p-2" dir={strDocDir}>
            <strong>{t("Total Amount")}:</strong> {totalAmount.toFixed(2)} <br />
            <strong>{t("Tax Percent")}:</strong> {objSale.Tax}% <br />
            <strong>{t("Tax Amount")}:</strong> {taxAmount.toFixed(2)} <br />
            <strong>{t("Discount")}:</strong> {objSale.Discount} <br />
            <strong>{t("Net Amount")}:</strong> {netAmount.toFixed(2)}
          </div>
        </div>

        {/* Add Button */}
        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-3 me-2">
            <button type="button" className="btn btn-success" onClick={Add}>
              {t("Add")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSales;
