import { useEffect, useRef, useCallback } from "react";
import { Modal as BootstrapModal } from "bootstrap";

/**
 * 
 * 
 * @param {string} id - Unique modal ID (required)
 * @param {string} title - Modal header title
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl' (default: 'lg')
 * @param {ReactNode} children - Modal body content
 * @param {ReactNode} footer - Custom footer content (optional)
 * @param {Function} onSave - Save button click handler (optional)
 * @param {Function} onCancel - Cancel/close callback (optional)
 * @param {Function} onShow - Callback when modal is shown (optional)
 * @param {Function} onHide - Callback when modal is hidden (optional)
 * @param {string} saveLabel - Save button label (default: 'Save')
 * @param {string} cancelLabel - Cancel button label (default: 'Cancel')
 * @param {string} saveButtonClass - Save button CSS class (default: 'btn btn-primary')
 * @param {string} cancelButtonClass - Cancel button CSS class (default: 'btn btn-outline-secondary')
 * @param {boolean} showFooter - Show/hide footer (default: true)
 * @param {boolean} showSaveButton - Show/hide save button (default: true)
 * @param {boolean} showCancelButton - Show/hide cancel button (default: true)
 * @param {string} maxWidth - Custom max width for modal dialog (optional)
 */
const Modal = ({
    id,
    title,
    size = "lg",
    children,
    footer,
    onSave,
    onCancel,
    onShow,
    onHide,
    saveLabel = "Save",
    cancelLabel = "Cancel",
    saveButtonClass = "btn btn-primary",
    cancelButtonClass = "btn btn-outline-secondary",
    showFooter = true,
    showSaveButton = true,
    showCancelButton = true,
    maxWidth,
}) => {
    const modalRef = useRef(null);

    // Get modal size class
    const getSizeClass = () => {
        switch (size) {
            case "sm":
                return "modal-sm";
            case "md":
                return "";
            case "lg":
                return "modal-lg";
            case "xl":
                return "modal-xl";
            default:
                return "modal-lg";
        }
    };

    // Hide modal function
    const hideModal = useCallback(() => {
        if (modalRef.current) {
            const modal = BootstrapModal.getInstance(modalRef.current);
            if (modal) {
                modal.hide();
            }
            // Clean up any remaining backdrops
            const backdrops = document.querySelectorAll(".modal-backdrop.fade.show");
            backdrops.forEach((b) => b.remove());
        }
    }, []);

    // Handle save click
    const handleSave = () => {
        if (onSave) {
            onSave();
        }
    };

    // Handle cancel click
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    // Set up modal event listeners
    useEffect(() => {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const handleShow = () => {
            if (onShow) onShow();
        };

        const handleHide = () => {
            if (onHide) onHide();
            // Clean up backdrops on hide
            const backdrops = document.querySelectorAll(".modal-backdrop.fade.show");
            backdrops.forEach((b) => b.remove());
        };

        modalElement.addEventListener("show.bs.modal", handleShow);
        modalElement.addEventListener("hidden.bs.modal", handleHide);

        return () => {
            modalElement.removeEventListener("show.bs.modal", handleShow);
            modalElement.removeEventListener("hidden.bs.modal", handleHide);
        };
    }, [onShow, onHide]);

    const dialogStyle = maxWidth ? { maxWidth } : {};

    // Modern styles
    const contentStyle = {
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        border: "none",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        overflow: "hidden",
    };

    const headerStyle = {
        background: "linear-gradient(135deg, #1e3a5f 0%, #0a1929 100%)",
        color: "#ffffff",
        padding: "1.25rem 1.5rem",
        borderBottom: "none",
        borderRadius: "16px 16px 0 0",
    };

    const titleStyle = {
        fontWeight: "600",
        fontSize: "1.25rem",
        letterSpacing: "0.025em",
        margin: 0,
    };

    const closeButtonStyle = {
        background: "rgba(255, 255, 255, 0.1)",
        border: "none",
        borderRadius: "8px",
        color: "#ffffff",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.25rem",
        transition: "all 0.2s ease",
        cursor: "pointer",
    };

    const bodyStyle = {
        padding: "1.5rem",
        overflowY: "auto",
        backgroundColor: "#ffffff",
    };

    const footerStyle = {
        padding: "1rem 1.5rem",
        backgroundColor: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        borderRadius: "0 0 16px 16px",
        display: "flex",
        justifyContent: "flex-end",
        gap: "0.75rem",
    };

    const modernSaveButtonStyle = {
        padding: "0.625rem 1.5rem",
        borderRadius: "8px",
        fontWeight: "500",
        fontSize: "0.95rem",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    };

    const modernCancelButtonStyle = {
        padding: "0.625rem 1.5rem",
        borderRadius: "8px",
        fontWeight: "500",
        fontSize: "0.95rem",
        transition: "all 0.2s ease",
    };

    return (
        <div
            className="modal fade"
            id={id}
            tabIndex="-1"
            aria-hidden="true"
            ref={modalRef}
        >
            <div
                className={`modal-dialog ${getSizeClass()} modal-dialog-centered`}
                style={dialogStyle}
            >
                <div className="modal-content" style={contentStyle}>
                    {/* Modern Navy Blue Header */}
                    <div
                        className="modal-header d-flex justify-content-between align-items-center"
                        style={headerStyle}
                    >
                        <h5 className="modal-title" style={titleStyle}>{title}</h5>
                        <button
                            type="button"
                            style={closeButtonStyle}
                            data-bs-dismiss="modal"
                            onClick={handleCancel}
                            onMouseEnter={(e) => {
                                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Body */}
                    <div className="modal-body" style={bodyStyle}>
                        {children}
                    </div>

                    {/* Modern Footer */}
                    {showFooter && (
                        <div className="modal-footer" style={footerStyle}>
                            {footer ? (
                                footer
                            ) : (
                                <>
                                    {showCancelButton && (
                                        <button
                                            type="button"
                                            className={cancelButtonClass}
                                            style={modernCancelButtonStyle}
                                            data-bs-dismiss="modal"
                                            onClick={handleCancel}
                                        >
                                            {cancelLabel}
                                        </button>
                                    )}
                                    {showSaveButton && (
                                        <button
                                            type="button"
                                            className={saveButtonClass}
                                            style={modernSaveButtonStyle}
                                            onClick={handleSave}
                                        >
                                            {saveLabel}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper function to show modal programmatically
export const showModal = (modalId) => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        let modal = BootstrapModal.getInstance(modalElement);
        if (!modal) modal = new BootstrapModal(modalElement);
        modal.show();
    }
};

// Helper function to hide modal programmatically
export const hideModal = (modalId) => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        const modal = BootstrapModal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        const backdrops = document.querySelectorAll(".modal-backdrop.fade.show");
        backdrops.forEach((b) => b.remove());
    }
};

export default Modal;
