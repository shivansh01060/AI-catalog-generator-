import { useState } from "react";

function TeamMember({ name, role, email, avatar, status }) {
  return (
    <div className="glass rounded-2xl p-4 glow-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{
              background: "linear-gradient(135deg, #1e40af, #3b82f6)",
            }}
          >
            {avatar}
          </div>
          <div>
            <h4 className="font-bold text-white">{name}</h4>
            <p className="text-xs text-gray-400">{role}</p>
          </div>
        </div>
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: status === "active" ? "#10b981" : "#6b7280",
          }}
        />
      </div>
      <p className="text-sm text-gray-400 mb-3">{email}</p>
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 rounded-lg text-xs bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition">
          Edit
        </button>
        <button className="flex-1 px-3 py-2 rounded-lg text-xs bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 transition">
          Remove
        </button>
      </div>
    </div>
  );
}

function Team() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "member" });

  const teamMembers = [
    {
      id: 1,
      name: "Shivansh Kumar",
      role: "Admin",
      email: "shivansh@example.com",
      avatar: "SK",
      status: "active",
    },
    {
      id: 2,
      name: "Alex Johnson",
      role: "Editor",
      email: "alex@example.com",
      avatar: "AJ",
      status: "active",
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Viewer",
      email: "emma@example.com",
      avatar: "ED",
      status: "active",
    },
    {
      id: 4,
      name: "Michael Chen",
      role: "Editor",
      email: "michael@example.com",
      avatar: "MC",
      status: "inactive",
    },
  ];

  const handleInvite = () => {
    if (inviteForm.email) {
      // Handle invitation
      setInviteForm({ email: "", role: "member" });
      setShowInvite(false);
    }
  };

  return (
    <div className="mesh-bg min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
                👥 Team Management
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Manage team members and permissions
              </p>
            </div>
            <button
              onClick={() => setShowInvite(!showInvite)}
              className="btn-neon text-white px-6 py-3 rounded-xl font-medium text-sm w-full md:w-auto"
            >
              ➕ Invite Member
            </button>
          </div>

          {/* Invite Form */}
          {showInvite && (
            <div className="glass rounded-2xl p-6 glow-border mb-6 animate-in fade-in">
              <h3 className="font-display font-bold text-white mb-4">
                Invite New Team Member
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, email: e.target.value })
                    }
                    placeholder="member@example.com"
                    className="input-dark w-full rounded-xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
                    Role
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, role: e.target.value })
                    }
                    className="input-dark w-full rounded-xl px-4 py-3 text-sm"
                  >
                    <option value="member">Member</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleInvite}
                  className="btn-neon text-white px-4 py-2 rounded-lg font-medium text-sm"
                >
                  Send Invite
                </button>
                <button
                  onClick={() => setShowInvite(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#9ca3af",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Members", value: "4", icon: "👥" },
            { label: "Active Now", value: "3", icon: "🟢" },
            { label: "Pending Invites", value: "2", icon: "📧" },
            { label: "Storage Used", value: "2.4 GB", icon: "💾" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-4 glow-border">
              <p className="text-gray-400 text-xs font-medium mb-2">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Team Members */}
        <div className="mb-8">
          <h2 className="font-display font-bold text-white text-xl mb-4">
            Team Members
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <TeamMember key={member.id} {...member} />
            ))}
          </div>
        </div>

        {/* Pending Invitations */}
        <div>
          <h2 className="font-display font-bold text-white text-xl mb-4">
            Pending Invitations
          </h2>
          <div className="space-y-3">
            {["john.doe@example.com", "sarah.smith@example.com"].map(
              (email, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-4 flex items-center justify-between glow-border"
                >
                  <div>
                    <p className="text-white font-medium">{email}</p>
                    <p className="text-xs text-gray-400">Invited 3 days ago</p>
                  </div>
                  <button className="px-3 py-1 rounded-lg text-xs text-red-300 bg-red-600/20 hover:bg-red-600/30 transition border border-red-500/30">
                    Cancel
                  </button>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Team;
