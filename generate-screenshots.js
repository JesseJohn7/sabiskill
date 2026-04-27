#!/usr/bin/env node

/**
 * PWA Screenshot Generator for Sabiskill
 * Generates placeholder screenshots for app stores
 * Run: node generate-screenshots.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createScreenshot(width, height, name) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
      
      <!-- Header -->
      <rect width="${width}" height="${height * 0.15}" fill="#0f172a"/>
      <text x="${width * 0.05}" y="${height * 0.12}" font-size="${height * 0.08}" font-weight="bold" fill="#3B82F6" font-family="Arial">Sabiskill</text>
      
      <!-- Main Content Area -->
      <g id="content">
        <!-- Card 1 -->
        <rect x="${width * 0.05}" y="${height * 0.2}" width="${width * 0.9}" height="${height * 0.18}" rx="12" fill="#1e293b" stroke="#3B82F6" stroke-width="2"/>
        <text x="${width * 0.1}" y="${height * 0.28}" font-size="${height * 0.06}" font-weight="bold" fill="white">📚 React Basics</text>
        <text x="${width * 0.1}" y="${height * 0.36}" font-size="${height * 0.04}" fill="#94a3b8">8/12 lessons completed</text>
        <rect x="${width * 0.1}" y="${height * 0.32}" width="${width * 0.8}" height="${height * 0.03}" rx="4" fill="#334155"/>
        <rect x="${width * 0.1}" y="${height * 0.32}" width="${width * 0.8 * 0.67}" height="${height * 0.03}" rx="4" fill="#3B82F6"/>
        
        <!-- Card 2 -->
        <rect x="${width * 0.05}" y="${height * 0.43}" width="${width * 0.9}" height="${height * 0.18}" rx="12" fill="#1e293b" stroke="#10B981" stroke-width="2"/>
        <text x="${width * 0.1}" y="${height * 0.51}" font-size="${height * 0.06}" font-weight="bold" fill="white">🎯 JavaScript Advanced</text>
        <text x="${width * 0.1}" y="${height * 0.59}" font-size="${height * 0.04}" fill="#94a3b8">3/10 lessons completed</text>
        <rect x="${width * 0.1}" y="${height * 0.55}" width="${width * 0.8}" height="${height * 0.03}" rx="4" fill="#334155"/>
        <rect x="${width * 0.1}" y="${height * 0.55}" width="${width * 0.8 * 0.3}" height="${height * 0.03}" rx="4" fill="#10B981"/>
        
        <!-- Card 3 -->
        <rect x="${width * 0.05}" y="${height * 0.66}" width="${width * 0.9}" height="${height * 0.18}" rx="12" fill="#1e293b" stroke="#F59E0B" stroke-width="2"/>
        <text x="${width * 0.1}" y="${height * 0.74}" font-size="${height * 0.06}" font-weight="bold" fill="white">🎨 Web Design</text>
        <text x="${width * 0.1}" y="${height * 0.82}" font-size="${height * 0.04}" fill="#94a3b8">5/8 lessons completed</text>
        <rect x="${width * 0.1}" y="${height * 0.78}" width="${width * 0.8}" height="${height * 0.03}" rx="4" fill="#334155"/>
        <rect x="${width * 0.1}" y="${height * 0.78}" width="${width * 0.8 * 0.625}" height="${height * 0.03}" rx="4" fill="#F59E0B"/>
      </g>
      
      <!-- Display Mode Badge -->
      <rect x="${width * 0.05}" y="${height * 0.89}" width="auto" height="${height * 0.08}" rx="8" fill="#3B82F6"/>
      <text x="${width * 0.1}" y="${height * 0.96}" font-size="${height * 0.05}" font-weight="bold" fill="white" font-family="Arial">Installed App</text>
    </svg>
  `;

  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return buffer;
}

async function createScreenshots() {
  const publicDir = path.join(__dirname, 'public');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const screenshots = [
    { width: 540, height: 720, name: 'screenshot-1.png', label: 'Mobile' },
    { width: 1280, height: 720, name: 'screenshot-2.png', label: 'Desktop' },
  ];

  console.log('📸 Generating PWA screenshots...\n');

  for (const { width, height, name, label } of screenshots) {
    try {
      const buffer = await createScreenshot(width, height, name);
      const filePath = path.join(publicDir, name);
      fs.writeFileSync(filePath, buffer);
      console.log(`✅ Created ${name} (${width}x${height}px - ${label})`);
    } catch (error) {
      console.error(`❌ Failed to create ${name}:`, error.message);
    }
  }

  console.log('\n✨ All screenshots generated successfully!');
}

createScreenshots().catch(console.error);
