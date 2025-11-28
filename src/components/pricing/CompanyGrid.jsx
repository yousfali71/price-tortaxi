import React from "react";
import { getAllCompanies } from "../../features/pricing/companiesConfig.js";
import "./CompanyGrid.css";

/**
 * CompanyGrid - Displays a responsive grid of taxi company logos
 * Each company card is clickable and triggers the onCompanySelect callback
 */
const CompanyGrid = ({ onCompanySelect }) => {
  const companies = getAllCompanies();

  return (
    <div className="company-grid">
      {companies.map((company) => (
        <button
          key={company.id}
          className="company-card"
          onClick={() => onCompanySelect(company)}
          aria-label={`Calculate price for ${company.displayName}`}
        >
          <div className="company-logo-container">
            <img
              src={company.logoSrc}
              alt={`${company.displayName} logo`}
              className="company-logo"
              onError={(e) => {
                // Fallback if logo is missing
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="company-logo-fallback" style={{ display: "none" }}>
              <span style={{ color: company.accentColor }}>
                {company.displayName.charAt(0)}
              </span>
            </div>
          </div>
          <h3 className="company-name" style={{ color: company.accentColor }}>
            {company.displayName}
          </h3>
        </button>
      ))}
    </div>
  );
};

export default CompanyGrid;
