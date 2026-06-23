import { useState } from "react";

function SettingsSection({ title, description, children }) {
  return (
    <div className="glass rounded-2xl p-6 glow-border mb-6">
      <div className="mb-6">
        <h3 className="font-display font-bold text-white text-lg">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
      {children}
    </div>
  );
}

function ToggleSetting({ label, description, enabled, onChange }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-700 last:border-0">
      <div>
        <p className="text-white font-medium text-sm">{label}</p>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className="relative w-12 h-6 rounded-full transition"
        style={{
          background: enabled ? "#3b82f6" : "rgba(255,255,255,0.1)",
        }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition"
          style={{
            left: enabled ? "calc(100% - 5px)" : "5px",
            transform: "translateX(-50%)",
          }}
        />
      </button>
    </div>
  );
}

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: true,
    twoFactor: false,
    dataSharing: true,
    apiAccess: true,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="mesh-bg min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
            ⚙️ Settings
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Manage your account preferences and configuration
          </p>
        </div>

        {/* Account Settings */}
        <SettingsSection
          title="Account Information"
          description="Update your profile and account details"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Shivansh Kumar"
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                Organization
              </label>
              <input
                type="text"
                placeholder="Your Company"
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>
            <button className="btn-neon text-white px-6 py-2 rounded-xl text-sm font-medium mt-4">
              Save Changes
            </button>
          </div>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection
          title="Preferences"
          description="Customize your experience"
        >
          <div>
            <ToggleSetting
              label="Push Notifications"
              description="Receive notifications about catalog updates"
              enabled={settings.notifications}
              onChange={() => handleToggle("notifications")}
            />
            <ToggleSetting
              label="Email Updates"
              description="Receive weekly summary emails"
              enabled={settings.emailUpdates}
              onChange={() => handleToggle("emailUpdates")}
            />
            <ToggleSetting
              label="Dark Mode"
              description="Use dark theme throughout the app"
              enabled={settings.darkMode}
              onChange={() => handleToggle("darkMode")}
            />
          </div>
        </SettingsSection>

        {/* Security */}
        <SettingsSection
          title="Security & Privacy"
          description="Control your security settings"
        >
          <div>
            <ToggleSetting
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              enabled={settings.twoFactor}
              onChange={() => handleToggle("twoFactor")}
            />
            <ToggleSetting
              label="Data Sharing"
              description="Allow us to analyze usage patterns"
              enabled={settings.dataSharing}
              onChange={() => handleToggle("dataSharing")}
            />
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <button className="px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 transition">
              Change Password
            </button>
          </div>
        </SettingsSection>

        {/* API & Integrations */}
        <SettingsSection
          title="API & Integrations"
          description="Manage API keys and third-party integrations"
        >
          <div>
            <ToggleSetting
              label="API Access"
              description="Enable API access for integrations"
              enabled={settings.apiAccess}
              onChange={() => handleToggle("apiAccess")}
            />
          </div>
          {settings.apiAccess && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                  API Key
                </label>
                <div className="flex gap-2">
                  <div
                    className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-300 font-mono"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    sk_live_••••••••••••••••
                  </div>
                  <button className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition">
                    Copy
                  </button>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 transition">
                Regenerate Key
              </button>
            </div>
          )}
        </SettingsSection>

        {/* Billing */}
        <SettingsSection
          title="Billing & Subscription"
          description="Manage your subscription plan"
        >
          <div className="mb-6">
            <div
              className="p-4 rounded-xl mb-4"
              style={{ background: "rgba(59, 130, 246, 0.1)" }}
            >
              <p className="text-sm text-white font-medium mb-1">
                Current Plan: Pro
              </p>
              <p className="text-xs text-gray-400">
                Next billing date: March 15, 2025
              </p>
            </div>
            <div className="space-y-2 text-sm text-gray-400 mb-4">
              <p>✓ Unlimited products</p>
              <p>✓ AI-powered descriptions</p>
              <p>✓ Team access (up to 5 members)</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition">
            Upgrade Plan
          </button>
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection
          title="Danger Zone"
          description="Irreversible actions — be careful"
        >
          <div className="space-y-3">
            <button className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 transition">
              🗑️ Delete Account
            </button>
            <button className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 transition">
              🔒 Export My Data
            </button>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}

export default Settings;
