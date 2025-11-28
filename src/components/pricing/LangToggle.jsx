import React from "react";

/**
 * LangToggle - Language switcher between English and Swedish
 */
const LangToggle = ({ lang, onLangChange }) => {
  return (
    <button
      className="lang-toggle"
      onClick={() => onLangChange(lang === "EN" ? "SV" : "EN")}
      aria-label={`Switch to ${lang === "EN" ? "Swedish" : "English"}`}
    >
      🌐 {lang}
    </button>
  );
};

export default LangToggle;
