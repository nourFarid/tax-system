import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";

const Document41 = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [arrFiscalYear, setArrFiscalYear] = useState([]);
  const [objCurrentDoc, setObjCurrentDoc] = useState({});
  const breadcrumbItems = [
    { label: t("Document 41"), link: "/Document41", active: false }
  ];
  const strDocDir = document.documentElement.dir;

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      link: "/Document41/Add",
      class: "btn btn-sm btn-success ms-2 float-end"
    },
    {
      label: t("Export"),
      icon: "bi bi-box-arrow-up-right",
      fun: async () => {
        const res = await axiosInstance.post("Document41/ExportExcel", objFilter, { responseType: "blob" });

        if (res.data.type === "application/json") {
          return alert("No data to export");
        }
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Document41.xlsx";
        a.click();
        window.URL.revokeObjectURL(url)
      },
      class: "btn btn-sm btn-warning ms-2 float-end"
    }
  ];

  const columns = [
    { label: t("Supplier Name"), accessor: "supplier.name" },
    { label: t("Transaction Date"), accessor: "transactionDate" },
    { label: t("Amount"), accessor: "amount" },
    { label: t("Transaction Nature"), accessor: "transactionNature.name" },
    { label: t("Price"), accessor: "price" },
    { label: t("Tax Percent"), accessor: "transactionNature.ratePercent" },
    { label: t("Deduction Percentage"), accessor: "deductionPercentage" },
    { label: t("Fiscal Year From"), accessor: "quarter.dateFrom" },
    { label: t("Fiscal Year To"), accessor: "quarter.dateTo" }
  ];

  const [arrData, setArrData] = useState([]);
  const [objFilter, setObjFilter] = useState({
    fiscalYearId: -1,
    quarterId: -1,
    transactionDateFrom: "",
    transactionDateTo: ""
  });

  const List = async (intPageNumber = 1) => {
    setPageNumber(intPageNumber);
    const res = await axiosInstance.post("Document41/List", {pageNumber: pageNumber, pageSize: pageSize, filter: objFilter});
    const result = res.data;
    if (!result.result) {
      alert(result.message);
      return;
    }
    for (let i = 0; i < result.data.data.length; i++) {
      result.data.data[i].deductionPercentage = result.data.data[i].price * result.data.data[i].transactionNature.ratePercent / 100;
    }
    setArrData(result.data.data);
    setTotalRows(result.data.totalRows);
    setTotalCount(result.data.totalCount);
  };

  const Edit = (objRow) => {
    window.location.href = `/Document41/Edit?id=${objRow.id}`;
  }

  const GetQuarters = (fiscalYearId) => {
    let fiscalYear = arrFiscalYear.find(fy => fy.id === parseInt(fiscalYearId));
    return fiscalYear ? fiscalYear.quarters : [];
  }

  const HandelDelete = (row) => {
    setObjCurrentDoc(row);
  }

  const listFiscalYear = async () => {
    const res = await axiosInstance.post("FiscalYear/ListAll", {});
    if (!res.data.result) {
      alert(res.data.message);
      return;
    }
    setArrFiscalYear(res.data.data);
  }

  useEffect(() => {
    List();
    listFiscalYear();
  }, []);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />
      <div className="bg-white p-3 mb-3 shadow-sm shadow-lg">
        <h4 className="font-semibold" style={{ color: "blue" }}>{t("Filter")}</h4>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Transaction Date Form")}</label>
            <input type="date" className="form-control" value={objFilter.transactionDateFrom} onChange={(e) => setObjFilter({...objFilter, transactionDateFrom: e.target.value})} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Transaction Date To")}</label>
            <input type="date" className="form-control" value={objFilter.transactionDateTo} onChange={(e) => setObjFilter({...objFilter, transactionDateTo: e.target.value})} />
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
            <button className="btn btn-primary" onClick={() => List()}>{t("Filter")}</button>
          </div>
        </div>
      </div>
      <div className="bg-white p-3 shadow-sm shadow-lg">
        <Table
          columns={columns}
          data={arrData}
          showActions={true}
          onEdit={Edit}
          showShow={false}
          onShow={() => { }}
          onDelete={HandelDelete}
        />
        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalRows={totalCount}
          onPageChange={setPageNumber}
        />
      </div>
    </>
  );
};

export default Document41;
