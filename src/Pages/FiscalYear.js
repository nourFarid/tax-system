import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { Modal } from "bootstrap";
import Pagination from '../Components/Layout/Pagination';

const FiscalYear = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

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

  const data = [
    { id: 1, From: "2024-07-11", To: "2024-10-11", YrFrom: "2024", YrTo: "2025" },
    { id: 2, From: "2024-07-11", To: "2024-10-11", YrFrom: "2024", YrTo: "2025" },
  ];

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
  const handleShow = (row) => { };
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

  const handleSave = () => {
    setObjDocType({ From: "", To: "", YrFrom: "", YrTo: "" });
    // the add request should be here
  };

  const handleUpdate = () => {
    // the add request should be here
  };

  const Delete = () => {
    // the add request should be here
  };

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

    // Cleanup
    return () => {
      modals.forEach((modalEl) => {
        modalEl.removeEventListener("hidden.bs.modal", handleHidden);
      });
    };
  }, []);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      <Table
        columns={columns}
        data={data}
        showActions={true}
        onEdit={handleEdit}
        showShow={false}
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
    </>
  );
};

export default FiscalYear;
