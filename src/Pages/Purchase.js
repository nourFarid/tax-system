import { useEffect, useState, useMemo } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Pagination from "../Components/Layout/Pagination";
import axiosInstance from "../Axios/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useSwal } from "../Hooks/Alert/Swal";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import { toast, ToastContainer } from "react-toastify";

const Purchase = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [purchase, setPurchase] = useState([]);
  const [error, setError] = useState(null);
  const [arrFiscalYear, setArrFiscalYear] = useState([]);
  const [boolDisableExport, setBoolDisableExport] = useState(false);

  const [objFilter, setObjFilter] = useState({
    fiscalYearId: -1,
    quarterId: -1,
    invoiceDateFrom: "",
    invoiceDateTo: "",
    exportWithName: null,

  });

  // State for delete modal
  const [objCurrentPurchase, setObjCurrentPurchase] = useState({});
  const { showSuccess, showError, showDeleteConfirmation, SwalComponent } = useSwal();

  const objTitle = useMemo(() => ({
    Save: t("Save"),
    Cancel: t("Cancel"),
    Delete: t("Delete"),
    DeleteConfirmation: t("Are you sure to delete"),
    QuestionMark: t("?"),
  }), [t]);

  const breadcrumbItems = [
    { label: t("Purchase"), link: "/purchase", active: false },
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      link: "/Purchase/Add",
      class: "btn btn-sm btn-success ms-2 float-end",
    },
    {
      label: t("Export With Names"),
      icon: "bi bi-box-arrow-up-right",
      fun: async () => {
        try {
          const payload = {
            ...objFilter,
            exportWithName: true,
          };

          const res = await axiosInstance.post(
            "purchase/ExportCsv",
            payload,
            { responseType: "blob" }
          );

          if (res.data.type === "application/json") {
            showError(t("Error"), t("No data to export"));
            return;
          }

          const blob = new Blob([res.data], {
            type: "text/csv;charset=utf-8",
          });

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `purchase ${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
        } catch {
          showError(t("Error"), t("Export failed"));
        }
      },
      class: "btn btn-sm btn-warning ms-2 float-end",
      disabled: boolDisableExport,
    },
    {
      label: t("Export With Codes"),
      icon: "bi bi-box-arrow-up-right",
      fun: async () => {
        try {
          const payload = {
            ...objFilter,
            exportWithName: false,
          };

          const res = await axiosInstance.post(
            "purchase/ExportCsv",
            payload,
            { responseType: "blob" }
          );

          if (res.data.type === "application/json") {
            showError(t("Error"), t("No data to export"));
            return;
          }

          const blob = new Blob([res.data], {
            type: "text/csv;charset=utf-8",
          });

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `purchase ${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
        } catch {
          showError(t("Error"), t("Export failed"));
        }
      },
      class: "btn btn-sm btn-warning ms-2 float-end",
      disabled: boolDisableExport,
    },
  ];


  const columns = [
    { label: t("Invoice Number"), accessor: "invoiceNumber" },
    { label: t("Supplier Name"), accessor: "customerSupplierName" },
    { label: t("Tax Registration Number"), accessor: "customerSupplierTaxRegistrationNumber" },
    { label: t("Address"), accessor: "customerSupplierAddress" },
    { label: t("National ID / Passport Number"), accessor: "CustomerSupplierIdentificationNumber" },
    { label: t("Settlement Date"), accessor: "invoiceDate" },
    { label: t("Valid"), accessor: "isValid" },
    { label: t("Updated By User"), accessor: "updatedByUser.userName" },
    { label: t("Created At"), accessor: "createdAt" },
    { label: t("Updated At"), accessor: "updateAt" },
        {
  label: t("Status"),
  accessor: "isValid",
  render: (value) =>
    value ? (
      <span className="badge bg-success">{t("Valid")}</span>
    ) : (
      <span className="badge bg-danger">{t("Invalid")}</span>
    )
}
  ];

  const strDocDir = document.documentElement.dir;

  const listFiscalYear = async () => {
    try {
      const res = await axiosInstance.post("FiscalYear/ListAll", {});
      if (!res.data.result) {
        showError(t("Error"), res.data.message);

        return;
      }
      setArrFiscalYear(res.data.data);
    } catch {
      showError(t("Error"), t("Failed to load fiscal years"));

    }
  };
const MarkInvalid = async (row) => {
  try {
    const res = await axiosInstance.put(
      `Document/MarkInvalid/${row.docId}?type=Sale`
    );

    if (res.data.result) {
      toast.success(res.data.message);
      fetchPurchase(pageNumber);
    } else {
      showError(t("Error"), res.data.message);
    }
  } catch (error) {
    showError(t("Error"), t("Something went wrong"));
  }
};
  const GetQuarters = (fiscalYearId) => {
    const fiscalYear = arrFiscalYear.find(
      (fy) => fy.id === Number(fiscalYearId)
    );
    return fiscalYear ? fiscalYear.quarters : [];
  };

  const fetchPurchase = async (page = 1) => {
    setLoading(true);
    try {
      const isFilterEmpty =
        objFilter.quarterId === -1 &&
        objFilter.invoiceDateFrom === "" &&
        objFilter.invoiceDateTo === "";

      let Filter = {};
      if (objFilter.invoiceDateFrom) {
        Filter.invoiceDateFrom = objFilter.invoiceDateFrom;
      } else {
        delete Filter.invoiceDateFrom;
      }
      if (objFilter.invoiceDateTo) {
        Filter.invoiceDateTo = objFilter.invoiceDateTo;
      } else {
        delete Filter.invoiceDateTo;
      }
      if (objFilter.quarterId !== -1) {
        Filter.quarterId = Number.parseInt(objFilter.quarterId);
      } else {
        delete Filter.quarterId;
      }
      const body = {
        filter: isFilterEmpty ? {} : Filter,
        pageNumber: page,
        pageSize,
        sortBy: "invoiceDate",
        isDescending: true,
      };

      const res = await axiosInstance.post("Purchase/List", body);

      if (res.data.result) {
        setPurchase(res.data.data.items);
        setTotalCount(res.data.data.totalCount);
        setPageNumber(res.data.data.pageNumber);
      } else {
        setError(res.data.message || t("Failed to fetch data"));
      }
    } catch {
      setError(t("Failed to fetch data"));
    } finally {
      setLoading(false);
    }
  };

  // Delete function
  const Delete = async () => {
    try {
      const res = await axiosInstance.delete(`Purchase/${objCurrentPurchase.docId}`);
      if (res.data.result) {
        showSuccess(t("Success"), res.data.message);
        hideModal("Delete");
        fetchPurchase(pageNumber);
      } else {
        showError(t("Error"), res.data.message);
      }
    } catch {
      showError(t("Error"), t("Delete failed"));
    }
  };

  // Show delete modal
  const HandelDelete = (row) => {
    setObjCurrentPurchase(row);
    showModal("Delete");
  };

  useEffect(() => {
    if (
      (objFilter.invoiceDateFrom === "" || objFilter.invoiceDateTo === "") &&
      objFilter.quarterId === -1
    ) {
      setBoolDisableExport(true);
    } else {
      setBoolDisableExport(false);
    }

    fetchPurchase(pageNumber);
  }, [objFilter, pageNumber]);

  useEffect(() => {
    listFiscalYear();
  }, []);

  const Reset = () => {
    setObjFilter({
      fiscalYearId: -1,
      quarterId: -1,
      invoiceDateFrom: "",
      invoiceDateTo: "",
    });
    setPageNumber(1);
  };

  const onFilterClick = () => {
    setPageNumber(1);
    fetchPurchase();
  };

  const onPageChange = (page) => {
    setPageNumber(page);
    fetchPurchase();
  };

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      <div className="bg-white p-3 mb-3 shadow-sm shadow-lg">
        <h4 className="font-semibold" style={{ color: "blue" }}>
          {t("Filter")}
        </h4>

        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Invoice Date From")}</label>
            <input
              type="date"
              className="form-control"
              value={objFilter.invoiceDateFrom}
              onChange={(e) =>
                setObjFilter({ ...objFilter, invoiceDateFrom: e.target.value })
              }
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Invoice Date To")}</label>
            <input
              type="date"
              className="form-control"
              value={objFilter.invoiceDateTo}
              onChange={(e) =>
                setObjFilter({ ...objFilter, invoiceDateTo: e.target.value })
              }
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">{t("Fiscal Year")}</label>
            <select
              className="form-select"
              value={objFilter.fiscalYearId}
              onChange={(e) => {
                const value = Number(e.target.value);
                setObjFilter({
                  ...objFilter,
                  fiscalYearId: value,
                  quarterId: -1,
                });
              }}
            >
              <option value={-1}>{t("Select Fiscal Year")}</option>
              {arrFiscalYear.map((item) => (
                <option key={item.id} value={item.id}> {item.yearFromDate} - {item.yearToDate} </option>
              ))}
            </select>
          </div>

          {objFilter.fiscalYearId !== -1 && (
            <div className="col-md-3 mb-3">
              <label className="form-label">{t("Quarter")}</label>
              <select
                className="form-select"
                value={objFilter.quarterId}
                onChange={(e) =>
                  setObjFilter({ ...objFilter, quarterId: e.target.value })
                }
              >
                <option value={-1}>{t("Select Quarter")}</option>
                {GetQuarters(objFilter.fiscalYearId).map((item) => (
                  <option key={item.id} value={item.id}> {item.dateFrom} - {item.dateTo}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="row" dir={strDocDir === "ltr" ? "rtl" : "ltr"}>
          <div className="col-md-3 mb-3">
            <button className="btn btn-primary" onClick={onFilterClick}> {t("Filter")} </button>
            &nbsp;
            <button className="btn btn-danger" onClick={Reset}>{t("Reset")} </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 shadow-sm shadow-lg">
        <Table
          columns={columns}
          data={purchase}
          showActions={true}
          onEdit={(row) => navigate(`/Purchase/UpdatePurchase/${row.id}`)}
          showShow={false}
          onShow={() => { }}
          onDelete={HandelDelete}
                      customActions={(row) => (
    <>
      {!row.isInvalid && (
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          title={t("Mark Invalid")}
          onClick={() => MarkInvalid(row)}
        >
          <i className="bi bi-x-circle"></i>
        </button>
      )}
    </>
  )}
        />

        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalRows={totalCount}
          onPageChange={onPageChange}
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
        <p>
          {objTitle.DeleteConfirmation}{" "}
          <strong>{objCurrentPurchase.invoiceNumber || objCurrentPurchase.customerSupplierName || ""}</strong>{" "}
          {objTitle.QuestionMark}
        </p>
      </Modal>

      <SwalComponent />
    </>
  );
};

export default Purchase;
