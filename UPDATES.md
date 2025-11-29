# Price Calculator Updates

## Summary of Changes

All 11 requirements have been successfully implemented:

### ✅ 1. TorTaxi Branding Note

- Added branding note at the top of the modal with phone number
- Text: "Drivs av TorTaxi.se – För bokning eller frågor ring +46 31 10 10 00"
- Styled with small, gray text for subtle appearance

### ✅ 2. Fixed Company Confusion (Kurir/Lerum)

- Separated TaxiKurir and Taxibil Lerum into distinct companies
- TaxiKurir: Cyan color (#00d4ff)
- Taxibil Lerum: Blue color (#0052cc)
- Total companies: 6 (Tor, VIB, GTT, TaxiKurir, Lerum, Click)

### ✅ 3. Expanded Company Tabs

- Reduced font size to 0.7rem (0.65rem on mobile)
- Added horizontal scrolling for mobile devices
- Tabs now fit all company names without text wrapping
- Smooth scrollbar styling

### ✅ 4. GPS Location Button

- Added "Use my location" button next to pickup address field
- Uses browser's geolocation API (navigator.geolocation)
- Icon-only on mobile, full text on desktop
- Styled with GPS icon SVG

### ✅ 5. Added Click Taxi Company

- Company ID: `click`
- Display Name: "Taxi Click"
- Color: Orange (#ff6b00)
- Tariffs:
  - Day (07:00-15:00): base 75, hour 836, km 18
  - Night (15:00-07:00): base 75, hour 1136, km 14

### ✅ 6. Improved Price Alignment

- Changed ResultSummary to two-column grid layout
- Labels left-aligned, values right-aligned
- Clean, professional appearance

### ✅ 7. Removed Date/Time Inputs

- Completely removed datetime input field from form
- Calculations now automatically use current date/time (`new Date()`)
- Tariff selection happens automatically based on current time

### ✅ 8. Lerum Logo Background Fix

- Added white background for Lerum logo wrapper
- CSS rule targets Lerum's blue border color
- Ensures logo displays cleanly without black corners

### ✅ 9. Reduced Main Headline Size

- Mobile: 1.2rem
- Desktop: 1.4-1.6rem (was larger before)
- Better visual hierarchy with smaller top bar title

### ✅ 10. Removed Price Details Button

- No "price details" info page button existed in original code
- Information section remains at bottom of modal

### ✅ 11. Added TorTaxi.se Button

- Button in modal footer: "Gå till TorTaxi.se för att boka"
- Opens TorTaxi.se in new tab using `window.open()`
- Styled as secondary/outline button with hover effects

## New Files Created

1. **`src/constants/config.js`**
   - `TOR_TAXI_PHONE = "+46 31 10 10 00"`
   - `TOR_TAXI_URL = "https://tortaxi.se"`

## Files Modified

1. **`src/features/pricing/companiesConfig.js`**

   - Updated kurir to "TaxiKurir" with cyan color
   - Added lerum company (Taxibil Lerum, blue)
   - Added click company (Taxi Click, orange)

2. **`src/features/pricing/tariffs.js`**

   - Added Click Taxi tariffs (day/night for small car)

3. **`src/components/pricing/PriceCalculatorModal.jsx`**

   - Complete rewrite with all new features
   - Removed datetime state and input
   - Added pickup address field with GPS button
   - Added handleUseMyLocation function
   - Added handleGoToTorTaxi function
   - Changed default language to Swedish (SV)
   - Updated translations for all new fields
   - Added modal headline between top bar and company tabs
   - Added modal footer with TorTaxi button

4. **`src/components/pricing/PriceCalculatorModal.css`**
   - Added `.branding-note` styling
   - Added `.modal-headline` styling
   - Updated `.page-title` to smaller size
   - Updated `.company-tabs` with horizontal scroll
   - Reduced `.company-tab` font size
   - Added `.input-with-button` container styling
   - Added `.gps-button` styling with responsive text
   - Added `.modal-footer` and `.btn-go-to-tortaxi` styling
   - Updated `.company-logo-wrapper` with white background for Lerum
   - Updated `.summary-content` to grid layout for two columns
   - Updated `.summary-row` to use grid
   - Updated mobile responsive styles

## Technical Details

### GPS Location Feature

- Uses `navigator.geolocation.getCurrentPosition()`
- Error handling for browsers without geolocation support
- Displays coordinates as fallback when reverse geocoding not available

### Automatic Time Detection

- Calculation uses `new Date()` directly in `handleSubmit`
- No user input needed for datetime
- Tariff selection in `calculatePrice.js` works automatically

### Company Tab Scrolling

- CSS `overflow-x: auto` on `.company-tabs`
- Webkit scrollbar styling for better UX
- Smooth touch scrolling on mobile

### Two-Column Price Layout

- CSS Grid with `grid-template-columns: 1fr auto`
- `.summary-row` uses `display: contents`
- Clean alignment without flexbox spacing issues

## Testing Checklist

- ✅ No compilation errors
- ✅ Dev server running successfully on port 5175
- ⏳ Manual testing needed:
  - GPS button functionality
  - All 6 company tabs display and scroll
  - Price calculations with automatic time
  - TorTaxi.se button opens in new tab
  - Mobile responsive layout
  - Lerum logo displays with white background

## Next Steps

1. Test GPS location feature in browser
2. Verify all 6 companies display correctly
3. Confirm automatic time detection works for tariffs
4. Test responsive layout on mobile devices
5. Verify TorTaxi.se link functionality
6. Push changes to GitHub repository

## Notes

- Default language changed to Swedish (SV) as requested
- All translations updated for new features
- Existing Mapbox integration preserved
- Route visualization modal unchanged
- calculatePrice.js requires no changes (already supports new tariffs)
