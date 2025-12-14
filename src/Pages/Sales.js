import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import { useNavigate } from "react-router-dom";

const Sales = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [objFilter, setObjFilter] = useState({
   fiscalYearId: -1,
    quarterId: -1,
    invoiceDateFrom: "",
    invoiceDateTo: ""
  });
    const [arrFiscalYear, setArrFiscalYear] = useState([]);

    const [boolDisableExport, setBoolDisableExport] = useState(false);

  const breadcrumbItems = [
    { label: t("Sales"), link: "/Sales", active: false }
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      link: "/Sales/Add",
      class: "btn btn-sm btn-success ms-2 float-end"
    },
    {
      label: t("Export"),
      icon: "bi bi-box-arrow-up-right",
      fun: async () => {
        const res = await axiosInstance.post("Sales/ExportExcel", objFilter, { responseType: "blob" });

        if (res.data.type === "application/json") {
          return alert("No data to export");
        }
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Sale.xlsx";
        a.click();
        window.URL.revokeObjectURL(url)
      },
      class: "btn btn-sm btn-warning ms-2 float-end",
      disabled: boolDisableExport
    }
  ];
  const columns = [
    { label: t("Document Type"), accessor: "documentType.name" },
    { label: t("Invoice Number"), accessor: "invoiceNumber" },
    { label: t("Customer Name"), accessor: "customerSupplierName" },
    { label: t("Tax Registration Number"), accessor: "customerSupplierTaxRegistrationNumber" },
    { label: t("Address"), accessor: "customerSupplierAddress" },
    { label: t("National ID / Passport Number"), accessor: "CustomerSupplierIdentificationNumber" },
    { label: t("Invoice Date"), accessor: "invoiceDate" },
    { label: t("Item Name"), accessor: "item.name" },
    { label: t("Statment Type"), accessor: "statementType.name" },
    { label: t("Item Type"), accessor: "itemType.name" },
    { label: t("Price"), accessor: "item.price" },
    { label: t("Amount"), accessor: "amount" },
    { label: t("Tax Amount"), accessor: "tax" },

  ];
  const strDocDir = document.documentElement.dir;
  const Reset = () => {
    setObjFilter({
      fiscalYearId: -1,
      quarterId: -1,
      invoiceDateFrom: "",
      invoiceDateTo: ""
    });
    fetchSales();
  }

  const fetchSales = async (page = 1, pageSize = 10, sortBy = "invoiceDate", isDescending = true) => {
    setLoading(true);
    try {
      const body = {
        filter: {},
        pageNumber: page,
        pageSize,
        sortBy,
        isDescending
      };

      const res = await axiosInstance.post("Sales/List", body);
      const data = res.data;
      console.log('====================================');
      console.log(data.data.items);
      console.log('====================================');
      if (data.result) {
        setSales(data.data.items);
        setTotalCount(data.data.totalCount);
        setPageNumber(data.data.pageNumber);
        console.log('=====sssssssss===============================');
        console.log(sales);
        console.log('====================================');
      }

    } catch (e) {
      setError("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };
    const listFiscalYear = async () => {
    const res = await axiosInstance.post("FiscalYear/ListAll", {});
    if (!res.data.result) {
      alert(res.data.message);
      return;
    }
    setArrFiscalYear(res.data.data);
  }
  const GetQuarters = (fiscalYearId) => {
    let fiscalYear = arrFiscalYear.find(fy => fy.id === parseInt(fiscalYearId));
    return fiscalYear ? fiscalYear.quarters : [];
  }
  useEffect(() => {
    fetchSales()
    listFiscalYear()
       if ((objFilter.invoiceDateFrom == "" || objFilter.invoiceDateTo == "") && objFilter.quarterId == -1) {
      setBoolDisableExport(true);
    } else {
      setBoolDisableExport(false);
    }
  }, [objFilter.invoiceDateFrom, objFilter.invoiceDateTo, objFilter.quarterId]);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />
      <div className="bg-white p-3 mb-3 shadow-sm shadow-lg">
        <h4 className="font-semibold" style={{ color: "blue" }}>{t("Filter")}</h4>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Invoice Date Form")}</label>
            <input type="date" className="form-control" value={objFilter.invoiceDateFrom} onChange={(e) => setObjFilter({...objFilter, invoiceDateFrom: e.target.value})} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Invoice Date To")}</label>
            <input type="date" className="form-control" value={objFilter.invoiceDateTo} onChange={(e) => setObjFilter({...objFilter, invoiceDateTo: e.target.value})} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Fiscal Year")}</label>
            <select className="form-select" value={objFilter.fiscalYearId} onChange={(e) => {
                const value = Number(e.target.value);
                setObjFilter(prev => ({...prev, fiscalYearId: value, quarterId: value == -1 ? -1 : prev.quarterId}));
              }}>
              <option value={-1}>{t("Select Fiscal Year")}</option>
              {arrFiscalYear.map(item => (
                <option key={item.id} value={item.id}>
                  {item.yearFromDate} - {item.yearToDate}
                </option>
              ))}
            </select>
          </div>
          {objFilter.fiscalYearId != -1 && (<div className="col-md-3 mb-3">
            <label className="form-label">{t("Quarter")}</label>
            <select className="form-select" value={objFilter.quarterId} onChange={(e) => setObjFilter({...objFilter, quarterId: e.target.value})}>
              <option value={-1}>{t("Select Quarter")}</option>
              {GetQuarters(objFilter.fiscalYearId).map(item => (
                <option key={item.id} value={item.id}>
                  {item.dateFrom} - {item.dateTo}
                </option>
              ))}
            </select>
          </div>)}
        </div>
        <div className="row" dir={strDocDir === "ltr" ? "rtl" : "ltr"}>
          <div className="col-md-3 mb-3">
            <button className="btn btn-primary" onClick={() => fetchSales()}>{t("Filter")}</button>
            &nbsp;
            <button className="btn btn-danger" onClick={() => Reset()}>{t("Reset")}</button>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        data={sales}
        showActions={true}
onEdit={(row) => {
  navigate(`/Sales/UpdateSale/${row.id}`);
}}


         showShow={false}
        onShow={() => { }}
        onDelete={() => { }}
      />
      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRows={totalCount}
        onPageChange={setPageNumber}
      />
    </>
  );
};

export default Sales;
