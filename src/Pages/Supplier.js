import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import Checkbox from "../Components/Layout/Checkbox";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import { useSwal } from "../Hooks/Alert/Swal";
import { toast, ToastContainer } from "react-toastify";
import { getUserRoles } from "../Hooks/Services/Storage.js"

const Supplier = () => {
  const roles = getUserRoles();
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(30);
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
      PhoneNumber: t("Phone Number"),
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

  const [objDocType, setObjDocType] = useState({ NationalID: "", Name: "", Address: "", TaxNumber: "", PhoneNumber: "", IsSupplier: true, IsCustomer: false });
  const { showSuccess, showError, showDeleteConfirmation } = useSwal();
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
    { label: t("Phone Number"), accessor: "phoneNumber" },
    { label: t("Address"), accessor: "Address" }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!objDocType.Name || objDocType.Name.trim() === "") {
      newErrors.Name = "Name is required";
    }

    const hasNationalId =
      objDocType.NationalID && objDocType.NationalID.trim() !== "";

    const hasTaxNumber =
      objDocType.TaxNumber && objDocType.TaxNumber.trim() !== "";

    if (!hasNationalId && !hasTaxNumber) {
      newErrors.NationalID = "National ID or Passport is required if Tax Number is empty";
      newErrors.TaxNumber = "Tax Number is required if National ID is empty";
    }
    // if (hasTaxNumber && objDocType.TaxNumber.length > 50) {
    //   newErrors.TaxNumber = "Tax Number must not exceed 50 characters";
    // }

    const address = objDocType.AddressLine || objDocType.Address;
    if (!address || address.trim() === "") {
      newErrors.Address = "Address is required";
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
      PhoneNumber: row.phoneNumber || "",
      Address: row.address,
      IsCustomer: row.isCustomer,
      IsSupplier: row.isSupplier
    });
    showModal("EditSupplier");
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
    showModal("DeleteSupplier");
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
        PhoneNumber: objDocType.PhoneNumber,
        isSupplier: true,
        isCustomer: objDocType.IsCustomer || false
      };

      const response = await axiosInstance.post("CustomerSupplier/Add", payload);
      if (response.data.result == false) {
        toast.error(response.data.message);
        return;
      }
      reset();
      hideModal("AddSupplier");
      fetchSuppliers(pageNumber);
      toast.success(t("Supplier added successfully!"));
    } catch (error) {
      console.error("Failed to add supplier", error);
      toast.error(error.response?.data?.message || "Failed to add Supplier");
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
        PhoneNumber: objDocType.PhoneNumber,
        Address: objDocType.Address,
        IsCustomer: objDocType.IsCustomer,
        IsSupplier: objDocType.IsSupplier
      };

      console.log("Sending update payload:", payload);

      const response = await axiosInstance.put("CustomerSupplier/Update", payload);

      if (response.data.result == false) {
        toast.error(response.data.message);
        return;
      }

      reset();
      hideModal("EditSupplier");
      await fetchSuppliers(pageNumber);
      toast.success(t("Supplier updated successfully!"));

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update supplier");
    }
  };


  const Delete = async () => {
    try {
      const response = await axiosInstance.delete(`CustomerSupplier/${objDocType.Id}`);

      if (response.data.result == false) {
        toast.error(response.data.message);
        return;
      }
      reset();
      toast.success(t("Supplier deleted successfully!"));
      hideModal("DeleteSupplier");
      await fetchSuppliers(pageNumber);
    } catch (error) {
      console.error("Failed to delete supplier", error);
      toast.error(error.response?.data?.message || "Failed to delete supplier");
    }
  };
  const MarkValid = async (row) => {
    try {
      const res = await axiosInstance.put(
        `CustomerSupplier/Verify/${row.id}`
      );

      if (res.data.result) {
        toast.success(res.data.message);
        await fetchSuppliers(pageNumber);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(t("Something went wrong"));
    }
  };

  const reset = () => {
    setObjDocType({ NationalID: "", Name: "", AddressLine: "", TaxNumber: "", PhoneNumber: "", IsCustomer: false, IsSupplier: true });
  };

  useEffect(() => {
    fetchSuppliers(pageNumber);
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
        highLight={roles.includes("Admin")}
        highLightKey="isValid"
        customActions={
            roles.includes("Admin")
              ? (row) => (
                <>
                  {!row.isValid && (
                    <button className="btn btn-success btn-sm" onClick={() => MarkValid(row)} title={t("Mark as Valid")}>
                      <i className="bi bi-check2"></i>
                    </button>
                  )}
                </>
              )
              : undefined}
      />
      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRows={totalCount}
        onPageChange={setPageNumber}
      />

      {/* Add Supplier Modal */}
      <Modal
        id="AddSupplier"
        title={objTitle.AddSupplier}
        size="lg"
        onSave={handleSave}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
      >
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
          <div className="col-md-6">
            <label className="form-label">{objTitle.TaxNumber}</label>
            <input type="text" name="TaxNumber" value={objDocType.TaxNumber} onChange={handleChange} className={`form-control ${errors.TaxNumber ? "is-invalid" : ""}`} placeholder={objTitle.TaxNumber} maxLength={50} />
            {errors.TaxNumber && <div className="invalid-feedback">{errors.TaxNumber}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">{objTitle.PhoneNumber}</label>
            <input type="text" name="PhoneNumber" value={objDocType.PhoneNumber} onChange={handleChange} className="form-control" placeholder={objTitle.PhoneNumber} />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 d-flex align-items-center">
            <Checkbox
              id="IsSupplier"
              name="IsSupplier"
              checked={objDocType.IsSupplier}
              onChange={(e) =>
                setObjDocType((prev) => ({
                  ...prev,
                  IsSupplier: e.target.checked,
                }))
              }
              label={objTitle.IsSupplier}
            />
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <Checkbox
              id="IsCustomer"
              name="IsCustomer"
              checked={objDocType.IsCustomer}
              onChange={(e) =>
                setObjDocType((prev) => ({
                  ...prev,
                  IsCustomer: e.target.checked,
                }))
              }
              label={objTitle.IsCustomer}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal
        id="EditSupplier"
        title={objTitle.EditSupplier}
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
          <div className="col-md-6">
            <label className="form-label">{objTitle.TaxNumber}</label>
            <input
              type="text"
              name="TaxNumber"
              value={objDocType.TaxNumber}
              onChange={handleChange}
              className={`form-control ${errors.TaxNumber ? "is-invalid" : ""}`}
              placeholder={objTitle.TaxNumber}
              maxLength={50}
            />
            {errors.TaxNumber && <div className="invalid-feedback">{errors.TaxNumber}</div>}
          </div>
          <div className="col-md-6">
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
        </div>

        <div className="row mt-3">
          <div className="col-md-6 d-flex align-items-center">
            <Checkbox
              id="IsSupplierEdit"
              name="IsSupplier"
              checked={objDocType.IsSupplier}
              onChange={(e) =>
                setObjDocType((prev) => ({ ...prev, IsSupplier: e.target.checked }))
              }
              label={objTitle.IsSupplier}
            />
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <Checkbox
              id="IsCustomerEdit"
              name="IsCustomer"
              checked={objDocType.IsCustomer}
              onChange={(e) =>
                setObjDocType((prev) => ({ ...prev, IsCustomer: e.target.checked }))
              }
              label={objTitle.IsCustomer}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Supplier Modal */}
      <Modal
        id="DeleteSupplier"
        title={objTitle.Delete}
        size="lg"
        onSave={Delete}
        onHide={reset}
        saveLabel={objTitle.Delete}
        cancelLabel={objTitle.Cancel}
        saveButtonClass="btn btn-danger"
        cancelButtonClass="btn btn-primary"
      >
        <p>{objTitle.DeleteConfirmation} <strong> {objDocType.Name} </strong> {objTitle.QuestionMark}</p>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default Supplier;
