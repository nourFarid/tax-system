import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useTranslate from "../../Hooks/Translation/useTranslate";
import "remixicon/fonts/remixicon.css";

const Sidebar = ({ isSidebarOpen, closeSidebar, isDesktop }) => {
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const { t } = useTranslate();
    const location = useLocation();

    const menuItems = [
        {
            id: 1,
            title: t("Tax Management"),
            icon: "bi bi-cash-coin",
            subItems: [
                { id: 1, title: t("Document 41"), icon: "", path: "/Document41" },
                { id: 2, title: t("Sales"), icon: "", path: "/Sales" },
                { id: 3, title: t("Purchase"), icon: "", path: "/Purchase" },
                { id: 4, title: t("Setup"), icon: "", path: "/Setup" },
            ],
        },
    ];

    const toggleSubmenu = (itemId) => {
        setOpenSubmenu(openSubmenu === itemId ? null : itemId);
    };

    const isActiveLink = (path) =>  location.pathname.includes(path);
    const isParentActive = (subItems) => subItems?.some((item) => location.pathname.includes(item.path));

    useEffect(() => {
        function init() {
        for (let i = 0; i < menuItems.length; i++) {
            if (isParentActive(menuItems[i].subItems)) {
            setOpenSubmenu(menuItems[i].id);
            break;
            }
        }
        }
        init();
    }, []);
    return (
        <>
            {isSidebarOpen && !isDesktop && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeSidebar}></div>
            )}

            <aside className={`fixed top-16 md:top-20 lg:top-24 ltr:left-0 rtl:right-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] w-72 md:w-56 lg:w-64 xl:w-72 bg-white overflow-y-auto z-40 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transform transition-transform duration-300 ease-in-out shadow-lg
                ${isDesktop ? 'block' : (isSidebarOpen ? 'block' : 'hidden')} ${isDesktop ? 'translate-x-0' : (isSidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full')}`}>
                <nav className="me-4 mt-5">
                    <ul className="space-y-2 whitespace-nowrap">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                {!item.subItems ? (
                                    <Link to={item.path} onClick={closeSidebar}
                                        className={`no-underline !font-extrabold flex items-center px-4 py-3 rounded-lg text-sm md:text-base font-Cairo font-medium transition-all duration-200 ${isActiveLink(item.path) ? 'bg-primary-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}>
                                        <i className={`${item.icon} text-lg md:text-xl ltr:mr-3 rtl:ml-3`}></i>
                                        <span>{item.title}</span>
                                    </Link>
                                ) : (
                                    <div>
                                        <button onClick={() => toggleSubmenu(item.id)} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm md:text-base font-Cairo font-medium transition-all duration-200 ${isParentActive(item.subItems) ? 'bg-primary-50 text-primary-500' : 'text-gray-700 hover:bg-gray-100'}`}>
                                            <div className="flex items-center">
                                                <i className={`${item.icon} text-lg md:text-xl ltr:mr-3 rtl:ml-3`}></i>
                                                <span>{item.title}</span>
                                            </div>
                                            <i className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${openSubmenu === item.id ? 'rotate-180' : ''}`}></i>
                                        </button>

                                        <div className={` overflow-hidden transition-all duration-300 ease-in-out ${openSubmenu === item.id ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                            <ul className="ltr:ml-6 rtl:mr-6 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <li key={subItem.id}>
                                                        <Link to={subItem.path} onClick={closeSidebar} className={`no-underline !font-extrabold flex items-center px-4 py-2.5 rounded-lg text-sm font-Cairo transition-all duration-200 ${isActiveLink(subItem.path) ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-primary-500'}`}>
                                                            <i className={subItem.icon}></i>
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <div className="hidden lg:block w-72 md:w-56 lg:w-64 xl:w-72 flex-shrink-0"></div>
        </>
    );
};

export default Sidebar;