/**
 * Company configuration for the Tor Taxi Group price calculator
 * Contains display information and branding for each taxi company
 */

import torLogo from "../../assets/tor-logo.png";
import vibLogo from "../../assets/vib-logo.jpeg";
import gttLogo from "../../assets/gtt-logo.jpeg";
import kurirLogo from "../../assets/kurir-logo.jpeg";

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
    displayName: "VIB Taxi",
    accentColor: "#2c3e50",
    logoSrc: vibLogo,
    description: "VIB Taxi - Professional taxi service",
  },
  gtt: {
    id: "gtt",
    displayName: "GTT Taxi",
    accentColor: "#00c8ff",
    logoSrc: gttLogo,
    description: "GTT Taxi - Your trusted taxi company",
  },
  kurir: {
    id: "kurir",
    displayName: "Kurir Taxi",
    accentColor: "#e74c3c",
    logoSrc: kurirLogo,
    description: "Kurir Taxi - Fast and reliable",
  },
};

export const getCompanyById = (id) => companies[id];

export const getAllCompanies = () => Object.values(companies);
