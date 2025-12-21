import { useEffect, useState, useMemo } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Pagination from "../Components/Layout/Pagination";
import axiosInstance from "../Axios/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useSwal } from "../Hooks/Alert/Swal";
import { Modal } from "bootstrap";

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
      label: t("Export"),
      icon: "bi bi-box-arrow-up-right",
      fun: async () => {
        try {
          const res = await axiosInstance.post(
            "purchase/ExportExcel",
            objFilter,
            { responseType: "blob" }
          );

          if (res.data.type === "application/json") {
            showError(t("Error"), "No data to export");
            return;
          }

          const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "Purchase.xlsx";
          a.click();
          window.URL.revokeObjectURL(url);
        } catch {
          showError(t("Error"), "Export failed");

        }
      },
      class: "btn btn-sm btn-warning ms-2 float-end",
      disabled: boolDisableExport,
    },
  ];

  const columns = [
    { label: t("Document Type"), accessor: "documentType.name" },
    { label: t("Invoice Number"), accessor: "invoiceNumber" },
    { label: t("Supplier Name"), accessor: "customerSupplierName" },
    { label: t("Tax Registration Number"), accessor: "customerSupplierTaxRegistrationNumber" },
    { label: t("Address"), accessor: "customerSupplierAddress" },
    { label: t("National ID / Passport Number"), accessor: "CustomerSupplierIdentificationNumber" },
    { label: t("Invoice Date"), accessor: "invoiceDate" },
    { label: t("Item Name"), accessor: "item.name" },
    { label: t("Statement Type"), accessor: "statementType.name" },
    { label: t("Item Type"), accessor: "itemType.name" },
    { label: t("Price"), accessor: "price" },
    { label: t("Amount"), accessor: "amount" },
    { label: t("Tax Amount"), accessor: "tax" },
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
      showError(t("Error"), "Failed to load fiscal years");

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
      } else{
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
        setError(res.data.message || "Failed to fetch data");
      }
    } catch {
      setError("Failed to fetch data");
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
    const modalElement = document.getElementById("Delete");
    let modal = Modal.getInstance(modalElement);
    if (!modal) modal = new Modal(modalElement);
    modal.show();
  };

  const hideModal = (strModalId) => {
    const modal = Modal.getInstance(document.getElementById(strModalId));
    if (modal) {
      modal.hide();
    }
    const backdrops = document.querySelectorAll(".modal-backdrop.fade.show");
    backdrops.forEach(b => b.remove());
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

    // Clean up modal event listeners if needed
    return () => {
      hideModal("Delete");
    };
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
                <option key={item.id} value={item.id}>
                  {item.yearFromDate} - {item.yearToDate}
                </option>
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
                  <option key={item.id} value={item.id}>
                    {item.dateFrom} - {item.dateTo}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="row" dir={strDocDir === "ltr" ? "rtl" : "ltr"}>
          <div className="col-md-3 mb-3">
            <button className="btn btn-primary" onClick={onFilterClick}>
              {t("Filter")}
            </button>
            &nbsp;
            <button className="btn btn-danger" onClick={Reset}>
              {t("Reset")}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 shadow-sm shadow-lg">
        <Table
          columns={columns}
          data={purchase}
          showActions={true}
          onEdit={(row) => navigate(`/Purchase/UpdateSale/${row.id}`)}
          showShow={false}
          onShow={() => {}}
          onDelete={HandelDelete} // <-- Add the delete handler here
        />

        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalRows={totalCount}
          onPageChange={onPageChange}
        />
      </div>
      {/* Delete Confirmation Modal */}
      <div
        className="modal fade"
        id="Delete"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "10px",
              border: "1px solid #d3d3d3",
            }}
          >
            <div
              className="modal-header d-flex justify-content-between align-items-center"
              style={{ borderBottom: "1px solid #d3d3d3" }}
            >
              <h5 className="modal-title">{objTitle.Delete}</h5>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                data-bs-dismiss="modal"
              >
                X
              </button>
            </div>

            <div
              className="modal-body"
              style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}
            >
              <p>
                {objTitle.DeleteConfirmation}{" "}
                <strong>{objCurrentPurchase.invoiceNumber || objCurrentPurchase.customerSupplierName || ""}</strong>{" "}
                {objTitle.QuestionMark}
              </p>
            </div>

            <div
              className="modal-footer"
              style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}
            >
              <button
                type="button"
                className="btn btn-danger"
                onClick={Delete}
              >
                {objTitle.Delete}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                {objTitle.Cancel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <SwalComponent />
    </>
  );
};

export default Purchase;
