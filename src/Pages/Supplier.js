import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { Modal } from "bootstrap";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import { useSwal } from "../Hooks/Alert/Swal";

const Supplier = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const objTitle = useMemo(
    () => ({
      AddSupplier: t("Add Supplier"),
      EditSupplier: t("Edit Supplier"),
      ID: t("ID"),
      NationalID: t("National ID"),
      Name: t("Name"),
      AddressLine: t("Address Line 1"),
      TaxNumber: t("Tax Number"),
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

  const [objDocType, setObjDocType] = useState({ NationalID: "", Name: "", Address: "", TaxNumber: "", IsSupplier: true, IsCustomer: false });
  const { showSuccess, showError, showDeleteConfirmation, SwalComponent } = useSwal();
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
    { label: t("National ID"), accessor: "identificationNumber" },
    { label: t("Name"), accessor: "Name" },
    { label: t("Tax Number"), accessor: "taxRegistrationNumber" },
    { label: t("Address"), accessor: "Address" }

    // { label: t("Customer"), accessor: "IsCustomer" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!objDocType.Name || objDocType.Name.trim() === "") {
      newErrors.Name = "Name is required";
    }

    if (!objDocType.NationalID || objDocType.NationalID.trim() === "") {
      newErrors.NationalID = "National ID or Passport is required";
    }

    // Check both AddressLine (for Add) and Address (for Edit)
    const address = objDocType.AddressLine || objDocType.Address;
    if (!address || address.trim() === "") {
      newErrors.Address = "Address is required";
    }

    if (!objDocType.TaxNumber || objDocType.TaxNumber.trim() === "") {
      newErrors.TaxNumber = "Tax Number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchSuppliers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("CustomerSupplier/ListAll", { pageNumber: page, pageSize: pageSize });
      const data = res.data;

      if (data.result) {
        // Filter to only show suppliers (where isSupplier is true)
        const suppliersList = data.data.filter(item => item.isSupplier === true);
        setSuppliers(suppliersList);
        setTotalCount(suppliersList.length);
        setPageNumber(page);
      }
    } catch (e) {
      setError("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };
  const mappedSuppliers = suppliers.map(s => ({
    ...s,
    updatedByUserName: s.updatedByUser ? s.updatedByUser.userName : ""
  }));

  // وتستخدم accessor جديد للـ Table
  const columnsUpdated = [
    ...columns,
    { label: "Updated By", accessor: "updatedByUserName" }
  ]



  const handleEdit = (row) => {
    setObjDocType({
      Id: row.id,
      Name: row.name,
      NationalID: row.identificationNumber,
      PassportNumber: row.passportNumber,
      TaxNumber: row.taxRegistrationNumber,
      Address: row.address,
      IsCustomer: row.isCustomer,
      IsSupplier: row.isSupplier
    });

    const modalEl = document.getElementById("EditSupplier");
    const modal = new Modal(modalEl);
    modal.show();
  };
  const handleShow = (row) => { };
  const handleDelete = (row) => {
    setObjDocType({
      Id: row.id,
      NationalID: row.nationalId || "",
      Name: row.name || "",
      Address: row.address || "",
      TaxNumber: row.taxRegistrationNumber || "",
      IsSupplier: row.isSupplier || false,
      IsCustomer: row.isCustomer || false,
    });

    const modalElement = document.getElementById("DeleteSupplier");
    const modal = new Modal(modalElement);
    modal.show();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjDocType((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        IdentificationNumber: objDocType.NationalID,
        Name: objDocType.Name,
        Address: objDocType.AddressLine,
        TaxRegistrationNumber: objDocType.TaxNumber,
        isSupplier: true,
        isCustomer: objDocType.IsCustomer || false
      };

      const response = await axiosInstance.post("CustomerSupplier/Add", payload);
      console.log("Add response:", response.data);

      if (response.status === 200) {
        // Reset form
        setObjDocType({
          NationalID: "",
          Name: "",
          Address: "",
          TaxNumber: "",
          AddressLine: "",
          IsSupplier: true,
          IsCustomer: false
        });

        hideModal("AddSupplier");
        fetchSuppliers(pageNumber);
        showSuccess("Success", "Supplier added successfully!");


      } else {
        showError("Error", response.data?.message || "Failed to add Supplier");
      }
    } catch (error) {
      console.error("Failed to add supplier", error);
      showError("Error", error.response?.data?.message || "Failed to add Supplier");
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        Id: objDocType.Id,
        Name: objDocType.Name,
        IdentificationNumber: objDocType.NationalID,
        TaxRegistrationNumber: objDocType.TaxNumber,
        Address: objDocType.Address,
        IsCustomer: objDocType.IsCustomer,
        IsSupplier: objDocType.IsSupplier
      };

      console.log("Sending update payload:", payload);

      const response = await axiosInstance.put(
        "CustomerSupplier/" + objDocType.Id,
        payload
      );

      console.log("Update response:", response.data);

      setObjDocType({
        Id: null,
        Name: "",
        NationalID: "",
        PassportNumber: "",
        TaxNumber: "",
        Address: "",
        IsCustomer: false,
        IsSupplier: true
      });
      hideModal("EditSupplier");
      await fetchSuppliers(pageNumber);
      showSuccess("Success", "Supplier updated successfully!");

    } catch (error) {
      console.log(error);
      showError("Error", "Failed to update supplier");
    }
  };


  const Delete = async () => {
    try {
      const response = await axiosInstance.delete(`CustomerSupplier/${objDocType.Id}`);

      if (response.status === 200 || response.status === 204) {
        console.log("Supplier deleted successfully");
        showSuccess("Success", "Supplier deleted successfully!");
        hideModal("DeleteSupplier");
        await fetchSuppliers(pageNumber);
      }
    } catch (error) {
      console.error("Failed to delete supplier", error);
      showError("Error", "Failed to delete supplier");
    }
  };
  const hideModal = (strModalId) => {
    const modal = Modal.getInstance(document.getElementById(strModalId));
    if (modal) {
      modal.hide();
    }
    const backdrops = document.querySelectorAll(".modal-backdrop.fade.show");
    backdrops.forEach(b => b.remove());
  }
// Reset object when any modal is hidden
  useEffect(() => {
    fetchSuppliers(pageNumber);
    const modalIds = ["AddSupplier", "EditSupplier", "DeleteSupplier"];

    const handleHidden = () => {
      // Reset object when any modal is hidden
      setObjDocType({ NationalID: "", Name: "", AddressLine: "", TaxNumber: "", IsCustomer: false, IsSupplier: true });
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
  }, [pageNumber]);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      <Table
        columns={columnsUpdated}
        data={mappedSuppliers}
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
                  <input type="text" name="Name" value={objDocType.Name} onChange={handleChange} className={`form-control ${errors.Name ? "is-invalid" : ""}`} placeholder={objTitle.Name} />
                  {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.NationalID}</label>
                  <input type="text" name="NationalID" value={objDocType.NationalID} onChange={handleChange} className={`form-control ${errors.NationalID ? "is-invalid" : ""}`} placeholder={objTitle.NationalID} />
                  {errors.NationalID && <div className="invalid-feedback">{errors.NationalID}</div>}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <label className="form-label">{objTitle.AddressLine}</label>
                  <input type="text" name="AddressLine" value={objDocType.AddressLine} onChange={handleChange} className={`form-control ${errors.Address ? "is-invalid" : ""}`} placeholder={objTitle.AddressLine} />
                  {errors.Address && <div className="invalid-feedback">{errors.Address}</div>}
                </div>
              </div>
              <div className="row">

                <div className="col-md-4">
                  <label className="form-label">{objTitle.TaxNumber}</label>
                  <input type="text" name="TaxNumber" value={objDocType.TaxNumber} onChange={handleChange} className={`form-control ${errors.TaxNumber ? "is-invalid" : ""}`} placeholder={objTitle.TaxNumber} />
                  {errors.TaxNumber && <div className="invalid-feedback">{errors.TaxNumber}</div>}
                </div>



              </div>
              <div className="row">



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
                  <label htmlFor="IsSupplier" className="form-label">{objTitle.IsSupplier}</label>
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
                  <label htmlFor="IsCustomer" className="form-label">{objTitle.IsCustomer}</label>
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
                    className={`form-control ${errors.Name ? "is-invalid" : ""}`}
                    placeholder={objTitle.Name}
                  />
                  {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.NationalID}</label>
                  <input
                    type="text"
                    name="NationalID"
                    value={objDocType.NationalID}
                    onChange={handleChange}
                    className={`form-control ${errors.NationalID ? "is-invalid" : ""}`}
                    placeholder={objTitle.NationalID}
                  />
                  {errors.NationalID && <div className="invalid-feedback">{errors.NationalID}</div>}
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <label className="form-label">{objTitle.AddressLine}</label>
                  <input
                    type="text"
                    name="Address"
                    value={objDocType.Address}
                    onChange={handleChange}
                    className={`form-control ${errors.Address ? "is-invalid" : ""}`}
                    placeholder={objTitle.AddressLine}
                  />
                  {errors.Address && <div className="invalid-feedback">{errors.Address}</div>}
                </div>
              </div>

              <div className="row">

                <div className="col-md-4">
                  <label className="form-label">{objTitle.TaxNumber}</label>
                  <input
                    type="text"
                    name="TaxNumber"
                    value={objDocType.TaxNumber}
                    onChange={handleChange}
                    className={`form-control ${errors.TaxNumber ? "is-invalid" : ""}`}
                    placeholder={objTitle.TaxNumber}
                  />
                  {errors.TaxNumber && <div className="invalid-feedback">{errors.TaxNumber}</div>}
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
      <SwalComponent />
    </>
  );
};

export default Supplier;
