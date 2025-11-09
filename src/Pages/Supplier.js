import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { Modal } from "bootstrap";
import Pagination from '../Components/Layout/Pagination';

const Supplier = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const objTitle = useMemo(
    () => ({
      AddSupplier: t("Add Supplier"),
      EditSupplier: t("Edit Supplier"),
      ID: t("ID"),
      NationalID: t("National ID"),
      Name: t("Name"),
      AddressLine: t("Address Line 1"),
      TaxNumber: t("Tax Number"),
      FileNumber: t("File Number"),
      PhoneNumber: t("Phone Number"),
      ErrandCode: t("Errand Code"),
      ErrandName: t("Errand Name"),
      IsSupplier: t("Supplier"),
      IsCustomer: t("Customer"),
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

  const [objDocType, setObjDocType] = useState({ NationalID: "", Name: "", AddressLine: "", TaxNumber: "", FileNumber: "", PhoneNumber: "", ErrandCode: "", ErrandName: "", IsSupplier: false, IsCustomer: false });

  const breadcrumbItems = [
    { label: t("Setup"), link: "/Setup", active: false },
    { label: t("Supplier"), active: true },
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      dyalog: "#AddSupplier",
      class: "btn btn-sm btn-success ms-2 float-end",
    },
  ];

  const columns = [
    { label: t("ID"), accessor: "id" },
    { label: t("National ID"), accessor: "NationalID" },
    { label: t("Name"), accessor: "Name" },
    { label: t("Address Line 1"), accessor: "AddressLine" },
    { label: t("Tax Number"), accessor: "TaxNumber" },
    { label: t("File Number"), accessor: "FileNumber" },
    { label: t("Phone Number"), accessor: "PhoneNumber" },
    { label: t("Erand Code"), accessor: "ErrandCode" },
    { label: t("Erand Name"), accessor: "ErrandName" },
    // { label: t("Supplier"), accessor: "IsSupplier" },
    // { label: t("Customer"), accessor: "IsCustomer" },
  ];
  const data = [
    {
      id: 1,
      NationalID: "123456789",
      Name: "Good Supplier",
      AddressLine: "123 Street, City",
      TaxNumber: "TX-987654",
      FileNumber: "FN-12345",
      PhoneNumber: "+1234567890",
      ErrandCode: "E001",
      ErrandName: "Office Supplies",
      IsSupplier: true,
      IsCustomer: false,
    },
    {
      id: 2,
      NationalID: "987654321",
      Name: "علي أحمد",
      AddressLine: "شارع النيل، القاهرة",
      TaxNumber: "TX-123456",
      FileNumber: "FN-54321",
      PhoneNumber: "+0987654321",
      ErrandCode: "E002",
      ErrandName: "السلع الغذائية",
      IsSupplier: true,
      IsCustomer: true,
    },
  ];


  const handleEdit = (row) => {
    setObjDocType({
      Id: row.id || -1,
      NationalID: row.NationalID || "",
      Name: row.Name || "",
      AddressLine: row.AddressLine || "",
      TaxNumber: row.TaxNumber || "",
      FileNumber: row.FileNumber || "",
      PhoneNumber: row.PhoneNumber || "",
      ErrandCode: row.ErrandCode || "",
      ErrandName: row.ErrandName || "",
      IsSupplier: row.IsSupplier || false,
      IsCustomer: row.IsCustomer || false,
    });


    const modalElement = document.getElementById("EditSupplier");
    const modal = new Modal(modalElement);
    modal.show();
  };
  const handleShow = (row) => { };
  const handleDelete = (row) => {
    setObjDocType({
      Id: row.id || -1,
      NationalID: row.NationalID || "",
      Name: row.Name || "",
      AddressLine: row.AddressLine || "",
      TaxNumber: row.TaxNumber || "",
      FileNumber: row.FileNumber || "",
      PhoneNumber: row.PhoneNumber || "",
      ErrandCode: row.ErrandCode || "",
      ErrandName: row.ErrandName || "",
      IsSupplier: row.IsSupplier || false,
      IsCustomer: row.IsCustomer || false,
    });

    const modalElement = document.getElementById("DeleteSupplier");
    const modal = new Modal(modalElement);
    modal.show();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjDocType((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setObjDocType({ Name: "", Code: "" });
    // the add request should be here
  };

  const handleUpdate = () => {
    // the add request should be here
  };

  const Delete = () => {
    // the add request should be here
  };

  useEffect(() => {
    const modalIds = ["AddSupplier", "EditSupplier", "DeleteSupplier"];

    const handleHidden = () => {
      // Reset object when any modal is hidden
      setObjDocType({ NationalID: "", Name: "", AddressLine: "", TaxNumber: "", FileNumber: "", PhoneNumber: "", ErrandCode: "", ErrandName: "", IsCustomer: false, IsSupplier: false  });
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

      <div className="modal fade" id="AddSupplier" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.AddSupplier}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">
                X
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">{objTitle.Name}</label>
                  <input type="text" name="Name" value={objDocType.Name} onChange={handleChange} className="form-control" placeholder={objTitle.Name} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.NationalID}</label>
                  <input type="text" name="NationalID" value={objDocType.NationalID} onChange={handleChange} className="form-control" placeholder={objTitle.NationalID} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                    <label className="form-label">{objTitle.AddressLine}</label>
                  <input type="text" name="AddressLine" value={objDocType.AddressLine} onChange={handleChange} className="form-control" placeholder={objTitle.AddressLine} />
              
                </div>
              </div>
              <div className="row">
                  <div className="col-md-4">
                  <label className="form-label">{objTitle.PhoneNumber}</label>
                  <input type="text" name="PhoneNumber" value={objDocType.PhoneNumber} onChange={handleChange} className="form-control" placeholder={objTitle.PhoneNumber} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">{objTitle.TaxNumber}</label>
                  <input type="text" name="TaxNumber" value={objDocType.TaxNumber} onChange={handleChange} className="form-control" placeholder={objTitle.TaxNumber} />
                </div>

                <div className="col-md-4">
                  <label className="form-label">{objTitle.FileNumber}</label>
                  <input type="text" name="FileNumber" value={objDocType.FileNumber} onChange={handleChange} className="form-control" placeholder={objTitle.FileNumber} />
                </div>
              
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">{objTitle.ErrandCode}</label>
                  <input type="text" name="ErrandCode" value={objDocType.ErrandCode} onChange={handleChange} className="form-control" placeholder={objTitle.ErrandCode} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.ErrandName}</label>
                  <input type="text" name="ErrandName" value={objDocType.ErrandName} onChange={handleChange} className="form-control" placeholder={objTitle.ErrandName} />
                </div>

              </div>


              <div className="row" mt-3>
                <div className="col-md-6 d-flex align-items-center">
                  <input
                    type="checkbox"
                    id="IsSupplier"
                    name="IsSupplier"
                    checked={objDocType.IsSupplier}
                    onChange={(e) =>
                      setObjDocType((prev) => ({
                        ...prev,
                        IsSupplier: e.target.checked,
                      }))
                    }
                    className="form-check-input me-2"
                  />
                  <label htmlFor="IsSupplier"  className="form-label">{objTitle.IsSupplier}</label>
                </div>

                <div className="col-md-6 d-flex align-items-center">

                  <input
                    type="checkbox"
                    id="IsCustomer"
                    name="IsCustomer"
                    checked={objDocType.IsCustomer}
                    onChange={(e) =>
                      setObjDocType((prev) => ({
                        ...prev,
                        IsCustomer: e.target.checked,
                      }))
                    }
                    className="form-check-input me-2"
                  /> 
                  <label htmlFor="IsCustomer"  className="form-label">{objTitle.IsCustomer}</label>
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

      <div className="modal fade" id="EditSupplier" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.EditSupplier}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">
                X
              </button>
            </div>

      <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
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
      <label className="form-label">{objTitle.NationalID}</label>
      <input
        type="text"
        name="NationalID"
        value={objDocType.NationalID}
        onChange={handleChange}
        className="form-control"
        placeholder={objTitle.NationalID}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-12">
      <label className="form-label">{objTitle.AddressLine}</label>
      <input
        type="text"
        name="AddressLine"
        value={objDocType.AddressLine}
        onChange={handleChange}
        className="form-control"
        placeholder={objTitle.AddressLine}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-4">
      <label className="form-label">{objTitle.PhoneNumber}</label>
      <input
        type="text"
        name="PhoneNumber"
        value={objDocType.PhoneNumber}
        onChange={handleChange}
        className="form-control"
        placeholder={objTitle.PhoneNumber}
      />
    </div>

    <div className="col-md-4">
      <label className="form-label">{objTitle.TaxNumber}</label>
      <input
        type="text"
        name="TaxNumber"
        value={objDocType.TaxNumber}
        onChange={handleChange}
        className="form-control"
        placeholder={objTitle.TaxNumber}
      />
    </div>

    <div className="col-md-4">
      <label className="form-label">{objTitle.FileNumber}</label>
      <input
        type="text"
        name="FileNumber"
        value={objDocType.FileNumber}
        onChange={handleChange}
        className="form-control"
        placeholder={objTitle.FileNumber}
      />
    </div>
  </div>

  <div className="row">
    <div className="col-md-6">
      <label className="form-label">{objTitle.ErrandCode}</label>
      <input
        type="text"
        name="ErrandCode"
        value={objDocType.ErrandCode}
        onChange={handleChange}
        className="form-control"
        placeholder={objTitle.ErrandCode}
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">{objTitle.ErrandName}</label>
      <input
        type="text"
        name="ErrandName"
        value={objDocType.ErrandName}
        onChange={handleChange}
        className="form-control"
        placeholder={objTitle.ErrandName}
      />
    </div>
  </div>

  <div className="row mt-3">
    <div className="col-md-6 d-flex align-items-center">
      <input
        type="checkbox"
        id="IsSupplier"
        name="IsSupplier"
        checked={objDocType.IsSupplier}
        onChange={(e) =>
          setObjDocType((prev) => ({ ...prev, IsSupplier: e.target.checked }))
        }
        className="form-check-input me-2"
      />
      <label htmlFor="IsSupplier" className="form-label">{objTitle.IsSupplier}</label>
    </div>

    <div className="col-md-6 d-flex align-items-center">
      <input
        type="checkbox"
        id="IsCustomer"
        name="IsCustomer"
        checked={objDocType.IsCustomer}
        onChange={(e) =>
          setObjDocType((prev) => ({ ...prev, IsCustomer: e.target.checked }))
        }
        className="form-check-input me-2"
      />
      <label htmlFor="IsCustomer" className="form-label">{objTitle.IsCustomer}</label>
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

      <div className="modal fade" id="DeleteSupplier" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
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

export default Supplier;
