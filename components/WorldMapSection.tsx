"use client";

import React from 'react';

const WorldMapSection: React.FC = () => {
  const highlightedCountries = ["Nigeria", "South Africa", "UK", "USA", "France", "Greece"];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Global Learning Community</h2>
          <p className="text-lg text-gray-600">Join learners from around the world</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* World Map SVG */}
          <div className="relative flex justify-center">
            <svg
              viewBox="0 0 960 600"
              className="w-full h-auto"
              style={{ maxWidth: "500px" }}
            >
              {/* Simple world map representation with highlighted regions */}
              <rect width="960" height="600" fill="#f3f4f6" />
              
              {/* Simplified continents/regions - this is a basic representation */}
              {/* North America */}
              <path
                d="M 150 150 L 220 140 L 230 200 L 160 220 Z"
                fill="#dbeafe"
                stroke="#fff"
                strokeWidth="1"
              />
              
              {/* South America */}
              <path
                d="M 200 280 L 240 270 L 245 380 L 210 390 Z"
                fill="#dbeafe"
                stroke="#fff"
                strokeWidth="1"
              />
              
              {/* Europe & UK */}
              <path
                d="M 450 120 L 520 110 L 540 180 L 480 190 Z"
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth="1"
              />
              
              {/* Africa - Nigeria, South Africa */}
              <path
                d="M 490 220 L 570 210 L 590 380 L 520 390 Z"
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth="1"
              />
              
              {/* Middle East */}
              <path
                d="M 550 150 L 620 140 L 630 220 L 570 230 Z"
                fill="#dbeafe"
                stroke="#fff"
                strokeWidth="1"
              />
              
              {/* Asia */}
              <path
                d="M 620 80 L 750 70 L 780 250 L 650 260 Z"
                fill="#dbeafe"
                stroke="#fff"
                strokeWidth="1"
              />
              
              {/* Oceania */}
              <path
                d="M 780 330 L 820 320 L 830 370 L 800 375 Z"
                fill="#dbeafe"
                stroke="#fff"
                strokeWidth="1"
              />
              
              {/* Greece highlight */}
              <circle cx="530" cy="160" r="8" fill="#3b82f6" stroke="#fff" strokeWidth="1" />
              
              {/* France highlight */}
              <circle cx="470" cy="150" r="8" fill="#3b82f6" stroke="#fff" strokeWidth="1" />
              
              {/* Map labels */}
              <text x="180" y="180" fontSize="12" fill="#374151" fontWeight="bold">
                US
              </text>
              <text x="500" y="310" fontSize="12" fill="#fff" fontWeight="bold">
                Nigeria &amp; SA
              </text>
              <text x="450" y="200" fontSize="12" fill="#fff" fontWeight="bold">
                UK &amp; France
              </text>
              <text x="500" y="155" fontSize="10" fill="#fff" fontWeight="bold">
                Greece
              </text>
            </svg>
          </div>
          
          {/* Stats Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-lg text-gray-700">Active Learners</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">4</div>
              <div className="text-lg text-gray-700">Continents</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">20+</div>
              <div className="text-lg text-gray-700">Countries</div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">
                <span className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                Highlighted regions show our active community
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorldMapSection;