# PWA Icon Guide for Sabiskill

Your app is now a PWA! To complete the setup, you need to add icons to the `public/` folder. Here's what you need:

## Required Icon Files

Create these images in your `public/` folder:

1. **icon-192x192.png** - Standard icon (192x192px)
2. **icon-512x512.png** - Large icon (512x512px)
3. **icon-192x192-maskable.png** - Maskable icon for adaptive icons (192x192px)
4. **icon-512x512-maskable.png** - Maskable icon for adaptive icons (512x512px)

### Optional Screenshots
5. **screenshot-1.png** - Mobile screenshot (540x720px)
6. **screenshot-2.png** - Desktop screenshot (1280x720px)

## How to Create Icons

### Option 1: Using an Online Tool (Quickest)
1. Go to https://www.favicon-generator.org/ or https://icon.kitchen/
2. Upload your logo/image
3. Generate icons at different sizes
4. Download and place in `public/` folder

### Option 2: Using Figma
1. Create a 512x512px design
2. Export as PNG at different sizes (192x192, 512x512)
3. For maskable icons, create versions with safe areas (inner 60% padding)

### Option 3: Design Considerations
- Keep design simple and recognizable at small sizes
- Use your brand colors (dark blue theme matches your dark mode)
- Ensure good contrast for visibility on mobile home screens
- For maskable icons, keep important content within the center 60%

## Testing Your PWA

1. **Chrome DevTools:**
   - Open DevTools → Application → Manifest
   - Check for errors in manifest.json
   - Verify all required fields are present

2. **Install Prompt:**
   - On mobile: Should see "Add to Home Screen" prompt in browser menu
   - On desktop: Should see install icon in address bar

3. **View Service Worker:**
   - DevTools → Application → Service Workers
   - Verify it's active and running

## PWA Features Enabled

✅ **Offline Support** - Basic offline page with fallback caching
✅ **App Installation** - Install on home screen
✅ **Standalone Mode** - Runs like a native app (no browser UI)
✅ **App Shortcuts** - Quick access to Dashboard and Explore
✅ **Responsive Design** - Works on all device sizes
✅ **Background Sync** - Syncs learning data when connection returns (can be enhanced)

## Next Steps

1. Replace placeholder icons with your actual branding
2. Generate screenshots showing your app's best features
3. Test installation on mobile devices (iOS and Android)
4. Consider adding push notifications for better engagement
5. Implement offline-first data persistence in your app

## File Created

- `public/manifest.json` - PWA configuration
- `public/service-worker.js` - Offline support & caching
- `public/offline.html` - Offline fallback page
- `app/components/PWAInstaller.tsx` - Service worker registration

## Build & Deploy

```bash
npm run build
npm start
```

Then test on mobile by navigating to your deployed URL!
