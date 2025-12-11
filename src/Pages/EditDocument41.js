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
  const [strFiscalYear, setStrFiscalYear] = useState("Date Fiscal Year");
  const [objSupplier, setObjSupplier] = useState(null);
  const [objItem, setObjItem] = useState(null);
  const [objDocument41, setObjDocument41] = useState({
    serialNumber: "",
    supplierId: null,
    transactionDate: "",
    fiscalYearId: -1,
    quarterId: -1,
    transactionNatureId: -1,
    amount: 1,
    taxPercent: 14,
    price: 0
  });
  const strDocDir = document.documentElement.dir;

  const GetPercent = useMemo(() => {
    let nature = arrTransactionNature.find(n => n.id === objDocument41.transactionNatureId);
    return nature ? nature.ratePercent : 0;
  });

  const arrSupplier = async (strInput) => {
    if (strInput.length < 2) {
      return [];
    }
    let objFilter = {
      NameIdentity: strInput,
      IsSupplier: true
    };
    const res = await axiosInstance.post("CustomerSupplier/ListAll", objFilter);

    let arr = res.data.data.map(x => ({
      label: "[x.taxRegistrationNumber] x.name".replace("x.name", x.name).replace("x.taxRegistrationNumber", x.taxRegistrationNumber??"-"),
      value: x.id,
      objSupplier: x
    }));
    return arr;
  };

  const breadcrumbItems = [
    { label: t("Document 41"), link: "/Document41", active: false },
    { label: t("Add"), link: "", active: true }
  ];

  const UpdateFiscalYear = async (strDate) => {
    let objFilter = {
      InPeriodDate: strDate
    };
    const res = await axiosInstance.post("FiscalYear/ListAll", objFilter);

    if (!res.data.result) {
      alert(res.data.message);
      return;
    }
    setObjDocument41(prev => ({...prev, fiscalYearId: res.data.data[0].id || -1}));
    let date = new Date(strDate).setHours(0, 0, 0, 0);
    for (let i = 0; i < res.data.data[0].quarters.length; i++) {
      let quarter = res.data.data[0].quarters[i];
      let quarterStartDate = new Date(quarter.dateFrom).setHours(0, 0, 0, 0);
      let quarterEndDate = new Date(quarter.dateTo).setHours(0, 0, 0, 0);
      let lockDate = new Date(quarter.lockDate).setHours(0, 0, 0, 0);
      let currentDate = new Date().setHours(0, 0, 0, 0);
      let condition = date >= quarterStartDate && date <= quarterEndDate;
      if (condition) {
        setStrFiscalYear(res.data.data[0].yearFromDate + " - " + res.data.data[0].yearToDate + " / " + t("Quarter") + " " + quarter.dateFrom + " - " + quarter.dateTo );
        if (currentDate > lockDate) {
          alert(t("The quarter is locked. You cannot add transactions in this quarter."));
          return;
        }
        setObjDocument41(prev => ({...prev, quarterId: quarter.id || -1}));
        return;
      }
    }
  }

  const Update = async () => {
    let response = await axiosInstance.put("Document41/Update", objDocument41)
    if (response.data.result) {
      alert(response.data.message);
      reset();
      window.location.href = `/Document41`;
    }
  }

  const listTransactionNature = async () => {
    const res = await axiosInstance.post("TransactionNature/ListAll",{});
    if (res.data.result) {
      setArrTransactionNature(res.data.data);
    }
  }

  const reset = () => {
    setObjDocument41({
      serialNumber: "",
      supplierId: null,
      transactionDate: "",
      fiscalYearId: -1,
      quarterId: -1,
      transactionNatureId: -1,
      amount: 1,
      taxPercent: 14,
      price: 0
    });
    setObjSupplier(null);
    setObjItem(null);
    setStrFiscalYear("Date Fiscal Year");
  }

  const loadDocument41 = async () => {
    const res = await axiosInstance.post("Document41/List", {pageNumber: 1, pageSize: 1, filter: {id: (new URLSearchParams(window.location.search).get("id"))}});
    const result = res.data;
    if (!result.result) {
      alert(result.message);
      return;
    }
    setObjDocument41({
      id: result.data.data[0].id,
      item: result.data.data[0].item,
      itemId: result.data.data[0].itemId,
      supplierId: result.data.data[0].supplierId,
      transactionDate: result.data.data[0].transactionDate,
      fiscalYearId: result.data.data[0].fiscalYearId,
      quarterId: result.data.data[0].quarterId,
      transactionNatureId: result.data.data[0].transactionNatureId,
      amount: result.data.data[0].amount,
      taxPercent: result.data.data[0].taxPercent,
      price: result.data.data[0].price
    });
    setObjSupplier({
      label: "[x.taxRegistrationNumber] x.name".replace("x.name", result.data.data[0].supplier.name).replace("x.taxRegistrationNumber", result.data.data[0].supplier.taxRegistrationNumber??"-"),
      value: result.data.data[0].supplier.id,
      objSupplier: result.data.data[0].supplier
    });
    UpdateFiscalYear(result.data.data[0].transactionDate);
  };

  useEffect(() => {
    listTransactionNature();
    loadDocument41();
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
            <AsyncSelect cacheOptions defaultOptions={false} loadOptions={arrSupplier} value={objSupplier}
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
          <div className="col-md-4 form-group">
            <label>{t("Fiscal Year")}</label>
            <label className="mt-2 form-control">{strFiscalYear ?? t("Fiscal Year")}</label>
          </div>
          <div className="col-md-4 form-group">
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
          <div className="col-md-2 form-group">
            <label>{t("Price")}</label>
            <input type="number" className="mt-2 form-control" placeholder="0.0" value={objDocument41.price} onChange={(e) => {setObjDocument41(prev => ({...prev, price: Number(e.target.value)}))}} />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Tax")}</label>
            <input type="number" className="mt-2 form-control" value={GetPercent} disabled />
          </div>
        </div>

        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-2 pull-left border border-black me-3" dir={strDocDir}>
            <strong>{t("Total Amount")} : </strong><span>{objDocument41.price ?? "0.0"}</span><br />
            <strong>{t("Tax Percent")} : </strong><span>{GetPercent} %</span><br />
            <strong>{t("Tax Amount")} : </strong><span>{((objDocument41.price * GetPercent) / 100) ?? "0.0"}</span><br />
          </div>
        </div>

        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-3 me-2">
            <button type="button" className="btn btn-success" onClick={Update}>{t("Save")}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDocument41;
