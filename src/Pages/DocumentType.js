import { useEffect } from "react";
import Breadcrumb from './../Components/Layout/Breadcrumb';
import Table from "../Components/Layout/Table";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../../node_modules/bootstrap/dist/js/bootstrap"
// import "../Assets/css/EgyptAir.css"

const DocumentType = () => {
  const breadcrumbItems = [
    { label: "Setup", link: "/Setup", active: false },
    { label: "Document Type", active: true },
  ];
  const breadcrumbButtons = [
    {
      label: "Add New",
      icon: "bi bi-plus-circle",
      dyalog: "#exampleModal",
      class: "btn btn-sm btn-success ms-2 float-end"
    },
  ];

  const columns = [
    { label: "ID", accessor: "id" },
    { label: "Name", accessor: "name" },
    { label: "Code", accessor: "code" }
  ];
  const data = [
    {
      id: 1,
      name: "test1",
      code: "test123",
    },
    {
      id: 2,
      name: "test2",
      code: "test123",
    },
  ]
    const handleEdit = (row) => {
    // alert(`Edit ${data.agentName}`);
  };
  const handleShow = (row) => {
    // alert(`Agent Name: ${row.agentName}\nAvailable: ${row.available}`);
  };

  const handleDelete = (row) => {
    // setAgents((prev) => prev.filter((r) => r.agentId !== row.agentId));
  };
  useEffect(() => {
    // fetchAgents();
  }, []);
  /* if (loading)
    return <p className="text-center mt-5 text-gray-500">Loading...</p>;

  if (error)
    return <p className="text-center mt-5 text-red-500">{error}</p>;

  const handleEdit = (row) => {
    alert(`Edit ${row.agentName}`);
  };
  const handleShow = (row) => {
    alert(`Agent Name: ${row.agentName}\nAvailable: ${row.available}`);
  };

  const handleDelete = (row) => {
    setAgents((prev) => prev.filter((r) => r.agentId !== row.agentId));
  }; */

  return (
    <>
      <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />
      <Table
        columns={columns}
        data={data}
        showActions={true}
        onEdit={handleEdit}
        showShow={true}
        onShow={handleShow}
        onDelete={handleDelete}
      />
    </>
  );
};

export default DocumentType;
