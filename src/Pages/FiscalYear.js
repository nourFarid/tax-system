import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { Modal } from "bootstrap";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import { useSwal } from "../Hooks/Alert/Swal";


const FiscalYear = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fiscalYears, setFiscalYears] = useState([]);
  const navigate = useNavigate();

  const objTitle = useMemo(
    () => ({
      AddFiscalYear: t("Add Fiscal Year"),
      EditFiscalYear: t("Edit Fiscal Year"),
      Id: t("ID"),
      From: t("From"),
      To: t("To"),
      YrFrom: t("Year From"),
      YrTo: t("Year To"),
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

  const [objDocType, setObjDocType] = useState({ From: "", To: "", YrFrom: "", YrTo: "" });
  const { showSuccess, showError, showDeleteConfirmation, SwalComponent } = useSwal();

  const breadcrumbItems = [
    { label: t("Setup"), link: "/Setup", active: false },
    { label: t("Fiscal Year"), active: true },
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      dyalog: "#AddFiscalYear",
      class: "btn btn-sm btn-success ms-2 float-end",
    },
  ];

  const columns = [
    { label: t("ID"), accessor: "id" },
    { label: t("Year From"), accessor: "YrFrom" },
    { label: t("Year To"), accessor: "YrTo" },
    { label: t("From"), accessor: "From" },
    { label: t("To"), accessor: "To" },

  ];

  const getFiscalYears = async () => {
    try {
      const response = await axiosInstance.post("FiscalYear/ListAll", {});

      const list = response.data?.data || [];

      const mappedData = list.map(item => ({
        id: item.id,
        From: item.fromDate ? item.fromDate.split('T')[0] : "",
        To: item.toDate ? item.toDate.split('T')[0] : "",
        YrFrom: item.yearFromDate,
        YrTo: item.yearToDate,
      }));

      setFiscalYears(mappedData);
      setTotalCount(mappedData.length);

    } catch (error) {
      console.error("Fetch Fiscal Years Error:", error);
    }
  };




  const handleEdit = (row) => {
    setObjDocType({
      Id: row.id || -1,
      From: row.From || "",
      To: row.To || "",
      YrFrom: row.YrFrom || "",
      YrTo: row.YrTo || "",
    });

    const modalElement = document.getElementById("EditFiscalYear");
    const modal = new Modal(modalElement);
    modal.show();
  };
  const handleShow = (row) => {
    navigate(`/Setup/FiscalYear/Info/${row.id}`);
  };
  const handleDelete = (row) => {
    setObjDocType({
      Id: row.id || -1,
      From: row.From || "",
      To: row.To || "",
      YrFrom: row.YrFrom || "",
      YrTo: row.YrTo || "",
    });

    const modalElement = document.getElementById("DeleteFiscalYear");
    const modal = new Modal(modalElement);
    modal.show();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjDocType((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: 0,
        fromDate: objDocType.From,
        toDate: objDocType.To,
        yearFromDate: objDocType.YrFrom,
        yearToDate: objDocType.YrTo,
        isActive: true,
        quarters: []
      };
      const response = await axiosInstance.post("FiscalYear/Add", payload);
      if (response.status === 200) {
        await getFiscalYears();
        hideModal("AddFiscalYear");
        setObjDocType({ From: "", To: "", YrFrom: "", YrTo: "" });
        showSuccess("Success", "Fiscal Year added successfully!");

      }

    } catch (error) {
      console.error("Add Fiscal Year Error:", error);
      showError(t("An error occurred while adding the Fiscal Year."));
    }
  };


  const handleUpdate = async () => {
    const payload = {
      id: objDocType.Id,
      fromDate: objDocType.From,
      toDate: objDocType.To,
      yearFromDate: objDocType.YrFrom,
      yearToDate: objDocType.YrTo,
      isActive: true,
      quarters: []
    };

    try {
      await axiosInstance.put(
        `/FiscalYear`,
        payload
      );
      await getFiscalYears();
      const modalElement = document.getElementById("EditFiscalYear");
      const modal = Modal.getInstance(modalElement);
      modal.hide();
      setObjDocType({ From: "", To: "", YrFrom: "", YrTo: "" });
      showSuccess("Success", "Fiscal Year updated successfully!");

    } catch (error) {
      console.error("Update Fiscal Year Error:", error);
      showError(t("An error occurred while updating the Fiscal Year."));
    }
  };

const Delete = () => {
    axiosInstance
      .delete(`/FiscalYear/${objDocType.Id}`)
      .then(() => {
        getFiscalYears();
        const modalElement = document.getElementById("DeleteFiscalYear");
        const modal = Modal.getInstance(modalElement);
        modal.hide();
        showSuccess("Success", "Fiscal Year deleted successfully!");
      })
      .catch((error) => {
        console.error("Delete Fiscal Year Error:", error);
        showError(t("An error occurred while deleting the Fiscal Year."));
      });

  };
  const hideModal = (strModalId) => {
    const modal = Modal.getInstance(document.getElementById(strModalId));
    if (modal) {
      modal.hide();
    }
    const backdrops = document.querySelectorAll(".modal-backdrop.fade.show");
    backdrops.forEach(b => b.remove());
  }
  useEffect(() => {
    const modalIds = ["AddFiscalYear", "EditFiscalYear", "DeleteFiscalYear"];

    const handleHidden = () => {
      // Reset object when any modal is hidden
      setObjDocType({ From: "", To: "", YrFrom: "", YrTo: "" });
    };

    const modals = modalIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    modals.forEach((modalEl) => {
      modalEl.addEventListener("hidden.bs.modal", handleHidden);
    });



    getFiscalYears();

    // Cleanup
    return () => {
      modals.forEach((modalEl) => {
        modalEl.removeEventListener("hidden.bs.modal", handleHidden);
      });
    };
  }, []);
  const pagedData = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    return fiscalYears.slice(start, end);
  }, [fiscalYears, pageNumber, pageSize])

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      <Table
        columns={columns}
        data={pagedData}
        showActions={true}
        onEdit={handleEdit}
        showShow={true}
        onShow={handleShow}
        onDelete={handleDelete}
      />
      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRows={totalCount}
        onPageChange={setPageNumber}
      />

      <div className="modal fade" id="AddFiscalYear" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.AddFiscalYear}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">X</button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">{objTitle.From}</label>
                  <input type="date" name="From" value={objDocType.From} onChange={handleChange} className="form-control" placeholder={objTitle.From} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.To}</label>
                  <input type="date" name="To" value={objDocType.To} onChange={handleChange} className="form-control" placeholder={objTitle.To} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">{objTitle.YrFrom}</label>
                  <input type="text" name="YrFrom" value={objDocType.YrFrom} onChange={handleChange} className="form-control" placeholder={objTitle.YrFrom} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.YrTo}</label>
                  <input type="text" name="YrTo" value={objDocType.YrTo} onChange={handleChange} className="form-control" placeholder={objTitle.YrTo} />
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}>
              <button type="button" className="btn btn-success" onClick={handleSave} >
                {objTitle.Save}
              </button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" >
                {objTitle.Cancel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="EditFiscalYear" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.EditFiscalYear}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">
                X
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">{objTitle.From}</label>
                  <input type="date" name="From" value={objDocType.From} onChange={handleChange} className="form-control" placeholder={objTitle.From} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.To}</label>
                  <input type="date" name="To" value={objDocType.To} onChange={handleChange} className="form-control" placeholder={objTitle.To} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">{objTitle.YrFrom}</label>
                  <input type="text" name="YrFrom" value={objDocType.YrFrom} onChange={handleChange} className="form-control" placeholder={objTitle.YrFrom} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.YrTo}</label>
                  <input type="text" name="YrTo" value={objDocType.YrTo} onChange={handleChange} className="form-control" placeholder={objTitle.YrTo} />
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}>
              <button type="button" className="btn btn-success" onClick={handleUpdate} >
                {objTitle.Save}
              </button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" >
                {objTitle.Cancel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="DeleteFiscalYear" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.Delete}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">
                X
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <p>
                {objTitle.DeleteConfirmation}{" "}
                <strong>{objDocType.YrFrom} - {objDocType.YrTo}</strong> {objTitle.QuestionMark}
              </p>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}>
              <button type="button" className="btn btn-danger" onClick={Delete} >
                {objTitle.Delete}
              </button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" >
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

export default FiscalYear;
