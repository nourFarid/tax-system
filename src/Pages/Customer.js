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

const Customer = () => {
  const roles = getUserRoles();
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const objTitle = useMemo(
    () => ({
      AddCustomer: t("Add Customer"),
      EditCustomer: t("Edit Customer"),
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

  const [objDocType, setObjDocType] = useState({ NationalID: "", Name: "", Address: "", TaxNumber: "", PhoneNumber: "", IsSupplier: false, IsCustomer: true });
  const { showSuccess, showError, showDeleteConfirmation } = useSwal();

  const breadcrumbItems = [
    { label: t("Setup"), link: "/Setup", active: false },
    { label: t("Customer"), active: true },
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      dyalog: "#AddCustomer",
      class: "btn btn-sm btn-success ms-2 float-end",
    },
  ];

  const columns = [
    { label: t("ID"), accessor: "id" },
    { label: t("National ID"), accessor: "identificationNumber" },
    { label: t("Name"), accessor: "Name" },
    { label: t("Tax Number"), accessor: "taxRegistrationNumber" },
    { label: t("Address"), accessor: "Address" },
    { label: t("Phone Number"), accessor: "phoneNumber" },
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


  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("CustomerSupplier/List", {
        Filter: { IsCustomer: true },
        PageNumber: page,
        PageSize: pageSize
      });
      const data = res.data;

      if (data.result) {
        setCustomers(data.data.items || []);
        setTotalCount(data.data.totalCount || 0);
        setPageNumber(page);
      }
    } catch (e) {
      setError("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const mappedCustomers = (customers || []).map(c => ({
    ...c,
    updatedByUserName: c.updatedByUser ? c.updatedByUser.userName : ""
  }));

  const columnsUpdated = [
    ...columns,
    { label: "Updated By", accessor: "updatedByUserName" }
  ];

  const handleEdit = (row) => {
    setObjDocType({
      Id: row.id,
      Name: row.name,
      NationalID: row.identificationNumber,
      TaxNumber: row.taxRegistrationNumber,
      PhoneNumber: row.phoneNumber || "",
      Address: row.address,
      IsCustomer: row.isCustomer,
      IsSupplier: row.isSupplier
    });
    showModal("EditCustomer");
  };
  const handleShow = (row) => {
  };
  const handleDelete = (row) => {
    setObjDocType({
      Id: row.id,
      IdentificationNumber: row.nationalId || "",
      Name: row.name || "",
      Address: row.address || "",
      TaxNumber: row.taxRegistrationNumber || "",
      IsSupplier: row.isSupplier || false,
      IsCustomer: row.isCustomer || false,
    });
    showModal("DeleteCustomer");
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
        isSupplier: objDocType.IsSupplier || false,
        isCustomer: true
      };
      const response = await axiosInstance.post("CustomerSupplier/Add", payload);
      if (response.data.result == false) {
        toast.error(response.data.message);
        return;
      }
      reset();
      hideModal("AddCustomer");
      await fetchCustomers(pageNumber);
      toast.success(t("Customer added successfully!"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add Customer");
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        Id: objDocType.Id,
        Name: objDocType.Name,
        IdentificationNumber: objDocType.NationalID,
        PassportNumber: objDocType.PassportNumber,
        TaxRegistrationNumber: objDocType.TaxNumber,
        PhoneNumber: objDocType.PhoneNumber,
        Address: objDocType.Address,
        IsCustomer: objDocType.IsCustomer,
        IsSupplier: objDocType.IsSupplier
      };

      const response = await axiosInstance.put("CustomerSupplier/Update", payload);
      if (response.data.result == false) {
        toast.error(response.data.message);
        return;
      }
      reset();
      hideModal("EditCustomer");
      await fetchCustomers(pageNumber);
      toast.success(t("Customer updated successfully!"));

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update customer");
    }
  };

  const Delete = async () => {
    try {
      const response = await axiosInstance.delete(`CustomerSupplier/${objDocType.Id}`);

      if (response?.data?.result === true) {
        console.log("Customer deleted successfully");

        toast.success(t("Customer deleted successfully!"));
        hideModal("DeleteCustomer");
          
        reset();
      } else {
        toast.error(t("Failed to delete customer"));
      }
    } catch (error) {
      console.error("Failed to delete customer", error);
      toast.error(error.response?.data?.message || "Failed to delete customer");
    }
  };
  const MarkValid = async (row) => {
    try {
      const res = await axiosInstance.put(
        `CustomerSupplier/Verify/${row.id}`
      );

      if (res.data.result) {
        toast.success(res.data.message);
        await fetchCustomers(pageNumber);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(t("Something went wrong"));
    }
  };

  const reset = () => {
    setObjDocType({ NationalID: "", Name: "", AddressLine: "", TaxNumber: "", PhoneNumber: "", IsCustomer: false, IsSupplier: false });
    setErrors({});
  };

  useEffect(() => {
    fetchCustomers(pageNumber);
  }, [pageNumber]);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      <Table
        columns={columnsUpdated}
        data={mappedCustomers}
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

      {/* Add Customer Modal */}
      <Modal
        id="AddCustomer"
        title={objTitle.AddCustomer}
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
              id="AddIsCustomer"
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

          <div className="col-md-6 d-flex align-items-center">
            <Checkbox
              id="AddIsSupplier"
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
        </div>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        id="EditCustomer"
        title={objTitle.EditCustomer}
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
              id="EditIsCustomer"
              name="IsCustomer"
              checked={objDocType.IsCustomer}
              onChange={(e) =>
                setObjDocType((prev) => ({ ...prev, IsCustomer: e.target.checked }))
              }
              label={objTitle.IsCustomer}
            />
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <Checkbox
              id="EditIsSupplier"
              name="IsSupplier"
              checked={objDocType.IsSupplier}
              onChange={(e) =>
                setObjDocType((prev) => ({ ...prev, IsSupplier: e.target.checked }))
              }
              label={objTitle.IsSupplier}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Customer Modal */}
      <Modal
        id="DeleteCustomer"
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

export default Customer;
