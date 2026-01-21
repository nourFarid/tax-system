import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
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
    showModal("EditTaxType");
  };

  const handleShow = (row) => { };

  const handleDelete = (row) => {
    setObjDocType({
      Name: row.name || "",
      Code: row.code || "",
      Id: row.id || -1,
      IsPurchase: row.IsPurchase || false,
      IsSales: row.IsSales || false,
    });
    showModal("DeleteTaxType");
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

  const reset = () => {
    setObjDocType({ Name: "", Code: "", IsSales: false, IsPurchase: false });
  };

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

      {/* Add Tax Type Modal */}
      <Modal
        id="AddTaxType"
        title={objTitle.AddTaxType}
        size="lg"
        onSave={handleSave}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
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
      </Modal>

      {/* Edit Tax Type Modal */}
      <Modal
        id="EditTaxType"
        title={objTitle.EditTaxType}
        size="lg"
        onSave={handleUpdate}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
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
      </Modal>

      {/* Delete Tax Type Modal */}
      <Modal
        id="DeleteTaxType"
        title={objTitle.Delete}
        size="lg"
        onSave={Delete}
        onHide={reset}
        saveLabel={objTitle.Delete}
        cancelLabel={objTitle.Cancel}
        saveButtonClass="btn btn-danger"
        cancelButtonClass="btn btn-primary"
      >
        <p>
          {objTitle.DeleteConfirmation} <strong>{objDocType.Name}</strong>{" "}
          {objTitle.QuestionMark}
        </p>
      </Modal>
    </>
  );
};

export default TaxType;
