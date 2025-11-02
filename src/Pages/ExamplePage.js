import React, { useState, useEffect } from "react";
import Table from "../Components/Layout/Table";
import axiosInstance from "../Axios/AxiosInstance";

const ExamplePage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("Agent");
      console.log("API response:", response.data);
      setAgents(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAgents();
  }, []);


  const columns = [
    { label: "Agent ID", accessor: "agentId" },
    { label: "Name", accessor: "agentName" },
    { label: "Abbreviation", accessor: "agentAbbreviation" },
    { label: "Available", accessor: "available" },
  ];
  if (loading)
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
  };

  return (
    <div className="container mx-auto p-6">
      <h3 className="text-xl font-semibold mb-4">Users</h3>
      <Table
        columns={columns}
        data={agents}
        showActions={true}
        onEdit={handleEdit}
        showShow={true}
        onShow={handleShow}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ExamplePage;
