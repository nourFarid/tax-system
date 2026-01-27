import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import Pagination from './../Components/Layout/Pagination';
import { useSwal } from "../Hooks/Alert/Swal";
import axiosInstance from "../Axios/AxiosInstance";
import { toast, ToastContainer } from "react-toastify";

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
      toast.error("Failed to fetch document types.");
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
    showModal("EditDocumentType");
  };
  const handleShow = (row) => { };
  const handleDelete = (row) => {
    setObjDocType({
      Name: row.name || "",
      Code: row.code || "",
      Id: row.id || -1
    });
    showModal("DeleteDocumentType");
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
      toast.success("document type deleted successfully!");
    } catch (error) {
      console.error("Failed to delete document type", error);
      toast.error("Failed to delete document type");
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
        toast.success(t("document type added successfully!"));
      }
    } catch (error) {
      console.error("Failed to add document type", error);
      toast.error(t("Failed to add document type!"));
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
      toast.success(t("document type updated successfully!"));
    } catch (error) {
      console.log(error)
      toast.error(t("Failed to update document type"));
    }
  };

  const reset = () => {
    setObjDocType({ Name: "", Code: "" });
  };

  useEffect(() => {
    fetchDocType(pageNumber);
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

      {/* Add Document Type Modal */}
      <Modal
        id="AddDocumentType"
        title={objTitle.AddDocumentType}
        size="lg"
        onSave={save}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
      >
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
      </Modal>

      {/* Edit Document Type Modal */}
      <Modal
        id="EditDocumentType"
        title={objTitle.EditDocumentType}
        size="lg"
        onSave={update}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
      >
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
      </Modal>

      {/* Delete Document Type Modal */}
      <Modal
        id="DeleteDocumentType"
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

export default DocumentType;
