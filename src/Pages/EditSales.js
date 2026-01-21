import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import axiosInstance from "../Axios/AxiosInstance";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import { useSwal } from "../Hooks/Alert/Swal";

const emptyRow = {
  itemId: -1,
  documentId:-1,
  unitPrice: 0,
  amount: 1,
  statementTypeId: -1,
  itemTypeId: -1,
  documentTypeId: -1,
  tax: 14,
};

const EditSale = () => {
  const { t } = useTranslate();
  const strDocDir = document.documentElement.dir;
  const navigate = useNavigate();
  const { showSuccess, SwalComponent } = useSwal();
  const LOAD_OPTION_DOCUMENT_ITEMS = 1;

  const breadcrumbItems = [
    { label: t("sale"), link: "/Sales", active: false },
    { label: t("Edit"), link: "", active: true },
  ];

  // ===================== STATE =====================
  const [objCustomer, setObjCustomer] = useState(null);
  const [objDocType, setObjDocType] = useState([]);
  const [objStatmentType, setObjStatmentType] = useState([]);
  const [arrSettlementStatment, setArrSettlementStatment] = useState([]);
  const [arrDocumentTypeStatment, setArrDocumentTypeStatment] = useState([]);
  const [objItemType, setObjItemType] = useState([]);

  const [objSale, setObjSale] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    issueDate: "",
    customerId: -1,
    totalPrice: 0,
    documentItems: [{ ...emptyRow }],
  });

  // ===================== HELPERS =====================
  const updateRow = (index, field, value) => {
    setObjSale(prev => {
      const rows = [...prev.documentItems];
      rows[index] = { ...rows[index], [field]: value };
      return { ...prev, documentItems: rows };
    });
  };

  const addRow = () => {
    emptyRow.documentId = objSale.docId;
    setObjSale(prev => ({
      ...prev,
      documentItems: [...prev.documentItems, { ...emptyRow }],
    }));
  };

  const removeRow = (index) => {
    setObjSale(prev => ({
      ...prev,
      documentItems: prev.documentItems.filter((_, i) => i !== index),
    }));
  };

  // ===================== TOTALS =====================
  const totalAmount = objSale.documentItems.reduce(
    (sum, r) => sum + r.unitPrice * r.amount,
    0
  );

  const totalTax = objSale.documentItems.reduce(
    (sum, r) => sum + (r.unitPrice * r.amount * r.tax) / 100,
    0
  );

  const netAmount = totalAmount + totalTax;

  useEffect(() => {
    setObjSale(prev => ({ ...prev, totalPrice: netAmount }));
  }, [netAmount]);

  // ===================== API =====================
  const arrItem = async (input) => {
    if (input.length < 2) return [];
    const res = await axiosInstance.post("Item/ListAll", { NameCode: input });
    return res.data.data.map(x => ({
      label: `[${x.code}] ${x.name}`,
      value: x.id,
      objItem: x,
    }));
  };

  const arrCustomer = async (input) => {
    if (input.length < 2) return [];
    const res = await axiosInstance.post("/CustomerSupplier/ListAll", {
      NameIdentity: input,
      IsSupplier: false,
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

  const loadSale = async () => {
    const body = {
        filter: {id: window.location.pathname.split("/").pop() },
        pageNumber: 1,
        pageSize: 1,
        sortBy: "invoiceDate",
        isDescending: true,
        loadOption: [LOAD_OPTION_DOCUMENT_ITEMS],
      };

      const res = await axiosInstance.post("Sales/List", body);
      const sale = res.data.data.items[0];

      setObjSale(sale);
      setObjSale(prev => ({
        ...prev,
        documentItems: sale.documentItem.map(di => ({
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
    const response = await axiosInstance.put("/Sales/Update", objSale);
    if (response.data.result) {
      showSuccess(t("Success"), t("Sale Edited successfully"), {
        onConfirm: () => navigate("/Sales"),
      });
    }
  };

  const AddDocItem = async (obj) => {
    console.log(obj);
    const response = await axiosInstance.post("/Sales/AddDocumentItem", obj);
    if (response.data.result) {
      showSuccess(t("Success"), t("Sale item added successfully"));
    }
  };

  const EditDocItem = async (obj) => {
    console.log(obj);
    const response = await axiosInstance.put("/Sales/UpdateDocumentItem", obj);
    if (response.data.result) {
      showSuccess(t("Success"), t("Sale item edited successfully"));
    }
  };
  // ===================== EFFECT =====================
  useEffect(() => {
    fetchDocType();
    fetchStatmentType();
    fetchItemType();
    loadSale();
  }, []);

  // ===================== RENDER =====================
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      {/* ================= HEADER ================= */}
      <div className="border rounded p-3 bg-white shadow-lg">
        <div className="row p-4">
          <h1 className="text-primary">
            <strong>{t("Sale")}</strong>
          </h1>
        </div>

        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Customer")}</label>
            <AsyncSelect
              loadOptions={arrCustomer}
              value={objCustomer}
              onChange={(o) => {
                setObjCustomer(o);
                setObjSale(prev => ({ ...prev, customerId: o.value }));
              }}
            />
          </div>

          <div className="col-md-6">
            <label>{t("Invoice Date")}</label>
            <input
              type="date"
              className="form-control"
              value={objSale.invoiceDate}
              onChange={e =>
                setObjSale(prev => ({ ...prev, invoiceDate: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-6">
            <label>{t("Invoice Number")}</label>
            <input
              className="form-control"
              value={objSale.invoiceNumber}
              onChange={e =>
                setObjSale(prev => ({ ...prev, invoiceNumber: e.target.value }))
              }
            />
          </div>

          <div className="col-md-6">
            <label>{t("Issue Date")}</label>
            <input
              type="date"
              className="form-control"
              value={objSale.issueDate}
              onChange={e =>
                setObjSale(prev => ({ ...prev, issueDate: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="col-md-3 text-end mt-3">
          <button className="btn btn-primary btn-lg" onClick={Edit}>
            {t("Save")}
          </button>
        </div>
      </div>

      {/* ================= ITEMS PANELS ================= */}
      <div className="border rounded p-3 bg-white shadow-lg mt-4 p-4">
        {objSale.documentItems.map((r, index) => (
          <div key={index} className="mt-4">
            <div className="row g-2 align-items-end">

              <div className="col-md-4">
                <label>{t("Item")}</label>
                <AsyncSelect
                  loadOptions={arrItem}
                  onChange={(o) => {
                    updateRow(index, "itemId", o.value);
                    updateRow(index, "unitPrice", o.objItem?.unitPrice || 0);
                  }}
                />
              </div>

              <div className="col-md-1">
                <label>{t("Price")}</label>
                <input
                  type="number"
                  className="form-control"
                  value={r.unitPrice}
                  onChange={e => updateRow(index, "unitPrice", +e.target.value)}
                />
              </div>

              <div className="col-md-1">
                <label>{t("Amount")}</label>
                <input
                  type="number"
                  className="form-control"
                  value={r.amount}
                  onChange={e => updateRow(index, "amount", +e.target.value)}
                />
              </div>

              <div className="col-md-1">
                <label>{t("Tax")}</label>
                <input
                  type="number"
                  className="form-control"
                  value={r.tax}
                  onChange={e => updateRow(index, "tax", +e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label>{t("Document Type")}</label>
                <select
                  className="form-control"
                  value={r.documentTypeId}
                  onChange={e => {
                    updateRow(index, "documentTypeId", +e.target.value);
                    SetStatmentType(+e.target.value);
                  }}
                >
                  <option value={-1}>{t("Document Type")}</option>
                  {objDocType.map(x => (
                    <option key={x.id} value={x.id}>{x.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label>{t("Statement Type")}</label>
                <select
                  className="form-control"
                  value={r.statementTypeId}
                  onChange={e =>
                    updateRow(index, "statementTypeId", +e.target.value)
                  }
                >
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

            <div className="col-md-1 text-end">
              {objSale.documentItems.length > 1 && (
                <button className="btn btn-danger" onClick={() => removeRow(index)}>
                  ✕
                </button>
              )}
            </div>
            <div className="col-md-3 text-end">
              {r.id ?
              <button className="btn btn-primary btn-lg" onClick={() => EditDocItem(r)}>
                {t("Save")}
              </button> :
              <button className="btn btn-primary btn-lg" onClick={() => AddDocItem(r)}>
                {t("Save")}
              </button>
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
        <div
          className="border rounded p-4 mt-5"
          style={{ background: "#f8f9fa" }}
          dir={strDocDir}
        >
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
      </div>

      <SwalComponent />
    </>
  );
};

export default EditSale;
