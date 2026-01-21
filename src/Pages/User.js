import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Components/Layout/Breadcrumb";
import Table from "../Components/Layout/Table";
import useTranslate from "../Hooks/Translation/useTranslate";
import Modal, { showModal, hideModal } from "../Components/Layout/Modal";
import Pagination from '../Components/Layout/Pagination';
import axiosInstance from "../Axios/AxiosInstance";
import { useSwal } from "../Hooks/Alert/Swal";

const User = () => {
    const { t } = useTranslate();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const objTitle = useMemo(
        () => ({
            AddUser: t("Add User"),
            EditUser: t("Edit User"),
            ID: t("ID"),
            Username: t("Username"),
            Email: t("Email"),
            Password: t("Password"),
            FullName: t("Full Name"),
            UserCode: t("User Code"),
            Role: t("Role"),
            IsActive: t("Active"),
            Save: t("Save"),
            Cancel: t("Cancel"),
            Filter: t("Filter"),
            Reset: t("Reset"),
        }),
        [t]
    );

    const [objUser, setObjUser] = useState({
        Username: "",
        Email: "",
        Password: "",
        FullName: "",
        UserCode: "",
        RoleId: "",
        IsActive: true
    });
    const { showSuccess, showError, SwalComponent } = useSwal();

    // Function to reset form to initial state
    const resetForm = () => {
        setObjUser({
            Id: null,
            Username: "",
            Email: "",
            Password: "",
            FullName: "",
            UserCode: "",
            RoleId: "",
            IsActive: true
        });
        setErrors({});
    };

    // Handler for opening Add modal
    const handleOpenAddModal = () => {
        resetForm();
        showModal("AddUser");
    };

    const breadcrumbItems = [
        { label: t("Setup"), link: "/Setup", active: false },
        { label: t("User"), active: true },
    ];

    const breadcrumbButtons = [
        {
            label: t("Add"),
            icon: "bi bi-plus-circle",
            fun: handleOpenAddModal,
            class: "btn btn-sm btn-success ms-2 float-end",
        },
    ];

    const columns = [
        { label: t("Username"), accessor: "userName" },
        { label: t("Email"), accessor: "email" },
        { label: t("Full Name"), accessor: "fullName" },
        { label: t("User Role"), accessor: "roleName", render: (value) => value || "-" },
        { label: t("User Code"), accessor: "userName", render: (value) => value ? value.replace(/\D/g, "") : "" },
        {
            label: t("Active"), accessor: "isActive", render: (value, row) => {
                // Check both possible field names
                const isActive = value ?? row?.available ?? row?.isActive ?? false;
                return isActive ? "Active" : "Inactive";
            }
        }
    ];

    const validateForm = (isEdit = false) => {
        const newErrors = {};

        if (!objUser.Username || objUser.Username.trim() === "") {
            newErrors.Username = "Username is required";
        }

        if (!objUser.Email || objUser.Email.trim() === "") {
            newErrors.Email = "Email is required";
        } else {
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(objUser.Email)) {
                newErrors.Email = "Invalid email format";
            }
        }

        if (!objUser.FullName || objUser.FullName.trim() === "") {
            newErrors.FullName = "Full Name is required";
        }

        // UserCode validation - required only when adding, optional when editing
        if (!isEdit) {
            if (!objUser.UserCode || objUser.UserCode.trim() === "") {
                newErrors.UserCode = "User Code is required";
            } else {
                const userCodeNum = parseInt(objUser.UserCode, 10);
                if (isNaN(userCodeNum) || userCodeNum <= 0) {
                    newErrors.UserCode = "User Code must be a positive number";
                }
            }
        } else {
            // When editing, validate only if UserCode is provided
            if (objUser.UserCode && objUser.UserCode.trim() !== "") {
                const userCodeNum = parseInt(objUser.UserCode, 10);
                if (isNaN(userCodeNum) || userCodeNum <= 0) {
                    newErrors.UserCode = "User Code must be a positive number";
                }
            }
        }

        // Password is required only when adding, optional when editing
        if (!isEdit && (!objUser.Password || objUser.Password.trim() === "")) {
            newErrors.Password = "Password is required";
        }

        // Password strength validation (if password is provided)
        if (objUser.Password && objUser.Password.trim() !== "") {
            const password = objUser.Password;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(password);

            if (!hasUpperCase || !hasLowerCase || !hasNonAlphanumeric) {
                const requirements = [];
                if (!hasUpperCase) requirements.push("uppercase letter");
                if (!hasLowerCase) requirements.push("lowercase letter");
                if (!hasNonAlphanumeric) requirements.push("special character");
                newErrors.Password = `Password must contain: ${requirements.join(", ")}`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("User/ListAll");
            const data = res.data;

            if (data.result) {
                setUsers(data.data);
                setTotalCount(data.data.length);
                setPageNumber(page);
            }
        } catch (e) {
            setError("Failed to fetch users");
            showError("Error", "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await axiosInstance.get("User/ListAllRoles");
            const data = res.data;
            if (data.result) {
                setRoles(data.data);
            }
        } catch (e) {
            console.error("Failed to fetch roles", e);
        }
    };

    const mappedUsers = users.map(u => ({
        ...u
    }));

    const columnsUpdated = [
        ...columns
    ];

    const handleEdit = (row) => {
        console.log("Edit row data:", row);
        // Reset errors before populating edit data
        setErrors({});

        // Extract userCode from userName if not available (remove non-digit characters)
        const extractedUserCode = row.userCode || (row.userName ? row.userName.replace(/\D/g, "") : "");

        setObjUser({
            Id: row.userId,
            Username: row.userName,
            Email: row.email,
            Password: "", // Password is optional when editing
            FullName: row.fullName,
            UserCode: extractedUserCode,
            RoleId: row.roleId || "",
            IsActive: row.available ?? row.isActive ?? true
        });

        showModal("EditUser");
    };

    const handleShow = (row) => {
        // Not implemented
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If UserCode changes, auto-generate Username as "GS" + UserCode
        if (name === "UserCode") {
            setObjUser((prev) => ({
                ...prev,
                UserCode: value,
                Username: "GS" + value
            }));
        } else {
            setObjUser((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        if (!validateForm(false)) return;
        try {
            const payload = {
                Username: objUser.Username,
                Email: objUser.Email,
                Password: objUser.Password,
                FullName: objUser.FullName,
                UserCode: objUser.UserCode,
                RoleId: objUser.RoleId,
                IsActive: objUser.IsActive
            };
            const response = await axiosInstance.post("User/Add", payload);
            console.log("Add response:", response.data);

            resetForm();

            hideModal("AddUser");
            await fetchUsers(pageNumber);
            showSuccess("Success", "User added successfully!");

        } catch (error) {
            console.error("Failed to add User", error);
            showError("Error", error.response?.data?.message || "Failed to add User");
        }
    };

    const handleUpdate = async () => {
        if (!validateForm(true)) return;
        try {
            const payload = {
                userId: objUser.Id,
                userName: objUser.Username,
                email: objUser.Email,
                fullName: objUser.FullName,
                available: objUser.IsActive,
                isActive: objUser.IsActive,  // Send both field names to match backend
                newUser: false,
                // Send null for empty values instead of empty strings
                userCode: (objUser.UserCode && objUser.UserCode.toString().trim() !== "") ? objUser.UserCode : null,
                roleId: (objUser.RoleId && objUser.RoleId.toString().trim() !== "") ? objUser.RoleId : null
            };

            // Only include password if it has a value (completely exclude from payload otherwise)
            if (objUser.Password && objUser.Password.trim() !== "") {
                payload.password = objUser.Password;
            }

            console.log("Sending update payload:", payload);

            const response = await axiosInstance.post(
                "User/Update",
                payload
            );

            console.log("Update response:", response.data);

            if (response.data && response.data.result) {
                resetForm();

                hideModal("EditUser");
                await fetchUsers(pageNumber);
                showSuccess("Success", "User updated successfully!");
            } else {
                showError("Error", response.data?.message || "Failed to update user");
            }

        } catch (error) {
            console.log(error);
            showError("Error", error.response?.data?.message || "Failed to update user");
        }
    };

    useEffect(() => {
        fetchUsers(pageNumber);
        fetchRoles();
    }, [pageNumber]);

    if (loading) return <div>{t("Loading...")}</div>;
    if (error) return <div>{t(error)}</div>;

    return (
        <>
            <Breadcrumb items={breadcrumbItems} button={breadcrumbButtons} />

            <Table
                columns={columnsUpdated}
                data={mappedUsers}
                showActions={true}
                onEdit={handleEdit}
                showShow={false}
                onShow={handleShow}
                showDelete={false}
            />
            <Pagination
                pageNumber={pageNumber}
                pageSize={pageSize}
                totalRows={totalCount}
                onPageChange={setPageNumber}
            />

            {/* Add User Modal */}
            <Modal
                id="AddUser"
                title={objTitle.AddUser}
                size="lg"
                onSave={handleSave}
                onHide={resetForm}
                saveLabel={objTitle.Save}
                cancelLabel={objTitle.Cancel}
            >
                <div className="row">
                    <div className="col-md-6">
                        <label className="form-label">{objTitle.UserCode}</label>
                        <input type="text" name="UserCode" value={objUser.UserCode} onChange={handleChange} className={`form-control ${errors.UserCode ? "is-invalid" : ""}`} placeholder={objTitle.UserCode} autoComplete="off" />
                        {errors.UserCode && <div className="invalid-feedback">{errors.UserCode}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">{objTitle.Username}</label>
                        <input type="text" name="Username" value={objUser.Username} onChange={handleChange} className="form-control" placeholder={objTitle.Username} autoComplete="off" readOnly disabled style={{ backgroundColor: "#e9ecef" }} />
                        <small className="text-muted">Auto-generated: GS + User Code</small>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-6">
                        <label className="form-label">{objTitle.Email}</label>
                        <input type="email" name="Email" value={objUser.Email} onChange={handleChange} className={`form-control ${errors.Email ? "is-invalid" : ""}`} placeholder={objTitle.Email} autoComplete="off" />
                        {errors.Email && <div className="invalid-feedback">{errors.Email}</div>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{objTitle.Password}</label>
                        <input type="password" name="Password" value={objUser.Password} onChange={handleChange} className={`form-control ${errors.Password ? "is-invalid" : ""}`} placeholder={objTitle.Password} autoComplete="new-password" />
                        {errors.Password && <div className="invalid-feedback">{errors.Password}</div>}
                        <small className="text-muted">Must contain: uppercase, lowercase, and special character (!@#$%^&*)</small>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-6">
                        <label className="form-label">{objTitle.FullName}</label>
                        <input type="text" name="FullName" value={objUser.FullName} onChange={handleChange} className={`form-control ${errors.FullName ? "is-invalid" : ""}`} placeholder={objTitle.FullName} />
                        {errors.FullName && <div className="invalid-feedback">{errors.FullName}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">{objTitle.Role}</label>
                        <select name="RoleId" value={objUser.RoleId} onChange={handleChange} className="form-control">
                            <option value="">Select Role</option>
                            {roles.map(role => (
                                <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-6 d-flex align-items-center">
                        <input
                            type="checkbox"
                            id="AddIsActive"
                            name="IsActive"
                            checked={objUser.IsActive}
                            onChange={(e) =>
                                setObjUser((prev) => ({
                                    ...prev,
                                    IsActive: e.target.checked,
                                }))
                            }
                            className="form-check-input me-2"
                        />
                        <label htmlFor="AddIsActive" className="form-label">{objTitle.IsActive}</label>
                    </div>
                </div>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                id="EditUser"
                title={objTitle.EditUser}
                size="lg"
                onSave={handleUpdate}
                onHide={resetForm}
                saveLabel={objTitle.Save}
                cancelLabel={objTitle.Cancel}
            >
                <div className="row">
                    <div className="col-md-6">
                        <label className="form-label">{objTitle.UserCode}</label>
                        <input type="text" name="UserCode" value={objUser.UserCode} onChange={handleChange} className={`form-control ${errors.UserCode ? "is-invalid" : ""}`} placeholder={objTitle.UserCode} autoComplete="off" />
                        {errors.UserCode && <div className="invalid-feedback">{errors.UserCode}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">{objTitle.Username}</label>
                        <input
                            type="text"
                            name="Username"
                            value={objUser.Username}
                            onChange={handleChange}
                            className="form-control"
                            placeholder={objTitle.Username}
                            autoComplete="off"
                            readOnly
                            disabled
                            style={{ backgroundColor: "#e9ecef" }}
                        />
                        <small className="text-muted">Auto-generated: GS + User Code</small>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-6">
                        <label className="form-label">{objTitle.Email}</label>
                        <input
                            type="email"
                            name="Email"
                            value={objUser.Email}
                            onChange={handleChange}
                            className={`form-control ${errors.Email ? "is-invalid" : ""}`}
                            placeholder={objTitle.Email}
                            autoComplete="off"
                        />
                        {errors.Email && <div className="invalid-feedback">{errors.Email}</div>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">{objTitle.FullName}</label>
                        <input
                            type="text"
                            name="FullName"
                            value={objUser.FullName}
                            onChange={handleChange}
                            className={`form-control ${errors.FullName ? "is-invalid" : ""}`}
                            placeholder={objTitle.FullName}
                        />
                        {errors.FullName && <div className="invalid-feedback">{errors.FullName}</div>}
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-6">
                        <label className="form-label">{objTitle.Role}</label>
                        <select name="RoleId" value={objUser.RoleId} onChange={handleChange} className="form-control">
                            <option value="">Select Role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">{objTitle.Password} (Optional)</label>
                        <input
                            type="password"
                            name="Password"
                            value={objUser.Password}
                            onChange={handleChange}
                            className={`form-control ${errors.Password ? "is-invalid" : ""}`}
                            placeholder="Leave blank to keep current password"
                            autoComplete="new-password"
                        />
                        {errors.Password && <div className="invalid-feedback">{errors.Password}</div>}
                        <small className="text-muted">If changing: Must contain uppercase, lowercase, and special character</small>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-6 d-flex align-items-center">
                        <input
                            type="checkbox"
                            id="EditIsActive"
                            name="IsActive"
                            checked={objUser.IsActive}
                            onChange={(e) =>
                                setObjUser((prev) => ({ ...prev, IsActive: e.target.checked }))
                            }
                            className="form-check-input me-2"
                        />
                        <label htmlFor="EditIsActive" className="form-label">{objTitle.IsActive}</label>
                    </div>
                </div>
            </Modal>

            <SwalComponent />
        </>
    );
};

export default User;
