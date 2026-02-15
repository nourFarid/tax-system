import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { useSwal } from "../Hooks/Alert/Swal";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import Spinner from "../Components/Layout/Spinner";
import { toast, ToastContainer } from "react-toastify";

const Item = () => {
  const { t } = useTranslate();
  const [items, setItems] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const objTitle = useMemo(
    () => ({
      AddItem: t("Add Item"),
      EditItem: t("Edit Item"),
      Name: t("Name"),
      Save: t("Save"),
      Cancel: t("Cancel"),
      Delete: t("Delete"),
      DeleteConfirmation: t("Are you sure to delete"),
      QuestionMark: t("?"),
      Filter: t("Filter"),
      Reset: t("Reset"),
      Code: t('Code')
    }),
    [t]
  );
  const [objItem, setObjItem] = useState({
    Name: "",
    Price: 0,
    Code: ""
  });
  const { showSuccess, showError, showDeleteConfirmation, SwalComponent } = useSwal();
  const validateDuplicates = (name, code, id = null) => {
    let newErrors = { Name: "", Code: "" };
    let hasError = false;

    // Trim & lowercase comparison
    const nameExists = items.some(
      item => item.name.trim().toLowerCase() === name.trim().toLowerCase() && item.id !== id
    );
    if (nameExists) {
      newErrors.Name = "This name already exists";
      hasError = true;
    }

    const codeExists = items.some(
      item => item.code.trim().toLowerCase() === code.trim().toLowerCase() && item.id !== id
    );
    if (codeExists) {
      newErrors.Code = "This code already exists";
      hasError = true;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return !hasError;
  };


  const breadcrumbItems = [
    { label: t("Setup"), link: "/Setup", active: false },
    { label: t("Items"), active: true },
  ];
  const handleAddClick = () => {
    setObjItem({
      Name: "",
      Price: 0,
      Code: ""
    });
    setErrors({});
    setTouched({});
  };

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      dyalog: "#AddItem",
      class: "btn btn-sm btn-success ms-2 float-end",
      onClick: handleAddClick,
    },
  ];

  const columns = [
    { label: t("Code"), accessor: "code" },
    { label: t("Name"), accessor: "name" },
    { label: t("Price"), accessor: "price" },
    { label: t("Updated At"), accessor: "updateAt" },
    { label: t("Created At"), accessor: "createdAt" },
    { label: t("Updated By"), accessor: "updatedByUser.userName" },
  ];

  const fetchItems = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("Item/List", { pageNumber: page, pageSize });
      const data = res.data;
      if (data.result) {
        setItems(data.data.items);
        setTotalCount(data.data.totalCount);
        setPageNumber(data.data.pageNumber);
      }
    } catch (e) {
      setError("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!objItem.Name || objItem.Name.trim() === "") {
      newErrors.Name = "Name is required";
    }

    if (!objItem.Code || objItem.Code.trim() === "") {
      newErrors.Code = "Code is required";
    }

    if (objItem.Price === "" || objItem.Price === null || isNaN(objItem.Price)) {
      newErrors.Price = "Price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleEdit = (row) => {
    setObjItem({
      Id: row.id || -1,
      Name: row.name || "",
      Price: row.price || 0,
      Code: row.code || ""
    });
    showModal("EditItem");
  };
  const handleDelete = (row) => {
    setObjItem({
      Id: row.id || null,
      Name: row.name || "",
      Price: row.price || 0,
      Code: row.code || ""
    });
    showModal("DeleteItem");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Price" && Number(value) < 0) return;
    setObjItem((prev) => ({ ...prev, [name]: value }));
    const updated = { ...objItem, [name]: value };
    setObjItem(updated);

    // live duplicate check
    validateDuplicates(updated.Name, updated.Code, updated.Id);
  };


  const update = async () => {
    if (!validateForm()) return;
    if (!validateDuplicates(objItem.Name, objItem.Code, objItem.Id)) return;
    try {
      const payload = {
        Id: objItem.Id,
        Name: objItem.Name,
        Price: Number(objItem.Price),
        Code: objItem.Code,
      };
      const response = await axiosInstance.put("Item/Update", payload);
      if (response.data.result === true) {
        reset();
        hideModal("EditItem");
        await fetchItems(pageNumber);
        toast.success(t("Item updated successfully!"));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(t("Failed to update item"));
    }
  };


  const Delete = async () => {
    try {
      const response = await axiosInstance.delete(`Item/${objItem.Id}`);
      if (response.data.result === true) {
        reset();
        hideModal("DeleteItem");
        await fetchItems(pageNumber);
        toast.success(t("Item deleted successfully!"));
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(t("Failed to delete item"));
    }
  };



  const save = async () => {
    if (!validateForm()) return;
    if (!validateDuplicates(objItem.Name, objItem.Code)) return;
    try {
      const payload = {
        Name: objItem.Name,
        Price: Number(objItem.Price),
        Code: objItem.Code
      };
      const response = await axiosInstance.post("Item/Add", payload);
      if (response.data.result === true) {
        reset();
        hideModal("AddItem");
        fetchItems(pageNumber)
        toast.success(t("Item added successfully!"));
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(t("Failed to add item!"));
    }
  };

  const reset = () => {
    setObjItem({
      Name: "",
      Price: 0,
      Id: null,
      Code: ""
    });
  }

  useEffect(() => {
    fetchItems(pageNumber)
  }, [pageNumber]);

  if (error) return <p>{error}</p>;
  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      <Table
        columns={columns}
        data={items}
        showActions={true}
        onEdit={handleEdit}
        showShow={false}
        onShow={() => { }}
        onDelete={handleDelete}
      />
      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRows={totalCount}
        onPageChange={setPageNumber}
      />

      {/* Add Item Modal */}
      <Modal
        id="AddItem"
        title={objTitle.AddItem}
        size="lg"
        onSave={save}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
      >
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">{objTitle.Name}</label>
            <input
              type="text"
              name="Name"
              value={objItem.Name}
              onChange={handleChange}
              className={`form-control ${errors.Name ? "is-invalid" : ""}`}
              placeholder={objTitle.Name}
            />
            {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">{objTitle.Code}</label>
            <input
              type="text"
              name="Code"
              value={objItem.Code}
              onChange={handleChange}
              className={`form-control ${errors.Code ? "is-invalid" : ""}`}
              placeholder={objTitle.Code}
            />
            {errors.Code && <div className="invalid-feedback">{errors.Code}</div>}
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">{t("Price")}</label>
            <input
              type="number"
              name="Price"
              value={objItem.Price}
              onChange={handleChange}
              className={`form-control ${errors.Price ? "is-invalid" : ""}`}
              placeholder={t("Price")}
              step="0.01"
              min="0"
            />
            {errors.Price && <div className="invalid-feedback">{errors.Price}</div>}
          </div>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        id="EditItem"
        title={objTitle.EditItem}
        size="lg"
        onSave={update}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
      >
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">{objTitle.Name}</label>
            <input
              type="text"
              name="Name"
              value={objItem.Name}
              onChange={handleChange}
              className={`form-control ${errors.Name ? "is-invalid" : ""}`}
              placeholder={objTitle.Name}
            />
            {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">{objTitle.Code}</label>
            <input
              type="text"
              name="Code"
              value={objItem.Code}
              onChange={handleChange}
              className={`form-control ${errors.Code ? "is-invalid" : ""}`}
              placeholder={objTitle.Code}
            />
            {errors.Code && <div className="invalid-feedback">{errors.Code}</div>}
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">{t("Price")}</label>
            <input
              type="number"
              name="Price"
              value={objItem.Price}
              onChange={handleChange}
              className={`form-control ${errors.Price ? "is-invalid" : ""}`}
              placeholder={t("Price")}
              step="0.01"
              min="0"
            />
            {errors.Price && <div className="invalid-feedback">{errors.Price}</div>}
          </div>
        </div>
      </Modal>

      {/* Delete Item Modal */}
      <Modal
        id="DeleteItem"
        title={objTitle.Delete}
        size="lg"
        onSave={Delete}
        onHide={reset}
        saveLabel={objTitle.Delete}
        cancelLabel={objTitle.Cancel}
        saveButtonClass="btn btn-danger"
        cancelButtonClass="btn btn-primary"
      >
        <p>{objTitle.DeleteConfirmation} <strong> {objItem.Name} </strong> {objTitle.QuestionMark}</p>
      </Modal>

      <ToastContainer />
      <SwalComponent />

      {loading && <Spinner></Spinner>}
    </>
  );
};

export default Item;
