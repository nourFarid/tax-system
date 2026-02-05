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

    // Info Item Component
    const InfoItem = ({ label, value, icon }) => (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            background: "rgba(255,255,255,0.7)",
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.05)"
        }}>
            <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3b4ebeff 0%, #0e1f69ff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "16px"
            }}>
                <i className={icon}></i>
            </div>
            <div>
                <div style={{ fontSize: "12px", color: "#718096", marginBottom: "2px" }}>{label}</div>
                <div style={{ fontWeight: 600, color: "#2d3748" }}>{value || "-"}</div>
            </div>
        </div>
    );

    // Quarter Card Component
    const QuarterCard = ({ quarter, index }) => (
        <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,0.05)",
            transition: "transform 0.2s, box-shadow 0.2s"
        }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
            }}
        >
            {/* Quarter Header */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "14px"
                    }}>
                        Q{index + 1}
                    </div>
                    <span style={{ fontWeight: 600, color: "#2d3748" }}>{t("Quarter")} {index + 1}</span>
                </div>
                <button
                    onClick={() => handleEditLockDate(quarter)}
                    style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "8px",
                        border: "none",
                        background: "linear-gradient(135deg, #3b4ebeff 0%, #0e1f69ff 100%)",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "opacity 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                    title={t("Edit Lock Date")}
                >
                    <i className="bi bi-pencil" style={{ fontSize: "14px" }}></i>
                </button>
            </div>

            {/* Quarter Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "rgba(59, 78, 190, 0.06)",
                    borderRadius: "8px"
                }}>
                    <span style={{ fontSize: "13px", color: "#718096" }}>
                        <i className="bi bi-calendar-event me-2"></i>{t("Date From")}
                    </span>
                    <span style={{ fontWeight: 500, color: "#2d3748" }}>
                        {quarter.dateFrom ? quarter.dateFrom.split('T')[0] : "-"}
                    </span>
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "rgba(59, 78, 190, 0.06)",
                    borderRadius: "8px"
                }}>
                    <span style={{ fontSize: "13px", color: "#718096" }}>
                        <i className="bi bi-calendar-check me-2"></i>{t("Date To")}
                    </span>
                    <span style={{ fontWeight: 500, color: "#2d3748" }}>
                        {quarter.dateTo ? quarter.dateTo.split('T')[0] : "-"}
                    </span>
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "rgba(245, 158, 11, 0.1)",
                    borderRadius: "8px"
                }}>
                    <span style={{ fontSize: "13px", color: "#718096" }}>
                        <i className="bi bi-lock me-2"></i>{t("Lock Date")}
                    </span>
                    <span style={{ fontWeight: 500, color: quarter.lockDate ? "#d97706" : "#a0aec0" }}>
                        {quarter.lockDate ? quarter.lockDate.split('T')[0] : t("Not Set")}
                    </span>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <>
                <Breadcrumb items={breadcrumbItems} />
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "80px 0",
                    color: "#a0aec0"
                }}>
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    {t("Loading...")}
                </div>
            </>
        );
    }

    if (!fiscalYear) {
        return (
            <>
                <Breadcrumb items={breadcrumbItems} />
                <div style={{
                    textAlign: "center",
                    padding: "80px 0",
                    color: "#a0aec0"
                }}>
                    <i className="bi bi-exclamation-circle" style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}></i>
                    {t("Fiscal Year not found")}
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            {/* Summary Header */}
            <div style={{
                background: "linear-gradient(135deg, #0e1f69ff 0%, #3b4ebeff 100%)",
                borderRadius: "16px",
                padding: "24px 32px",
                marginBottom: "24px",
                color: "white",
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)"
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <h4 style={{ margin: 0, fontWeight: 600 }}>{t("Fiscal Year Details")}</h4>
                        <p style={{ margin: "8px 0 0 0", opacity: 0.9, fontSize: "14px" }}>
                            {t("Year")} {fiscalYear.yearFromDate} - {fiscalYear.yearToDate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Fiscal Year Info Card */}
            <div style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
                marginBottom: "24px"
            }}>
                <div style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "18px"
                    }}>
                        <i className="bi bi-calendar-range"></i>
                    </div>
                    <h6 style={{ margin: 0, fontWeight: 600, color: "#2d3748" }}>{t("Date Range")}</h6>
                </div>
                <div style={{ padding: "20px 24px" }}>
                    <div className="row g-3">
                        <div className="col-12 col-md-6 col-lg-3">
                            <InfoItem
                                label={t("Year From")}
                                value={fiscalYear.yearFromDate}
                                icon="bi bi-calendar-date"
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <InfoItem
                                label={t("Year To")}
                                value={fiscalYear.yearToDate}
                                icon="bi bi-calendar-date"
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <InfoItem
                                label={t("From Date")}
                                value={fiscalYear.fromDate ? fiscalYear.fromDate.split('T')[0] : "-"}
                                icon="bi bi-calendar-event"
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <InfoItem
                                label={t("To Date")}
                                value={fiscalYear.toDate ? fiscalYear.toDate.split('T')[0] : "-"}
                                icon="bi bi-calendar-check"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quarters Section */}
            <div style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)"
            }}>
                <div style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "18px"
                        }}>
                            <i className="bi bi-grid-3x3"></i>
                        </div>
                        <h6 style={{ margin: 0, fontWeight: 600, color: "#2d3748" }}>{t("Quarters")}</h6>
                    </div>
                    <span style={{
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: 600
                    }}>{fiscalYear.quarters?.length || 0}</span>
                </div>
                <div style={{ padding: "20px 24px" }}>
                    {fiscalYear.quarters && fiscalYear.quarters.length > 0 ? (
                        <div className="row g-4">
                            {fiscalYear.quarters.map((quarter, index) => (
                                <div className="col-12 col-md-6 col-xl-3" key={quarter.id || index}>
                                    <QuarterCard quarter={quarter} index={index} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "#a0aec0" }}>
                            <i className="bi bi-inbox" style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}></i>
                            {t("No Quarters Found")}
                        </div>
                    )}
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
                        <div style={{
                            background: "linear-gradient(135deg, rgba(59, 78, 190, 0.08) 0%, rgba(14, 31, 105, 0.08) 100%)",
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "20px"
                        }}>
                            <div className="row">
                                <div className="col-6">
                                    <div style={{ fontSize: "12px", color: "#718096", marginBottom: "4px" }}>{t("Date From")}</div>
                                    <div style={{ fontWeight: 500, color: "#2d3748" }}>
                                        {selectedQuarter.dateFrom ? selectedQuarter.dateFrom.split('T')[0] : "-"}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div style={{ fontSize: "12px", color: "#718096", marginBottom: "4px" }}>{t("Date To")}</div>
                                    <div style={{ fontWeight: 500, color: "#2d3748" }}>
                                        {selectedQuarter.dateTo ? selectedQuarter.dateTo.split('T')[0] : "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <label className="form-label" style={{ fontWeight: 500, color: "#2d3748" }}>{t("Lock Date")}</label>
                    <input
                        type="date"
                        className="form-control"
                        value={editLockDate}
                        onChange={(e) => setEditLockDate(e.target.value)}
                        style={{
                            borderRadius: "10px",
                            padding: "12px 16px",
                            border: "1px solid rgba(0,0,0,0.1)"
                        }}
                    />
                </div>
            </Modal>
            <ToastContainer />
            <SwalComponent />
        </>
    );
};

export default InfoFiscalYear;
