import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { Modal } from "bootstrap";
import Pagination from "../Components/Layout/Pagination";

const TaxType = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const objTitle = useMemo(
    () => ({
      TaxType: t("Tax Type"),
      AddTaxType: t("Add Tax Type"),
      EditTaxType: t("Edit Tax Type"),
      Name: t("Name"),
      Code: t("Code"),
      Sales: t("Sales"),
      Purchase: t("Purchase"),
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

  const [objDocType, setObjDocType] = useState({
    Name: "",
    Code: "",
    IsSales: false,
    IsPurchase: false,
  });

  const breadcrumbItems = [
    { label: t("Setup"), link: "/Setup", active: false },
    { label: t("Tax Type"), active: true },
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      dyalog: "#AddTaxType",
      class: "btn btn-sm btn-success ms-2 float-end",
    },
  ];

  const columns = [
    { label: t("ID"), accessor: "id" },
    { label: t("Name"), accessor: "name" },
    { label: t("Code"), accessor: "code" },
    { label: t("Sales"), accessor: "IsSales" },
    { label: t("Purchase"), accessor: "IsPurchase" },
  ];

  const data = [
    { id: 1, name: "سلع عامة", code: "test123", IsSales: true, IsPurchase: true },
    { id: 2, name: "سلع جدول", code: "test123", IsSales: true },
  ];

  const handleEdit = (row) => {
    setObjDocType({
      Name: row.name || "",
      Code: row.code || "",
      Id: row.id || -1,
      IsPurchase: row.IsPurchase || false,
      IsSales: row.IsSales || false,
    });

    const modalElement = document.getElementById("EditTaxType");
    const modal = new Modal(modalElement);
    modal.show();
  };

  const handleShow = (row) => {};

  const handleDelete = (row) => {
    setObjDocType({
      Name: row.name || "",
      Code: row.code || "",
      Id: row.id || -1,
      IsPurchase: row.IsPurchase || false,
      IsSales: row.IsSales || false,
    });

    const modalElement = document.getElementById("DeleteTaxType");
    const modal = new Modal(modalElement);
    modal.show();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjDocType((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving:", objDocType);
    setObjDocType({ Name: "", Code: "", IsSales: false, IsPurchase: false });
  };

  const handleUpdate = () => {
    console.log("Updating:", objDocType);
  };

  const Delete = () => {
    console.log("Deleting:", objDocType);
  };

  useEffect(() => {
    const modalIds = ["AddTaxType", "EditTaxType", "DeleteTaxType"];

    const handleHidden = () => {
      setObjDocType({ Name: "", Code: "", IsSales: false, IsPurchase: false });
    };

    const modals = modalIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    modals.forEach((modalEl) => {
      modalEl.addEventListener("hidden.bs.modal", handleHidden);
    });

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

  {/* Add */}
      <div className="modal fade" id="AddTaxType" tabIndex="-1" aria-hidden="true">
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
              <h5 className="modal-title">{objTitle.AddTaxType}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal"> X </button>
            </div>

            <div className="modal-body"style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">{objTitle.Name}</label>
                  <input
                    type="text"
                    name="Name"
                    value={objDocType.Name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={objTitle.Name}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.Code}</label>
                  <input
                    type="text"
                    name="Code"
                    value={objDocType.Code}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={objTitle.Code}
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6 d-flex align-items-center">
                  <input
                    type="checkbox"
                    id="IsSales"
                    name="IsSales"
                    checked={objDocType.IsSales}
                    onChange={(e) =>
                      setObjDocType((prev) => ({
                        ...prev,
                        IsSales: e.target.checked,
                      }))
                    }
                    className="form-check-input me-2"
                  />
                  <label htmlFor="IsSales" className="form-check-label">
                    {objTitle.Sales}
                  </label>
                </div>

                <div className="col-md-6 d-flex align-items-center">
                  <input
                    type="checkbox"
                    id="IsPurchase"
                    name="IsPurchase"
                    checked={objDocType.IsPurchase}
                    onChange={(e) =>
                      setObjDocType((prev) => ({
                        ...prev,
                        IsPurchase: e.target.checked,
                      }))
                    }
                    className="form-check-input me-2"
                  />
                  <label htmlFor="IsPurchase" className="form-check-label"> {objTitle.Purchase} </label>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }} >
              <button type="button" className="btn btn-success" onClick={handleSave}> {objTitle.Save} </button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal"> {objTitle.Cancel} </button>
            </div>
          </div>
        </div>
      </div>
  {/* Edit */}
      <div className="modal fade" id="EditTaxType" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3", }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }} >
              <h5 className="modal-title">{objTitle.EditTaxType}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm"  data-bs-dismiss="modal" > X </button>
            </div>

            <div
              className="modal-body"
              style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}
            >
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">{objTitle.Name}</label>
                  <input
                    type="text"
                    name="Name"
                    value={objDocType.Name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={objTitle.Name}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.Code}</label>
                  <input
                    type="text"
                    name="Code"
                    value={objDocType.Code}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={objTitle.Code}
                  />
                </div>
              </div>

              {/* ✅ Checkboxes */}
              <div className="row mt-3">
                <div className="col-md-6 d-flex align-items-center">
                  <input
                    type="checkbox"
                    id="IsSalesEdit"
                    name="IsSales"
                    checked={objDocType.IsSales}
                    onChange={(e) =>
                      setObjDocType((prev) => ({
                        ...prev,
                        IsSales: e.target.checked,
                      }))
                    }
                    className="form-check-input me-2"
                  />
                  <label htmlFor="IsSalesEdit" className="form-check-label"> {objTitle.Sales} </label>
                </div>

                <div className="col-md-6 d-flex align-items-center">
                  <input
                    type="checkbox"
                    id="IsPurchaseEdit"
                    name="IsPurchase"
                    checked={objDocType.IsPurchase}
                    onChange={(e) =>
                      setObjDocType((prev) => ({
                        ...prev,
                        IsPurchase: e.target.checked,
                      }))
                    }
                    className="form-check-input me-2"
                  />
                  <label htmlFor="IsPurchaseEdit" className="form-check-label">
                    {objTitle.Purchase}
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }} >
              <button type="button" className="btn btn-success" onClick={handleUpdate} > {objTitle.Save} </button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" > {objTitle.Cancel} </button>
            </div>
          </div>
        </div>
      </div>
  {/* Delete */}
      <div className="modal fade" id="DeleteTaxType" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3", }} >
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }} >
              <h5 className="modal-title">{objTitle.Delete}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal" > X </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }} >
              <p>
                {objTitle.DeleteConfirmation} <strong>{objDocType.Name}</strong>{" "}
                {objTitle.QuestionMark}
              </p>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }} >
              <button type="button" className="btn btn-danger" onClick={Delete}> {objTitle.Delete} </button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal"> {objTitle.Cancel} </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaxType;
