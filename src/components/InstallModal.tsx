import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  ExternalLink,
  Copy,
  Check,
  HardDrive,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<boolean>;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  onInstall,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'pwabuilder' | 'cli'>('pwa');

  if (!isOpen) return null;

  const currentAppUrl = window.location.origin;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentAppUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-amber-700 to-amber-900 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight leading-tight">
                Get Android APK & Install
              </h2>
              <p className="text-xs text-amber-200/90">
                Install as a native phone app with offline storage
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-3 pt-2 gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className={`px-3 py-2 font-medium rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-white text-amber-900 border-t-2 border-amber-800 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Direct Phone Install
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pwabuilder')}
            className={`px-3 py-2 font-medium rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'pwabuilder'
                ? 'bg-white text-amber-900 border-t-2 border-amber-800 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Generate .APK File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cli')}
            className={`px-3 py-2 font-medium rounded-t-lg transition-colors cursor-pointer ${
              activeTab === 'cli'
                ? 'bg-white text-amber-900 border-t-2 border-amber-800 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Build from Code
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700">
          {activeTab === 'pwa' && (
            <div className="space-y-3.5">
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div className="text-stone-800">
                  <p className="font-semibold text-amber-950 text-xs">
                    Recommended: Instant Android App (WebAPK)
                  </p>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Android automatically compiles and installs this app directly from Chrome
                    into an official Android app on your phone with a home screen icon, splash
                    screen, and offline local device storage.
                  </p>
                </div>
              </div>

              {isInstalled ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs">Already Installed on this Device!</p>
                    <p className="text-[11px] text-emerald-800">
                      Tea Counter is running in standalone native mode. All data is saved inside
                      your device storage.
                    </p>
                  </div>
                </div>
              ) : isInstallable ? (
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await onInstall();
                    if (ok) onClose();
                  }}
                  className="w-full py-3 px-4 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Install to Phone Now</span>
                </button>
              ) : (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2.5">
                  <p className="font-semibold text-stone-900">How to install on Android phone:</p>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-stone-600">
                    <li>
                      Open this URL on your Android phone inside <strong>Google Chrome</strong>.
                    </li>
                    <li>
                      Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.
                    </li>
                    <li>
                      Tap <strong>"Install app"</strong> or{' '}
                      <strong>"Add to Home screen"</strong>.
                    </li>
                    <li>
                      Android will generate an APK package and add the <strong>Tea Counter</strong>{' '}
                      icon to your home screen!
                    </li>
                  </ol>
                </div>
              )}

              {/* URL bar copy */}
              <div className="border border-stone-200 rounded-xl p-3 bg-stone-50/50 space-y-1.5">
                <span className="text-[11px] text-stone-500 font-medium">App URL:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentAppUrl}
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-mono select-all focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium rounded-lg flex items-center gap-1.5 cursor-pointer text-[11px] transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pwabuilder' && (
            <div className="space-y-3.5">
              <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3.5">
                <p className="font-semibold text-blue-950 text-xs">
                  Generate a Standalone .APK File (Free & Instant)
                </p>
                <p className="text-[11px] text-blue-900/80 mt-1">
                  Because Tea Counter is built with full PWA manifests and icons, Microsoft &
                  Google's <strong>PWABuilder</strong> can wrap this app into a signed Android{' '}
                  <strong>.apk</strong> or <strong>.aab</strong> package in 1 minute.
                </p>
              </div>

              <div className="border border-stone-200 rounded-xl p-3.5 space-y-2.5 bg-stone-50/60">
                <p className="font-semibold text-stone-900">3 Easy Steps to download the .apk:</p>
                <ol className="list-decimal list-inside space-y-2 text-[11px] text-stone-600">
                  <li>
                    Copy this app URL:
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={currentAppUrl}
                        className="flex-1 bg-white border border-stone-300 rounded-lg px-2 py-1 text-[11px] text-stone-800 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleCopyUrl}
                        className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-md font-medium text-[10px]"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </li>
                  <li>
                    Open <strong>pwabuilder.com</strong> and paste the URL into the input field.
                  </li>
                  <li>
                    Click <strong>Package for Android</strong> and download your generated{' '}
                    <strong>.apk</strong> file directly to your phone!
                  </li>
                </ol>
              </div>

              <a
                href={`https://www.pwabuilder.com/?url=${encodeURIComponent(currentAppUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors text-xs"
              >
                <span>Open PWABuilder to Generate APK</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {activeTab === 'cli' && (
            <div className="space-y-3">
              <p className="text-stone-600 text-[11px]">
                If you prefer to compile an APK with <strong>Android Studio</strong> or Capacitor
                locally on your computer:
              </p>

              <div className="bg-stone-900 text-amber-200/90 font-mono text-[10px] p-3 rounded-xl space-y-1.5 overflow-x-auto">
                <p className="text-stone-400"># 1. Install Capacitor</p>
                <p className="text-white">npm install @capacitor/core @capacitor/android</p>
                <p className="text-white">npm install -D @capacitor/cli</p>
                <p className="text-stone-400 mt-2"># 2. Initialize project</p>
                <p className="text-white">npx cap init "Tea Counter" com.teacounter.app</p>
                <p className="text-stone-400 mt-2"># 3. Build web assets & add Android platform</p>
                <p className="text-white">npm run build</p>
                <p className="text-white">npx cap add android</p>
                <p className="text-stone-400 mt-2"># 4. Open in Android Studio or build APK</p>
                <p className="text-white">npx cap open android</p>
                <p className="text-stone-400 mt-2"># Or build APK directly via Gradle:</p>
                <p className="text-emerald-400">cd android && ./gradlew assembleDebug</p>
              </div>

              <p className="text-[11px] text-stone-500">
                The resulting file will be in{' '}
                <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">
                  android/app/build/outputs/apk/debug/app-debug.apk
                </code>
                .
              </p>
            </div>
          )}

          {/* Device Storage Guarantee */}
          <div className="pt-2 border-t border-stone-200/80 flex items-start gap-2 text-[11px] text-stone-500">
            <HardDrive className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
            <span>
              <strong>100% Offline Device Storage:</strong> Regardless of installation method, all
              your daily counts, varieties, and records stay strictly inside your phone storage.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
