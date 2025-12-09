import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";

const Document41 = () => {
  const { t } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const breadcrumbItems = [
    { label: t("Document 41"), link: "/Document41", active: false }
  ];

  const breadcrumbButtons = [
    {
      label: t("Add"),
      icon: "bi bi-plus-circle",
      link: "/Document41/Add",
      class: "btn btn-sm btn-success ms-2 float-end"
    },
  ];

  const columns = [
    { label: t("Serial Number"), accessor: "serialNumber" },/* 
    { label: t("Tax Registration Number"), accessor: "supplier.taxRegistrationNumber" },
    { label: t("National ID"), accessor: "supplier.nationalId" }, */
    { label: t("Supplier Name"), accessor: "supplier.name" },
    { label: t("Transaction Date"), accessor: "transactionDate" },
    { label: t("Nature of Transaction"), accessor: "transactionNature.name" },
    { label: t("Item"), accessor: "item.name" },
    { label: t("Amount"), accessor: "amount" },
    { label: t("Transaction Nature"), accessor: "transactionNature.name" },
    { label: t("Price"), accessor: "price" },
    { label: t("Tax Percent"), accessor: "taxPercent" },
    { label: t("Deduction Percentage"), accessor: "deductionPercentage" },
    { label: t("Fiscal Year From"), accessor: "quarter.dateFrom" },
    { label: t("Fiscal Year To"), accessor: "quarter.dateTo" }
  ];

  const [arrData, setArrData] = useState([]);
  const [objFilter, setObjFilter] = useState({});

  const List = async (intPageNumber = 1) => {
    setPageNumber(intPageNumber);
    const res = await axiosInstance.post("Document41/List", {pageNumber: pageNumber, pageSize: pageSize, filter: objFilter});
    const result = res.data;
    if (!result.result) {
      alert(result.message);
      return;
    }
    for (let i = 0; i < result.data.data.length; i++) {
      result.data.data[i].deductionPercentage = result.data.data[i].price * result.data.data[i].taxPercent / 100;
    }
    setArrData(result.data.data);
    setTotalRows(result.data.totalRows);
    setTotalCount(result.data.totalCount);
  };

  useEffect(() => {
    List();
  }, []);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      <Table
        columns={columns}
        data={arrData}
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

export default Document41;
