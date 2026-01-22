import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import Pagination from "../Components/Layout/Pagination";
import Switch from "../Components/Layout/Switch";
import axiosInstance from "../Axios/AxiosInstance";
import { useSwal } from "../Hooks/Alert/Swal";

const Departments = () => {
    const { t } = useTranslate();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [arrData, setArrData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError, SwalComponent } = useSwal();

    const [objDepartment, setObjDepartment] = useState({
        id: -1,
        name: "",
        code: "",
        isActive: true,
    });

    const [errors, setErrors] = useState({});

    const objTitle = useMemo(
        () => ({
            Departments: t("Departments"),
            AddDepartment: t("Add Department"),
            EditDepartment: t("Edit Department"),
            Name: t("Name"),
            Code: t("Code"),
            IsActive: t("Is Active"),
            Save: t("Save"),
            Cancel: t("Cancel"),
            Delete: t("Delete"),
            DeleteConfirmation: t("Are you sure to delete"),
            QuestionMark: t("?"),
            Active: t("Active"),
            Inactive: t("Inactive"),
        }),
        [t]
    );

    const breadcrumbItems = [
        { label: t("Setup"), link: "/Setup", active: false },
        { label: t("Departments"), active: true },
    ];

    const breadcrumbButtons = [
        {
            label: t("Add"),
            icon: "bi bi-plus-circle",
            dyalog: "#AddDepartment",
            class: "btn btn-sm btn-success ms-2 float-end",
        },
    ];

    const columns = [
        { label: t("ID"), accessor: "id" },
        { label: t("Department Name"), accessor: "name" },
        { label: t("Department Code"), accessor: "code" },
        {
            label: t("Status"),
            accessor: "isActive",
            render: (value) => (
                <span className={`badge ${value ? 'bg-success' : 'bg-danger'}`}>
                    {value ? objTitle.Active : objTitle.Inactive}
                </span>
            )
        },
    ];

    const ListAll = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.post("Department/ListAll", {});
            // Handle different response formats
            if (Array.isArray(res.data)) {
                // Direct array response
                setArrData(res.data);
                setTotalCount(res.data.length);
            } else if (res.data.result !== undefined) {
                // Wrapped response with result property
                if (res.data.result) {
                    setArrData(res.data.data || []);
                    setTotalCount(res.data.data?.length || 0);
                } else {
                    showError(t("Error"), res.data.message);
                }
            } else if (res.data.data) {
                // Response with data property but no result
                setArrData(res.data.data);
                setTotalCount(res.data.data.length);
            } else {
                setArrData([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("ListAll error:", error);
            showError(t("Error"), t("Failed to load departments"));
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!objDepartment.name?.trim()) {
            newErrors.name = t("Name is required");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = async () => {
        if (!validateForm()) return;

        try {
            const payload = {
                name: objDepartment.name,
                code: objDepartment.code,
                isActive: objDepartment.isActive,
            };
            const res = await axiosInstance.post("Department/Add", payload);
            if (res.data.result) {
                showSuccess(t("Success"), res.data.message || t("Department added successfully"));
                hideModal("AddDepartment");
                reset();
                ListAll();
            } else {
                showError(t("Error"), res.data.message);
            }
        } catch (error) {
            showError(t("Error"), t("Failed to add department"));
        }
    };

    const handleToggle = async (row) => {
        try {
            const res = await axiosInstance.put(`Department/toggle/${row.id}`);
            if (res.data.result) {
                showSuccess(t("Success"), res.data.message || t("Department status updated"));
                ListAll();
            } else {
                showError(t("Error"), res.data.message);
            }
        } catch (error) {
            showError(t("Error"), t("Failed to toggle department status"));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setObjDepartment((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const reset = () => {
        setObjDepartment({
            id: -1,
            name: "",
            code: "",
            isActive: true,
        });
        setErrors({});
    };

    useEffect(() => {
        ListAll();
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
                    showDelete={false}
                    customActions={(row) => (
                        <Switch
                            id={`switch-${row.id}`}
                            checked={row.isActive}
                            onChange={() => handleToggle(row)}
                        />
                    )}
                />

                <Pagination
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    totalRows={totalCount}
                    onPageChange={setPageNumber}
                />
            </div>

            {/* Add Department Modal */}
            <Modal
                id="AddDepartment"
                title={objTitle.AddDepartment}
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
                            value={objDepartment.name}
                            onChange={handleChange}
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            placeholder={objTitle.Name}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">{objTitle.Code}</label>
                        <input
                            type="text"
                            name="code"
                            value={objDepartment.code}
                            onChange={handleChange}
                            className="form-control"
                            placeholder={objTitle.Code}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={objDepartment.isActive}
                                onChange={handleChange}
                                className="form-check-input"
                            />
                            <label htmlFor="isActive" className="form-check-label">
                                {objTitle.IsActive}
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>

            <SwalComponent />
        </>
    );
};

export default Departments;
