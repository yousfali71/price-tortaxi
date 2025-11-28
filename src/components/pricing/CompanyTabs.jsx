import React from "react";

/**
 * CompanyTabs - Tab switcher for selecting active taxi company
 */
const CompanyTabs = ({ companies, activeCompanyId, onCompanyChange }) => {
  const companyArray = Object.values(companies);

  return (
    <div className="company-tabs">
      {companyArray.map((company) => (
        <button
          key={company.id}
          className={`company-tab ${
            activeCompanyId === company.id ? "active" : ""
          }`}
          onClick={() => onCompanyChange(company.id)}
          style={
            activeCompanyId === company.id
              ? { borderBottomColor: company.accentColor }
              : {}
          }
        >
          {company.displayName}
        </button>
      ))}
    </div>
  );
};

export default CompanyTabs;
