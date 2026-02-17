import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import "remixicon/fonts/remixicon.css";
import styled from "styled-components";
import MainLogo from "../Assets/Images/logo2-dev.jpeg";
import EgyptAirLogo from "../Assets/Images/EgyptAir.png"
import { useSelector, useDispatch } from "react-redux";
import useTranslate from "../../src/Hooks/Translation/useTranslate";
import { SET_LANGUAGE } from "../Redux/actions/languageActions.js";
import axiosInstance from './../Axios/AxiosInstance';
import { useNavigate } from "react-router-dom";
import { setAuthUser, getAuthUser } from "../Hooks/Services/Storage.js"
import Spinner from "../Components/Layout/Spinner.js";

// Styled Login Button with 3D effect
const StyledButtonWrapper = styled.div`
  button {
    font: inherit;
    background-color: #f0f0f0;
    border: 0;
    color: #242424;
    border-radius: 0.6em;
    font-size: 2rem;
    padding: 0.6em 2.5em;
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
`;

const Auth = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const currentLang = useSelector((state) => state.language.lang);
    const [login, setlogin] = useState({
        userName: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [loginError, setLoginError] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const loginFun = async () => {
        try {
            setLoading(true);
            setLoginError(""); // Clear previous errors
            const payload = {
                userName: login.userName,
                password: login.password,
                rememberMe: true
            };
            const response = await axiosInstance.post("Auth/Login", payload);
            setAuthUser(response.data.token || response.data.Token);
            setLoading(false);
            if (getAuthUser()) {
                // Check if API returns DefaultPage indicating user needs to change password
                const defaultPage = response.data.defaultPage || response.data.DefaultPage;
                if (defaultPage === "Auth/ChangePassword") {
                    navigate("/ResetPassword");
                } else {
                    navigate("/Setup");
                }
            }
        } catch (error) {
            setLoading(false);
            // Check if it's an authentication error (401) or other error
            if (error.response && (error.response.status === 401 || error.response.status === 400)) {
                setLoginError(t("Invalid username or password"));
            } else {
                setLoginError(t("Login failed. Please try again."));
            }
            console.error("Failed to login", error);
        }
    };

    // Set direction based on language from Redux
    useEffect(() => {
        const direction = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = direction;
        document.documentElement.lang = currentLang;
    }, [currentLang]);


    const toggleLanguage = () => {
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        dispatch({ type: SET_LANGUAGE, payload: newLang });
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center p-4 md:p-3 lg:p-5 3xl:p-10 overflow-auto" style={{ background: "rgb(10, 10, 26)" }}>
                {/* Main Container */}
                <div className="w-full my-auto max-w-[92%] sm:max-w-[600px] md:max-w-[750px] lg:max-w-[1100px] xl:max-w-[1100px] 3xl:max-w-[1500px] rounded-[30px] md:rounded-[40px] lg:rounded-[50px] p-6 sm:p-8 md:p-6 lg:p-8 xl:p-12 3xl:p-20 shadow-2xl overflow-auto relative" style={{ background: "#02000e" }}>
                    {/* Language Toggle Button - Inside Container */}
                    <button onClick={toggleLanguage} className="absolute top-4 md:top-6 lg:top-8 ltr:right-4 rtl:left-4 md:ltr:right-6 md:rtl:left-6 lg:ltr:right-8 lg:rtl:left-8 z-50 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white" aria-label="Toggle Language" title={currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}>
                        <span className="font-Cairo font-bold text-sm md:text-base">
                            {currentLang === 'ar' ? 'EN' : 'ع'}
                        </span>
                    </button>

                    {/* Grid Layout: Image on left, Form on right (responsive) */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-6 lg:gap-8 xl:gap-12 place-items-center ">
                        {/* Right Side - Form Section (shows first on mobile) */}
                        <div className="order-2 lg:order-1 w-full max-w-md lg:max-w-full flex flex-col justify-center items-center gap-4 md:gap-4 lg:gap-4 xl:gap-6 py-4">
                            {/* Title */}
                            <h1 className="font-Cairo font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-4xl 3xl:text-6xl text-center mb-2 md:mb-3 lg:mb-2" style={{ color: "#ffffff" }}>
                                {t("Tax Management")}
                            </h1>

                            {/* Email Input with Icon */}
                            <div className="relative w-full sm:w-[350px] md:w-[400px] lg:w-[300px] xl:w-[350px] 3xl:w-[400px]">
                                <i className="ri-mail-line absolute ltr:left-5 rtl:right-5 md:ltr:left-8 md:rtl:right-8 lg:ltr:left-10 lg:rtl:right-10 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg md:text-xl lg:text-2xl 3xl:text-3xl pointer-events-none"></i>
                                <input type="email" placeholder={t("Email")} className="w-full h-[50px] md:h-[60px] lg:h-[65px] xl:h-[75px] 3xl:h-[93px] rounded-[25px] md:rounded-[30px] lg:rounded-[30px] 3xl:rounded-[40px] border border-black ltr:pl-12 rtl:pr-12 md:ltr:pl-16 md:rtl:pr-16 lg:ltr:pl-20 lg:rtl:pr-20 3xl:ltr:pl-24 3xl:rtl:pr-24 ltr:pr-5 rtl:pl-5 md:ltr:pr-8 md:rtl:pl-8 lg:ltr:pr-10 lg:rtl:pl-10 text-base md:text-lg lg:text-xl 3xl:text-2xl font-inter text-gray-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-300 transition-all"
                                    value={login.userName} onChange={(e) => setlogin({ ...login, userName: e.target.value })}
                                />
                            </div>


                            {/* Password Input with Icon and Toggle */}
                            <div className="relative w-full sm:w-[350px] md:w-[400px] lg:w-[300px] xl:w-[350px] 3xl:w-[400px]">
                                <i className=" ri-lock-line absolute ltr:left-5 rtl:right-5 md:ltr:left-8 md:rtl:right-8 lg:ltr:left-10 lg:rtl:right-10 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg md:text-xl lg:text-2xl 3xl:text-3xl pointer-events-none "></i>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t("Password")}
                                    className=" w-full h-[50px] md:h-[60px] lg:h-[65px] xl:h-[75px] 3xl:h-[93px] rounded-[25px] md:rounded-[30px] lg:rounded-[30px] 3xl:rounded-[40px]  border border-black ltr:pl-12 rtl:pr-12 md:ltr:pl-16 md:rtl:pr-16 lg:ltr:pl-20 lg:rtl:pr-20 3xl:ltr:pl-24 3xl:rtl:pr-24 ltr:pr-12 rtl:pl-12 md:ltr:pr-16 md:rtl:pl-16 lg:ltr:pr-20 lg:rtl:pl-20 3xl:ltr:pr-24 3xl:rtl:pl-24 text-base md:text-lg lg:text-xl 3xl:text-2xl font-inter text-gray-700 focus:outline-none  focus:border-primary-500  focus:ring-2  focus:ring-primary-300 transition-all "
                                    value={login.password}
                                    onChange={(e) => setlogin({ ...login, password: e.target.value })}

                                />
                                <i className={`${showPassword ? "ri-eye-off-line" : "ri-eye-line"} absolute ltr:right-5 rtl:left-5 md:ltr:right-8 md:rtl:left-8 lg:ltr:right-10 lg:rtl:left-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-500 text-lg md:text-xl lg:text-2xl 3xl:text-3xl cursor-pointer transition-colors`}
                                    onClick={togglePasswordVisibility}>
                                </i>
                            </div>

                            {/* Error Message */}
                            {loginError && (
                                <div className="w-full sm:w-[350px] md:w-[400px] lg:w-[300px] xl:w-[350px] 3xl:w-[400px] text-center">
                                    <p className="text-red-500 text-sm md:text-base lg:text-lg font-Cairo bg-red-100 rounded-lg py-2 px-4 flex items-center justify-center gap-2">
                                        <i className="ri-error-warning-line"></i>
                                        {loginError}
                                    </p>
                                </div>
                            )}


                            {/* Login Button */}
                            <div className="flex justify-center mt-4 md:mt-5 lg:mt-6 w-full">
                                <StyledButtonWrapper>
                                    <button onClick={loginFun}>
                                        {t("Login")}
                                    </button>
                                </StyledButtonWrapper>
                            </div>
                        </div>


                        {/* Left Side - Illustration (shows second on mobile) */}
                        <div className=" order-1 lg:order-2 flex items-center justify-center w-full ">
                            <img
                                src={MainLogo}
                                alt="Tax System Illustration"
                                className=" w-full max-w-[280px] sm:max-w-[350px] md:max-w-[500px] lg:max-w-[550px] xl:max-w-[700px] 3xl:max-w-[1004px] h-auto object-contain "
                            />
                        </div>
                    </div>
                </div>
            </div>
            {loading && <Spinner></Spinner>}
        </>
    );
}


export default Auth;
