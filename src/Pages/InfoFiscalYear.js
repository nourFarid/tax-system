import React, { useEffect, useState } from 'react';
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import { useParams } from 'react-router-dom';
import axiosInstance from "../Axios/AxiosInstance";
import { Modal } from "bootstrap";
import { useSwal } from "../Hooks/Alert/Swal";

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
        const modalElement = document.getElementById("EditQuarterLockDate");
        const modal = new Modal(modalElement);
        modal.show();
    };

    const handleUpdateQuarter = async () => {
        if (!selectedQuarter) return;

        // Prepare detailed payload as expected by the API
        // We need to send the full Fiscal Year object with the updated quarter list
        const updatedQuarters = fiscalYear.quarters.map(q => {
            if (q.id === selectedQuarter.id) {
                return { ...q, lockDate: editLockDate };
            }
            return q;
        });

        const payload = {
            ...fiscalYear,
            quarters: updatedQuarters
        };

        try {
            const response = await axiosInstance.put(`/FiscalYear/${fiscalYear.id}`, payload);

            // Re-fetch or update local state
            if (response.status === 200 || response.data.result) {
                showSuccess("Success", "Quarter updated successfully!");
                // Hide modal
                const modalElement = document.getElementById("EditQuarterLockDate");
                const modal = Modal.getInstance(modalElement);
                modal.hide();

                await fetchFiscalYear(); // Refresh data
            } else {
                showError("Error", "Failed to update quarter");
            }

        } catch (error) {
            console.error("Error updating quarter:", error);
            showError("Error", "An error occurred while updating the quarter.");
        }
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
            <div className="modal fade" id="EditQuarterLockDate" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{t("Edit Lock Date")}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">{t("Lock Date")}</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={editLockDate}
                                    onChange={(e) => setEditLockDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t("Cancel")}</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdateQuarter}>{t("Save Changes")}</button>
                        </div>
                    </div>
                </div>
            </div>
            <SwalComponent />
        </>
    );
};

export default InfoFiscalYear;
