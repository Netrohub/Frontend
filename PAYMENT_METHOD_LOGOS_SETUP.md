# Payment Method Logos Setup Guide

## Overview
The checkout page now displays actual payment method logos (MADA, Visa, Mastercard) instead of emoji icons.

## Required Logo Files

Add the following logo files to: **`frontend/public/images/payment-methods/`**

1. **mada-logo.png** - MADA payment network logo
2. **visa-logo.png** - Visa payment card logo  
3. **mastercard-logo.png** - Mastercard payment card logo

## Image Requirements

- **Format**: PNG with transparent background (preferred) or SVG
- **Size**: Minimum 200px width, maintain aspect ratio (recommended: 200x80px)
- **Style**: Official brand logos with proper colors
- **Background**: Transparent (PNG) preferred

## Where to Get Logos

### MADA Logo
- **Official Source**: [MADA Brand Guidelines](https://gate2play.docs.oppwa.com/reference/brands-reference)
- **HyperPay Documentation**: Check HyperPay integration docs
- **Note**: MADA logo should be lowercase "mada" as per Saudi Payments requirements

### Visa Logo
- **Official Source**: [Visa Brand Center](https://brandcenter.visa.com/) (requires account)
- **Alternative**: Use publicly available Visa logo from CDN (ensure licensing)
- **Quick Option**: `https://www.visa.com/dam/VCOM/regional/me/english/partner-with-us/images/visa-logo.png`

### Mastercard Logo
- **Official Source**: [Mastercard Brand Center](https://brand.mastercard.com/) (requires account)
- **Alternative**: Use publicly available Mastercard logo from CDN (ensure licensing)
- **Quick Option**: `https://brand.mastercard.com/content/dam/mccom/brandcenter/thumbnails/mastercard_vrt_rev_92px_2x.png`

## Temporary Solution (CDN URLs)

If you need to test immediately, you can temporarily update the component to use CDN URLs:

```typescript
// In PaymentMethodSelector.tsx, update logo paths:
logo: "https://www.visa.com/dam/VCOM/regional/me/english/partner-with-us/images/visa-logo.png", // Visa
logo: "https://brand.mastercard.com/content/dam/mccom/brandcenter/thumbnails/mastercard_vrt_rev_92px_2x.png", // Mastercard
logo: "/images/payment-methods/mada-logo.png", // MADA (needs to be added locally)
```

**⚠️ Important**: Replace CDN URLs with local files for production to ensure:
- Better performance (local files)
- No external dependencies
- Proper licensing compliance

## File Structure

```
frontend/
  public/
    images/
      payment-methods/
        ├── README.md
        ├── mada-logo.png
        ├── visa-logo.png
        └── mastercard-logo.png
```

## Fallback Behavior

If logo images are missing or fail to load, the component will automatically:
1. Hide the broken image
2. Display the first 2 letters of the payment method name as fallback text

## Testing

After adding logos:
1. Restart the dev server: `npm run dev`
2. Navigate to checkout page
3. Verify logos display correctly
4. Test image loading on slow connections
5. Verify fallback works if images are removed

## Production Checklist

- [ ] All three logo files added to `public/images/payment-methods/`
- [ ] Logos are properly sized (200x80px recommended)
- [ ] Logos have transparent backgrounds
- [ ] Logos use official brand colors
- [ ] Tested on both desktop and mobile
- [ ] Verified fallback behavior works
- [ ] Checked licensing compliance for logos

