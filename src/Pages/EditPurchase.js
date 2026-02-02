import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import axiosInstance from "../Axios/AxiosInstance";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import { useSwal } from "../Hooks/Alert/Swal";
import { useParams } from 'react-router-dom';

const emptyRow = {
  itemId: -1,
  documentId: -1,
  unitPrice: 0,
  amount: 1,
  statementTypeId: -1,
  itemTypeId: -1,
  documentTypeId: -1,
  tax: 14,
};

const EditPurchase = () => {
  const { id } = useParams();
  const { docItemId } = useParams();
  const { t } = useTranslate();
  const strDocDir = document.documentElement.dir;
  const navigate = useNavigate();
  const { showSuccess, SwalComponent } = useSwal();
  const LOAD_OPTION_DOCUMENT_ITEMS = 1;

  const breadcrumbItems = [
    { label: t("purchase"), link: "/Purchases", active: false },
    { label: t("Edit"), link: "", active: true },
  ];

  // ===================== STATE =====================
  const [objSupplier, setObjSupplier] = useState(null);
  const [objDocType, setObjDocType] = useState([]);
  const [objStatmentType, setObjStatmentType] = useState([]);
  const [arrSettlementStatment, setArrSettlementStatment] = useState([]);
  const [arrDocumentTypeStatment, setArrDocumentTypeStatment] = useState([]);
  const [objItemType, setObjItemType] = useState([]);
  const [arrTransactionNature, setArrTransactionNature] = useState([]);
  const [boolIsChanged, setBoolIsChanged] = useState(false);

  const [objPurchase, setObjPurchase] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    issueDate: "",
    supplierId: -1,
    totalPrice: 0,
    documentItems: [{ ...emptyRow }],
  });

  // ===================== HELPERS =====================
  const updateRow = (index, field, value) => {
    setObjPurchase(prev => {
      const rows = [...prev.documentItems];
      rows[index] = { ...rows[index], [field]: value };
      return { ...prev, documentItems: rows };
    });
  };

  const addRow = () => {
    emptyRow.documentId = objPurchase.docId;
    setObjPurchase(prev => ({
      ...prev,
      documentItems: [...prev.documentItems, { ...emptyRow }],
    }));
  };

  const removeRow = (index) => {
    setObjPurchase(prev => ({
      ...prev,
      documentItems: prev.documentItems.filter((_, i) => i !== index),
    }));
  };

  // ===================== TOTALS =====================
  const totalAmount = objPurchase.documentItems.reduce(
    (sum, r) => sum + r.unitPrice * r.amount,
    0
  );

  const totalTax = objPurchase.documentItems.reduce(
    (sum, r) => sum + (r.unitPrice * r.amount * r.tax) / 100,
    0
  );

  const netAmount = totalAmount + totalTax;

  useEffect(() => {
    setObjPurchase(prev => ({ ...prev, totalPrice: netAmount }));
  }, [netAmount]);

  // ===================== API =====================
  const listTransactionNature = async () => {
    const res = await axiosInstance.post("TransactionNature/ListAll",{});
    if (res.data.result) {
      setArrTransactionNature(res.data.data);
    }
  };
  const arrItem = async (input) => {
    if (input.length < 2) return [];
    const res = await axiosInstance.post("Item/ListAll", { NameCode: input });
    return res.data.data.map(x => ({
      label: `[${x.code}] ${x.name}`,
      value: x.id,
      objItem: x,
    }));
  };

  const arrSupplier = async (input) => {
    if (input.length < 2) return [];
    const res = await axiosInstance.post("/CustomerSupplier/ListAll", {
      NameIdentity: input,
      IsSupplier: true,
    });
    return res.data.data.map(x => ({
      label: `[${x.taxRegistrationNumber ?? "-"}] ${x.name}`,
      value: x.id,
    }));
  };

  const fetchDocType = async () => {
    const res = await axiosInstance.post("/DocumentType/ListAll", {});
    setObjDocType(res.data.data);
  };

  const fetchItemType = async () => {
    const res = await axiosInstance.get("/ItemType/ListAll");
    setObjItemType(res.data.data);
  };

  const fetchStatmentType = async () => {
    const res = await axiosInstance.post("/StatementType/ListAll", {});
    const arr1 = [], arr2 = [];
    res.data.data.forEach(x => {
      x.code === 5 ? arr1.push(x) : arr2.push(x);
    });
    setArrSettlementStatment(arr1);
    setArrDocumentTypeStatment(arr2);
    setObjStatmentType(res.data.data);
  };

  const loadPurchase = async () => {
    console.log("==========================================");
    console.log(docItemId);
    console.log("");
    const body = {
      filter: { id },
      pageNumber: 1,
      pageSize: 1,
      sortBy: "invoiceDate",
      isDescending: true,
      loadOption: [LOAD_OPTION_DOCUMENT_ITEMS],
    };

    const res = await axiosInstance.post("Purchase/List", body);
    const purchase = res.data.data.items[0];

    setObjPurchase(purchase);
    setObjPurchase(prev => ({
      ...prev,
      supplierId: purchase.customerSupplierId,
    }));
    setObjPurchase(prev => ({
      ...prev,
      documentItems: purchase.documentItem.map(di => ({
        ...di,
        id: di.id,
        itemId: di.itemId,
        totalPrice: di.totalPrice,
        amount: di.amount,
        unitPrice: di.unitPrice,
        statementTypeId: di.statementTypeId,
        itemTypeId: di.itemTypeId,
        documentTypeId: di.documentTypeId,
        tax: di.tax,
      })),
    }));
  };

  const SetStatmentType = (docTypeId) => {
    setObjStatmentType(
      docTypeId === 2 || docTypeId === 3
        ? arrSettlementStatment
        : arrDocumentTypeStatment
    );
  };

  const GetStatmentType = (docTypeId) => {
    return docTypeId === 2 || docTypeId === 3
      ? arrSettlementStatment
      : arrDocumentTypeStatment;
  };

  // ===================== SUBMIT =====================
  const Edit = async () => {
    const response = await axiosInstance.put("/Purchase/Update", objPurchase);
    if (response.data.result) {
      showSuccess(t("Success"), t("Purchase Edited successfully"));
    }
  };

  const AddDocItem = async (obj) => {
    const response = await axiosInstance.post("/Purchase/AddDocumentItem", obj);
    if (response.data.result) {
      showSuccess(t("Success"), t("Purchase item added successfully"));
    } else {
      alert("Error adding item");
    }
  };

  const EditDocItem = async (obj) => {
    obj.isPrePaid = objPurchase.isPrePaid;
    const response = await axiosInstance.put("/Purchase/UpdateDocumentItem", obj);
    if (response.data.result) {
      showSuccess(t("Success"), t("Purchase item edited successfully"));
    } else {
      alert("Error adding item");
    }
  };

  const Delete = async (index) => {
    const obj = objPurchase.documentItems[index];
    const response = await axiosInstance.delete(`/Purchase/DeleteDocumentItem/${obj.id}`);
    if (response.data.result) {
      showSuccess(t("Success"), t("Purchase item deleted successfully"));
      removeRow(index);
    } else {
      alert("Error deleting item");
    }
  }

  // ===================== EFFECT =====================
  useEffect(() => {
    fetchDocType();
    fetchStatmentType();
    fetchItemType();
    loadPurchase();
    listTransactionNature();
  }, []);

  // ===================== RENDER =====================
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      {/* ================= HEADER ================= */}
      <div className="border rounded p-3 bg-white shadow-lg">
        <div className="row p-4">
          <h1 className="text-primary">
            <strong>{t("Purchase")}</strong>
          </h1>
        </div>

        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Supplier")}</label>
            <label className="form-control">[{objPurchase.customerSupplierTaxRegistrationNumber ?? objPurchase.customerSupplierIdentificationNumber}] {objPurchase.customerSupplierName}</label>
          </div>

          <div className="col-md-6">
            <label>{t("Settlement Date")}</label>
            <input
              type="date"
              className="form-control"
              value={objPurchase.invoiceDate}
              onChange={e =>
                setObjPurchase(prev => ({ ...prev, invoiceDate: e.target.value }))
              }
              disabled={docItemId != undefined || docItemId != null}
            />
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Invoice Number")}</label>
            <input className="form-control" value={objPurchase.invoiceNumber} onChange={e => setObjPurchase(prev => ({ ...prev, invoiceNumber: e.target.value })) } disabled={docItemId != undefined || docItemId != null} />
          </div>

          <div className="col-md-6">
            <label>{t("Issue Date")}</label>
            <input type="date" className="form-control" value={objPurchase.issueDate} onChange={e => setObjPurchase(prev => ({ ...prev, issueDate: e.target.value })) } disabled={docItemId != undefined || docItemId != null} />
          </div>
        </div>
         <div className="row p-4">
            <div className="col-md-6">
              <label className="mb-2 d-block">
                {t("Prepaid payments")}
              </label>

              <select id="isPrePaid" className="form-control" value={String(objPurchase.isPrePaid)} onChange={(e) => {setObjPurchase(prev => ({ ...prev, isPrePaid: e.target.value === "true" })); setBoolIsChanged(true); }} disabled={docItemId != undefined || docItemId != null}>
                <option value={null}>{t("choose Prepaid payments option")}</option>
                <option value="true">{t("Prepaid payments")}</option>
                <option value="false">{t("Not Prepaid payments")}</option>
              </select>
            </div>
          </div>


        {!boolIsChanged ? <div className="col-md-3 text-end mt-3">
          <button className="btn btn-primary btn-lg" onClick={Edit}>
            {t("Save")}
          </button>
        </div> : null}
      </div>

      {/* ================= ITEMS PANELS ================= */}
      <div className="border rounded p-3 bg-white shadow-lg mt-4 p-4">
        {objPurchase.documentItems.map((r, index) => (
          <div key={index} className="mt-4">
            <div className="row g-2 align-items-end border rounded p-3">
              <div className="col-md-4">
                <label>{t("Item")}</label>
                {r.id > 0 ? <label className="form-control">[{r.item.code}] {r.item.name}</label> :
                <AsyncSelect loadOptions={arrItem} onChange={(o) => {
                    updateRow(index, "itemId", o.value);
                    updateRow(index, "unitPrice", o.objItem?.unitPrice || 0);
                  }} />}
              </div>

              <div className="col-md-1">
                <label>{t("Price")}</label>
                <input type="number" className="form-control" value={r.unitPrice} onChange={e => updateRow(index, "unitPrice", +e.target.value)} disabled={(docItemId != undefined || docItemId != null) && r.id != docItemId} />
              </div>

              <div className="col-md-1">
                <label>{t("Amount")}</label>
                <input type="number" className="form-control" value={r.amount} onChange={e => updateRow(index, "amount", +e.target.value)} disabled={(docItemId != undefined || docItemId != null) && r.id != docItemId} />
              </div>

              <div className="col-md-1">
                <label>{t("Tax")}</label>
                <input type="number" className="form-control" value={r.tax} onChange={e => updateRow(index, "tax", +e.target.value)} disabled={(docItemId != undefined || docItemId != null) && r.id != docItemId} />
              </div>

              <div className="col-md-2">
                <label>{t("Document Type")}</label>
                <select className="form-control" value={r.documentTypeId} onChange={e => { updateRow(index, "documentTypeId", +e.target.value); SetStatmentType(+e.target.value); }} disabled={(docItemId != undefined || docItemId != null) && r.id != docItemId}>
                  <option value={-1}>{t("Document Type")}</option>
                  {objDocType.map(x => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-1">
                <label>{t("Statement Type")}</label>
                <select className="form-control" value={r.statementTypeId} onChange={e => updateRow(index, "statementTypeId", +e.target.value) } disabled={(docItemId != undefined || docItemId != null) && r.id != docItemId}>
                  <option value={-1}>{t("Statement Type")}</option>
                  {GetStatmentType(r.documentTypeId).map(x => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label>{t("Item Type")}</label>
                <select className="form-control" value={r.itemTypeId} onChange={(e) => updateRow(index, "itemTypeId", Number(e.target.value)) } disabled={(docItemId != undefined || docItemId != null) && r.id != docItemId}>
                  <option value={-1}>{t("Item Type")}</option>
                  {objItemType.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-1 form-group">
                <label>{t("Transaction Nature")}</label>
                <select className="mt-2 form-control" value={r.transactionNatureId} onChange={(e) => updateRow(index, "transactionNatureId", Number(e.target.value)) } disabled={(docItemId != undefined || docItemId != null) && r.id != docItemId}>
                  <option value={-1}>{t("Transaction Nature")}</option>
                  {arrTransactionNature.map((nature) => (
                    <option key={nature.id} value={nature.id}>
                      {nature.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-1 text-end">
                {r.id && !boolIsChanged ?
                  <button className="btn btn-danger" onClick={() => Delete(index)}>
                    Delete
                  </button>
                  :
                  <button className="btn btn-danger" onClick={() => removeRow(index)}>
                    ✕
                  </button>}
              </div>

              <div className="col-md-3 text-end">
                {!boolIsChanged ? ( r.id ?
                  <button className="btn btn-primary" onClick={() => EditDocItem(r)}>
                    {t("Save")}
                  </button> :
                  <button className="btn btn-primary" onClick={() => AddDocItem(r)}>
                    {t("Save")}
                  </button>) : null
                }
              </div>

            </div>
          </div>
        ))}

        <div className="mt-4">
          <button className="btn btn-success me-2" onClick={addRow}>
            {t("Add Item")}
          </button>
        </div>

        {/* ================= FINAL SUMMARY ================= */}
        <div className="border rounded p-4 mt-5" style={{ background: "#f8f9fa" }} dir={strDocDir}>
          <div className="row align-items-end">

            <div className="col-md-3">
              <strong>{t("Total Amount")}</strong>
              <div className="fs-5 text-primary">
                {totalAmount.toFixed(2)}
              </div>
            </div>

            <div className="col-md-3">
              <strong>{t("Total Tax")}</strong>
              <div className="fs-5 text-danger">
                {totalTax.toFixed(2)}
              </div>
            </div>

            <div className="col-md-3">
              <strong>{t("Net Amount")}</strong>
              <div className="fs-4 fw-bold text-success">
                {netAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      {boolIsChanged == true ?
        <div className="col-md-3 text-end mt-3">
          <button className="btn btn-primary btn-lg" onClick={Edit}>
            {t("Save")}
          </button>
        </div>
        :
        null
      }
    </div>

      <SwalComponent />
    </>
  );
};

export default EditPurchase;
