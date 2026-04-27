'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/',
          });
          console.log('✅ Service Worker registered successfully:', registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000);
        } catch (error) {
          console.error('❌ Service Worker registration failed:', error);
        }
      });

      // Listen for install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        console.log('📱 beforeinstallprompt fired - app is installable');
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowInstallPrompt(true);
      };

      const handleAppInstalled = () => {
        console.log('✅ App was installed successfully');
        setIsInstalled(true);
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      // Check if already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('ℹ️ App is running in standalone mode (already installed)');
        setIsInstalled(true);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('Install prompt not available');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      }
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-lg shadow-lg flex items-center gap-3 max-w-sm animate-slideIn z-50">
      <Download size={20} />
      <div className="flex-1">
        <p className="font-semibold text-sm">Install Sabiskill</p>
        <p className="text-xs opacity-90">Add to your home screen</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleDismiss}
          className="px-3 py-1 text-xs font-medium hover:bg-blue-500 rounded transition-colors"
        >
          Not now
        </button>
        <button
          onClick={handleInstallClick}
          className="px-3 py-1 text-xs font-bold bg-white text-blue-600 rounded hover:bg-gray-100 transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  );
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
  }>;
}
