import React, { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";

const CustomSelect = ({ value, onChange, options, label, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name: id, value: optionValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="custom-select-wrapper" ref={dropdownRef}>
      {label && <label className="custom-select-label">{label}</label>}
      <div
        className={`custom-select ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="custom-select-trigger">
          <span>{selectedOption?.label}</span>
          <svg
            className="custom-select-arrow"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
          >
            <path
              d="M1 1L7 7L13 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {isOpen && (
          <div className="custom-select-dropdown">
            {options.map((option) => (
              <div
                key={option.value}
                className={`custom-select-option ${
                  value === option.value ? "selected" : ""
                }`}
                onClick={() => handleSelect(option.value)}
              >
                <span className="option-label">{option.label}</span>
                {value === option.value && (
                  <span className="option-checkmark">✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
