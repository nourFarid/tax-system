import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import axiosInstance from "../Axios/AxiosInstance";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import { useSwal } from "../Hooks/Alert/Swal";
import { toast, ToastContainer } from "react-toastify";

const emptyRow = {
  itemId: -1,
  unitPrice: 0,
  amount: 1,
  statementTypeId: -1,
  itemTypeId: -1,
  documentTypeId: -1,
  transactionNatureId: -1,
  tax: 14,
};

const AddPurchase = () => {
  const { t } = useTranslate();
  const strDocDir = document.documentElement.dir;
  const navigate = useNavigate();
  const { showSuccess } = useSwal();

  const breadcrumbItems = [
    { label: t("purchase"), link: "/purchase", active: false },
    { label: t("Add"), link: "", active: true },
  ];

  // ===================== STATE =====================
  const [objSupplier, setObjSupplier] = useState(null);
  const [objDocType, setObjDocType] = useState([]);
  const [objStatmentType, setObjStatmentType] = useState([]);
  const [objItemType, setObjItemType] = useState([]);
  const [arrSettlementStatment, setArrSettlementStatment] = useState([]);
  const [arrDocumentTypeStatment, setArrDocumentTypeStatment] = useState([]);
  const [arrTransactionNature, setArrTransactionNature] = useState([]);

  const [objPurchase, setObjPurchase] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    issueDate: "",
    supplierId: -1,
    totalPrice: 0,
    isPrePaid: null,
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
    const res = await axiosInstance.post("TransactionNature/ListAll", {});
    if (res.data.result) {
      setArrTransactionNature(res.data.data);
    }
  }

  const arrItem = async (input) => {
    if (input.length < 2 || input.length > 50) return [];
    const res = await axiosInstance.post("Item/ListAll", { NameCode: input });
    return res.data.data.map(x => ({
      label: `[${x.code}] ${x.name}`,
      value: x.id,
      objItem: x,
    }));
  };

  const arrSupplier = async (input) => {
    if (input.length < 2 || input.length > 50) return [];
    const res = await axiosInstance.post("/CustomerSupplier/ListAll", {
      NameIdentity: input,
      IsSupplier: true,
    });
    return res.data.data.map(x => ({
      label: `[${x.taxRegistrationNumber ?? x.identificationNumber}] ${x.name}`,
      value: x.id,
    }));
  };

  const fetchDocType = async () => {
    const res = await axiosInstance.post("/DocumentType/ListAll", {});
    setObjDocType(res.data.data);
  };

  const fetchStatmentType = async () => {
    const res = await axiosInstance.post("/StatementType/ListAll", {});
    const arr1 = [], arr2 = [];
    res.data.data.forEach(x => {
      x.code == 5 ? arr1.push(x) : arr2.push(x);
    });
    setArrSettlementStatment(arr1);
    setArrDocumentTypeStatment(arr2);
    setObjStatmentType(res.data.data);
  };

  const fetchItemType = async () => {
    const res = await axiosInstance.get("/ItemType/ListAll");
    setObjItemType(res.data.data);
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
  const Add = async () => {
    const response = await axiosInstance.post("/Purchase/Add", objPurchase);
    if (response.data.result) {
      toast.success(t("Purchase added successfully"), {
        onConfirm: () => navigate("/Purchase"),
      });
    }
    else {
      toast.error(response.data.message);
    }
  };

  // ===================== EFFECT =====================
  useEffect(() => {
    fetchDocType();
    fetchStatmentType();
    fetchItemType();
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
            <AsyncSelect
              loadOptions={arrSupplier}
              value={objSupplier}
              placeholder={t("Type to search...")}
              noOptionsMessage={() => t("No options")}
              loadingMessage={() => t("Loading...")}
              onChange={(o) => {
                setObjSupplier(o);
                setObjPurchase(prev => ({ ...prev, supplierId: o.value }));
              }}
            />
          </div>

          <div className="col-md-6">
            <label>{t("Settlement Date")}</label>
            <input type="date" className="form-control" value={objPurchase.invoiceDate}
              onChange={e =>
                setObjPurchase(prev => ({ ...prev, invoiceDate: e.target.value }))
              } />
          </div>
        </div>
        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Invoice Number")}</label>
            <input type="text" className="form-control" value={objPurchase.invoiceNumber}
              onChange={e =>
                setObjPurchase(prev => ({ ...prev, invoiceNumber: e.target.value }))
              } placeholder={t("Invoice Number")} />
          </div>

          <div className="col-md-6">
            <label>{t("Issue Date")}</label>
            <input type="date" className="form-control" value={objPurchase.issueDate}
              onChange={e =>
                setObjPurchase(prev => ({ ...prev, issueDate: e.target.value }))
              } />
          </div>

          <div className="row p-4">
            <div className="col-md-6">
              <label className="mb-2 d-block">
                {t("Prepaid payments")}
              </label>

              <select
                id="isPrePaid"
                className="form-control"
                value={String(objPurchase.isPrePaid)}
                onChange={(e) =>
                  setObjPurchase(prev => ({
                    ...prev,
                    isPrePaid: e.target.value === "true"
                  }))
                }
              >
                <option value={null}>{t("choose Prepaid payments option")}</option>
                <option value="true">{t("Prepaid payments")}</option>
                <option value="false">{t("Not Prepaid payments")}</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* ================= ITEMS PANELS ================= */}
      <div className="border rounded p-3 bg-white shadow-lg mt-4 p-4">
        {objPurchase.documentItems.map((r, index) => (
          <div key={index} className="mt-4">
            <div className="row g-2 align-items-end border rounded p-3">

              <div className="col-md-4">
                <label>{t("Item")}</label>
                <AsyncSelect
                  loadOptions={arrItem}
                  placeholder={t("Type to search...")}
                  noOptionsMessage={() => t("No options")}
                  loadingMessage={() => t("Loading...")}
                  onChange={(o) => {
                    updateRow(index, "itemId", o.value);
                    updateRow(index, "unitPrice", o.objItem?.unitPrice || 0);
                  }}
                />
              </div>

              <div className="col-md-1">
                <label>{t("Price")}</label>
                <input type="number" className="form-control" value={r.unitPrice}
                  onChange={e => updateRow(index, "unitPrice", +e.target.value)} />
              </div>

              <div className="col-md-1">
                <label>{t("Amount")}</label>
                <input type="number" className="form-control" value={r.amount}
                  onChange={e => updateRow(index, "amount", +e.target.value)} />
              </div>

              <div className="col-md-1">
                <label>{t("Tax")}</label>
                <input type="number" className="form-control" value={r.tax}
                  onChange={e => updateRow(index, "tax", +e.target.value)} />
              </div>

              <div className="col-md-2">
                <label>{t("Document Type")}</label>
                <select className="form-control" value={r.documentTypeId}
                  onChange={e => {
                    updateRow(index, "documentTypeId", +e.target.value);
                    SetStatmentType(+e.target.value);
                  }}>
                  <option value={-1}>{t("Document Type")}</option>
                  {objDocType.map(x => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-1">
                <label>{t("Statement Type")}</label>
                <select className="form-control" value={r.statementTypeId}
                  onChange={e =>
                    updateRow(index, "statementTypeId", +e.target.value)
                  }>
                  <option value={-1}>{t("Statement Type")}</option>
                  {GetStatmentType(r.documentTypeId).map(x => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label>{t("Item Type")}</label>
                <select
                  className="form-control"
                  value={r.itemTypeId}
                  onChange={(e) =>
                    updateRow(index, "itemTypeId", Number(e.target.value))
                  }
                >
                  <option value={-1}>{t("Item Type")}</option>
                  {objItemType.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 form-group">
                <label>{t("Transaction Nature")}</label>
                <select className="mt-2 form-control" value={r.transactionNatureId}
                  onChange={(e) =>
                    updateRow(index, "transactionNatureId", Number(e.target.value))
                  }>
                  <option value={-1}>{t("Transaction Nature")}</option>
                  {arrTransactionNature.map((nature) => (
                    <option key={nature.id} value={nature.id}>
                      {nature.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-1 text-end">
                {objPurchase.documentItems.length > 1 && (
                  <button
                    className="btn btn-danger"
                    onClick={() => removeRow(index)}
                  >
                    ✕
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}

        {/* ================= ACTIONS ================= */}
        <div className="mt-4">
          <button className="btn btn-success me-2" onClick={addRow}>
            {t("Add Item")}
          </button>
        </div>

        {/* ================= FINAL SUMMARY (LAST) ================= */}
        <div className="border rounded p-4 mt-5" style={{ background: "#f8f9fa" }}
          dir={strDocDir}>
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

        <div className="col-md-3 text-end mt-3">
          <button className="btn btn-primary btn-lg" onClick={Add}>
            {t("Save")}
          </button>
        </div>
      </div>
      <ToastContainer />

    </>
  );
};

export default AddPurchase;
