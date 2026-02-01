import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import axiosInstance from "../Axios/AxiosInstance";
import { useNavigate } from "react-router-dom";
import Item from './Item';

const InvalidDocuments = () => {
    const { t } = useTranslate();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(5);

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
        { label: t("Invalid Documents"), link: "/InvalidDocuments", active: false },
    ];
    return (
        <>
            <>
                <Breadcrumb items={breadcrumbItems} />


                <div className="container-fluid mt-4">
                    <div className="row g-4">
                        {/* Sales */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">{t("Invalid Sales")}</h6>
                                    <span className="badge bg-primary">{sales.length}</span>
                                </div>

                                <div className="card-body overflow-auto">
                                    {loading ? (
                                        <p className="text-muted text-center">Loading...</p>
                                    ) : sales.length === 0 ? (
                                        <p className="text-muted text-center">
                                            No invalid sales
                                        </p>
                                    ) : (
                                        sales.map((item) => (
                                            <div
                                                key={item.id}
                                                className="d-flex justify-content-between align-items-center py-2 border-bottom"
                                            >
                                                <div>
                                                    <div className="fw-medium">{item.invoiceNumber}</div>
                                                    <small className="text-muted">
                                                        {item.customerSupplierName}
                                                    </small>
                                                </div>

                                                <div className="d-flex align-items-center gap-2">
                                                    <small className="text-muted">{item.invoiceDate}</small>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary"
                                                        title={t("Edit")} onClick={() => navigate(`/Sales/UpdateSale/${item.id}`)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>

                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary"
                                                        title={t("Edit")} onClick={() => {}}
                                                    >
                                                        <i className="bi bi-check2"></i>

                                                    </button>
                                                </div>
                                            </div>

                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Purchase */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">{t("Invalid Purchases")}</h6>
                                    <span className="badge bg-warning text-dark">
                                        {purchase.length}
                                    </span>
                                </div>

                                <div className="card-body overflow-auto">
                                    {loading ? (
                                        <p className="text-muted text-center">Loading...</p>
                                    ) : purchase.length === 0 ? (
                                        <p className="text-muted text-center">
                                            No invalid purchases
                                        </p>
                                    ) : (
                                        purchase.map((item) => (
                                            <div
                                                key={item.id}
                                                className="d-flex justify-content-between align-items-center py-2 border-bottom"
                                            >
                                                <span className="fw-medium">
                                                    {item.invoiceNumber || item.id}
                                                </span>

                                                <div className="d-flex align-items-center gap-2">
                                                    <small className="text-muted">{item.invoiceDate}</small>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary"
                                                        title={t("Edit")} onClick={() => navigate(`/Purchase/UpdatePurchase/${item.id}`)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>

                                                    </button>  <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary"
                                                        title={t("Edit")} onClick={() => {}}
                                                    >
                                                        <i className="bi bi-check2"></i>

                                                    </button>
                                                </div>
                                            </div>

                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Doc 41 */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">{t("Invalid Document 41")}</h6>
                                    <span className="badge bg-danger">{doc41.length}</span>
                                </div>

                                <div className="card-body overflow-auto">
                                    {loading ? (
                                        <p className="text-muted text-center">Loading...</p>
                                    ) : doc41.length === 0 ? (
                                        <p className="text-muted text-center">
                                            No invalid documents
                                        </p>
                                    ) : (
                                        doc41.map((item) => (
                                            <div
                                                key={item.id}
                                                className="d-flex justify-content-between align-items-center py-2 border-bottom"
                                            >
                                                <span className="fw-medium">
                                                    {item.purchase.document.invoiceNumber}
                                                </span>

                                                <div className="d-flex align-items-center gap-2">
                                                    <small className="text-muted">{item.transactionDate}</small>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary"
                                                        title={t("Edit")}
                                                        onClick={() => navigate(`/Purchase/UpdatePurchase/${item.purchaseId}`)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>


                                                    </button>  <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary"
                                                        title={t("Edit")} onClick={() => {}}
                                                    >
                                                        <i className="bi bi-check2"></i>

                                                    </button>


                                                </div>
                                            </div>

                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        </>
    );
};

export default InvalidDocuments;
