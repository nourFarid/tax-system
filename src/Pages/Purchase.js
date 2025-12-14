import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import { useNavigate } from "react-router-dom";

const Purchase = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: t("Purchase"), link: "/Purchase", active: false }
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      link: "/Purchase/Add",
      class: "btn btn-sm btn-success ms-2 float-end"
    },
  ];
  const columns = [
    { label: t("Document Type"), accessor: "documentType.name" },
    { label: t("Invoice Number"), accessor: "invoiceNumber" },
    { label: t("Supplier Name"), accessor: "customerSupplierName" },
    { label: t("Tax Registration Number"), accessor: "customerSupplierTaxRegistrationNumber" },
    { label: t("Address"), accessor: "customerSupplierAddress" },
    { label: t("National ID / Passport Number"), accessor: "CustomerSupplierIdentificationNumber" },
    { label: t("Invoice Date"), accessor: "invoiceDate" },
    { label: t("Item Name"), accessor: "item.name" },
    { label: t("Statment Type"), accessor: "statementType.name" },
    { label: t("Item Type"), accessor: "itemType.name" },
    { label: t("Price"), accessor: "item.price" },
    { label: t("Amount"), accessor: "amount" },
    { label: t("Tax Amount"), accessor: "tax" },

  ];

  const fetchSales = async (page = 1, pageSize = 10, sortBy = "invoiceDate", isDescending = true) => {
    setLoading(true);
    try {
      const body = {
        filter: {},
        pageNumber: page,
        pageSize,
        sortBy,
        isDescending
      };

      const res = await axiosInstance.post("Purchase/List", body);
      const data = res.data;
      console.log('====================================');
      console.log(data.data.items);
      console.log('====================================');
      if (data.result) {
        setSales(data.data.items);
        setTotalCount(data.data.totalCount);
        setPageNumber(data.data.pageNumber);
        console.log('=====sssssssss===============================');
        console.log(sales);
        console.log('====================================');
      }

    } catch (e) {
      setError("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales()
  }, []);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      <Table
        columns={columns}
        data={sales}
        showActions={true}
onEdit={(row) => {
  navigate(`/Purchase/UpdatePurchase/${row.id}`);
}}


         showShow={false}
        onShow={() => { }}
        onDelete={() => { }}
      />
      <Pagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRows={totalCount}
        onPageChange={setPageNumber}
      />
    </>
  );
};

export default Purchase;
