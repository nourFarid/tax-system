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

  const [objSupplier, setObjSupplier] = useState(null);
  const [objItem, setObjItem] = useState(null);
  const [objDocument41, setObjDocument41] = useState({
    item: null,
    supplierId: null,
    transactionDate: "",
    fiscalYearId: null,
    transactionNatureId: -1,
    amount: 0,
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
      console.log(arr);
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
      value: x.id
    }));
    console.log(arr);
    return arr;
  };
  const breadcrumbItems = [
    { label: t("Document 41"), link: "/Document41", active: false },
    { label: t("Add"), link: "", active: true }
  ];

  useEffect(() => {
    // fetch data here if needed
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
              onChange={(option) => setObjSupplier(option)}
            />
          </div>
          <div className="col-md-6 form-group">
            <label>{t("Transaction Date")}</label>
            <input type="date" className="mt-2 form-control" />
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-6 form-group">
            <label>{t("Fiscal Year")}</label>
            <label className="mt-2 form-control">{t("Fiscal Year")}</label>
          </div>
          <div className="col-md-6 form-group">
            <label>{t("Transaction Nature")}</label>
            <select className="mt-2 form-control">
              <option >{t("Transaction Nature")}</option>
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
              onChange={(option) => setObjItem(option.objItem)}
            />
          </div>
          <div className="col-md-3 form-group">
            <label>{t("Price")}</label>
            <input type="number" className="mt-2 form-control" placeholder="0.0" />
          </div>
          <div className="col-md-3 form-group">
            <label>{t("Amount")}</label>
            <input type="number" className="mt-2 form-control" placeholder="0" />
          </div>
        </div>

        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-2 pull-left border border-black me-3" dir={strDocDir}>
            <strong>{t("Total Amount")} : </strong><span>{"0.0"}</span><br />
            <strong>{t("Tax Percent")} : </strong><span>{"0.0"} %</span><br />
            <strong>{t("Tax Amount")} : </strong><span>{"0.0"}</span><br />
            <strong>{t("Net Amount")} : </strong><span>{"0.0"}</span><br />
          </div>
        </div>

        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-3 me-2">
            <button type="button" className="btn btn-success">{t("Add")}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDocument41;
