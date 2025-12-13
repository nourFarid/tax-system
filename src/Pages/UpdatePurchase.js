import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import axiosInstance from "../Axios/AxiosInstance";
import AsyncSelect from "react-select/async";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Updatepurchases = () => {
    const navigate = useNavigate();

  const { t } = useTranslate();
  const { id } = useParams();
  const strDocDir = document.documentElement.dir;

  const breadcrumbItems = [
    { label: t("Purchase"), link: "/Purchase", active: false },
    { label: t("Edit"), link: "", active: true },
  ];

  // ==========================
  // STATE
  // ==========================
  const [objSupplier, setObjSupplier] = useState(null);
  const [objDocType, setObjDocType] = useState([]);
  const [objStatmentType, setObjStatmentType] = useState([]);
  const [objItemType, setObjItemType] = useState([]);
  const [objItem, setObjItem] = useState(null);

  const [objpurchase, setObjpurchase] = useState({
    id: 0,
    docId: 0,
    documentTypeId: -1,
    invoiceNumber: "",
    invoiceDate: "",
    itemId: -1,
    statementTypeId: -1,
    itemTypeId: -1,
    supplierId: -1, // purchase
    customerId: -1, // purchases
    price: 0,
    amount: 1,
    tax: 14,
  });

  // ==========================
  // API HELPERS
  // ==========================
  const arrItem = async (strInput) => {
    if (strInput.length < 2) return [];
    const res = await axiosInstance.post("Item/ListAll", { NameCode: strInput });
    if (!res.data.data?.length) {
      return [
        { label: strInput, value: -1, objItem: { name: strInput, code: "", price: 0 } },
      ];
    }
    return res.data.data.map((x) => ({
      label: `[${x.code}] ${x.name}`,
      value: x.id,
      objItem: x,
    }));
  };

  const arrSupplier = async (strInput) => {
    if (strInput.length < 2) return [];
    const res = await axiosInstance.post("/CustomerSupplier/ListAll", {
      NameIdentity: strInput,
      IsSupplier: true,
    });
    return res.data.data.map((x) => ({
      label: `[${x.taxRegistrationNumber ?? "-"}] ${x.name}`,
      value: x.id,
      objSupplier: x,
    }));
  };

  // ==========================
  // FETCH DATA
  // ==========================
  const fetchDocType = async () => {
    const response = await axiosInstance.post("/DocumentType/ListAll", {});
    if (!response.data.result) alert(response.data.message);
    else setObjDocType(response.data.data);
  };

  const fetchStatmentType = async () => {
    const response = await axiosInstance.post("/StatementType/ListAll", {});
    if (!response.data.result) alert(response.data.message);
    else setObjStatmentType(response.data.data);
  };

  const fetchItemType = async () => {
    const response = await axiosInstance.post("/ItemType/ListAll", {});
    if (!response.data.result) alert(response.data.message);
    else setObjItemType(response.data.data);
  };

  const fetchpurchase = async () => {
    const response = await axiosInstance.get("/Purchase/" + id);
    if (!response.data.result) return alert(response.data.message);

    const purchase = response.data.data;

    setObjpurchase({
      id: purchase.id,
      docId: purchase.docId,
      documentTypeId: purchase.documentType?.id ?? -1,
      invoiceNumber: purchase.invoiceNumber ?? "",
      invoiceDate: purchase.invoiceDate ?? "",
      itemId: purchase.item?.id ?? -1,
      statementTypeId: purchase.statementType?.id ?? -1,
      itemTypeId: purchase.itemType?.id ?? -1,
      supplierId: purchase.customerSupplierId ?? -1,
      customerId: purchase.customerId ?? -1,
      price: purchase.item?.price ?? 0,
      amount: purchase.amount ?? 1,
      tax: purchase.tax ?? 14,
    });

    if (purchase.customerSupplierId) {
      setObjSupplier({
        label: `[${purchase.customerSupplierTaxRegistrationNumber ?? "-"}] ${purchase.customerSupplierName}`,
        value: purchase.customerSupplierId,
        objSupplier: {
          id: purchase.customerSupplierId,
          name: purchase.customerSupplierName,
          taxRegistrationNumber: purchase.customerSupplierTaxRegistrationNumber,
          nationalId: purchase.customerSupplierNationalId,
          passportNumber: purchase.customerSupplierPassportNumber,
          address: purchase.customerSupplierAddress,
        },
      });
    }

    if (purchase.item) {
      setObjItem({
        label: `[${purchase.item.code}] ${purchase.item.name}`,
        value: purchase.item.id,
        objItem: purchase.item,
      });
    }
  };

  useEffect(() => {
    fetchDocType();
    fetchStatmentType();
    fetchItemType();
    fetchpurchase();
  }, []);

  // ==========================
  // UPDATE FUNCTION
  // ==========================
  const Update = async () => {
    try {
      const body = {
        id: objpurchase.id,
        docId: objpurchase.docId,
        documentTypeId: objpurchase.documentTypeId,
        invoiceNumber: objpurchase.invoiceNumber,
        invoiceDate: objpurchase.invoiceDate,
        itemId: objpurchase.itemId,
        statementTypeId: objpurchase.statementTypeId,
        itemTypeId: objpurchase.itemTypeId,
        supplierId: objpurchase.supplierId,
        customerId: objpurchase.customerId,
        price: objpurchase.price,
        amount: objpurchase.amount,
        tax: objpurchase.tax,
      };

      const response = await axiosInstance.put("/purchase/Update", body);

      if (response.data.result) 
        {alert("purchase updated successfully");
       navigate(`/purchases`);}
      else alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to update purchase");
    }
  };

  // ==========================
  // CALCULATIONS
  // ==========================
  const totalAmount = objpurchase.price * objpurchase.amount;
  const taxAmount = (totalAmount * objpurchase.tax) / 100;
  const netAmount = totalAmount + taxAmount;

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      {/* purchase Details */}
      <div className="border rounded p-3 mb-2 bg-white shadow-lg">
        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Customer")}</label>
            <AsyncSelect
              cacheOptions
              defaultOptions={false}
              loadOptions={arrSupplier}
              value={objSupplier}
              onChange={(option) => {
                setObjSupplier(option);
                setObjpurchase((prev) => ({ ...prev, supplierId: option.value }));
              }}
            />
          </div>

          <div className="col-md-6">
            <label>{t("Document Type")}</label>
            <select
              className="mt-2 form-control"
              value={objpurchase.documentTypeId}
              onChange={(e) =>
                setObjpurchase({ ...objpurchase, documentTypeId: Number(e.target.value) })
              }
            >
              <option value={-1}>{t("Document Type")}</option>
              {objDocType.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Item Details */}
        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Item Type")}</label>
            <select
              className="mt-2 form-control"
              value={objpurchase.itemTypeId}
              onChange={(e) =>
                setObjpurchase({ ...objpurchase, itemTypeId: Number(e.target.value) })
              }
            >
              <option value={-1}>{t("Item Type")}</option>
              {objItemType.map((itemType) => (
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
              value={objpurchase.statementTypeId}
              onChange={(e) =>
                setObjpurchase({ ...objpurchase, statementTypeId: Number(e.target.value) })
              }
            >
              <option value={-1}>{t("Statement Type")}</option>
              {objStatmentType.map((x) => (
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
              value={objpurchase.invoiceNumber}
              onChange={(e) =>
                setObjpurchase({ ...objpurchase, invoiceNumber: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <label>{t("Invoice Date")}</label>
            <input
              type="date"
              className="mt-2 form-control"
              value={objpurchase.invoiceDate}
              onChange={(e) =>
                setObjpurchase({ ...objpurchase, invoiceDate: e.target.value })
              }
            />
          </div>
        </div>

        {/* Item Selection */}
        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Item")}</label>
            <AsyncSelect
              cacheOptions
              defaultOptions={false}
              loadOptions={arrItem}
              value={objItem}
              onChange={(option) => {
                setObjItem(option);
                setObjpurchase((prev) => ({
                  ...prev,
                  itemId: option.value,
                  price: option.objItem?.price ?? 0,
                }));
              }}
            />
          </div>

          <div className="col-md-2">
            <label>{t("Price")}</label>
            <input
              type="number"
              className="mt-2 form-control"
              value={objpurchase.price}
              onChange={(e) =>
                setObjpurchase({ ...objpurchase, price: Number(e.target.value) })
              }
            />
          </div>

          <div className="col-md-2">
            <label>{t("Tax")}</label>
            <input
              type="number"
              className="mt-2 form-control"
              value={objpurchase.tax}
              disabled
            />
          </div>

          <div className="col-md-2">
            <label>{t("Amount")}</label>
            <input
              type="number"
              className="mt-2 form-control"
              value={objpurchase.amount}
              disabled
            />
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-2 border border-black me-3">
            <strong>{t("Total Amount")}:</strong> {totalAmount} <br />
            <strong>{t("Tax Amount")}:</strong> {taxAmount} <br />
            <strong>{t("Net Amount")}:</strong> {netAmount}
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-3">
            <button className="btn btn-success" onClick={Update}>
              {t("Update")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Updatepurchases;
