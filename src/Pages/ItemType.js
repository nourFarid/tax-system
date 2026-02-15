import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import Pagination from '../Components/Layout/Pagination';
import { useSwal } from "../Hooks/Alert/Swal";
import axiosInstance from "../Axios/AxiosInstance";
import { toast, ToastContainer } from "react-toastify";

const ItemType = () => {
  const { t } = useTranslate();
  const [itemTypes, setItemTypes] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [objItemType, setObjItemType] = useState({ Name: "", Code: "" });
  const { showSuccess, showError } = useSwal();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const objTitle = useMemo(
    () => ({
      AddItemType: t("Add Item Type"),
      EditItemType: t("Edit Item Type"),
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

  const breadcrumbItems = [
    { label: t("Setup"), link: "/Setup", active: false },
    { label: t("Item Type"), active: true },
  ];

  const handleAddClick = () => {
    setObjItemType({
      Name: "",
      Code: ""
    });
  };

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      dyalog: "#AddItemType",
      onClick: handleAddClick,
      class: "btn btn-sm btn-success ms-2 float-end",
    },
  ];

  const columns = [
    { label: t("Name"), accessor: "name" },
    { label: t("Code"), accessor: "code" }
  ];


  const fetchItemTypes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("ItemType/ListAll");
      const data = res.data;
      if (data.result) {
        const itemTypeList = data.data || [];
        setItemTypes(itemTypeList);
        setTotalCount(itemTypeList.length);
      } else {
        setItemTypes([]);
        setTotalCount(0);
      }
    } catch (e) {
      console.error("Failed to fetch item types", e);
      showError("Error", "Failed to fetch item types");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setObjItemType({
      Name: row.name || "",
      Code: row.code || "",
      Id: row.id || -1
    });
    showModal("EditItemType");
  };

  const handleShow = (row) => { };

  const handleDelete = (row) => {
    setObjItemType({
      Name: row.name || "",
      Code: row.code || "",
      Id: row.id || -1
    });
    showModal("DeleteItemType");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjItemType((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!objItemType.Name || objItemType.Name.trim() === "") {
      newErrors.Name = "Name is required";
    }
    if (!objItemType.Code || objItemType.Code.trim() === "") {
      newErrors.Code = "Code is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        name: objItemType.Name,
        code: objItemType.Code
      };
      const response = await axiosInstance.post("ItemType/AddItemType", payload);
      if (response.data.result) {
        setObjItemType({
          Name: "",
          Code: "",
        });
        hideModal("AddItemType");
        fetchItemTypes();
        toast.success(t("Item type added successfully!"));
      }
    } catch (error) {
      toast.error(t("Failed to add item type"));
    }
  };

  const update = async () => {
    try {
      const payload = {
        id: objItemType.Id,
        name: objItemType.Name,
        code: objItemType.Code,
      };

      const response = await axiosInstance.put("ItemType/Update", payload);

      if (response?.data?.result === true) {
        setObjItemType({
          Name: "",
          Id: null,
          Code: ""
        });

        hideModal("EditItemType");
        await fetchItemTypes();
        toast.success(t("Item type updated successfully!"));
      } else {
        toast.error(t("Update failed"));
      }

    } catch (error) {
      console.log(error);
      const msg = error?.response?.data?.message || t("Failed to update item type");
      toast.error(msg);
    }
  };

  const Delete = async () => {
    try {
      const response = await axiosInstance.put(`ItemType/SoftDelete?id=${objItemType.Id}`);

      if (response?.data?.result === true) {
        setObjItemType({
          Name: "",
          Id: null,
          Code: ""
        });
        hideModal("DeleteItemType");
        await fetchItemTypes();
        toast.success(t("Item type deleted successfully!"));
      } else {
        toast.error(t("Delete failed"));
      }
    } catch (error) {
      const msg = error?.response?.data?.message || t("Failed to delete item type");
      toast.error(msg);
    }
  };


  const reset = () => {
    setObjItemType({ Name: "", Code: "" });
    setErrors({});
  };

  useEffect(() => {
    fetchItemTypes();
  }, []);

  // Paginate client-side since ListAll returns all items
  const paginatedData = itemTypes.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      <Table
        columns={columns}
        data={paginatedData}
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

      {/* Add Item Type Modal */}
      <Modal
        id="AddItemType"
        title={objTitle.AddItemType}
        size="lg"
        onSave={save}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
      >
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">{objTitle.Name}</label>
            <input type="text" name="Name" value={objItemType.Name} onChange={handleChange} className={`form-control ${errors.Name ? "is-invalid" : ""}`} placeholder={objTitle.Name} />
            {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">{objTitle.Code}</label>
            <input type="text" name="Code" value={objItemType.Code} onChange={handleChange} className={`form-control ${errors.Code ? "is-invalid" : ""}`} placeholder={objTitle.Code} />
            {errors.Code && <div className="invalid-feedback">{errors.Code}</div>}
          </div>
        </div>
      </Modal>

      {/* Edit Item Type Modal */}
      <Modal
        id="EditItemType"
        title={objTitle.EditItemType}
        size="lg"
        onSave={update}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
      >
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">{objTitle.Name}</label>
            <input type="text" name="Name" value={objItemType.Name} onChange={handleChange} className="form-control" placeholder={objTitle.Name} />
          </div>

          <div className="col-md-6">
            <label className="form-label">{objTitle.Code}</label>
            <input type="text" name="Code" value={objItemType.Code} onChange={handleChange} className="form-control" placeholder={objTitle.Code} />
          </div>
        </div>
      </Modal>

      {/* Delete Item Type Modal */}
      <Modal
        id="DeleteItemType"
        title={objTitle.Delete}
        size="lg"
        onSave={Delete}
        onHide={reset}
        saveLabel={objTitle.Delete}
        cancelLabel={objTitle.Cancel}
        saveButtonClass="btn btn-danger"
        cancelButtonClass="btn btn-primary"
      >
        <p>{objTitle.DeleteConfirmation} <strong> {objItemType.Name} </strong> {objTitle.QuestionMark}</p>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default ItemType;
