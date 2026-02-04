import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import { useSwal } from "../Hooks/Alert/Swal";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "../Components/Layout/Spinner";



const FiscalYear = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fiscalYears, setFiscalYears] = useState([]);
  const navigate = useNavigate();

  const objTitle = useMemo(
    () => ({
      AddFiscalYear: t("Add Fiscal Year"),
      EditFiscalYear: t("Edit Fiscal Year"),
      Id: t("ID"),
      From: t("From"),
      To: t("To"),
      YrFrom: t("Year From"),
      YrTo: t("Year To"),
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

  const [objDocType, setObjDocType] = useState({ From: "", To: "", YrFrom: "", YrTo: "" });
  const { showSuccess, showError, showDeleteConfirmation, SwalComponent } = useSwal();

  const breadcrumbItems = [
    { label: t("Setup"), link: "/Setup", active: false },
    { label: t("Fiscal Year"), active: true },
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      dyalog: "#AddFiscalYear",
      class: "btn btn-sm btn-success ms-2 float-end",
    },
  ];

  const columns = [
    { label: t("ID"), accessor: "id" },
    { label: t("Year From"), accessor: "YrFrom" },
    { label: t("Year To"), accessor: "YrTo" },
    { label: t("From"), accessor: "From" },
    { label: t("To"), accessor: "To" },

  ];

  const getFiscalYears = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("FiscalYear/ListAll", {});

      const list = response.data?.data || [];

      const mappedData = list.map(item => ({
        id: item.id,
        From: item.fromDate ? item.fromDate.split('T')[0] : "",
        To: item.toDate ? item.toDate.split('T')[0] : "",
        YrFrom: item.yearFromDate,
        YrTo: item.yearToDate,
      }));

      setFiscalYears(mappedData);
      setTotalCount(mappedData.length);

    } catch (error) {
      console.error("Fetch Fiscal Years Error:", error);
    } finally {
      setLoading(false);
    }
  };




  const handleEdit = (row) => {
    setObjDocType({
      Id: row.id || -1,
      From: row.From || "",
      To: row.To || "",
      YrFrom: row.YrFrom || "",
      YrTo: row.YrTo || "",
    });
    showModal("EditFiscalYear");
  };
  const handleShow = (row) => {
    navigate(`/Setup/FiscalYear/Info/${row.id}`);
  };
  const handleDelete = (row) => {
    setObjDocType({
      Id: row.id || -1,
      From: row.From || "",
      To: row.To || "",
      YrFrom: row.YrFrom || "",
      YrTo: row.YrTo || "",
    });
    showModal("DeleteFiscalYear");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjDocType((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: 0,
        fromDate: objDocType.From,
        toDate: objDocType.To,
        yearFromDate: objDocType.YrFrom,
        yearToDate: objDocType.YrTo,
        isActive: true,
        quarters: []
      };
      const response = await axiosInstance.post("FiscalYear/Add", payload);
      if (response.data.result) {
        await getFiscalYears();
        hideModal("AddFiscalYear");
        setObjDocType({ From: "", To: "", YrFrom: "", YrTo: "" });
        toast.success(response.data.message || t("Fiscal Year added successfully!"));
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Add Fiscal Year Error:", error);
      toast.error(t("An error occurred while adding the Fiscal Year."));
    }
  };


  const handleUpdate = async () => {
    const payload = {
      id: objDocType.Id,
      fromDate: objDocType.From,
      toDate: objDocType.To,
      yearFromDate: objDocType.YrFrom,
      yearToDate: objDocType.YrTo,
      isActive: true,
      quarters: []
    };

    try {
      const response = await axiosInstance.put(
        `/FiscalYear`,
        payload
      );
      if (response.data.result) {
        await getFiscalYears();
        hideModal("EditFiscalYear");
        setObjDocType({ From: "", To: "", YrFrom: "", YrTo: "" });
        toast.success(response.data.message || t("Fiscal Year updated successfully!"));
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Update Fiscal Year Error:", error);
      toast.error(t("An error occurred while updating the Fiscal Year."));
    }
  };

  const Delete = async () => {
    try {
      const response = await axiosInstance.delete(`/FiscalYear/${objDocType.Id}`);
      if (response.data.result) {
        await getFiscalYears();
        hideModal("DeleteFiscalYear");
        toast.success(response.data.message || t("Fiscal Year deleted successfully!"));
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Delete Fiscal Year Error:", error);
      toast.error(t("An error occurred while deleting the Fiscal Year."));
    }
  };

  const reset = () => {
    setObjDocType({ From: "", To: "", YrFrom: "", YrTo: "" });
  };

  useEffect(() => {
    getFiscalYears();
  }, []);

  const pagedData = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    return fiscalYears.slice(start, end);
  }, [fiscalYears, pageNumber, pageSize])

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table
            columns={columns}
            data={pagedData}
            showActions={true}
            onEdit={handleEdit}
            showShow={true}
            onShow={handleShow}
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

      {/* Add Fiscal Year Modal */}
      <Modal
        id="AddFiscalYear"
        title={objTitle.AddFiscalYear}
        size="lg"
        onSave={handleSave}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
      >
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">{objTitle.From}</label>
            <input type="date" name="From" value={objDocType.From} onChange={handleChange} className="form-control" placeholder={objTitle.From} />
          </div>

          <div className="col-md-6">
            <label className="form-label">{objTitle.To}</label>
            <input type="date" name="To" value={objDocType.To} onChange={handleChange} className="form-control" placeholder={objTitle.To} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">{objTitle.YrFrom}</label>
            <input type="text" name="YrFrom" value={objDocType.YrFrom} onChange={handleChange} className="form-control" placeholder={objTitle.YrFrom} />
          </div>

          <div className="col-md-6">
            <label className="form-label">{objTitle.YrTo}</label>
            <input type="text" name="YrTo" value={objDocType.YrTo} onChange={handleChange} className="form-control" placeholder={objTitle.YrTo} />
          </div>
        </div>
      </Modal>

      {/* Edit Fiscal Year Modal */}
      <Modal
        id="EditFiscalYear"
        title={objTitle.EditFiscalYear}
        size="lg"
        onSave={handleUpdate}
        onHide={reset}
        saveLabel={objTitle.Save}
        cancelLabel={objTitle.Cancel}
      >
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">{objTitle.From}</label>
            <input type="date" name="From" value={objDocType.From} onChange={handleChange} className="form-control" placeholder={objTitle.From} />
          </div>

          <div className="col-md-6">
            <label className="form-label">{objTitle.To}</label>
            <input type="date" name="To" value={objDocType.To} onChange={handleChange} className="form-control" placeholder={objTitle.To} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">{objTitle.YrFrom}</label>
            <input type="text" name="YrFrom" value={objDocType.YrFrom} onChange={handleChange} className="form-control" placeholder={objTitle.YrFrom} />
          </div>

          <div className="col-md-6">
            <label className="form-label">{objTitle.YrTo}</label>
            <input type="text" name="YrTo" value={objDocType.YrTo} onChange={handleChange} className="form-control" placeholder={objTitle.YrTo} />
          </div>
        </div>
      </Modal>

      {/* Delete Fiscal Year Modal */}
      <Modal
        id="DeleteFiscalYear"
        title={objTitle.Delete}
        size="lg"
        onSave={Delete}
        onHide={reset}
        saveLabel={objTitle.Delete}
        cancelLabel={objTitle.Cancel}
        saveButtonClass="btn btn-danger"
        cancelButtonClass="btn btn-primary"
      >
        <p>
          {objTitle.DeleteConfirmation}{" "}
          <strong>{objDocType.YrFrom} - {objDocType.YrTo}</strong> {objTitle.QuestionMark}
        </p>
      </Modal>

      <ToastContainer />
      <SwalComponent />
    </>
  );
};

export default FiscalYear;
