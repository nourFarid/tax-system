import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import AsyncSelect from "react-select/async";
import axiosInstance from "../Axios/AxiosInstance";

const AddDocument41 = () => {
  const { t } = useTranslate();
  
  const objTitle = useMemo(
    () => ({
      AddDocumentType: t("Add Document Type"),
      EditDocumentType: t("Edit Document Type"),
      Name: t("Name"),
      Code: t("Code"),
      Save: t("Save"),
      Cancel: t("Cancel"),
      Delete: t("Delete"),
      DeleteConfirmation: t("Are you sure to delete"),
      QuestionMark: t("?"),
      Filter: t("Filter"),
      Reset: t("Reset"),
    }),
    [t]
  );

  const [arrTransactionNature, setArrTransactionNature] = useState([]);
  const [strFiscalYear, setStrFiscalYear] = useState("");
  const [objSupplier, setObjSupplier] = useState(null);
  const [objItem, setObjItem] = useState(null);
  const [objDocument41, setObjDocument41] = useState({
    serialNumber: "",
    item: null,
    supplierId: null,
    transactionDate: "",
    fiscalYearId: -1,
    transactionNatureId: -1,
    amount: 1,
    taxPercent: 14,
    price: 0
  });
  const strDocDir = document.documentElement.dir;

  const arrSupplier = async (strInput) => {
    if (strInput.length < 2) {
      return [];
    }
    let objFilter = {
      NameCode: strInput
    };
    const res = await axiosInstance.post("Item/ListAll", objFilter);
    console.log(res);
    
      let arr = res.data.map(x => ({
        label: x.name,
        value: x.id,
        objItem: x
      }));
      return arr;
  };
  const arrItem = async (strInput) => {
    if (strInput.length < 2) {
      return [];
    }
    let objFilter = {
      NameCode: strInput
    };
    const res = await axiosInstance.post("Item/ListAll", objFilter);
    let arr = res.data.map(x => ({
      label: x.name,
      value: x.id,
      objItem: x
    }));
    return arr;
  };
  const breadcrumbItems = [
    { label: t("Document 41"), link: "/Document41", active: false },
    { label: t("Add"), link: "", active: true }
  ];

  const UpdateFiscalYear = (strDate) => {
    // featsh fiscal year based on date
    let date = new Date(strDate);
    let year = date.getFullYear();
    setObjDocument41(prev => ({...prev, fiscalYearId: year}));
    setStrFiscalYear(year.toString());
  }

  const Add = async () => {
    let response = await axiosInstance.post("Document41/Add", objDocument41)
    if (response.data.result) {
      alert(response.data.message);
    }
  }

  const listTransactionNature = async () => {
    const res = await axiosInstance.post("TransactionNature/ListAll",{});
    if (res.data.result) {
      setArrTransactionNature(res.data.data);
    }
  }

  useEffect(() => {
    // fetch data here if needed
    listTransactionNature();
  }, []);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className="border rounded p-3 mb-2 bg-white shadow-lg">
        <div className="row p-4">
          <div className="col-md-6 form-group">
            <h1><strong className="text-primary">{t("Document 41")}</strong></h1>
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-6 form-group">
            <label className="mb-2">{t("Supplier")}</label>
            <AsyncSelect
              cacheOptions
              defaultOptions={false}
              loadOptions={arrSupplier}
              value={objSupplier}
              onChange={(option) => {
                  setObjSupplier(option);
                  setObjDocument41(prev => ({ ...prev, supplierId: option.value }));
                }
              }
            />
          </div>
          <div className="col-md-6 form-group">
            <label>{t("Transaction Date")}</label>
            <input type="date" className="mt-2 form-control" value={objDocument41.transactionDate} onChange={(e) => { setObjDocument41((prev) => ({...prev, transactionDate: e.target.value})); UpdateFiscalYear(e.target.value);}} />
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-6 form-group">
            <label>{t("Fiscal Year")}</label>
            <label className="mt-2 form-control">{strFiscalYear ?? t("Fiscal Year")}</label>
          </div>
          <div className="col-md-6 form-group">
            <label>{t("Transaction Nature")}</label>
            <select className="mt-2 form-control" value={objDocument41.transactionNatureId} onChange={(e) => setObjDocument41((prev) => ({...prev, transactionNatureId: Number(e.target.value)}))}>
              <option value="-1">{t("Transaction Nature")}</option>
              {arrTransactionNature.map((nature) => (
                <option key={nature.id} value={nature.id}>{nature.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="border rounded p-3 mb-2 bg-white shadow-lg mt-5">
        <div className="row p-4">
          <div className="col-md-6 form-group">
            <label className="mb-2">{t("Item")}</label>
            <AsyncSelect
              cacheOptions
              defaultOptions={false}
              loadOptions={arrItem}
              value={objItem}
              onChange={(option) => {
                setObjItem(option);
                setObjDocument41(prev => ({...prev, item: option.value}));
                setObjDocument41(prev => ({...prev, price: option.objItem?.price || 0}));
              }}
            />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Price")}</label>
            <input type="number" className="mt-2 form-control" placeholder="0.0" value={objDocument41.price} onChange={(e) => {setObjDocument41(prev => ({...prev, price: Number(e.target.value * objDocument41.amount)}))}} />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Tax")}</label>
            <input type="number" className="mt-2 form-control" value={objDocument41.taxPercent} onChange={(e) => setObjDocument41(prev => ({...prev, taxPercent: Number(e.target.value)}))} />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Amount")}</label>
            <input type="number" className="mt-2 form-control" placeholder="1" value={objDocument41.amount} onChange={(e) => setObjDocument41(prev => ({...prev, amount: Number(e.target.value)}))}disabled />
          </div>
        </div>

        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-2 pull-left border border-black me-3" dir={strDocDir}>
            <strong>{t("Total Amount")} : </strong><span>{objDocument41.price ?? "0.0"}</span><br />
            <strong>{t("Tax Percent")} : </strong><span>{objDocument41.taxPercent ?? "0"} %</span><br />
            <strong>{t("Tax Amount")} : </strong><span>{((objDocument41.price * objDocument41.taxPercent) / 100) ?? "0.0"}</span><br />
          </div>
        </div>

        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-3 me-2">
            <button type="button" className="btn btn-success" onClick={Add()}>{t("Add")}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDocument41;
