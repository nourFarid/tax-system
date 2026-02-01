import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useTranslate from "../../Hooks/Translation/useTranslate";
import "remixicon/fonts/remixicon.css";

const Sidebar = ({ isDesktop, isCollapsed, toggleCollapse }) => {
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
                { id: 3, title: t("Invalid Documents"), icon: "bi bi-x-lg", path: "/InvalidDocuments" },
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
    const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';

    return (
        <>
            <aside
                className={`fixed top-16 md:top-20 lg:top-24 ltr:left-0 rtl:right-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] ${sidebarWidth} bg-white overflow-y-auto z-40 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 transition-all duration-300 ease-in-out shadow-lg`}
            >
                {/* Toggle Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleCollapse();
                    }}
                    className="absolute top-3 ltr:right-3 rtl:left-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 z-50"
                    title={isCollapsed ? t("Expand") : t("Collapse")}
                >
                    <i className={`bi ${isCollapsed ? 'bi-chevron-right rtl:bi-chevron-left' : 'bi-chevron-left rtl:bi-chevron-right'} text-gray-600`}></i>
                </button>

                <nav className={`mt-14 ${isCollapsed ? 'ltr:pl-0 ltr:pr-14 rtl:px-3' : 'px-3'}`}>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                {!item.subItems ? (
                                    <Link
                                        to={item.path}
                                        className={`no-underline font-bold rounded-xl text-base font-Cairo transition-all duration-200
                                            ${isCollapsed
                                                ? 'flex items-center justify-center w-14 h-14 mx-auto'
                                                : 'block w-full py-3 px-4'
                                            }
                                            ${isActiveLink(item.path)
                                                ? 'bg-primary-500 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }
                                        `}
                                        title={isCollapsed ? item.title : ''}
                                    >
                                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                                            <i className={`${item.icon} text-xl ${isCollapsed ? '' : 'ltr:mr-3 rtl:ml-3'}`}></i>
                                            {!isCollapsed && <span>{item.title}</span>}
                                        </div>
                                    </Link>
                                ) : (
                                    <div>
                                        {/* Parent Menu Item */}
                                        <button
                                            onClick={() => toggleSubmenu(item.id)}
                                            className={`rounded-xl text-base font-Cairo font-medium transition-all duration-200
                                                ${isCollapsed
                                                    ? 'flex items-center justify-center w-14 h-14 mx-auto'
                                                    : 'block w-full py-3 px-4'
                                                }
                                                ${isParentActive(item.subItems)
                                                    ? 'bg-primary-50 text-primary-600'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }
                                            `}
                                            title={isCollapsed ? item.title : ''}
                                        >
                                            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                                                <div className="flex items-center">
                                                    <i className={`${item.icon} text-xl ${isCollapsed ? '' : 'ltr:mr-3 rtl:ml-3'}`}></i>
                                                    {!isCollapsed && <span>{item.title}</span>}
                                                </div>
                                                {!isCollapsed && (
                                                    <i className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${openSubmenu === item.id ? 'rotate-180' : ''}`}></i>
                                                )}
                                            </div>
                                        </button>

                                        {/* Submenu - Expanded View */}
                                        {!isCollapsed && (
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSubmenu === item.id ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                                <ul className="space-y-1 ltr:pl-4 rtl:pr-4">
                                                    {item.subItems.map((subItem) => (
                                                        <li key={subItem.id}>
                                                            <Link
                                                                to={subItem.path}
                                                                className={`block w-full no-underline font-semibold py-3 px-4 rounded-xl text-sm font-Cairo transition-all duration-200
                                                                    ${isActiveLink(subItem.path)
                                                                        ? 'bg-primary-500 text-white shadow-sm'
                                                                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                                                                    }
                                                                `}
                                                            >
                                                                <div className="flex items-center">
                                                                    <i className={`${subItem.icon} text-lg ltr:mr-3 rtl:ml-3`}></i>
                                                                    <span>{subItem.title}</span>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Submenu - Collapsed View (icons only) */}
                                        {isCollapsed && (
                                            <div className="mt-2 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <Link
                                                        key={subItem.id}
                                                        to={subItem.path}
                                                        className={`flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-all duration-200
                                                            ${isActiveLink(subItem.path)
                                                                ? 'bg-primary-500 text-white shadow-sm'
                                                                : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                                                            }
                                                        `}
                                                        title={subItem.title}
                                                    >
                                                        <i className={`${subItem.icon} text-xl`}></i>
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

            {/* Spacer to push content */}
            <div className={`${sidebarWidth} flex-shrink-0 transition-all duration-300`}></div>
        </>
    );
};

export default Sidebar;