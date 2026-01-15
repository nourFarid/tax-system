import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import  { useSwal }  from "../Hooks/Alert/Swal";
import { Modal } from "bootstrap";

const Document41 = () => {
  const [boolDisableExport, setBoolDisableExport] = useState(false);
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [arrFiscalYear, setArrFiscalYear] = useState([]);
  const [objCurrentDoc, setObjCurrentDoc] = useState({});
  const { showSuccess, showError, showDeleteConfirmation, SwalComponent } = useSwal();
  const objTitle = useMemo(
    () => ({
      Save: t("Save"),
      Cancel: t("Cancel"),
      Delete: t("Delete"),
      DeleteConfirmation: t("Are you sure to delete"),
      QuestionMark: t("?")
    }),
    [t]
  );
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
          return showError("Error", "No data to export");
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
      class: "btn btn-sm btn-warning ms-2 float-end",
      disabled: boolDisableExport
    }
  ];

  const columns = [
    { label: t("Supplier Name"), accessor: "supplier.name" },
    { label: t("Transaction Date"), accessor: "transactionDate" },
    // { label: t("Amount"), accessor: "amount" },
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
  const Reset = () => {
    setObjFilter({
      fiscalYearId: -1,
      quarterId: -1,
      transactionDateFrom: "",
      transactionDateTo: ""
    });
    List();
  }

  const Delete = async () => {
    const res = await axiosInstance.delete("Document41/Delete/" + objCurrentDoc.id);
    const response = res.data;
    if (response.result) {
      showSuccess(t("Success"), response.message);
      hideModal("Delete");
      List();
    } else {
      showError(t("Error"), response.message);
    }
  }

  const Edit = (objRow) => {
    window.location.href = `/Document41/UpdateDocument41/${objRow.id}`;
  }

  const GetQuarters = (fiscalYearId) => {
    let fiscalYear = arrFiscalYear.find(fy => fy.id === parseInt(fiscalYearId));
    return fiscalYear ? fiscalYear.quarters : [];
  }

  const HandelDelete = (row) => {
    setObjCurrentDoc(row);
    const modalElement = document.getElementById("Delete");
    let modal = Modal.getInstance(modalElement);
    if (!modal) modal = new Modal(modalElement);
    modal.show();
  }

  const hideModal = (strModalId) => {
    const modal = Modal.getInstance(document.getElementById(strModalId));
    if (modal) {
      modal.hide();
    }
    const backdrops = document.querySelectorAll(".modal-backdrop.fade.show");
    backdrops.forEach(b => b.remove());
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
    if ((objFilter.transactionDateFrom == "" || objFilter.transactionDateTo == "") && objFilter.quarterId == -1) {
      setBoolDisableExport(true);
    } else {
      setBoolDisableExport(false);
    }
    List();
    listFiscalYear();

    document.getElementById("Delete")?.addEventListener("hidden.bs.modal", Reset);

    return () => {
      document.getElementById("Delete")?.removeEventListener("hidden.bs.modal", Reset);
    };
  }, [objFilter.transactionDateFrom, objFilter.transactionDateTo, objFilter.quarterId]);

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
            <button className="btn btn-danger" onClick={() => Reset()}>{t("Reset")}</button>
            &nbsp;
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

      <div className="modal fade" id="Delete" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.Delete}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal"> X </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <p>{objTitle.DeleteConfirmation} <strong> {objCurrentDoc.Name} </strong> {objTitle.QuestionMark}</p>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}>
              <button type="button" className="btn btn-danger" onClick={Delete} >{objTitle.Delete}</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" >{objTitle.Cancel}</button>
            </div>
          </div>
        </div>
      </div>
      <SwalComponent />
    </>
  );
};

export default Document41;
