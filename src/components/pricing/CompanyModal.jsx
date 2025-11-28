import React, { useEffect } from "react";
import "./CompanyModal.css";

/**
 * CompanyModal - Generic modal component with slide/fade animation
 * Displays company-specific content with close functionality
 */
const CompanyModal = ({ isOpen, onClose, company, children }) => {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-company-info">
            <img
              src={company.logoSrc}
              alt={`${company.displayName} logo`}
              className="modal-company-logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <h2
              className="modal-company-name"
              style={{ color: company.accentColor }}
            >
              {company.displayName}
            </h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default CompanyModal;
