import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import { Modal } from "bootstrap";
import Pagination from './../Components/Layout/Pagination';
import { useSwal } from "../Hooks/Alert/Swal";
import axiosInstance from "../Axios/AxiosInstance";

const DocumentType = () => {
  const { t } = useTranslate();
  const [docType, setDocType] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [objDocType, setObjDocType] = useState({ Name: "", Code: "" });
  const { showSuccess, showError, showDeleteConfirmation, SwalComponent } = useSwal();
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddClick = () => {
    setObjDocType({
      Name: "",
      Code: ""
    });
    setErrors({});
  }

  const fetchDocType = async (page = 1) => {
    try {
      const res = await axiosInstance.post("DocumentType/List", { pageNumber: page, pageSize: pageSize });
      const data = res.data;
      console.log('====================================');
      console.log(data.data.totalCount);
      console.log('====================================');
      if (data.result) {
        const DocTypeList = data.data.items;
        setDocType(DocTypeList);
        ;
        setTotalCount(data.data.totalCount);
        setPageNumber(page);
      }
    } catch (e) {
      setError("Failed to fetch document types.");
    } finally {
      setLoading(false);
    }
  };
  const objTitle = useMemo(
    () => ({
      AddDocumentType: t("Add Document Type"),
      EditDocumentType: t("Edit Document Type"),
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
    { label: t("Document Type"), active: true },
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      dyalog: "#AddDocumentType",
      onClick: handleAddClick,
      class: "btn btn-sm btn-success ms-2 float-end",
    },
  ];

  const columns = [
    { label: t("ID"), accessor: "id" },
    { label: t("Name"), accessor: "name" },
    { label: t("Code"), accessor: "code" },
  ];


  const handleEdit = (row) => {
    setObjDocType({
      Name: row.name || "",
      Code: row.code || "",
      Id: row.id || -1
    });

    const modalElement = document.getElementById("EditDocumentType");
    let modal = Modal.getInstance(modalElement);
    if (!modal) modal = new Modal(modalElement);
    modal.show();
  };
  const handleShow = (row) => { };
  const handleDelete = (row) => {
    setObjDocType({
      Name: row.name || "",
      Code: row.code || "",
      Id: row.id || -1
    });

    const modalElement = document.getElementById("DeleteDocumentType");
    const modal = new Modal(modalElement);
    modal.show();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjDocType((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setObjDocType({ Name: "", Code: "" });
    // the add request should be here
  };

  const handleUpdate = () => {
    // the add request should be here
  };

  const Delete = async () => {
    try {
      console.log('====================================');
      console.log(objDocType.Id);
      console.log('====================================');
      await axiosInstance.put(`DocumentType/SoftDelete?id=${objDocType.Id}`);
      setObjDocType({
        Name: "",
        Id: null,
        Code: ""
      });
      hideModal("DeleteDocumentType");
      await fetchDocType(pageNumber);
      showSuccess("Deleted", "document type deleted successfully!");
    } catch (error) {
      console.error("Failed to delete document type", error);
      showError("Error", "Failed to delete document type");
    }
  };

  const save = async () => {

    try {
      const payload = {
        Name: objDocType.Name,
        Code: objDocType.Code
      };
      const response = await axiosInstance.post("DocumentType/add", payload);
      if (response.status === 200) {
        setDocType({
          Name: "",
          Code: "",

        });
        hideModal("AddDocumentType");
        fetchDocType(pageNumber)
        showSuccess("Success", "document type added successfully!");
      }
    } catch (error) {
      console.error("Failed to add document type", error);
      showError("Error", "Failed to add document type!");
    }
  };

  const update = async () => {

    try {
      const payload = {
        Id: objDocType.Id,
        Name: objDocType.Name,
        Code: objDocType.Code,
      };
      const response = await axiosInstance.put("DocumentType/Update", payload);
      console.log("Update response:", response);

      setObjDocType({
        Name: "",
        Id: null,
        Code: ""
      });
      hideModal("EditDocumentType");
      await fetchDocType(pageNumber);
      showSuccess("Success", "document type updated successfully!");
    } catch (error) {
      console.log(error)
      showError("Error", "Failed to update document type");
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
  useEffect(() => {
    fetchDocType(pageNumber);
    const modalIds = ["AddDocumentType", "EditDocumentType", "DeleteDocumentType"];

    const handleHidden = () => {
      // Reset object when any modal is hidden
      setObjDocType({ Name: "", Code: "" });
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
        columns={columns}
        data={docType}
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

      <div className="modal fade" id="AddDocumentType" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.AddDocumentType}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">
                X
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">{objTitle.Name}</label>
                  <input type="text" name="Name" value={objDocType.Name} onChange={handleChange} className="form-control" placeholder={objTitle.Name} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.Code}</label>
                  <input type="text" name="Code" value={objDocType.Code} onChange={handleChange} className="form-control" placeholder={objTitle.Code} />
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}>
              <button type="button" className="btn btn-success" onClick={save} >
                {objTitle.Save}
              </button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" >
                {objTitle.Cancel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="EditDocumentType" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "10px", border: "1px solid #d3d3d3" }}>
            <div className="modal-header d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #d3d3d3" }}>
              <h5 className="modal-title">{objTitle.EditDocumentType}</h5>
              <button type="button" className="btn btn-outline-danger btn-sm" data-bs-dismiss="modal">
                X
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">{objTitle.Name}</label>
                  <input type="text" name="Name" value={objDocType.Name} onChange={handleChange} className="form-control" placeholder={objTitle.Name} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">{objTitle.Code}</label>
                  <input type="text" name="Code" value={objDocType.Code} onChange={handleChange} className="form-control" placeholder={objTitle.Code} />
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}>
              <button type="button" className="btn btn-success" onClick={update} >
                {objTitle.Save}
              </button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" >
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

export default DocumentType;
