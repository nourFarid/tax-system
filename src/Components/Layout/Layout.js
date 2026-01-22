import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        // Load from localStorage on initial render
        const saved = localStorage.getItem('sidebarCollapsed');
        // Default to collapsed on small screens
        if (saved === null) {
            return window.innerWidth < 1024;
        }
        return saved === 'true';
    });

    // Detect screen size changes
    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= 1024;
            setIsDesktop(desktop);

            // Auto-collapse on small screens
            if (!desktop && !isCollapsed) {
                setIsCollapsed(true);
                localStorage.setItem('sidebarCollapsed', 'true');
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isCollapsed]);

    const toggleCollapse = () => {
        setIsCollapsed(prev => {
            const newValue = !prev;
            localStorage.setItem('sidebarCollapsed', String(newValue));
            return newValue;
        });
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    isDesktop={isDesktop}
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-100 overflow-y-auto mt-16 md:mt-20 lg:mt-24">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Layout;