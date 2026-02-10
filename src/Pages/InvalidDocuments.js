import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import useTranslate from "../Hooks/Translation/useTranslate";
import axiosInstance from "../Axios/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const InvalidDocuments = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pageNumber] = useState(1);
  const [pageSize] = useState(10);

  const [sales, setSales] = useState([]);
  const [purchase, setPurchase] = useState([]);
//   const [doc41, setDoc41] = useState([]);

  /* ===================== MARK SALES / PURCHASE ===================== */
  const MarkDocUpdated = async (row, docType) => {
    try {
      const res = await axiosInstance.put(
        `Document/MarkUpdated/${row.docId}?type=${docType}`
      );

      if (res.data.result) {
        toast.success(res.data.message);

        if (docType === "Sales") {
          setSales(prev => prev.filter(d => d.id !== row.id));
        } else if (docType === "Purchase") {
          setPurchase(prev => prev.filter(d => d.id !== row.id));
        }

      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(t("Something went wrong"));
    }
  };

  /* ===================== MARK DOC 41 ===================== */
//   const MarkDoc41Updated = async (row) => {
//     try {
//       const res = await axiosInstance.put(
//         `Document41/MarkUpdated/${row.id}`
//       );

//       if (res.data.result) {
//         toast.success(res.data.message);

//         setDoc41(prev => prev.filter(d => d.id !== row.id));
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       toast.error(t("Something went wrong"));
//     }
//   };

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [salesRes, purchaseRes] = await Promise.all([
          axiosInstance.post("Sales/List", {
            filter: { isValid: false, isUpdated: false },
            pageNumber,
            pageSize,
          }),
          axiosInstance.post("Purchase/List", {
            filter: { isValid: false, isUpdated: false },
            pageNumber,
            pageSize,
          }),
        //   axiosInstance.post("Document41/List", {
        //     filter: { isValid: false, isUpdated: false },
        //     pageNumber,
        //     pageSize,
        //   }),
        ]);

        setSales(salesRes.data.data?.items || []);
        setPurchase(purchaseRes.data.data?.items || []);
        // setDoc41(doc41Res.data.data?.data || []);
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

  const totalCount = sales.length + purchase.length;

  /* ===================== CARD ===================== */
  const DocumentCard = ({
    title,
    count,
    items,
    colorClass,
    iconClass,
    onEdit,
    onMarkValid,
    getLabel,
    getSubLabel,
    getDate
  }) => (
    <div className="col-12 col-lg-6">
      <div style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
        height: "100%",
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
            <div
              className={`bg-${colorClass} bg-opacity-10 text-${colorClass}`}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px"
              }}
            >
              <i className={iconClass}></i>
            </div>
            <h6 style={{ margin: 0, fontWeight: 600 }}>{title}</h6>
          </div>
          <span
            style={{
              background: `var(--bs-${colorClass})`,
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600
            }}
          >
            {count}
          </span>
        </div>

        <div style={{ padding: "16px 24px", maxHeight: "350px", overflowY: "auto" }}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border spinner-border-sm me-2"></div>
              {t("Loading...")}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-check-circle fs-2"></i>
              <div>{t("All documents are valid")}</div>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={item.id || index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: index < items.length - 1
                    ? "1px solid rgba(0,0,0,0.06)"
                    : "none"
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{getLabel(item)}</div>
                  <div style={{ fontSize: "13px", color: "#718096" }}>
                    {getSubLabel(item)}
                  </div>
                </div>

                <div className="d-flex gap-2 align-items-center">
                  <span style={{ fontSize: "12px", color: "#a0aec0" }}>
                    {getDate(item)}
                  </span>

                  <button
                    onClick={() => onEdit(item)}
                    className="btn btn-sm"
                    style={{
                      background: `var(--bs-${colorClass})`,
                      color: "white"
                    }}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>

                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => onMarkValid(item)}
                    title={t("Mark as Valid")}
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
  );

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="row g-4">
        <DocumentCard
          title={t("Invalid Sales")}
          count={sales.length}
          items={sales}
          colorClass="primary"
          iconClass="bi bi-cart-x"
          onEdit={(item) => navigate(`/Sales/UpdateSale/${item.id}`)}
          onMarkValid={(item) => MarkDocUpdated(item, "Sales")}
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
          onMarkValid={(item) => MarkDocUpdated(item, "Purchase")}
          getLabel={(item) => item.invoiceNumber || `#${item.id}`}
          getSubLabel={(item) => item.customerSupplierName || "-"}
          getDate={(item) => item.invoiceDate?.split("T")[0] || "-"}
        />

        {/* <DocumentCard
          title={t("Invalid Document 41")}
          count={doc41.length}
          items={doc41}
          colorClass="danger"
          iconClass="bi bi-file-earmark-x"
          onEdit={(item) =>
            navigate(`/Purchase/UpdatePurchase/${item.purchaseId}/${item.documentItemId}`)
          }
          onMarkValid={(item) => MarkDoc41Updated(item)}
          getLabel={(item) => item.purchase?.document?.invoiceNumber || `#${item.id}`}
          getSubLabel={(item) => item.supplier?.name || "-"}
          getDate={(item) => item.transactionDate?.split("T")[0] || "-"}
        /> */}
      </div>

      <ToastContainer />
    </>
  );
};

export default InvalidDocuments;
