import React, { useEffect, useState } from 'react';
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import { useParams } from 'react-router-dom';
import axiosInstance from "../Axios/AxiosInstance";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import { useSwal } from "../Hooks/Alert/Swal";
import { toast, ToastContainer } from "react-toastify";

const InfoFiscalYear = () => {
    const { t } = useTranslate();
    const { id } = useParams();
    const [fiscalYear, setFiscalYear] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError, SwalComponent } = useSwal();

    // State for Quarter Edit
    const [selectedQuarter, setSelectedQuarter] = useState(null);
    const [editLockDate, setEditLockDate] = useState("");

    const breadcrumbItems = [
        { label: t("Setup"), link: "/Setup", active: false },
        { label: t("Fiscal Year"), link: "/Setup/FiscalYear", active: false },
        { label: t("Info Fiscal Year"), active: true },
    ];

    const fetchFiscalYear = async () => {
        try {
            const response = await axiosInstance.post(`/FiscalYear/ListAll`, { Id: id });
            if (response.data && response.data.result) {
                const data = response.data.data;
                if (Array.isArray(data) && data.length > 0) {
                    setFiscalYear(data[0]);
                } else if (data) {
                    setFiscalYear(data);
                } else {
                    console.error("Fiscal Year not found");
                }
            } else {
                console.error("Failed to fetch fiscal year");
            }
        } catch (error) {
            console.error("Error fetching fiscal year:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchFiscalYear();
        }
    }, [id]);

    const handleEditLockDate = (quarter) => {
        setSelectedQuarter(quarter);
        setEditLockDate(quarter.lockDate ? quarter.lockDate.split('T')[0] : "");
        showModal("EditQuarterLockDate");
    };

    const handleUpdateQuarter = async () => {
        if (!selectedQuarter) return;

        const payload = {
            ...selectedQuarter,
            lockDate: editLockDate
        };

        try {
            const response = await axiosInstance.put("/Quarter", payload);

            // Re-fetch or update local state
            if (response.status === 200 || response.data.result) {
                toast.success(t("Quarter updated successfully!"));
                hideModal("EditQuarterLockDate");
                await fetchFiscalYear(); // Refresh data
            } else {
                toast.error(t("Failed to update quarter"));
            }

        } catch (error) {
            console.error("Error updating quarter:", error);
            toast.error(t("An error occurred while updating the quarter."));
        }
    };

    const reset = () => {
        setSelectedQuarter(null);
        setEditLockDate("");
    };

    if (loading) return <div>{t("Loading...")}</div>;
    if (!fiscalYear) return <div>{t("Fiscal Year not found")}</div>;

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="container-fluid mt-4">
                {/* Details Panel */}
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">{t("Fiscal Year Details")}</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold text-muted">{t("Year From")}</label>
                                <div className="form-control-plaintext">{fiscalYear.yearFromDate}</div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold text-muted">{t("Year To")}</label>
                                <div className="form-control-plaintext">{fiscalYear.yearToDate}</div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold text-muted">{t("From Date")}</label>
                                <div className="form-control-plaintext">{fiscalYear.fromDate ? fiscalYear.fromDate.split('T')[0] : "-"}</div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="fw-bold text-muted">{t("To Date")}</label>
                                <div className="form-control-plaintext">{fiscalYear.toDate ? fiscalYear.toDate.split('T')[0] : "-"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quarters Panel */}
                <div className="card">
                    <div className="card-header bg-info text-white">
                        <h5 className="mb-0">{t("Quarters")}</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>{t("Date From")}</th>
                                        <th>{t("Date To")}</th>
                                        <th>{t("Lock Date")}</th>
                                        <th>{t("Actions")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fiscalYear.quarters && fiscalYear.quarters.map((quarter, index) => (
                                        <tr key={quarter.id || index}>
                                            <td>{quarter.dateFrom ? quarter.dateFrom.split('T')[0] : "-"}</td>
                                            <td>{quarter.dateTo ? quarter.dateTo.split('T')[0] : "-"}</td>
                                            <td>{quarter.lockDate ? quarter.lockDate.split('T')[0] : "-"}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleEditLockDate(quarter)}
                                                >
                                                    <i className="bi bi-pencil-square me-1"></i> {t("Edit Lock Date")}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!fiscalYear.quarters || fiscalYear.quarters.length === 0) && (
                                        <tr>
                                            <td colSpan="4" className="text-center">{t("No Quarters Found")}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Lock Date Modal */}
            <Modal
                id="EditQuarterLockDate"
                title={t("Edit Lock Date")}
                size="md"
                onSave={handleUpdateQuarter}
                onHide={reset}
                saveLabel={t("Save Changes")}
                cancelLabel={t("Cancel")}
                saveButtonClass="btn btn-primary"
                cancelButtonClass="btn btn-secondary"
            >
                <div className="mb-3">
                    {selectedQuarter && (
                        <div className="alert alert-info py-2 mb-3">
                            <div className="row">
                                <div className="col-6">
                                    <strong>{t("Date From")}:</strong> {selectedQuarter.dateFrom ? selectedQuarter.dateFrom.split('T')[0] : "-"}
                                </div>
                                <div className="col-6">
                                    <strong>{t("Date To")}:</strong> {selectedQuarter.dateTo ? selectedQuarter.dateTo.split('T')[0] : "-"}
                                </div>
                            </div>
                        </div>
                    )}
                    <label className="form-label">{t("Lock Date")}</label>
                    <input
                        type="date"
                        className="form-control"
                        value={editLockDate}
                        onChange={(e) => setEditLockDate(e.target.value)}
                    />
                </div>
            </Modal>
            <ToastContainer />
            <SwalComponent />
        </>
    );
};

export default InfoFiscalYear;
