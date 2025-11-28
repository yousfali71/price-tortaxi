# Deployment Guide - Price Calculator

## Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

## Deployment Options

### 1. Vercel (Recommended for Vite)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel dashboard.

### 2. Netlify

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Then deploy via Netlify CLI or drag-drop the `dist` folder.

### 3. GitHub Pages

Install gh-pages:

```bash
npm install -D gh-pages
```

Add to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Update `vite.config.js` with base path:

```js
export default defineConfig({
  base: "/price-calculator/",
  // ... rest of config
});
```

Deploy:

```bash
npm run deploy
```

### 4. Static Server (Any)

Simply upload contents of `dist/` folder to your web server.

## QR Code Generation

For taxi QR codes, use any QR generator with your deployed URL:

- [QR Code Generator](https://www.qr-code-generator.com/)
- [QRCode Monkey](https://www.qrcode-monkey.com/)

Recommended QR settings:

- Error correction: High (H)
- Size: 300×300px minimum
- Format: PNG or SVG

## Environment Variables

If you need to add environment variables, create `.env` file:

```env
VITE_API_URL=https://api.example.com
VITE_COMPANY_NAME=Tor Taxi Group
```

Access in code:

```js
const apiUrl = import.meta.env.VITE_API_URL;
```

## Pre-deployment Checklist

- [ ] All company logos replaced with actual images
- [ ] Test on real mobile devices
- [ ] Check all calculations are accurate
- [ ] Verify all 4 companies work correctly
- [ ] Test with various time ranges
- [ ] Test with different dates (weekdays/weekends)
- [ ] Check all tariff rules match specifications
- [ ] Verify mobile responsiveness
- [ ] Test modal animations
- [ ] Check accessibility (screen readers, keyboard nav)
- [ ] Remove console.log statements
- [ ] Update README with production URL

## Performance Optimization

Already included:

- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Asset optimization

Optional improvements:

- Add service worker for offline support
- Implement lazy loading for modal
- Add image optimization for logos

## Monitoring

Consider adding:

- Google Analytics
- Sentry for error tracking
- Simple backend logging for calculations

## Updating Tariffs

When tariff prices change:

1. Update `src/features/pricing/tariffs.js`
2. Rebuild: `npm run build`
3. Redeploy
4. No database or backend changes needed!

## Security

- All calculations are client-side
- No sensitive data stored
- No API keys needed
- No authentication required
- Safe to deploy as static site

## Support

For issues or questions, check:

- PRICE_CALCULATOR_README.md
- TESTING_GUIDE.md
- This deployment guide
