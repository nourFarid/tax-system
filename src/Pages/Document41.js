import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import { useSwal } from "../Hooks/Alert/Swal";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import { getUserRoles } from "../Hooks/Services/Storage.js";
import AsyncSelect from "react-select/async";

const Document41 = () => {
  const roles = getUserRoles();

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
      label: t("Export With Names"),
      icon: "bi bi-box-arrow-up-right",
      fun: async () => {
        const payload = {
          ...objFilter,
          exportWithName: true,
        };
        const res = await axiosInstance.post("Document41/ExportToCsv", payload, { responseType: "blob" });

        if (res.data.type === "application/json") {
          return showError("Error", "No data to export");
        }
        const blob = new Blob([res.data], {
          type: "text/csv;charset=utf-8",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Doc41 ${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url)
      },
      class: "btn btn-sm btn-warning ms-2 float-end",
      disabled: boolDisableExport
    },
    {
      label: t("Export With Codes"),
      icon: "bi bi-box-arrow-up-right",
      fun: async () => {
        const payload = {
          ...objFilter,
          exportWithName: false,
        };
        const res = await axiosInstance.post("Document41/ExportToCsv", payload, { responseType: "blob" });

        if (res.data.type === "application/json") {
          return showError("Error", "No data to export");
        }
        const blob = new Blob([res.data], {
          type: "text/csv;charset=utf-8",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Doc41 ${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url)
      },
      class: "btn btn-sm btn-warning ms-2 float-end",
      disabled: boolDisableExport
    },
  ];

  const columns = [
    { label: t("Supplier Name"), accessor: "supplier.name" },
    { label: t("Transaction Date"), accessor: "transactionDate" },
    { label: t("Transaction Nature"), accessor: "transactionNature.name" },
    { label: t("Price"), accessor: "price" },
    { label: t("Tax Percent"), accessor: "transactionNature.ratePercent" },
    { label: t("Deduction Percentage"), accessor: "deductionPercentage" },
    { label: t("Fiscal Year From"), accessor: "quarter.dateFrom" },
    { label: t("Fiscal Year To"), accessor: "quarter.dateTo" },
    // {
    //   label: t("Status"),
    //   accessor: "isValid",
    //   render: (value) =>
    //     value ? (
    //       <span className="badge bg-success">{t("Valid")}</span>
    //     ) : (
    //       <span className="badge bg-danger">{t("Invalid")}</span>
    //     )
    // },
    // {
    //   label: t("Update Status"),
    //   accessor: "IsUpdated",
    //   render: (value) =>
    //     value ? (
    //       <span className="badge bg-success">{t("Updated")}</span>
    //     ) : (
    //       <span className="badge bg-danger">{t("Not Updated")}</span>
    //     )
    // },



  ];

  const [arrData, setArrData] = useState([]);
  const [objSupplier, setObjSupplier] = useState(null);
  const [objFilter, setObjFilter] = useState({
    fiscalYearId: -1,
    quarterId: -1,
    transactionDateFrom: "",
    transactionDateTo: "",
    exportWithName: false,
    supplierId: -1,
  });

  const arrSupplier = async (input) => {
    if (input.length < 2) return [];
    const res = await axiosInstance.post("/CustomerSupplier/ListAll", {
      NameIdentity: input,
      IsSupplier: true,
    });
    return res.data.data.map(x => ({
      label: `[${x.taxRegistrationNumber ?? x.identificationNumber}] ${x.name}`,
      value: x.id,
    }));
  };
  // const MarkInvalid = async (row) => {
  //   const res = await axiosInstance.put(
  //     `Document41/MarkInvalid/${row.id}`
  //   );

  //   if (res.data.result) {
  //     showSuccess(t("Success"), t("Document marked as invalid"));
  //     List(pageNumber);
  //   } else {
  //     showError(t("Error"), res.data.message);
  //   }
  // };

  const List = async (intPageNumber = 1) => {
    setPageNumber(intPageNumber);
    const res = await axiosInstance.post("Document41/List", { pageNumber: pageNumber, pageSize: pageSize, filter: objFilter });
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
      transactionDateTo: "",
      supplierId: -1,
    });
    setObjSupplier(null);
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
    showModal("Delete");
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
  }, [objFilter.transactionDateFrom, objFilter.transactionDateTo, objFilter.quarterId]);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />
      <div className="bg-white p-3 mb-3 shadow-sm shadow-lg">
        <h4 className="font-semibold" style={{ color: "blue" }}>{t("Filter")}</h4>
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Supplier")}</label>
            <AsyncSelect
              loadOptions={arrSupplier}
              value={objSupplier}
              placeholder={t("Type to search...")}
              noOptionsMessage={() => t("No options")}
              loadingMessage={() => t("Loading...")}
              isClearable={true}
              onChange={(o) => {
                setObjSupplier(o);
                setObjFilter(prev => ({ ...prev, supplierId: o ? o.value : -1 }));
              }}
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Transaction Date Form")}</label>
            <input type="date" className="form-control" value={objFilter.transactionDateFrom} onChange={(e) => setObjFilter({ ...objFilter, transactionDateFrom: e.target.value })} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Transaction Date To")}</label>
            <input type="date" className="form-control" value={objFilter.transactionDateTo} onChange={(e) => setObjFilter({ ...objFilter, transactionDateTo: e.target.value })} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Fiscal Year")}</label>
            <select className="form-select" value={objFilter.fiscalYearId} onChange={(e) => {
              const value = Number(e.target.value);
              setObjFilter(prev => ({ ...prev, fiscalYearId: value, quarterId: value == -1 ? -1 : prev.quarterId }));
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
            <select className="form-select" value={objFilter.quarterId} onChange={(e) => setObjFilter({ ...objFilter, quarterId: e.target.value })}>
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
          showDelete={false}
          onEdit={Edit}
          showShow={false}
          // onDelete={HandelDelete}
          // customActions={
          //   roles.includes("Admin")
          //     ? (row) => (
          //       <>
          //         {!row.isInvalid && (
          //           <button
          //             type="button"
          //             className="btn btn-sm btn-secondary"
          //             title={t("Mark Invalid")}
          //             onClick={() => MarkInvalid(row)}
          //           >
          //             <i className="bi bi-x-circle"></i>
          //           </button>
          //         )}
          //       </>
          //     )
          //     : undefined
          // }
        />

        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalRows={totalCount}
          onPageChange={setPageNumber}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        id="Delete"
        title={objTitle.Delete}
        size="lg"
        onSave={Delete}
        onHide={Reset}
        saveLabel={objTitle.Delete}
        cancelLabel={objTitle.Cancel}
        saveButtonClass="btn btn-danger"
        cancelButtonClass="btn btn-primary"
      >
        <p>{objTitle.DeleteConfirmation} <strong> {objCurrentDoc.Name} </strong> {objTitle.QuestionMark}</p>
      </Modal>

      <SwalComponent />
    </>
  );
};

export default Document41;
