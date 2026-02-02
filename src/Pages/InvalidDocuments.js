import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import axiosInstance from "../Axios/AxiosInstance";
import { useNavigate } from "react-router-dom";

const InvalidDocuments = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [pageNumber] = useState(1);
    const [pageSize] = useState(10);

    const [sales, setSales] = useState([]);
    const [purchase, setPurchase] = useState([]);
    const [doc41, setDoc41] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [salesRes, purchaseRes, doc41Res] = await Promise.all([
                    axiosInstance.post("Sales/List", {
                        filter: { isValid: false },
                        pageNumber,
                        pageSize,
                    }),
                    axiosInstance.post("Purchase/List", {
                        filter: { isValid: false },
                        pageNumber,
                        pageSize,
                    }),
                    axiosInstance.post("Document41/List", {
                        filter: { isValid: false },
                        pageNumber,
                        pageSize,
                    }),
                ]);
                setSales(salesRes.data.data?.items || []);
                setPurchase(purchaseRes.data.data?.items || []);
                setDoc41(doc41Res.data.data?.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [pageNumber]);

    const breadcrumbItems = [
        { label: t("Invalid Documents"), link: "/InvalidDocuments", active: true },
    ];

    const totalCount = sales.length + purchase.length + doc41.length;

    // Card component for each category
    const DocumentCard = ({ title, count, items, colorClass, iconClass, onEdit, getLabel, getSubLabel, getDate }) => (
        <div className="col-12 col-lg-4">
            <div style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
                height: "100%",
                border: "1px solid rgba(0,0,0,0.05)"
            }}>
                {/* Header */}
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px"
                        }} className={`bg-${colorClass} bg-opacity-10 text-${colorClass}`}>
                            <i className={iconClass}></i>
                        </div>
                        <h6 style={{ margin: 0, fontWeight: 600, color: "#2d3748" }}>{title}</h6>
                    </div>
                    <span style={{
                        background: `var(--bs-${colorClass})`,
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: 600
                    }}>{count}</span>
                </div>

                {/* Body */}
                <div style={{ padding: "16px 24px", maxHeight: "350px", overflowY: "auto" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "#a0aec0" }}>
                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            {t("Loading...")}
                        </div>
                    ) : items.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "#a0aec0" }}>
                            <i className="bi bi-check-circle" style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}></i>
                            {t("All documents are valid")}
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={item.id || index} style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px 0",
                                borderBottom: index < items.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none"
                            }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 500, color: "#2d3748", marginBottom: "2px" }}>
                                        {getLabel(item)}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#718096" }}>
                                        {getSubLabel(item)}
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span style={{ fontSize: "12px", color: "#a0aec0" }}>
                                        {getDate(item)}
                                    </span>
                                    <button
                                        onClick={() => onEdit(item)}
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "8px",
                                            border: "none",
                                            background: `var(--bs-${colorClass})`,
                                            color: "white",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "transform 0.2s, opacity 0.2s"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
                                        onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                                        title={t("Edit")}
                                    >
                                        <i className="bi bi-pencil" style={{ fontSize: "14px" }}></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            {/* Summary Header */}
            <div style={{
                background: "linear-gradient(135deg, #0e1f69ff 0%, #2d43c8ff 100%)",
                borderRadius: "16px",
                padding: "24px 32px",
                marginBottom: "24px",
                color: "white",
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)"
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <h4 style={{ margin: 0, fontWeight: 600 }}>{t("Invalid Documents")}</h4>
                        <p style={{ margin: "8px 0 0 0", opacity: 0.9, fontSize: "14px" }}>
                            {t("Documents that need attention or correction")}
                        </p>
                    </div>
                    <div style={{
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "12px",
                        padding: "12px 20px",
                        textAlign: "center"
                    }}>
                        <div style={{ fontSize: "28px", fontWeight: 700 }}>{totalCount}</div>
                        <div style={{ fontSize: "12px", opacity: 0.9 }}>{t("Total")}</div>
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="row g-4">
                <DocumentCard
                    title={t("Invalid Sales")}
                    count={sales.length}
                    items={sales}
                    colorClass="primary"
                    iconClass="bi bi-cart-x"
                    onEdit={(item) => navigate(`/Sales/UpdateSale/${item.id}`)}
                    getLabel={(item) => item.invoiceNumber || `#${item.id}`}
                    getSubLabel={(item) => item.customerSupplierName || "-"}
                    getDate={(item) => item.invoiceDate?.split("T")[0] || "-"}
                />

                <DocumentCard
                    title={t("Invalid Purchases")}
                    count={purchase.length}
                    items={purchase}
                    colorClass="warning"
                    iconClass="bi bi-bag-x"
                    onEdit={(item) => navigate(`/Purchase/UpdatePurchase/${item.id}`)}
                    getLabel={(item) => item.invoiceNumber || `#${item.id}`}
                    getSubLabel={(item) => item.customerSupplierName || "-"}
                    getDate={(item) => item.invoiceDate?.split("T")[0] || "-"}
                />

                <DocumentCard
                    title={t("Invalid Document 41")}
                    count={doc41.length}
                    items={doc41}
                    colorClass="danger"
                    iconClass="bi bi-file-earmark-x"
                    onEdit={(item) => navigate(`/Purchase/UpdatePurchase/${item.purchaseId}`)}
                    getLabel={(item) => item.purchase?.document?.invoiceNumber || `#${item.id}`}
                    getSubLabel={(item) => item.supplier?.name || "-"}
                    getDate={(item) => item.transactionDate?.split("T")[0] || "-"}
                />
            </div>
        </>
    );
};

export default InvalidDocuments;
