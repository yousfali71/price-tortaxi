# Price Calculator - Testing Guide

## Quick Start

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open in browser:**
   - The app will run at `http://localhost:5173` (or similar)
   - Best tested in mobile view (Chrome DevTools mobile emulation or actual mobile device)

## Manual Testing Checklist

### 1. Company Grid Display

- [ ] All 4 company cards are visible
- [ ] Logos display correctly (or fallback letters show)
- [ ] Company names show in correct accent colors:
  - Tor Taxi: Yellow (#ffc107)
  - VIB Taxi: White (#ffffff)
  - GTT Taxi: White (#ffffff)
  - Kurir Taxi: Cyan (#00c8ff)
- [ ] Cards have hover effect (desktop)
- [ ] Cards are tappable on mobile

### 2. Modal Functionality

- [ ] Clicking a company card opens modal
- [ ] Modal slides up with fade animation
- [ ] Company logo and name appear in modal header
- [ ] Close button (X) works
- [ ] Clicking outside modal closes it
- [ ] ESC key closes modal
- [ ] Page scrolling is disabled when modal open

### 3. Price Form

- [ ] Car type dropdown works (Small/Big)
- [ ] Date/time picker defaults to current time
- [ ] Can change date and time
- [ ] Distance input accepts decimals
- [ ] Duration input accepts integers
- [ ] Form validation prevents negative numbers
- [ ] Calculate button shows company accent color
- [ ] Form submits when all fields valid

### 4. Price Calculation - VIB Taxi

**Small Car - Day (09:00-15:00):**

- Input: 10 km, 20 min, 10:00
- Expected: Base 61 + Hour ~197 + KM 168.20 = ~426 SEK

**Small Car - Night (15:00-09:00):**

- Input: 10 km, 20 min, 18:00
- Expected: Base 61 + Hour ~199 + KM 196.60 = ~457 SEK

**Big Car - Day:**

- Input: 15 km, 30 min, 12:00
- Expected: Base 89 + Hour 442.50 + KM 378.45 = ~910 SEK

### 5. Price Calculation - Tor Taxi

**Normal Car - Day (07:00-15:00):**

- Input: 10 km, 20 min, 10:00
- Expected: Base 39 + Hour 240 + KM 180 = 459 SEK

**Normal Car - Night (15:00-07:00):**

- Input: 10 km, 20 min, 20:00
- Expected: Base 75 + Hour ~379 + KM 140 = ~594 SEK

**Big Car - 24h:**

- Input: 10 km, 20 min (any time)
- Expected: Base 95 + Hour ~533 + KM 320 = ~948 SEK

### 6. Price Calculation - GTT Taxi

**Normal Car - 24h:**

- Input: 10 km, 20 min (any time)
- Expected: Base 75 + Hour ~253 + KM 200 = ~528 SEK

**Big Car - 24h:**

- Input: 10 km, 20 min (any time)
- Expected: Base 97 + Hour ~467 + KM 343 = ~907 SEK

### 7. Price Calculation - Kurir Taxi

**Small Car - Workday (Monday-Thursday, 09:00-15:00):**

- Input: 10 km, 20 min, Monday 12:00
- Expected: Base 54 + Hour ~197 + KM 197 = ~448 SEK

**Small Car - Night/Weekend (Friday, Saturday, or 15:00-09:00):**

- Input: 10 km, 20 min, Friday 12:00
- Expected: Base 54 + Hour ~218 + KM 206.50 = ~479 SEK

**Big Car - Workday:**

- Input: 10 km, 20 min, Tuesday 11:00
- Expected: Base 82 + Hour 295 + KM 272 = ~649 SEK

### 8. Result Display

- [ ] Breakdown shows all components:
  - Base fare
  - Time charge (hour × hourPart)
  - Distance charge (km × kmPart)
- [ ] Total is in bold with accent color
- [ ] Total is rounded to nearest SEK
- [ ] Tariff description is displayed
- [ ] Result card animates in

### 9. Responsive Design

- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Grid adapts to screen size
- [ ] Modal is full-screen on mobile
- [ ] All text is readable
- [ ] Touch targets are adequate (44px+)

### 10. Accessibility

- [ ] All buttons have labels
- [ ] Form inputs have labels
- [ ] Modal can be closed with keyboard
- [ ] Color contrast is sufficient
- [ ] Reduced motion respected

## Edge Cases to Test

1. **Midnight crossing:**

   - VIB night tariff at 23:00 (should use night rate)
   - VIB night tariff at 02:00 (should use night rate)
   - Switch from day to night at 15:00 exactly

2. **Kurir weekend logic:**

   - Thursday 14:00 → Workday tariff
   - Friday 10:00 → Night/weekend tariff
   - Saturday any time → Night/weekend tariff
   - Sunday any time → Night/weekend tariff
   - Monday 09:00 → Workday tariff

3. **Very small/large values:**

   - 0.1 km, 1 minute
   - 100 km, 180 minutes

4. **Decimal precision:**
   - 10.5 km should calculate correctly
   - Result should round properly

## Known Issues / Future Enhancements

- [ ] Logo placeholders need to be replaced with actual company logos
- [ ] Consider adding currency conversion
- [ ] Consider adding booking integration
- [ ] Add loading states for form submission
- [ ] Add form reset button

## Browser Compatibility

Tested on:

- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Firefox
- [ ] Edge

## Performance

- [ ] Initial load < 2s
- [ ] Modal open/close smooth (60fps)
- [ ] No console errors
- [ ] No console warnings
