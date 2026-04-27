#!/usr/bin/env node

/**
 * PWA Icon Generator for Sabiskill
 * Generates placeholder icons for your PWA
 * Run: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Try to use sharp if available, otherwise use canvas
let generateIcon;

try {
  const sharp = require('sharp');
  
  generateIcon = async (size, maskable = false) => {
    const padding = maskable ? size * 0.2 : 0;
    const innerSize = size - padding * 2;
    
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" fill="url(#grad)"/>
        <g transform="translate(${padding}, ${padding})">
          <!-- Book icon -->
          <g transform="translate(${innerSize * 0.15}, ${innerSize * 0.15}) scale(${innerSize * 0.007})">
            <path d="M4 19h16v2H4z" fill="#3B82F6"/>
            <path d="M20 3H4c-1.1 0-1.99.9-1.99 2L2 19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14z" fill="#3B82F6"/>
            <path d="M6 7h12v2H6z" fill="#60A5FA"/>
            <path d="M6 11h12v2H6z" fill="#60A5FA"/>
            <path d="M6 15h8v2H6z" fill="#60A5FA"/>
          </g>
          <!-- Skill badge -->
          <circle cx="${innerSize * 0.75}" cy="${innerSize * 0.25}" r="${innerSize * 0.15}" fill="#10B981"/>
          <text x="${innerSize * 0.75}" y="${innerSize * 0.3}" text-anchor="middle" font-size="${innerSize * 0.2}" font-weight="bold" fill="white">S</text>
        </g>
      </svg>
    `;
    
    return sharp(Buffer.from(svg)).png().toBuffer();
  };

} catch {
  console.log('sharp not found, trying to install...');
  console.log('(Or you can manually create 192x192 and 512x512 PNG icons and place them in public/)');
  process.exit(1);
}

async function createIcons() {
  const publicDir = path.join(__dirname, 'public');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sizes = [
    { size: 192, maskable: false, name: 'icon-192x192.png' },
    { size: 192, maskable: true, name: 'icon-192x192-maskable.png' },
    { size: 512, maskable: false, name: 'icon-512x512.png' },
    { size: 512, maskable: true, name: 'icon-512x512-maskable.png' },
  ];

  console.log('🎨 Generating PWA icons...\n');

  for (const { size, maskable, name } of sizes) {
    try {
      const buffer = await generateIcon(size, maskable);
      const filePath = path.join(publicDir, name);
      fs.writeFileSync(filePath, buffer);
      console.log(`✅ Created ${name} (${size}x${size}px)`);
    } catch (error) {
      console.error(`❌ Failed to create ${name}:`, error.message);
    }
  }

  console.log('\n✨ All icons generated successfully!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run build && npm start');
  console.log('2. Open your app in browser');
  console.log('3. Look for the install prompt');
  console.log('\n💡 Tip: Replace these icons with your actual branding later!');
}

createIcons().catch(console.error);
