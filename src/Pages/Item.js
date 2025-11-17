import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { Modal } from "bootstrap";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import Spinner from "../Components/Layout/Spinner";
const Item = () => {
  const { t } = useTranslate();
  const [items, setItems] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
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
    }),
    [t]
  );
    const [objDocType, setObjDocType] = useState({
    Name: "",
    Price: 0
  });
  const closeModal = (modalName) => {
    const modalElement = document.getElementById(modalName);
    console.log("closeModal: modalElement for", modalName, modalElement);

    if (!modalElement) {
      console.warn(`Modal with id "${modalName}" not found.`);
      return;
    }

    let modal = Modal.getInstance(modalElement);
    if (!modal) {
      modal = new Modal(modalElement);
    }

    try {
      modal.hide();
    } catch (e) {
      console.error("Error hiding modal:", e);
    }
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
  };

  const fetchItems = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("Item", {
        params: { pageNumber: page, pageSize },
      });
      const data = res.data;
      setItems(data.items);
      setTotalCount(data.totalCount);
      setPageNumber(data.pageNumber);
    } catch (e) {
      setError("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (row) => {
    setObjDocType({
      Id: row.id || -1,
      Name: row.name || "",
      Price: row.price || 0,
    });

    const modalElement = document.getElementById("EditItem");
    let modal = Modal.getInstance(modalElement);
    if (!modal) modal = new Modal(modalElement);
    modal.show();
  };
  const handleDelete = (row) => {
    setObjDocType({
      Id: row.id || null,
      Name: row.name || "",
      Price: row.price || 0,
    });
const modalElement = document.getElementById("DeleteDocumentType");
    let modal = Modal.getInstance(modalElement);
    if (!modal) modal = new Modal(modalElement);
    modal.show();

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjDocType((prev) => ({ ...prev, [name]: value }));
  };
  
  
  const update = async () => {
    try {
      const payload = {
        Name: objDocType.Name,
        Price: Number(objDocType.Price),
      };
      const response = await axiosInstance.put("Item/" + objDocType.Id, payload);
      console.log("Update response:", response);
      closeModal("EditItem");
      await fetchItems(pageNumber);

      setObjDocType({
        Name: "",
        Price: 0,
        Id: null,
      });
    } catch (error) {
      console.log(error)
      alert("Failed to update item");
    }
  };


  const Delete = async () => {
    try {
      await axiosInstance.delete(`Item/${objDocType.Id}`);
      await fetchItems(pageNumber);
      closeModal("DeleteDocumentType");
      setObjDocType({
        Name: "",
        Price: 0,
        Id: null,
      });
    } catch (error) {
      console.error("Failed to delete item", error);
      alert("Failed to delete item");
    }
  };



  const save = async () => {
    try {
      const payload = {
        Name: objDocType.Name,
        Price: Number(objDocType.Price),
      };
      const response = await axiosInstance.post("Item", payload);
      fetchItems(pageNumber)
      closeModal("AddItem")
      setObjDocType({
        Name: "",
        Price: 0,
      });
    } catch (error) {
      console.error("Failed to add item", error);
      alert("Failed to add item");
    }
  };



  const breadcrumbItems = [
    { label: t("Setup"), link: "/Setup", active: false },
    { label: t("Items"), active: true },
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      dyalog: "#AddItem",
      class: "btn btn-sm btn-success ms-2 float-end",
    },
  ];

  const columns = [
    { label: t("ID"), accessor: "id" },
    { label: t("Name"), accessor: "name" },
    { label: t("Price"), accessor: "price" },
    { label: t("Updated At"), accessor: "updateAt" },
    { label: t("Created At"), accessor: "createdAt" },
    { label: t("Updated By"), accessor: "updatedByUserId" },
  ];



  useEffect(() => {
    fetchItems(pageNumber)
    const modalIds = ["AddItem", "EditItem", "DeleteDocumentType"];

    const handleHidden = () => {
      // Reset object when any modal is hidden
      setObjDocType({
        Name: "",
        Price: 0
      });
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
      <div className="modal fade" id="AddItem" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "10px",
              border: "1px solid #d3d3d3",
            }}
          >
            <div
              className="modal-header d-flex justify-content-between align-items-center"
              style={{ borderBottom: "1px solid #d3d3d3" }}
            >
              <h5 className="modal-title">{objTitle.AddItem}</h5>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                data-bs-dismiss="modal"
              >
                X
              </button>
            </div>

            <div
              className="modal-body"
              style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}
            >
              <div className="row">
                <div className="col-md-6 mb-3">
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
                <div className="col-md-6 mb-3">
                  <label className="form-label">{t("Price")}</label>
                  <input
                    type="number"
                    name="Price"
                    value={objDocType.Price}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={t("Price")}
                    step="0.01"
                  />
                </div>







              </div>
            </div>

            <div
              className="modal-footer"
              style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}
            >
              <button type="button" className="btn btn-success" onClick={save}>
                {objTitle.Save}
              </button>

              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                {objTitle.Cancel}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      <div className="modal fade" id="EditItem" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "10px",
              border: "1px solid #d3d3d3",
            }}
          >
            <div
              className="modal-header d-flex justify-content-between align-items-center"
              style={{ borderBottom: "1px solid #d3d3d3" }}
            >
              <h5 className="modal-title">{objTitle.EditItem}</h5>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                data-bs-dismiss="modal"
              >
                X
              </button>
            </div>

            <div
              className="modal-body"
              style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}
            >
              <div className="row">
                <div className="col-md-6 mb-3">
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



                <div className="col-md-6 mb-3">
                  <label className="form-label">{t("Price")}</label>
                  <input
                    type="number"
                    name="Price"
                    value={objDocType.Price}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={t("Price")}
                    step="0.01"
                  />
                </div>



              </div>
            </div>

            <div
              className="modal-footer"
              style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}
            >
              <button
                type="button"
                className="btn btn-success"
                onClick={update}
              >
                {objTitle.Save}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                {objTitle.Cancel}
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="modal fade" id="DeleteDocumentType" tabIndex="-1" aria-hidden="true">
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

export default Item;
