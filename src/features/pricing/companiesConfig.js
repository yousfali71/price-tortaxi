/**
 * Company configuration for the Tor Taxi Group price calculator
 * Contains display information and branding for each taxi company
 */

import torLogo from "../../assets/tor-logo.png";
import vibLogo from "../../assets/vib-logo.jpeg";
import gttLogo from "../../assets/gtt-logo.jpeg";
import kurirLogo from "../../assets/kurir-logo.jpeg";
import clickLogo from "../../assets/ChatGPT Image Nov 29, 2025, 08_56_25 PM.png";

export const companies = {
  tor: {
    id: "tor",
    displayName: "Tor Taxi",
    accentColor: "#ffc107",
    logoSrc: torLogo,
    description: "Tor Taxi - Reliable transport service",
  },
  vib: {
    id: "vib",
    displayName: "VIP Taxi",
    accentColor: "#2c3e50",
    logoSrc: vibLogo,
    description: "VIP Taxi - Professional taxi service",
  },
  gtt: {
    id: "gtt",
    displayName: "Kurrir Taxi",
    accentColor: "#00c8ff",
    logoSrc: gttLogo,
    description: "Kurrir Taxi - Your trusted taxi company",
  },
  kurir: {
    id: "kurir",
    displayName: "Taxibil Lerum",
    accentColor: "#e74c3c",
    logoSrc: kurirLogo,
    description: "Taxibil Lerum - Fast and reliable",
  },
  click: {
    id: "click",
    displayName: "Taxi Click",
    accentColor: "#ff6b00",
    logoSrc: clickLogo,
    description: "Taxi Click - Modern taxi service",
  },
};

export const getCompanyById = (id) => companies[id];

export const getAllCompanies = () => Object.values(companies);
