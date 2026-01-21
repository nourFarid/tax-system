import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useTranslate from "../../Hooks/Translation/useTranslate";
import "remixicon/fonts/remixicon.css";

const Sidebar = ({ isSidebarOpen, closeSidebar, isDesktop, isCollapsed, toggleCollapse }) => {
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const { t } = useTranslate();
    const location = useLocation();

    const menuItems = [
        {
            id: 1,
            title: t("Tax Management"),
            icon: "bi bi-cash-coin",
            subItems: [
                { id: 1, title: t("Document 41"), icon: "bi bi-file-earmark-text", path: "/Document41" },
                { id: 2, title: t("Sales"), icon: "bi bi-cart-check", path: "/Sales" },
                { id: 3, title: t("Purchase"), icon: "bi bi-bag-check", path: "/Purchase" },
                { id: 4, title: t("Setup"), icon: "bi bi-gear", path: "/Setup" },
            ],
        },
    ];

    const toggleSubmenu = (itemId) => {
        if (isCollapsed) {
            toggleCollapse();
            setOpenSubmenu(itemId);
        } else {
            setOpenSubmenu(openSubmenu === itemId ? null : itemId);
        }
    };

    const handleToggleCollapse = () => {
        if (!isCollapsed) {
            setOpenSubmenu(null);
        }
        toggleCollapse();
    };

    const isActiveLink = (path) => location.pathname.includes(path);
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

    // Sidebar width based on collapsed state
    const sidebarWidth = isCollapsed ? 'w-20' : 'w-72 md:w-56 lg:w-64 xl:w-72';
    const spacerWidth = isCollapsed ? 'w-20' : 'w-72 md:w-56 lg:w-64 xl:w-72';

    return (
        <>
            {isSidebarOpen && !isDesktop && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeSidebar}></div>
            )}

            <aside className={`fixed top-16 md:top-20 lg:top-24 ltr:left-0 rtl:right-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] ${sidebarWidth} bg-white overflow-y-auto z-40 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transform transition-all duration-300 ease-in-out shadow-lg
                ${isDesktop ? 'block' : (isSidebarOpen ? 'block' : 'hidden')} ${isDesktop ? 'translate-x-0' : (isSidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full')}`}>

                {/* Toggle Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleCollapse();
                    }}
                    className="absolute top-2 ltr:right-2 rtl:left-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 z-50"
                    title={isCollapsed ? t("Expand") : t("Collapse")}
                >
                    <i className={`bi ${isCollapsed ? 'bi-chevron-right rtl:bi-chevron-left' : 'bi-chevron-left rtl:bi-chevron-right'} text-gray-600`}></i>
                </button>

                <nav className={`mt-12 ${isCollapsed ? 'px-2' : 'me-4'}`}>
                    <ul className="space-y-2 whitespace-nowrap">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                {!item.subItems ? (
                                    <Link to={item.path} onClick={closeSidebar}
                                        className={`no-underline !font-extrabold flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg text-sm md:text-base font-Cairo font-medium transition-all duration-200 ${isActiveLink(item.path) ? 'bg-primary-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                                        title={isCollapsed ? item.title : ''}>
                                        <i className={`${item.icon} text-lg md:text-xl ${isCollapsed ? '' : 'ltr:mr-3 rtl:ml-3'}`}></i>
                                        {!isCollapsed && <span>{item.title}</span>}
                                    </Link>
                                ) : (
                                    <div>
                                        <button
                                            onClick={() => toggleSubmenu(item.id)}
                                            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 rounded-lg text-sm md:text-base font-Cairo font-medium transition-all duration-200 ${isParentActive(item.subItems) ? 'bg-primary-50 text-primary-500' : 'text-gray-700 hover:bg-gray-100'}`}
                                            title={isCollapsed ? item.title : ''}>
                                            <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                                                <i className={`${item.icon} text-lg md:text-xl ${isCollapsed ? '' : 'ltr:mr-3 rtl:ml-3'}`}></i>
                                                {!isCollapsed && <span>{item.title}</span>}
                                            </div>
                                            {!isCollapsed && (
                                                <i className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${openSubmenu === item.id ? 'rotate-180' : ''}`}></i>
                                            )}
                                        </button>

                                        {/* Submenu - only show when not collapsed */}
                                        {!isCollapsed && (
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSubmenu === item.id ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                                <ul className="ltr:ml-6 rtl:mr-6 space-y-1">
                                                    {item.subItems.map((subItem) => (
                                                        <li key={subItem.id}>
                                                            <Link to={subItem.path} onClick={closeSidebar}
                                                                className={`no-underline !font-extrabold flex items-center px-4 py-2.5 rounded-lg text-sm font-Cairo transition-all duration-200 ${isActiveLink(subItem.path) ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-primary-500'}`}>
                                                                <i className={`${subItem.icon} ltr:mr-2 rtl:ml-2`}></i>
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Collapsed submenu - show as icons in a column */}
                                        {isCollapsed && (
                                            <div className="mt-1 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <Link
                                                        key={subItem.id}
                                                        to={subItem.path}
                                                        onClick={closeSidebar}
                                                        className={`flex items-center justify-center py-2 rounded-lg text-sm transition-all duration-200 ${isActiveLink(subItem.path) ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-primary-500'}`}
                                                        title={subItem.title}>
                                                        <i className={`${subItem.icon} text-lg`}></i>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <div className={`hidden lg:block ${spacerWidth} flex-shrink-0 transition-all duration-300`}></div>
        </>
    );
};

export default Sidebar;