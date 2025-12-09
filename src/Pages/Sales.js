import { useEffect, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";

const Sales = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);

  const breadcrumbItems = [
    { label: t("Sales"), link: "/Sales", active: false }
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      link: "/Sales/Add",
      class: "btn btn-sm btn-success ms-2 float-end"
    },
  ];
  const columns = [
    { label: t("Document Type"), accessor: "documentType" },
    { label: t("Tax Type"), accessor: "taxType" },
    { label: t("Table Goods Type"), accessor: "tableGoodsType" },
    { label: t("Invoice Number"), accessor: "invoiceNumber" },
    { label: t("Customer Name"), accessor: "Customer.name" },
    { label: t("Customer Tax Registration Number"), accessor: "Customer.taxRegistrationNumber" },
    { label: t("Customer Tax File Number"), accessor: "Customer.taxFileNumber" },
    { label: t("Address"), accessor: "Customer.address" },
    { label: t("National ID / Passport Number"), accessor: "Customer.nationalIdOrPassport" },
    { label: t("Mobile Number"), accessor: "Customer.phoneNumber" },
    { label: t("Invoice Date"), accessor: "invoiceDate" },
    { label: t("Product Name"), accessor: "product.name" },
    { label: t("Product Code"), accessor: "product.code" },
    { label: t("Statement Type"), accessor: "statementType" },
    { label: t("Item Type"), accessor: "itemType" },
    { label: t("Unit of Measure"), accessor: "product.unit" },
    { label: t("Unit Price"), accessor: "product.unitPrice" },
    { label: t("Tax Category"), accessor: "taxCategory" },
    { label: t("Product Quantity"), accessor: "product.quantity" },
    { label: t("Total Amount"), accessor: "totalAmount" },
    { label: t("Discount Value"), accessor: "discountAmount" },
    { label: t("Net Amount"), accessor: "netAmount" },
    { label: t("Tax Amount"), accessor: "taxAmount" },
    { label: t("Grand Total"), accessor: "grandTotal" }
  ];
  const data = [
    {
      documentType: "Invoice",
      taxType: "Value Added Tax",
      tableGoodsType: "General Goods",
      invoiceNumber: "INV-2025-001",
      customer: {
        name: "Global Supplies Co.",
        taxRegistrationNumber: "123456789",
        taxFileNumber: "TAX-998877",
        address: "123 Nile Street, Cairo, Egypt",
        nationalIdOrPassport: "29805231500123",
        phoneNumber: "+201012345678"
      },
      invoiceDate: "2025-11-05",
      product: {
        name: "Laptop HP ProBook 450",
        code: "HP450-G10",
        unit: "Piece",
        unitPrice: 25000.0,
        quantity: 2
      },
      statementType: "Sale",
      itemType: "Electronics",
      taxCategory: "Standard 14%",
      totalAmount: 50000.0,
      discountAmount: 1000.0,
      netAmount: 49000.0,
      taxAmount: 6860.0,
      grandTotal: 55860.0
    },
    {
      documentType: "Credit Note",
      taxType: "Value Added Tax",
      tableGoodsType: "Services",
      invoiceNumber: "CN-2025-032",
      customer: {
        name: "Tech Solutions Egypt",
        taxRegistrationNumber: "987654321",
        taxFileNumber: "TAX-223344",
        address: "45 Smart Village, Giza, Egypt",
        nationalIdOrPassport: "P98765432",
        phoneNumber: "+201115556677"
      },
      invoiceDate: "2025-11-01",
      product: {
        name: "Software License Renewal",
        code: "SW-REN2025",
        unit: "License",
        unitPrice: 1500.0,
        quantity: 10
      },
      statementType: "Return",
      itemType: "Digital Service",
      taxCategory: "Standard 14%",
      totalAmount: 15000.0,
      discountAmount: 0.0,
      netAmount: 15000.0,
      taxAmount: 2100.0,
      grandTotal: 17100.0
    }
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
    console.log(res);
    console.log('====================================');

    if (data.result) {
      setSales(data.data.data);
      setTotalCount(data.data.totalCount);
      setPageNumber(data.data.pageNumber);
    }
  } catch (e) {
    setError("Failed to fetch items");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    // fetch data here if needed
    fetchSales()
  }, []);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      <Table
        columns={columns}
        data={data}
        showActions={false}
        onEdit={() => { }}
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

export default Sales;
