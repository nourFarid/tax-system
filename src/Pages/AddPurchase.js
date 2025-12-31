import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import axiosInstance from "../Axios/AxiosInstance";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import { useSwal } from "../Hooks/Alert/Swal";

const AddPurchase = () => {
  const { t } = useTranslate();
  const strDocDir = document.documentElement.dir;
  const navigate = useNavigate();
  const { showSuccess, showError, showDeleteConfirmation, SwalComponent } = useSwal();

  const breadcrumbItems = [
    { label: t("purchase"), link: "/purchase", active: false },
    { label: t("Add"), link: "", active: true },
  ];

  // ==========================
  // STATE
  // ==========================
  const [objSupplier, setObjSupplier] = useState(null);
  const [objDocType, setObjDocType] = useState(null);
  const [objStatmentType, setObjStatmentType] = useState(null);
  const [objItemType, setObjItemType] = useState(null);
  const [objItem, setObjItem] = useState(null);
  const [arrSettlementStatment, SetArrSettlementStatment] = useState([]);
  const [arrDocumentTypeStatment, SetArrDocumentTypeStatment] = useState([]);


  const [objPurchase, setObjPurchase] = useState({
    documentTypeId: -1,
    invoiceNumber: "",
    invoiceDate: "",
    itemId: -1,
    statementTypeId: -1,
    itemTypeId: -1,
    supplierId: -1,
    price: 0,
    amount: 1,
    tax: 14,
    item: {
      price: 0
    }
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
      /* let arr = [
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
      return arr; */
      return [];
    }

    let arr = res.data.data.map(x => ({
      label: "[" + x.code + "] " + x.name,
      value: x.id,
      objItem: x
    }));
    return arr;
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
  // RESET
  // ==========================
  const resetSale = () => {
    setObjPurchase({
      documentTypeId: -1,
      invoiceNumber: "",
      invoiceDate: "",
      itemId: -1,
      statementTypeId: -1,
      itemTypeId: -1,
      supplierId: -1,
      price: 0,
      amount: 1,
      tax: 14,
      item: {
        price: 0
      }
    });

    setObjItem(null);
    setObjSupplier(null);
  };

  // ==========================
  // ADD SALE (POST)
  // ==========================
  const Add = async () => {
    const response = await axiosInstance.post("/Purchase/Add", objPurchase);
    if (response.data.result) {
      showSuccess(
        t("Success"),
        t("Purchase added successfully"),
        {
          onConfirm: () => {
            resetSale();
            navigate("/Purchase");
          },
        }
      );
    }

  };

  const SetStatmentType = (documentTypeId) => {
    if (documentTypeId == 2 || documentTypeId == 3) {
      setObjStatmentType(arrSettlementStatment);
    } else {
      setObjStatmentType(arrDocumentTypeStatment);
    }
    setObjPurchase(prev => ({
      ...prev,
      statementTypeId: -1
    }));
  };

  const fetchDocType = async () => {
    const response = await axiosInstance.post("/DocumentType/ListAll", {});
    if (!response.data.result) alert(response.data.message);
    setObjDocType(response.data.data);
  };

  const fetchStatmentType = async () => {
    const response = await axiosInstance.post("/StatementType/ListAll", {});
    if (!response.data.result) alert(response.data.message);
    let arr1 = [], arr2 = [];
    for (let i = 0; i < response.data.data.length; i++) {
      if (response.data.data[i].code == 5) {
        arr1.push(response.data.data[i]);
      } else{
        arr2.push(response.data.data[i]);
      }
    }
    SetArrSettlementStatment(arr1);
    SetArrDocumentTypeStatment(arr2);
    setObjStatmentType(response.data.data);
  };

  const fetchItemType = async () => {
    const response = await axiosInstance.get("/ItemType/ListAll");
    if (!response.data.result) alert(response.data.message);
    setObjItemType(response.data.data);
  };

  // ==========================
  // CALCULATIONS
  // ==========================
  const totalAmount = objPurchase.price * objPurchase.amount;
  const taxAmount = (totalAmount * objPurchase.tax) / 100;
  const netAmount = totalAmount + taxAmount;

  useEffect(() => {
    if (objPurchase.itemId === -1) {
      setObjPurchase(prev => ({
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
  }, [objPurchase.price, objPurchase.amount]);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="border rounded p-3 mb-2 bg-white shadow-lg">
        <div className="row p-4">
          <div className="col-md-4">
            <h1><strong className="text-primary">{t("Purchase")}</strong></h1>
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-6">
            <label className="mb-2">{t("Supplier")}</label>
            <AsyncSelect cacheOptions defaultOptions={false} loadOptions={arrSupplier} value={objSupplier} onChange={(option) => {setObjSupplier(option); setObjPurchase({ ...objPurchase, supplierId: option.value });}} />
          </div>
          <div className="col-md-6">
            <label>{t("Document Type")}</label>
            <select className="mt-2 form-control" value={objPurchase.documentTypeId} onChange={(e) => {setObjPurchase({...objPurchase,documentTypeId: Number(e.target.value),});SetStatmentType(e.target.value);}} >
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
              value={objPurchase.itemTypeId}
              onChange={(e) =>
                setObjPurchase({
                  ...objPurchase,
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
              value={objPurchase.statementTypeId}
              onChange={(e) =>
                setObjPurchase({
                  ...objPurchase,
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
              value={objPurchase.invoiceNumber}
              onChange={(e) =>
                setObjPurchase({ ...objPurchase, invoiceNumber: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <label>{t("Invoice Date")}</label>
            <input
              type="date"
              className="mt-2 form-control"
              value={objPurchase.invoiceDate}
              onChange={(e) =>
                setObjPurchase({ ...objPurchase, invoiceDate: e.target.value })
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
                setObjPurchase(prev => ({ ...prev, item: option.objItem }));
                setObjPurchase(prev => ({ ...prev, itemId: option.value }));
                setObjPurchase(prev => ({ ...prev, price: option.objItem?.price || 0 }));
              }}
            />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Price")}</label>
            <input type="number" className="mt-2 form-control" placeholder="0.0" value={objPurchase.item?.price} onChange={(e) => { setObjPurchase(prev => ({ ...prev, price: Number(e.target.value), item: { ...prev.item, price: Number(e.target.value) } })) }} />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Tax")}</label>
            <input type="number" className="mt-2 form-control" value={objPurchase.tax} onChange={(e) => setObjPurchase(prev => ({ ...prev, tax: Number(e.target.value) }))} />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Amount")}</label>
            <input type="number" className="mt-2 form-control" placeholder="1" value={objPurchase.amount} onChange={(e) => setObjPurchase(prev => ({ ...prev, amount: Number(e.target.value), price: Number(e.target.value * objPurchase.item?.price) }))} />
          </div>
        </div>

        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-2 pull-left border border-black me-3" dir={strDocDir}>
            <strong>{t("Total Amount")} : </strong><span>{objPurchase.price ?? "0.0"}</span><br />
            <strong>{t("Tax Percent")} : </strong><span>{objPurchase.tax ?? "0"} %</span><br />
            <strong>{t("Tax Amount")} : </strong><span>{((objPurchase.price * objPurchase.tax) / 100) ?? "0.0"}</span><br />
          </div>
        </div>

        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-3 me-2">
            <button type="button" className="btn btn-success" onClick={Add}>{t("Add")}</button>
          </div>
        </div>
      </div>
      <SwalComponent />

    </>
  );
};

export default AddPurchase;
