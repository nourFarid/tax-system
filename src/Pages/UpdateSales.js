import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import axiosInstance from "../Axios/AxiosInstance";
import AsyncSelect from "react-select/async";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import  { useSwal }  from "../Hooks/Alert/Swal";

const UpdateSales = () => {
    const navigate = useNavigate();

  const { t } = useTranslate();
  const { id } = useParams();
  const strDocDir = document.documentElement.dir;
  const { showSuccess, showError, showDeleteConfirmation, SwalComponent } = useSwal();

  const breadcrumbItems = [
    { label: t("Sales"), link: "/Sales", active: false },
    { label: t("Edit"), link: "", active: true },
  ];

  // ==========================
  // STATE
  // ==========================
  const [objCustomer, setObjCustomer] = useState(null);
  const [objDocType, setObjDocType] = useState([]);
  const [objStatmentType, setObjStatmentType] = useState([]);
  const [objItemType, setObjItemType] = useState([]);
  const [objItem, setObjItem] = useState(null);

  const [objSale, setObjSale] = useState({
    id: 0,
    docId: 0,
    documentTypeId: -1,
    invoiceNumber: "",
    invoiceDate: "",
    itemId: -1,
    statementTypeId: -1,
    itemTypeId: -1,
    supplierId: -1, // purchase
    customerId: -1, // sales
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

  const fetchSale = async () => {
    const response = await axiosInstance.get("/Sales/" + id);
    if (!response.data.result) return alert(response.data.message);

    const sale = response.data.data;

    setObjSale({
      id: sale.id,
      docId: sale.docId,
      documentTypeId: sale.documentType?.id ?? -1,
      invoiceNumber: sale.invoiceNumber ?? "",
      invoiceDate: sale.invoiceDate ?? "",
      itemId: sale.item?.id ?? -1,
      statementTypeId: sale.statementType?.id ?? -1,
      itemTypeId: sale.itemType?.id ?? -1,
      supplierId: sale.customerSupplierId ?? -1,
      customerId: sale.customerId ?? -1,
      price: sale.item?.price ?? 0,
      amount: sale.amount ?? 1,
      tax: sale.tax ?? 14,
    });

    if (sale.customerSupplierId) {
      setObjCustomer({
        label: `[${sale.customerSupplierTaxRegistrationNumber ?? "-"}] ${sale.customerSupplierName}`,
        value: sale.customerSupplierId,
        objCustomer: {
          id: sale.customerSupplierId,
          name: sale.customerSupplierName,
          taxRegistrationNumber: sale.customerSupplierTaxRegistrationNumber,
          nationalId: sale.customerSupplierNationalId,
          passportNumber: sale.customerSupplierPassportNumber,
          address: sale.customerSupplierAddress,
        },
      });
    }

    if (sale.item) {
      setObjItem({
        label: `[${sale.item.code}] ${sale.item.name}`,
        value: sale.item.id,
        objItem: sale.item,
      });
    }
  };

  useEffect(() => {
    fetchDocType();
    fetchStatmentType();
    fetchItemType();
    fetchSale();
  }, []);

  // ==========================
  // UPDATE FUNCTION
  // ==========================
const Update = async () => {
  try {
    const body = {
      id: objSale.id,
      docId: objSale.docId,
      documentTypeId: objSale.documentTypeId,
      invoiceNumber: objSale.invoiceNumber,
      invoiceDate: objSale.invoiceDate,
      itemId: objSale.itemId,
      statementTypeId: objSale.statementTypeId,
      itemTypeId: objSale.itemTypeId,
      supplierId: objSale.supplierId,
      customerId: objSale.customerId,
      price: objSale.price,
      amount: objSale.amount,
      tax: objSale.tax,
    };

    const response = await axiosInstance.put("/Sales/Update", body);

   if (response.data.result) {
  showSuccess(
    t("Success"),
    t("Sale updated successfully"),
    {
      onConfirm: () => {
        navigate("/Sales");
      }
    }
  );
} else {
  showError(t("Error"), response.data.message || t("Update failed"));
}

  } catch (err) {
    console.error(err);
    showError(t("Failed to update sale"));
  }
};


  // ==========================
  // CALCULATIONS
  // ==========================
  const totalAmount = objSale.price * objSale.amount;
  const taxAmount = (totalAmount * objSale.tax) / 100;
  const netAmount = totalAmount + taxAmount;

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      {/* Sale Details */}
      <div className="border rounded p-3 mb-2 bg-white shadow-lg">
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
                setObjSale((prev) => ({ ...prev, supplierId: option.value }));
              }}
            />
          </div>

          <div className="col-md-6">
            <label>{t("Document Type")}</label>
            <select
              className="mt-2 form-control"
              value={objSale.documentTypeId}
              onChange={(e) =>
                setObjSale({ ...objSale, documentTypeId: Number(e.target.value) })
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
              value={objSale.itemTypeId}
              onChange={(e) =>
                setObjSale({ ...objSale, itemTypeId: Number(e.target.value) })
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
              value={objSale.statementTypeId}
              onChange={(e) =>
                setObjSale({ ...objSale, statementTypeId: Number(e.target.value) })
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
                setObjSale((prev) => ({
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
              value={objSale.price}
              onChange={(e) =>
                setObjSale({ ...objSale, price: Number(e.target.value) })
              }
            />
          </div>

          <div className="col-md-2">
            <label>{t("Tax")}</label>
            <input
              type="number"
              className="mt-2 form-control"
              value={objSale.tax}
              disabled
            />
          </div>

          <div className="col-md-2">
            <label>{t("Amount")}</label>
            <input
              type="number"
              className="mt-2 form-control"
              value={objSale.amount}
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
          <SwalComponent/>

    </>
  );
};

export default UpdateSales;
