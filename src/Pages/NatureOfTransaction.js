import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { Modal } from "bootstrap";
import { useSwal } from "../Hooks/Alert/Swal";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import Spinner from "../Components/Layout/Spinner";
import { toast, ToastContainer } from 'react-toastify';

const NatureOfTransaction = () => {
  const { t } = useTranslate();
  const [items, setItems] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
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
    { label: t("Transaction Nature"), active: true },
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
    { label: t("RatePercent"), accessor: "ratepercent" },
    { label: t("Updated At"), accessor: "updateAt" },
    { label: t("Created At"), accessor: "createdAt" },
    { label: t("Updated By"), accessor: "updatedByUser.userName" },
  ];

  const fetchItems = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("TransactionNature/ListAll", { pageNumber: page, pageSize: pageSize });
      const data = res.data;

      if (data.result) {
        const itemsList = data.data;
        setItems(itemsList);
        setTotalCount(itemsList.length);
        setPageNumber(page);
      }
    } catch (e) {
      setError("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleEdit = (row) => {
    setObjItem({
      Id: row.id || -1,
      Name: row.name || "",
      Price: row.ratePercent || 0,
      Code: row.code || ""
    });

    const modalElement = document.getElementById("EditItem");
    let modal = Modal.getInstance(modalElement);
    if (!modal) modal = new Modal(modalElement);
    modal.show();
  };

  const handleDelete = (row) => {
    setObjItem({
      Id: row.id || null,
      Name: row.name || "",
      Price: row.ratePercent || 0,
      Code: row.code || ""

    });
    const modalElement = document.getElementById("DeleteItem");
    let modal = Modal.getInstance(modalElement);
    if (!modal) modal = new Modal(modalElement);
    modal.show();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Price" && Number(value) < 0) return;
    setObjItem((prev) => ({ ...prev, [name]: value }));
    const updated = { ...objItem, [name]: value };
    setObjItem(updated);
    validateDuplicates(updated.Name, updated.Code, updated.Id);
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
      newErrors.Price = "Rate Percent is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const update = async () => {
    if (!validateForm()) return;
    if (!validateDuplicates(objItem.Name, objItem.Code, objItem.Id)) return;
    try {
      const payload = {
        id: objItem.Id,
        name: objItem.Name,
        code: objItem.Code,
        ratePercent: Number(objItem.Price)
      };
      const response = await axiosInstance.put("TransactionNature/Update", payload);
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
      alert("Failed to update item");
      toast.error("Failed to update item");
    }
  };


  const Delete = async () => {
    try {
      await axiosInstance.delete(`TransactionNature/${objItem.Id}`);
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
      toast.error("Failed to delete item")
    }
  };



  const save = async () => {
    if (!validateForm()) return;
    if (!validateDuplicates(objItem.Name, objItem.Code, objItem.Id)) return;
    try {
      const payload = {
        name: objItem.Name,
        code: objItem.Code,
        ratePercent: Number(objItem.Price)
      };
      const response = await axiosInstance.post("TransactionNature/Add", payload);
      if (response.status === 200) {
        setObjItem({
          Name: "",
          Price: 0,
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

  const reset = () => {
    setObjItem({
      Name: "",
      Price: 0,
      Id: null,
      Code: ""
    });
  }

  const hideModal = (strModalId) => {
    const modal = Modal.getInstance(document.getElementById(strModalId));
    if (modal) {
      modal.hide();
    }
    const backdrops = document.querySelectorAll(".modal-backdrop.fade.show");
    backdrops.forEach(b => b.remove());
  }

  useEffect(() => {
    fetchItems(pageNumber)
    const handleAddModalShow = () => {
      setObjItem({
        Name: "",
        Price: 0,
        Code: ""
      });
      setErrors({});
      setTouched({});
    };

    document.getElementById("AddItem")?.addEventListener("show.bs.modal", handleAddModalShow);
    document.getElementById("AddItem")?.addEventListener("hidden.bs.modal", reset);
    document.getElementById("EditItem")?.addEventListener("hidden.bs.modal", reset);
    document.getElementById("DeleteItem")?.addEventListener("hidden.bs.modal", reset);

    return () => {
      document.getElementById("AddItem")?.removeEventListener("show.bs.modal", handleAddModalShow);
      document.getElementById("AddItem")?.removeEventListener("hidden.bs.modal", reset);
      document.getElementById("EditItem")?.removeEventListener("hidden.bs.modal", reset);
      document.getElementById("DeleteItem")?.removeEventListener("hidden.bs.modal", reset);
    };
  }, [pageNumber]);
  // Loading state handled in JSX to keep ToastContainer mounted

  if (error) return <p>{error}</p>;
  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      {loading ? (
        <Spinner />
      ) : (
        <>
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
        </>
      )}

      {/* Add Item Modal */}
      <div className="modal fade" id="AddItem" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3", }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.AddItem}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal"> X </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <div className="row">

                <div className="col-md-4 mb-3">
                  <label className="form-label">{objTitle.Name}</label>
                  <input type="text" name="Name" value={objItem.Name} onChange={handleChange} className={`form-control ${errors.Name ? "is-invalid" : ""}`} placeholder={objTitle.Name} />
                  {errors.Name && <div className="invalid-feedback">{errors.Name}</div>}
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">{objTitle.Code}</label>
                  <input type="text" name="Code" value={objItem.Code} onChange={handleChange}
                    className={`form-control ${errors.Code ? "is-invalid" : ""}`}
                    placeholder={objTitle.Code} />
                  {errors.Code && <div className="invalid-feedback">{errors.Code}</div>}
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">{t("RatePercent")}</label>
                  <input type="number" name="Price" value={objItem.Price} onChange={handleChange} className={`form-control ${errors.Price ? "is-invalid" : ""}`} placeholder={t("Price")}
                    step="0.01"
                    min="0" />
                  {errors.Price && <div className="invalid-feedback">{errors.Price}</div>}  </div>
              </div>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }} >
              <button type="button" className="btn btn-success" onClick={save}>{objTitle.Save}</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">{objTitle.Cancel}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      <div className="modal fade" id="EditItem" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3", }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.EditItem}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">X</button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
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
                  <input type="text" name="Code"
                    value={objItem.Code}
                    onChange={handleChange}
                    className={`form-control ${errors.Code ? "is-invalid" : ""}`}
                    placeholder={objTitle.Code}
                  />
                  {errors.Code && <div className="invalid-feedback">{errors.Code}</div>}
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">{t("RatePercent")}</label>
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
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}>
              <button type="button" className="btn btn-success" onClick={update}>{objTitle.Save}</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">{objTitle.Cancel}</button>
            </div>
          </div>
        </div>
      </div>


      <div className="modal fade" id="DeleteItem" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.Delete}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">X</button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <p>{objTitle.DeleteConfirmation} <strong> {objItem.Name} </strong> {objTitle.QuestionMark}</p>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}>
              <button type="button" className="btn btn-danger" onClick={Delete} >{objTitle.Delete}</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" >{objTitle.Cancel}</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <SwalComponent />
    </>
  );
};

export default NatureOfTransaction;
