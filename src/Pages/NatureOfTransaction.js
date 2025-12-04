import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { Modal } from "bootstrap";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import Spinner from "../Components/Layout/Spinner";

const NatureOfTransaction = () => {
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
      Code:t('Code')
    }),
    [t]
  );
  const [objItem, setObjItem] = useState({
    Name: "",
    Price: 0,
    Code:""
  });

  const breadcrumbItems = [
    { label: t("Setup"), link: "/Setup", active: false },
    { label: t("Transaction Nature"), active: true },
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
      const itemsList = data.data; // لو بيرجع array
      setItems(itemsList);
      setTotalCount(itemsList.length); // عدد العناصر
      setPageNumber(page); // الصفحة الحالية
    }
  } catch (e) {
    setError("Failed to fetch items");
  } finally {
    setLoading(false);
  }
};
  const handleEdit = (row) => {
    setObjItem({
      Id: row.id || -1,
      Name: row.name || "",
      Price: row.ratePercent || 0,
      Code:row.code||""
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
      Code:row.code||""

    });
    const modalElement = document.getElementById("DeleteItem");
    let modal = Modal.getInstance(modalElement);
    if (!modal) modal = new Modal(modalElement);
    modal.show();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjItem((prev) => ({ ...prev, [name]: value }));
  };


  const update = async () => {
    try {
      const payload = {
            name: objItem.Name,               // لاحظ small n
      code: objItem.Code,               // لاحظ small c
      ratePercent: Number(objItem.Price) 
      };
      const response = await axiosInstance.put("TransactionNature/" + objItem.Id, payload);
      console.log("Update response:", response);
      
      setObjItem({
        Name: "",
        Price: 0,
        Id: null,
        Code:""
      });
      hideModal("EditItem");
      await fetchItems(pageNumber);
    } catch (error) {
      console.log(error)
      alert("Failed to update item");
    }
  };


  const Delete = async () => {
    try {
      await axiosInstance.delete(`TransactionNature/${objItem.Id}`);
      setObjItem({
        Name: "",
        Price: 0,
        Id: null,
        Code:""
      });
      hideModal("DeleteItem");
      await fetchItems(pageNumber);
    } catch (error) {
      console.error("Failed to delete item", error);
      alert("Failed to delete item");
    }
  };



  const save = async () => {
    try {
      const payload = {
         name: objItem.Name,               // لاحظ small n
      code: objItem.Code,               // لاحظ small c
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
      }
    } catch (error) {
      console.error("Failed to add item", error);
      alert("Failed to add item");
    }
  };

  const reset = () => {
    setObjItem({
      Name: "",
      Price: 0,
      Id: null,
      Code:""
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
    document.getElementById("AddItem")?.addEventListener("hidden.bs.modal", reset);
    document.getElementById("EditItem")?.addEventListener("hidden.bs.modal", reset);
    document.getElementById("DeleteItem")?.addEventListener("hidden.bs.modal", reset);
    return () => {
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
                <div className="col-md-4 mb-3">
                  <label className="form-label">{objTitle.Name}</label>
                  <input
                    type="text"
                    name="Name"
                    value={objItem.Name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={objTitle.Name}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">{objTitle.Code}</label>
                  <input
                    type="text"
                    name="Code"
                    value={objItem.Code}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={objTitle.Code}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">{t("RatePercent")}</label>
                  <input
                    type="number"
                    name="Price"
                    value={objItem.Price}
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
                <div className="col-md-4 mb-3">
                  <label className="form-label">{objTitle.Name}</label>
                  <input
                    type="text"
                    name="Name"
                    value={objItem.Name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={objTitle.Name}
                  />
                </div>

<div className="col-md-4 mb-3">
                  <label className="form-label">{objTitle.Code}</label>
                  <input
                    type="text"
                    name="Code"
                    value={objItem.Code}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={objTitle.Code}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">{t("RatePercent")}</label>
                  <input
                    type="number"
                    name="Price"
                    value={objItem.Price}
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


      <div className="modal fade" id="DeleteItem" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.Delete}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">
                X
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <p>{objTitle.DeleteConfirmation} <strong> {objItem.Name} </strong> {objTitle.QuestionMark}</p>
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

export default NatureOfTransaction;
