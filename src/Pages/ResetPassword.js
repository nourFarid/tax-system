import { useState, useMemo } from "react";
import useTranslate from "../Hooks/Translation/useTranslate";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../Axios/AxiosInstance";
import { logout } from "../Redux/actions/authAction";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MainLogo from "../Assets/Images/logo2-dev.jpeg";
import "remixicon/fonts/remixicon.css";

// Styled Submit Button with 3D effect (matching Auth.js)
const StyledButtonWrapper = styled.div`
  button {
    font: inherit;
    background-color: #f0f0f0;
    border: 0;
    color: #242424;
    border-radius: 0.6em;
    font-size: 1.5rem;
    padding: 0.5em 2em;
    font-weight: 700;
    text-shadow: 0 0.0625em 0 #fff;
    box-shadow: inset 0 0.0625em 0 0 #f4f4f4, 0 0.0625em 0 0 #efefef,
      0 0.125em 0 0 #ececec, 0 0.25em 0 0 #e0e0e0, 0 0.3125em 0 0 #dedede,
      0 0.375em 0 0 #dcdcdc, 0 0.425em 0 0 #cacaca, 0 0.425em 0.5em 0 #cecece;
    transition: 0.15s ease;
    cursor: pointer;
  }
  button:active {
    translate: 0 0.225em;
    box-shadow: inset 0 0.03em 0 0 #f4f4f4, 0 0.03em 0 0 #efefef,
      0 0.0625em 0 0 #ececec, 0 0.125em 0 0 #e0e0e0, 0 0.125em 0 0 #dedede,
      0 0.2em 0 0 #dcdcdc, 0 0.225em 0 0 #cacaca, 0 0.225em 0.375em 0 #cecece;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResetPassword = () => {
    const { t } = useTranslate();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const objTitle = useMemo(
        () => ({
            ResetPassword: t("Reset Password"),
            CurrentPassword: t("Current Password"),
            NewPassword: t("New Password"),
            ConfirmPassword: t("Confirm Password"),
            Save: t("Save"),
            Reset: t("Reset"),
        }),
        [t]
    );

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const resetForm = () => {
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setErrors({});
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword || formData.currentPassword.trim() === "") {
            newErrors.currentPassword = t("Current password is required");
        }

        if (!formData.newPassword || formData.newPassword.trim() === "") {
            newErrors.newPassword = t("New password is required");
        } else {
            // Password strength validation
            const password = formData.newPassword;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(password);

            if (!hasUpperCase || !hasLowerCase || !hasNonAlphanumeric) {
                const requirements = [];
                if (!hasUpperCase) requirements.push(t("uppercase letter"));
                if (!hasLowerCase) requirements.push(t("lowercase letter"));
                if (!hasNonAlphanumeric) requirements.push(t("special character"));
                newErrors.newPassword = `${t("Password must contain")}: ${requirements.join(", ")}`;
            }
        }

        if (!formData.confirmPassword || formData.confirmPassword.trim() === "") {
            newErrors.confirmPassword = t("Confirm password is required");
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = t("Passwords do not match");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear the specific error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Note: API has typos in field names (currrentPassword, comfirmPassword)
            const payload = {
                currrentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                comfirmPassword: formData.confirmPassword,
            };

            const response = await axiosInstance.post("Auth/UpdatePassword", payload);

            if (response.data && response.data.rslt) {
                toast.success(response.data.message || t("Password updated successfully"));
                dispatch(logout());
                navigate("/", { replace: true });


            } else {
                toast.error(response.data?.message || t("Failed to update password"));
            }
        } catch (error) {
            console.error("Failed to update password", error);
            const errorMessage = error.response?.data?.message || t("Failed to update password");
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center p-4 md:p-3 lg:p-5 3xl:p-10 overflow-auto" style={{ background: "#ffffff" }}>
                {/* Main Container */}
                <div className="w-full my-auto max-w-[92%] sm:max-w-[600px] md:max-w-[750px] lg:max-w-[1100px] xl:max-w-[1100px] 3xl:max-w-[1500px] rounded-[30px] md:rounded-[40px] lg:rounded-[50px] p-6 sm:p-8 md:p-6 lg:p-8 xl:p-12 3xl:p-20 shadow-2xl overflow-auto relative" style={{ background: "#02000e" }}>

                    {/* Grid Layout: Image on left, Form on right (responsive) */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-6 lg:gap-8 xl:gap-12 place-items-center">
                        {/* Right Side - Form Section (shows first on mobile) */}
                        <div className="order-2 lg:order-1 w-full max-w-md lg:max-w-full flex flex-col justify-center items-center gap-4 md:gap-4 lg:gap-4 xl:gap-6 py-4">
                            {/* Title */}
                            <h1 className="font-Cairo font-bold text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-3xl 3xl:text-5xl text-center mb-2 md:mb-3 lg:mb-2" style={{ color: "#ffffff" }}>
                                {objTitle.ResetPassword}
                            </h1>

                            {/* Current Password Input */}
                            <div className="relative w-full sm:w-[350px] md:w-[400px] lg:w-[300px] xl:w-[350px] 3xl:w-[400px]">
                                <i className="ri-lock-line absolute ltr:left-5 rtl:right-5 md:ltr:left-8 md:rtl:right-8 lg:ltr:left-10 lg:rtl:right-10 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg md:text-xl lg:text-2xl 3xl:text-3xl pointer-events-none"></i>
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    name="currentPassword"
                                    placeholder={objTitle.CurrentPassword}
                                    className="w-full h-[50px] md:h-[60px] lg:h-[65px] xl:h-[70px] 3xl:h-[80px] rounded-[25px] md:rounded-[30px] lg:rounded-[30px] 3xl:rounded-[40px] border border-black ltr:pl-12 rtl:pr-12 md:ltr:pl-16 md:rtl:pr-16 lg:ltr:pl-20 lg:rtl:pr-20 3xl:ltr:pl-24 3xl:rtl:pr-24 ltr:pr-12 rtl:pl-12 md:ltr:pr-16 md:rtl:pl-16 lg:ltr:pr-20 lg:rtl:pl-20 3xl:ltr:pr-24 3xl:rtl:pl-24 text-base md:text-lg lg:text-xl 3xl:text-2xl font-inter text-gray-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-300 transition-all"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />
                                <i className={`${showCurrentPassword ? "ri-eye-off-line" : "ri-eye-line"} absolute ltr:right-5 rtl:left-5 md:ltr:right-8 md:rtl:left-8 lg:ltr:right-10 lg:rtl:left-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 text-lg md:text-xl lg:text-2xl 3xl:text-3xl cursor-pointer transition-colors`}
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                </i>
                            </div>
                            {errors.currentPassword && (
                                <span className="text-red-400 text-sm md:text-base -mt-2">{errors.currentPassword}</span>
                            )}

                            {/* New Password Input */}
                            <div className="relative w-full sm:w-[350px] md:w-[400px] lg:w-[300px] xl:w-[350px] 3xl:w-[400px]">
                                <i className="ri-lock-password-line absolute ltr:left-5 rtl:right-5 md:ltr:left-8 md:rtl:right-8 lg:ltr:left-10 lg:rtl:right-10 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg md:text-xl lg:text-2xl 3xl:text-3xl pointer-events-none"></i>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    placeholder={objTitle.NewPassword}
                                    className="w-full h-[50px] md:h-[60px] lg:h-[65px] xl:h-[70px] 3xl:h-[80px] rounded-[25px] md:rounded-[30px] lg:rounded-[30px] 3xl:rounded-[40px] border border-black ltr:pl-12 rtl:pr-12 md:ltr:pl-16 md:rtl:pr-16 lg:ltr:pl-20 lg:rtl:pr-20 3xl:ltr:pl-24 3xl:rtl:pr-24 ltr:pr-12 rtl:pl-12 md:ltr:pr-16 md:rtl:pl-16 lg:ltr:pr-20 lg:rtl:pl-20 3xl:ltr:pr-24 3xl:rtl:pl-24 text-base md:text-lg lg:text-xl 3xl:text-2xl font-inter text-gray-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-300 transition-all"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                                <i className={`${showNewPassword ? "ri-eye-off-line" : "ri-eye-line"} absolute ltr:right-5 rtl:left-5 md:ltr:right-8 md:rtl:left-8 lg:ltr:right-10 lg:rtl:left-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 text-lg md:text-xl lg:text-2xl 3xl:text-3xl cursor-pointer transition-colors`}
                                    onClick={() => setShowNewPassword(!showNewPassword)}>
                                </i>
                            </div>
                            {errors.newPassword && (
                                <span className="text-red-400 text-sm md:text-base -mt-2">{errors.newPassword}</span>
                            )}
                            <span className="text-gray-400 text-xs md:text-sm -mt-2 text-center max-w-[350px]">
                                {t("Must contain: uppercase, lowercase, and special character (!@#$%^&*)")}
                            </span>

                            {/* Confirm Password Input */}
                            <div className="relative w-full sm:w-[350px] md:w-[400px] lg:w-[300px] xl:w-[350px] 3xl:w-[400px]">
                                <i className="ri-checkbox-circle-line absolute ltr:left-5 rtl:right-5 md:ltr:left-8 md:rtl:right-8 lg:ltr:left-10 lg:rtl:right-10 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg md:text-xl lg:text-2xl 3xl:text-3xl pointer-events-none"></i>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder={objTitle.ConfirmPassword}
                                    className="w-full h-[50px] md:h-[60px] lg:h-[65px] xl:h-[70px] 3xl:h-[80px] rounded-[25px] md:rounded-[30px] lg:rounded-[30px] 3xl:rounded-[40px] border border-black ltr:pl-12 rtl:pr-12 md:ltr:pl-16 md:rtl:pr-16 lg:ltr:pl-20 lg:rtl:pr-20 3xl:ltr:pl-24 3xl:rtl:pr-24 ltr:pr-12 rtl:pl-12 md:ltr:pr-16 md:rtl:pl-16 lg:ltr:pr-20 lg:rtl:pl-20 3xl:ltr:pr-24 3xl:rtl:pl-24 text-base md:text-lg lg:text-xl 3xl:text-2xl font-inter text-gray-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-300 transition-all"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                                <i className={`${showConfirmPassword ? "ri-eye-off-line" : "ri-eye-line"} absolute ltr:right-5 rtl:left-5 md:ltr:right-8 md:rtl:left-8 lg:ltr:right-10 lg:rtl:left-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 text-lg md:text-xl lg:text-2xl 3xl:text-3xl cursor-pointer transition-colors`}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                </i>
                            </div>
                            {errors.confirmPassword && (
                                <span className="text-red-400 text-sm md:text-base -mt-2">{errors.confirmPassword}</span>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-center mt-4 md:mt-5 lg:mt-6 w-full">
                                <StyledButtonWrapper>
                                    <button onClick={handleSubmit} disabled={loading}>
                                        {loading ? t("Saving...") : objTitle.Save}
                                    </button>
                                </StyledButtonWrapper>
                            </div>
                        </div>

                        {/* Left Side - Illustration (shows second on mobile) */}
                        <div className="order-1 lg:order-2 flex items-center justify-center w-full">
                            <img
                                src={MainLogo}
                                alt="Tax System Illustration"
                                className="w-full max-w-[280px] sm:max-w-[350px] md:max-w-[500px] lg:max-w-[550px] xl:max-w-[700px] 3xl:max-w-[1004px] h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </>
    );
};

export default ResetPassword;
