import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import axiosInstance from "../Axios/AxiosInstance";
import AsyncSelect from "react-select/async";
import { useParams } from "react-router-dom";

const UpdateSales = () => {
  const { t } = useTranslate();
  const { id } = useParams();
  const strDocDir = document.documentElement.dir;
  const breadcrumbItems = [
    { label: t("Sales"), link: "/Sales", active: false },
    { label: t("Edit"), link: "", active: true },
  ];

  // ==========================
  // STATE
  // ==========================
  const [objCustomer, setObjCustomer] = useState(null);
  const [objDocType, setObjDocType] = useState(null);
  const [objStatmentType, setObjStatmentType] = useState(null);
  const [objItemType, setObjItemType] = useState(null);
  const [objItem, setObjItem] = useState(null);


  const [objSale, setObjSale] = useState({
    documentTypeId: -1,
    invoiceNumber: "",
    invoiceDate: "",
    itemId: -1,
    statementTypeId: -1,
    itemTypeId: -1,
    customerId: -1,
    price: 0,
    amount: 1,
    tax: 14,
  });

  // ==========================
  // FUNCTIONS (API)
  // ==========================
  const arrItem = async (strInput) => {
    if (strInput.length < 2) {
      return [];
    }
    let objFilter = {
      NameCode: strInput
    };
    const res = await axiosInstance.post("Item/ListAll", objFilter);

    if (res.data.data == null || res.data.data.length == 0) {
      let arr = [
        {
        label: strInput,
        value: -1,
        objItem: {
          name: strInput,
          code: "",
          price: 0
        }
      }]
      ;
      return arr;
    }

    let arr = res.data.data.map(x => ({
      label: "[" + x.code + "] " + x.name,
      value: x.id,
      objItem: x
    }));
    return arr;
  };

  const arrCustomer = async (strInput) => {
    if (strInput.length < 2) return [];

    const res = await axiosInstance.post("/CustomerSupplier/ListAll", {
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
  const resetSale = () => {
    setObjSale({
      documentTypeId: -1,
      invoiceNumber: "",
      invoiceDate: "",
      itemId: -1,
      statementTypeId: -1,
      itemTypeId: -1,
      customerId: -1,
      price: 0,
      amount: 1,
      tax: 14,
    });

    setObjItem(null);
    setObjCustomer(null);
  };

  // ==========================
  // ADD SALE (POST)
  // ==========================
  const Add = async () => {
      const response = await axiosInstance.post("/Sales/Add", objSale);
      if (response.data.result) {
        alert(response.data.message);
        resetSale();}
    
  };

  const fetchDocType = async () => {
    const response = await axiosInstance.post("/DocumentType/ListAll", {});
    if (!response.data.result) alert(response.data.message);
    setObjDocType(response.data.data);
  };
  const fetchSale = async () => {
    const response = await axiosInstance.get("/Sales/"+id, {});
    if (!response.data.result) alert(response.data.message);
    setObjSale(response.data.data);
    console.log('====================================');
    console.log(objSale);
    console.log('====================================');
  };

  const fetchStatmentType = async () => {
    const response = await axiosInstance.post("/StatementType/ListAll", {});
    if (!response.data.result) alert(response.data.message);
    setObjStatmentType(response.data.data);
  };

  const fetchItemType = async () => {
    const response = await axiosInstance.post("/ItemType/ListAll", {});
    if (!response.data.result) alert(response.data.message);
    setObjItemType(response.data.data);
  };

  // ==========================
  // CALCULATIONS
  // ==========================
  const totalAmount = objSale.price * objSale.amount;
  const taxAmount = (totalAmount * objSale.tax) / 100;
  const netAmount = totalAmount + taxAmount;

  useEffect(() => {
      if (objSale.itemId === -1) {
      setObjSale(prev => ({
        ...prev,
        item: {
          ...prev.item,
          price: prev.price / prev.amount
        }
      }));
    }

    fetchDocType();
    fetchStatmentType();
    fetchItemType();
        fetchSale()

  },  [objSale.price, objSale.amount]);

return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="border rounded p-3 mb-2 bg-white shadow-lg">
        <div className="row p-4">
          <div className="col-md-4">
            <h1>
              <strong className="text-primary">{t("Sales")}</strong>
            </h1>
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Customer")}</label>
            <AsyncSelect
              cacheOptions
              defaultOptions={false}
              loadOptions={arrCustomer}
              value={objCustomer}
              onChange={(option) => {
                setObjCustomer(option);
                setObjSale({ ...objSale, customerId: option.value });
              }}
            />
          </div>
          <div className="col-md-6">
            <label>{t("Document Type")}</label>
            <select
              className="mt-2 form-control"
              value={objSale.documentTypeId}
              onChange={(e) =>
                setObjSale({
                  ...objSale,
                  documentTypeId: Number(e.target.value),
                })
              }
            >
              <option value={-1}>{t("Document Type")}</option>

              {objDocType?.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Item Type")}</label>
            <select
              className="mt-2 form-control"
              value={objSale.itemTypeId}
              onChange={(e) =>
                setObjSale({
                  ...objSale,
                  itemTypeId: Number(e.target.value),
                })
              }
            >
              <option value={-1}>{t("Item Type")}</option>

              {objItemType?.map((itemType) => (
                <option key={itemType.id} value={itemType.id}>
                  {itemType.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label>{t("Statement Type")}</label>
            <select
              className="mt-2 form-control"
              value={objSale.statementTypeId}
              onChange={(e) =>
                setObjSale({
                  ...objSale,
                  statementTypeId: Number(e.target.value),
                })
              }
            >
              <option value={-1}>{t("Statement Type")}</option>

              {objStatmentType?.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Invoice Number")}</label>
            <input
              type="text"
              className="mt-2 form-control"
              value={objSale.invoiceNumber}
              onChange={(e) =>
                setObjSale({ ...objSale, invoiceNumber: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <label>{t("Invoice Date")}</label>
            <input
              type="date"
              className="mt-2 form-control"
              value={objSale.invoiceDate}
              onChange={(e) =>
                setObjSale({ ...objSale, invoiceDate: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* ------------------ Items ------------------ */}
        <div className="border rounded p-3 mb-2 bg-white shadow-lg mt-5">
        <div className="row p-4">
          <div className="col-md-6 form-group">
            <label className="mb-2">{t("Item")}</label>
            <AsyncSelect cacheOption defaultOptions={false} loadOptions={arrItem} value={objItem}
              onChange={(option) => {
                setObjItem(option);
                setObjSale(prev => ({...prev, item: option.objItem}));
                setObjSale(prev => ({...prev, itemId: option.value}));
                setObjSale(prev => ({...prev, price: option.objItem?.price || 0}));
              }}
            />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Price")}</label>
            <input type="number" className="mt-2 form-control" placeholder="0.0" value={objSale.price} onChange={(e) => {setObjSale(prev => ({...prev, price: Number(e.target.value)}))}} />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Tax")}</label>
            <input type="number" className="mt-2 form-control" value={objSale.tax} onChange={(e) => setObjSale(prev => ({...prev, tax: Number(e.target.value)}))} />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Amount")}</label>
            <input type="number" className="mt-2 form-control" placeholder="1" value={objSale.amount} onChange={(e) => setObjSale(prev => ({...prev, amount: Number(e.target.value)}))}disabled />
          </div>
        </div>

        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-2 pull-left border border-black me-3" dir={strDocDir}>
            <strong>{t("Total Amount")} : </strong><span>{objSale.price ?? "0.0"}</span><br />
            <strong>{t("Tax Percent")} : </strong><span>{objSale.tax ?? "0"} %</span><br />
            <strong>{t("Tax Amount")} : </strong><span>{((objSale.price * objSale.tax) / 100) ?? "0.0"}</span><br />
          </div>
        </div>

        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-3 me-2">
            <button type="button" className="btn btn-success" onClick={Add}>{t("Add")}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateSales;
