# Tor Taxi Group - Price Calculator

A mobile-first React application for calculating taxi fares across four taxi companies in the Tor Taxi Group: Tor Taxi, VIB Taxi, GTT Taxi, and Kurir Taxi.

## Features

- **Company Selection**: Interactive grid displaying all 4 taxi companies
- **Price Calculator**: Company-specific price calculation with detailed breakdown
- **Mobile-First Design**: Optimized for mobile devices (QR code scanning in taxis)
- **Real-Time Calculations**: All calculations done client-side, no external APIs needed
- **Responsive UI**: Clean, modern interface with smooth animations

## Project Structure

```
src/
├── pages/
│   ├── PriceCalculator.jsx          # Main page component
│   └── PriceCalculator.css          # Page styles
├── components/
│   └── pricing/
│       ├── CompanyGrid.jsx          # Grid of company cards
│       ├── CompanyGrid.css
│       ├── CompanyModal.jsx         # Modal for price calculation
│       ├── CompanyModal.css
│       ├── PriceForm.jsx            # Input form for ride details
│       ├── PriceForm.css
│       ├── ResultCard.jsx           # Price breakdown display
│       └── ResultCard.css
├── features/
│   └── pricing/
│       ├── companiesConfig.js       # Company information & branding
│       ├── tariffs.js              # All pricing rules (SEK)
│       └── calculatePrice.js        # Price calculation logic
└── App.jsx                          # Root component
```

## Pricing Rules

Each company has specific tariff structures:

### VIB Taxi

- Small Car (≤4 pax): Day/Night tariffs (09:00-15:00 / 15:00-09:00)
- Big Car (5+ pax): Day/Night tariffs (09:00-15:00 / 15:00-09:00)

### Tor Taxi

- Normal Car (≤4 pax): Day/Night tariffs (07:00-15:00 / 15:00-07:00)
- Big Car (>4 pax): 24h flat rate

### GTT Taxi

- Normal Car (≤4 pax): 24h flat rate
- Big Car (>4 pax): 24h flat rate

### Kurir Taxi

- Small Car (≤4 pax): Workday/Night+Weekend tariffs
- Big Car (5-8 pax): Workday/Night+Weekend tariffs
- Special handling for Friday/Saturday as weekend

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Usage

1. Open the application in a mobile browser (or scan QR code)
2. Select a taxi company by tapping its card
3. Fill in ride details:
   - Car type (small/big)
   - Date & time
   - Distance in kilometers
   - Duration in minutes
4. Click "Calculate Price" to see the breakdown

## Customization

### Replacing Logo Images

Replace the placeholder SVG files in `public/company-logos/` with your actual PNG/SVG logos:

- `tor.svg` → `tor.png`
- `vib.svg` → `vib.png`
- `gtt.svg` → `gtt.png`
- `kurir.svg` → `kurir.png`

Update the file extensions in `src/features/pricing/companiesConfig.js` if using PNG.

### Modifying Tariffs

Edit `src/features/pricing/tariffs.js` to update pricing rules. Each tariff includes:

- `base`: Fixed start price (SEK)
- `hour`: Price per hour (SEK)
- `km`: Price per kilometer (SEK)
- `type`: Tariff type (day/night/all/weekday-day/night-weekend)
- `from`/`to`: Time ranges (HH:MM format)

## Technologies

- React 18
- Vite
- CSS Modules
- Native JavaScript (no external calculation libraries)

## Browser Support

- Modern browsers (Chrome, Safari, Firefox, Edge)
- Mobile-optimized for iOS Safari and Android Chrome

## License

MIT
