import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { Modal } from "bootstrap";
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
    { label: t("ID"), accessor: "id" },
    { label: t("Name"), accessor: "name" },
    { label: t("Code"), accessor: "code" },
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

    const modalElement = document.getElementById("EditItemType");
    let modal = Modal.getInstance(modalElement);
    if (!modal) modal = new Modal(modalElement);
    modal.show();
  };

  const handleShow = (row) => { };

  const handleDelete = (row) => {
    setObjItemType({
      Name: row.name || "",
      Code: row.code || "",
      Id: row.id || -1
    });

    const modalElement = document.getElementById("DeleteItemType");
    const modal = new Modal(modalElement);
    modal.show();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjItemType((prev) => ({ ...prev, [name]: value }));
  };

  const hideModal = (strModalId) => {
    const modal = Modal.getInstance(document.getElementById(strModalId));
    if (modal) {
      modal.hide();
    }
    const backdrops = document.querySelectorAll(".modal-backdrop.fade.show");
    backdrops.forEach(b => b.remove());
  };

  const save = async () => {
    try {
      const payload = {
        name: objItemType.Name,
        code: objItemType.Code
      };
      const response = await axiosInstance.post("ItemType/AddItemType", payload);
      if (response.status === 200) {
        setObjItemType({
          Name: "",
          Code: "",
        });
        hideModal("AddItemType");
        fetchItemTypes();
        toast.success("Item type added successfully!");
      }
    } catch (error) {
      console.error("Failed to add item type", error);
      toast.error("Failed to add item type!");
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
      console.log("Update response:", response);

      setObjItemType({
        Name: "",
        Id: null,
        Code: ""
      });
      hideModal("EditItemType");
      await fetchItemTypes();
      toast.success("Item type updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update item type");
    }
  };

  const Delete = async () => {
    try {
      await axiosInstance.put(`ItemType/SoftDelete?id=${objItemType.Id}`);
      setObjItemType({
        Name: "",
        Id: null,
        Code: ""
      });
      hideModal("DeleteItemType");
      await fetchItemTypes();
      toast.success("Item type deleted successfully!");
    } catch (error) {
      console.error("Failed to delete item type", error);
      toast.error("Failed to delete item type");
    }
  };

  useEffect(() => {
    fetchItemTypes();
    const modalIds = ["AddItemType", "EditItemType", "DeleteItemType"];

    const handleHidden = () => {
      setObjItemType({ Name: "", Code: "" });
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

      <div className="modal fade" id="AddItemType" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.AddItemType}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal"> X </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
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
            </div>
            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}>
              <button type="button" className="btn btn-success" onClick={save} >{objTitle.Save}</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" >{objTitle.Cancel}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="EditItemType" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.EditItemType}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal"> X </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
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
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}>
              <button type="button" className="btn btn-success" onClick={update} > {objTitle.Save} </button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" > {objTitle.Cancel} </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="DeleteItemType" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.Delete}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal"> X </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <p>{objTitle.DeleteConfirmation} <strong> {objItemType.Name} </strong> {objTitle.QuestionMark}</p>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}>
              <button type="button" className="btn btn-danger" onClick={Delete} > {objTitle.Delete} </button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" > {objTitle.Cancel} </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ItemType;
