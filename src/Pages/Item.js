import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { Modal } from "bootstrap";
import Pagination from '../Components/Layout/Pagination';

const Item = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const objTitle = useMemo(
    () => ({
      AddItem: t("Add Item"),
      EditItem: t("Edit Item"),
      Name: t("Name"),
      Code: t("Code"),
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
    Price: 0,
    Unit: "",
    TaxAmount: 0,
    TaxType: "",
    CodeType: ""});

  const breadcrumbItems = [
    { label: t("Setup"), link: "/Setup", active: false },
    { label: t("Items"), active: true },
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      dyalog: "#AddItem",
      class: "btn btn-sm btn-success ms-2 float-end",
    },
  ];

  const columns = [
    { label: t("ID"), accessor: "id" },
    { label: t("Name"), accessor: "name" },
    { label: t("Code"), accessor: "code" },
    { label: t("Price"), accessor: "price" },
    { label: t("Unit"), accessor: "unit" },
    { label: t("Tax Amount"), accessor: "taxAmount" },
    { label: t("Tax Type"), accessor: "taxType" },
    { label: t("Code Type"), accessor: "codeType" },
  ];

const data = [
  {
    id: 1,
    name: "Good Product",
    code: "test123",
    price: 100.5,
    unit: "pcs",
    taxAmount: 15.08,
    taxType: "VAT",
    "code Type": "Type A"
  },
  {
    id: 2,
    name: "ازيك عامل اية",
    code: "test456",
    price: 200,
    unit: "kg",
    taxAmount: 30,
    taxType: "GST",
    "code Type": "Type B"
  },
  {
    id: 3,
    name: "Another Item",
    code: "test789",
    price: 50,
    unit: "box",
    taxAmount: 7.5,
    taxType: "VAT",
    "code Type": "Type C"
  }
];


  const handleEdit = (row) => {
    setObjDocType({
       Id: row.id || -1,
      Name: row.name || "",
      Code: row.code || "",
      Price: row.Price || 0,
      Unit: row.Unit || 0,
      TaxAmount: row.TaxAmount || 0,
      TaxType: row.TaxType || "",
      CodeType: row.CodeType || "",
    });

    const modalElement = document.getElementById("EditItem");
    const modal = new Modal(modalElement);
    modal.show();
  };
  const handleShow = (row) => {};
  const handleDelete = (row) => {
    setObjDocType({
      Name: row.name || "",
      Code: row.code || "",
      Price: row.Price || 0,
      Unit: row.Unit || 0,
      TaxAmount: row.TaxAmount || 0,
      TaxType: row.TaxType || "",
      CodeType: row.CodeType || "",
    });

    const modalElement = document.getElementById("DeleteDocumentType");
    const modal = new Modal(modalElement);
    modal.show();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjDocType((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setObjDocType({ 
      
    Name: "",
    Code: "",
    Price: 0,
    Unit: "",
    TaxAmount: 0,
    TaxType: "",
    CodeType: ""
    
    
    });
    // the add request should be here
  };

  const handleUpdate = () => {
    // the add request should be here
  };

  const Delete = () => {
    // the add request should be here
  };

  useEffect(() => {
    const modalIds = ["AddItem", "EditItem", "DeleteDocumentType"];

    const handleHidden = () => {
      // Reset object when any modal is hidden
      setObjDocType({ 
    Name: "",
    Code: "",
    Price: 0,
    Unit: "",
    TaxAmount: 0,
    TaxType: "",
    CodeType: ""
       });
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

   {/* Add Item Modal */}
<div className="modal fade" id="AddItem" tabIndex="-1" aria-hidden="true">
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
        <h5 className="modal-title">{objTitle.AddItem}</h5>
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
        <div className="row">
          <div className="col-md-6 mb-3">
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

          <div className="col-md-6 mb-3">
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

          <div className="col-md-6 mb-3">
            <label className="form-label">{t("Price")}</label>
            <input
              type="number"
              name="Price"
              value={objDocType.Price}
              onChange={handleChange}
              className="form-control"
              placeholder={t("Price")}
              step="0.01"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">{t("Unit")}</label>
            <input
              type="text"
              name="Unit"
              value={objDocType.Unit}
              onChange={handleChange}
              className="form-control"
              placeholder={t("Unit")}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">{t("Tax Amount")}</label>
            <input
              type="number"
              name="TaxAmount"
              value={objDocType.TaxAmount}
              onChange={handleChange}
              className="form-control"
              placeholder={t("Tax Amount")}
              step="0.01"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">{t("Tax Type")}</label>
            <input
              type="text"
              name="TaxType"
              value={objDocType.TaxType}
              onChange={handleChange}
              className="form-control"
              placeholder={t("Tax Type")}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">{t("Code Type")}</label>
            <input
              type="text"
              name="CodeType"
              value={objDocType.CodeType}
              onChange={handleChange}
              className="form-control"
              placeholder={t("Code Type")}
            />
          </div>
        </div>
      </div>

      <div
        className="modal-footer"
        style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}
      >
        <button type="button" className="btn btn-success" onClick={handleSave}>
          {objTitle.Save}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          data-bs-dismiss="modal"
        >
          {objTitle.Cancel}
        </button>
      </div>
    </div>
  </div>
</div>

{/* Edit Item Modal */}
<div className="modal fade" id="EditItem" tabIndex="-1" aria-hidden="true">
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
        <h5 className="modal-title">{objTitle.EditItem}</h5>
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
        <div className="row">
          <div className="col-md-6 mb-3">
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

          <div className="col-md-6 mb-3">
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

          <div className="col-md-6 mb-3">
            <label className="form-label">{t("Price")}</label>
            <input
              type="number"
              name="Price"
              value={objDocType.Price}
              onChange={handleChange}
              className="form-control"
              placeholder={t("Price")}
              step="0.01"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">{t("Unit")}</label>
            <input
              type="text"
              name="Unit"
              value={objDocType.Unit}
              onChange={handleChange}
              className="form-control"
              placeholder={t("Unit")}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">{t("Tax Amount")}</label>
            <input
              type="number"
              name="TaxAmount"
              value={objDocType.TaxAmount}
              onChange={handleChange}
              className="form-control"
              placeholder={t("Tax Amount")}
              step="0.01"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">{t("Tax Type")}</label>
            <input
              type="text"
              name="TaxType"
              value={objDocType.TaxType}
              onChange={handleChange}
              className="form-control"
              placeholder={t("Tax Type")}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">{t("Code Type")}</label>
            <input
              type="text"
              name="CodeType"
              value={objDocType.CodeType}
              onChange={handleChange}
              className="form-control"
              placeholder={t("Code Type")}
            />
          </div>
        </div>
      </div>

      <div
        className="modal-footer"
        style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}
      >
        <button
          type="button"
          className="btn btn-success"
          onClick={handleUpdate}
        >
          {objTitle.Save}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          data-bs-dismiss="modal"
        >
          {objTitle.Cancel}
        </button>
      </div>
    </div>
  </div>
</div>


      <div className="modal fade" id="DeleteDocumentType" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3"  }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.Delete}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">
                X
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <p>{objTitle.DeleteConfirmation} <strong> {objDocType.Name} </strong> {objTitle.QuestionMark}</p>
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

export default Item;
