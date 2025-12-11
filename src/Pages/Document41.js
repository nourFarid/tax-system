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
    {
      label: t("Export"),
      icon: "bi bi-box-arrow-up-right",
      fun: async () => {
        const res = await axiosInstance.post("Document41/ExportExcel", objFilter, { responseType: "blob" });

        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Document41.xlsx";
        a.click();
        window.URL.revokeObjectURL(url)
      },
      class: "btn btn-sm btn-warning ms-2 float-end"
    }
  ];

  const columns = [
    { label: t("Supplier Name"), accessor: "supplier.name" },
    { label: t("Transaction Date"), accessor: "transactionDate" },
    { label: t("Amount"), accessor: "amount" },
    { label: t("Transaction Nature"), accessor: "transactionNature.name" },
    { label: t("Price"), accessor: "price" },
    { label: t("Tax Percent"), accessor: "transactionNature.ratePercent" },
    { label: t("Deduction Percentage"), accessor: "deductionPercentage" },
    { label: t("Fiscal Year From"), accessor: "quarter.dateFrom" },
    { label: t("Fiscal Year To"), accessor: "quarter.dateTo" }
  ];

  const [arrData, setArrData] = useState([]);
  const [objFilter, setObjFilter] = useState({quarterId:12});

  const List = async (intPageNumber = 1) => {
    setPageNumber(intPageNumber);
    const res = await axiosInstance.post("Document41/List", {pageNumber: pageNumber, pageSize: pageSize, filter: objFilter});
    const result = res.data;
    if (!result.result) {
      alert(result.message);
      return;
    }
    for (let i = 0; i < result.data.data.length; i++) {
      result.data.data[i].deductionPercentage = result.data.data[i].price * result.data.data[i].transactionNature.ratePercent / 100;
    }
    setArrData(result.data.data);
    setTotalRows(result.data.totalRows);
    setTotalCount(result.data.totalCount);
  };

  const Edit = (objRow) => {
    window.location.href = `/Document41/Edit?id=${objRow.id}`;
  }

  useEffect(() => {
    List();
  }, []);

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

      <Table
        columns={columns}
        data={arrData}
        showActions={true}
        onEdit={Edit}
        showShow={false}
        onShow={() => { }}
        onDelete={() => { setObjFilter({quarterId:10})}}
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
