import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import AsyncSelect from "react-select/async";
import axiosInstance from "../Axios/AxiosInstance";
const AddPurchase = () => {
  const { t } = useTranslate();

  const breadcrumbItems = [
    { label: t("Purchase"), link: "/Purchase", active: false },
    { label: t("Add"), link: "", active: true }
  ];

  const strDocDir = document.documentElement.dir;
  const [objItem, setObjItem] = useState(null);
  const arrItem = async (strInput) => {
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
      value: x.id
    }));
    console.log(arr);
    return arr;
  };
  useEffect(() => {
    // fetch data here if needed
  }, []);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className="border rounded p-3 mb-2 bg-white shadow-lg">
        <div className="row p-4">
          <div className="col-md-4 form-group">
            <h1><strong className="text-primary">{t("Purchase")}</strong></h1>
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-4 form-group">
            <label>{t("Customer")}</label>
            <input type="text" className="mt-2 form-control" placeholder="server side autocomplete" />
          </div>
          <div className="col-md-4 form-group">
            <label>{t("Tax Type")}</label>
            <select className="mt-2 form-control">
              <option >{t("Tax Type")}</option>
            </select>
          </div>
          <div className="col-md-4 form-group">
            <label>{t("Document Type")}</label>
            <select className="mt-2 form-control">
              <option >{t("Document Type")}</option>
            </select>
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-4 form-group">
            <label>{t("Invoice Number")}</label>
            <input type="text" className="mt-2 form-control" placeholder={t("Invoice Number")} />
          </div>
          <div className="col-md-4 form-group">
            <label>{t("Invoic Date")}</label>
            <input type="date" className="mt-2 form-control" />
          </div>
          <div className="col-md-4 form-group">
            <label>{t("Statment Type")}</label>
            <select className="mt-2 form-control">
              <option >{t("Statment Type")}</option>
            </select>
          </div>
        </div>

        <div className="row p-4">
          <div className="col-md-4 form-group">
            <label>{t("Item Type")}</label>
            <select className="mt-2 form-control">
              <option >{t("Item Type")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border rounded p-3 mb-2 bg-white shadow-lg mt-5">
        <div className="row p-4">
          <div className="col-md-6 form-group">
            <label>{t("Item")}</label>
            <AsyncSelect
              cacheOptions
              defaultOptions={false}
              loadOptions={arrItem}
              value={objItem}
              onChange={(option) => setObjItem(option)}
            />
            </div>
          <div className="col-md-2 form-group">
            <label>{t("Price")}</label>
            <input type="number" className="mt-2 form-control" placeholder="0.0" />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Amount")}</label>
            <input type="number" className="mt-2 form-control" placeholder="0" />
          </div>
          <div className="col-md-2 form-group">
            <label>{t("Discount")}</label>
            <input type="number" className="mt-2 form-control" placeholder="0" />
          </div>
        </div>

        <div className="row p-4" dir={strDocDir === "rtl" ? "ltr" : "rtl"}>
          <div className="col-md-2 pull-left border border-black me-3" dir={strDocDir}>
            <strong>{t("Total Amount")} : </strong><span>{"0.0"}</span><br />
            <strong>{t("Tax Percent")} : </strong><span>{"0.0"} %</span><br />
            <strong>{t("Tax Amount")} : </strong><span>{"0.0"}</span><br />
            <strong>{t("Discount")} : </strong><span>{"0.0"}</span><br />
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

export default AddPurchase;
