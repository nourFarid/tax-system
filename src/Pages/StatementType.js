import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import { useSwal } from "../Hooks/Alert/Swal";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import Spinner from "../Components/Layout/Spinner";
import { toast, ToastContainer } from "react-toastify";
import Switch from "../Components/Layout/Switch";


const StatementType = () => {
  const { t } = useTranslate();
  const [items, setItems] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState(null);
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
      Code: t('Code'),
      Active: t("Active"),
      Inactive: t("Inactive"),
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

    // Check duplicate name
    const nameExists = items.some(
      item => item.name.toLowerCase() === name.toLowerCase() && item.id !== id
    );
    if (nameExists) {
      newErrors.Name = "This name already exists";
      hasError = true;
    }

    // Check duplicate code
    const codeExists = items.some(
      item => item.code.toLowerCase() === code.toLowerCase() && item.id !== id
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
    { label: t("Statement Type"), active: true },
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
      onClick: handleAddClick
    },
  ];

  const columns = [
    { label: t("Id"), accessor: "id" },
    { label: t("Name"), accessor: "name" },
    { label: t("Code"), accessor: "code" },
    {
      label: t("Status"),
      accessor: "isActive",
      render: (value) => (
        <span className={`badge ${value ? 'bg-success' : 'bg-danger'}`}>
          {value ? objTitle.Active : objTitle.Inactive}
        </span>
      )
    },
  ];

  const fetchItems = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("StatementType/ListAll", { pageNumber: page, pageSize: pageSize });
      const data = res.data;

      if (data.result) {
        const itemsList = data.data;
        // Map isDeleted to isActive if needed
        const mappedItems = itemsList.map(item => ({
          ...item,
          isActive: item.isActive !== undefined ? item.isActive : !item.isDeleted
        }));
        setItems(mappedItems);
        setTotalCount(mappedItems.length);
        setPageNumber(page);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleEdit = (row) => {
    setObjItem({
      Id: row.id || -1,
      Name: row.name || "",
      Code: row.code || ""
    });
    showModal("EditItem");
  };
  const handleDelete = (row) => {
    setObjItem({
      Id: row.id || null,
      Name: row.name || "",
      Code: row.code || ""
    });
    showModal("DeleteItem");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjItem((prev) => ({ ...prev, [name]: value }));
    const updated = { ...objItem, [name]: value };
    setObjItem(updated);
    validateDuplicates(updated.Name, updated.Code, updated.Id);
  };


  const update = async () => {
    if (!validateForm()) return;
    if (!validateDuplicates(objItem.Name, objItem.Code, objItem.Id)) return;
    try {
      const payload = {
        id: objItem.Id,
        name: objItem.Name,
        code: objItem.Code,

      };
      const response = await axiosInstance.put("StatementType/Update", payload);
      console.log("Update response:", response);

      setObjItem({
        Name: "",
        Price: 0,
        Id: null,
        Code: ""
      });
      hideModal("EditItem");
      await fetchItems(pageNumber);
      toast.success("Item updated successfully!");
    } catch (error) {
      console.log(error)

      toast.error("Failed to update item");
    }
  };


  const Delete = async () => {
    try {
      await axiosInstance.put(`StatementType/SoftDelete?id=${objItem.Id}`);
      setObjItem({
        Name: "",
        Price: 0,
        Id: null,
        Code: ""
      });
      hideModal("DeleteItem");
      await fetchItems(pageNumber);
      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Failed to delete item", error);
      alert("Failed to delete item");
      toast.error("Failed to delete item");
    }
  };



  const save = async () => {
    if (!validateForm()) return;
    if (!validateDuplicates(objItem.Name, objItem.Code)) return;
    try {
      const payload = {
        name: objItem.Name,
        code: objItem.Code,

      };
      const response = await axiosInstance.post("StatementType/add", payload);
      if (response.status === 200) {
        setObjItem({
          Name: "",
          Code: ""

        });
        hideModal("AddItem");
        fetchItems(pageNumber)
        toast.success("Item added successfully!");
      }
    } catch (error) {
      console.error("Failed to add item", error);
      alert("Failed to add item");
      toast.error("Failed to add item!");
    }
  };
  const handleToggle = async (row) => {
    console.log("Toggle row:", row);
    const itemId = row.id;
    if (!itemId) {
      showError(t("Error"), t("Invalid ID"));
      return;
    }
    try {
      const res = await axiosInstance.put(`StatementType/SoftDelete?id=${itemId}`);
      if (res.data.result) {
        toast.success(t("Status updated"));
        fetchItems(pageNumber);
      } else {
        toast.error(t("Failed to toggle status"));
      }
    } catch (error) {
      toast.error(t("Failed to toggle status"));
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

  if (loading) {
    return <Spinner></Spinner>
  }

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
        showDelete={false}
        onShow={() => { }}
        onDelete={handleDelete}
        customActions={(row) => (
          <Switch
            id={`switch-${row.id}`}
            checked={row.isActive}
            onChange={() => handleToggle(row)}
          />
        )}
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
        size="md"
        maxWidth="650px"
        onSave={save}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
      >
        <div className="row">
          <div className="col-md-6 mb-3">
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
          <div className="col-md-6 mb-3">
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
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        id="EditItem"
        title={objTitle.EditItem}
        size="md"
        maxWidth="650px"
        onSave={update}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
      >
        <div className="row">
          <div className="col-md-6 mb-3">
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

          <div className="col-md-6 mb-3">
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
    </>
  );
};
export default StatementType;