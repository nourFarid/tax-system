import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import Pagination from "../Components/Layout/Pagination";
import axiosInstance from "../Axios/AxiosInstance";
import { useSwal } from "../Hooks/Alert/Swal";

const Position = () => {
    const { t } = useTranslate();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [arrData, setArrData] = useState([]);
    const [arrDepartments, setArrDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError, showDeleteAlert, SwalComponent } = useSwal();

    const [objPosition, setObjPosition] = useState({
        id: 0,
        name: "",
        departmentId: "",
    });

    const [errors, setErrors] = useState({});

    const objTitle = useMemo(
        () => ({
            Positions: t("Positions"),
            AddPosition: t("Add Position"),
            EditPosition: t("Edit Position"),
            Name: t("Name"),
            Department: t("Department"),
            Save: t("Save"),
            Cancel: t("Cancel"),
            Delete: t("Delete"),
            DeleteConfirmation: t("Are you sure to delete"),
            QuestionMark: t("?"),
            SelectDepartment: t("Select Department"),
        }),
        [t]
    );

    const breadcrumbItems = [
        { label: t("Setup"), link: "/Setup", active: false },
        { label: t("Positions"), active: true },
    ];

    const breadcrumbButtons = [
        {
            label: t("Add"),
            icon: "bi bi-plus-circle",
            dyalog: "#AddPosition",
            class: "btn btn-sm btn-success ms-2 float-end",
        },
    ];

    const columns = [
        { label: t("ID"), accessor: "id" },
        { label: t("Name"), accessor: "name" },
        {
            label: t("Department"),
            accessor: "department",
            render: (row) => row.department?.name || "-"
        },
    ];

    const ListDepartments = async () => {
        try {
            const res = await axiosInstance.post("Department/ListAll", {});
            if (Array.isArray(res.data)) {
                setArrDepartments(res.data);
            } else if (res.data.result) {
                setArrDepartments(res.data.data || []);
            } else if (res.data.data) {
                setArrDepartments(res.data.data);
            }
        } catch (error) {
            console.error("ListDepartments error:", error);
        }
    };

    const ListAll = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.post("Position/ListAll", {});
            if (Array.isArray(res.data)) {
                setArrData(res.data);
                setTotalCount(res.data.length);
            } else if (res.data.result) {
                setArrData(res.data.data || []);
                setTotalCount(res.data.data?.length || 0);
            } else if (res.data.data) {
                setArrData(res.data.data);
                setTotalCount(res.data.data.length);
            } else {
                setArrData([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("ListAll error:", error);
            showError(t("Error"), t("Failed to load positions"));
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!objPosition.name?.trim()) {
            newErrors.name = t("Name is required");
        }
        if (!objPosition.departmentId) {
            newErrors.departmentId = t("Department is required");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = async () => {
        if (!validateForm()) return;

        try {
            const payload = {
                name: objPosition.name,
                departmentId: parseInt(objPosition.departmentId),
            };
            const res = await axiosInstance.post("Position/Add", payload);
            if (res.data.result) {
                showSuccess(t("Success"), res.data.message || t("Position added successfully"));
                hideModal("AddPosition");
                reset();
                ListAll();
            } else {
                showError(t("Error"), res.data.message);
            }
        } catch (error) {
            showError(t("Error"), t("Failed to add position"));
        }
    };

    const handleDelete = (row) => {
        showDeleteAlert(t("Are you sure to delete"), async () => {
            try {
                const res = await axiosInstance.delete(`Position/Delete/${row.id}`);
                if (res.data.result) {
                    showSuccess(t("Success"), res.data.message || t("Deleted Successfully!"));
                    ListAll();
                } else {
                    showError(t("Error"), res.data.message);
                }
            } catch (error) {
                showError(t("Error"), t("Failed to delete position"));
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setObjPosition((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const reset = () => {
        setObjPosition({
            id: 0,
            name: "",
            departmentId: "",
        });
        setErrors({});
    };

    useEffect(() => {
        ListAll();
        ListDepartments();
    }, []);

    return (
        <>
            <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

            <div className="bg-white p-3 shadow-sm shadow-lg">
                <Table
                    columns={columns}
                    data={arrData}
                    showActions={true}
                    showEdit={false}
                    showShow={false}
                    showDelete={true}
                    onDelete={handleDelete}
                />

                <Pagination
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    totalRows={totalCount}
                    onPageChange={setPageNumber}
                />
            </div>

            {/* Add Position Modal */}
            <Modal
                id="AddPosition"
                title={objTitle.AddPosition}
                size="lg"
                onSave={handleAdd}
                onHide={reset}
                saveLabel={objTitle.Save}
                cancelLabel={objTitle.Cancel}
            >
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">{objTitle.Name}</label>
                        <input
                            type="text"
                            name="name"
                            value={objPosition.name}
                            onChange={handleChange}
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            placeholder={objTitle.Name}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">{objTitle.Department}</label>
                        <select
                            name="departmentId"
                            value={objPosition.departmentId}
                            onChange={handleChange}
                            className={`form-select ${errors.departmentId ? "is-invalid" : ""}`}
                        >
                            <option value="">{objTitle.SelectDepartment}</option>
                            {arrDepartments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        {errors.departmentId && <div className="invalid-feedback">{errors.departmentId}</div>}
                    </div>
                </div>
            </Modal>

            <SwalComponent />
        </>
    );
};

export default Position;
