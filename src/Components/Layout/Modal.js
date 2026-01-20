import { useEffect, useRef, useCallback } from "react";
import { Modal as BootstrapModal } from "bootstrap";

/**
 * Reusable Modal Component
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
 * @param {string} saveButtonClass - Save button CSS class (default: 'btn btn-success')
 * @param {string} cancelButtonClass - Cancel button CSS class (default: 'btn btn-danger')
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
    saveButtonClass = "btn btn-success",
    cancelButtonClass = "btn btn-danger",
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
    const contentStyle = {
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        border: "1px solid #d3d3d3",
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
                    {/* Header */}
                    <div
                        className="modal-header d-flex justify-content-between align-items-center"
                        style={{ borderBottom: "1px solid #d3d3d3" }}
                    >
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            data-bs-dismiss="modal"
                            onClick={handleCancel}
                        >
                            X
                        </button>
                    </div>

                    {/* Body */}
                    <div
                        className="modal-body"
                        style={{ overflowY: "auto", borderBottom: "1px solid #d3d3d3" }}
                    >
                        {children}
                    </div>

                    {/* Footer */}
                    {showFooter && (
                        <div
                            className="modal-footer"
                            style={{ flexShrink: 0, borderTop: "1px solid #d3d3d3" }}
                        >
                            {footer ? (
                                footer
                            ) : (
                                <>
                                    {showSaveButton && (
                                        <button
                                            type="button"
                                            className={saveButtonClass}
                                            onClick={handleSave}
                                        >
                                            {saveLabel}
                                        </button>
                                    )}
                                    {showCancelButton && (
                                        <button
                                            type="button"
                                            className={cancelButtonClass}
                                            data-bs-dismiss="modal"
                                            onClick={handleCancel}
                                        >
                                            {cancelLabel}
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
