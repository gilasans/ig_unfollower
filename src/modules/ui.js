/**
 * UI Rendering Engine
 * Handles all page rendering, transitions, and component creation
 */

// SVG Icons as constants
const ICONS = {
  home: `<svg class="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
  upload: `<svg class="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>`,
  results: `<svg class="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
  history: `<svg class="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  profile: `<svg class="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  search: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`,
  external: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`,
  trash: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`,
  download: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
  chevronRight: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>`,
  close: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`,
  instagram: `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  userMinus: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"/></svg>`,
  userPlus: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>`,
  heart: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`,
  users: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
  arrowUp: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>`,
  arrowDown: `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>`,
  info: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  file: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
  check: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`,
};

/**
 * Format relative time
 */
function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Render the Dashboard page
 */
export function renderDashboard(stats, scanHistory) {
  const hasData = stats !== null;
  const lastScan = scanHistory.length > 0 ? scanHistory[0] : null;

  return `
    <div class="page-content">
      <!-- Header -->
      <div class="header-gradient pt-14 pb-24 px-5">
        <div class="max-w-lg mx-auto relative z-10">
          <div class="flex items-center justify-between mb-3 animate-fade-in">
            <div>
              <div class="flex items-center gap-2.5 mb-2">
                <div class="w-10 h-10 rounded-2xl ig-gradient flex items-center justify-center shadow-lg shadow-ig-pink/20">
                  ${ICONS.instagram}
                </div>
                <div>
                  <h1 class="text-xl font-extrabold text-white tracking-tight">InstaTrack</h1>
                  <p class="text-[11px] text-white/40 font-medium tracking-wider uppercase">Unfollower Tracker</p>
                </div>
              </div>
            </div>
            ${hasData ? `
              <div class="glass-card-light px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft"></span>
                <span class="text-[11px] text-white/60 font-semibold">Data Aktif</span>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="floating-shape floating-shape-1"></div>
        <div class="floating-shape floating-shape-2"></div>
      </div>

      <div class="max-w-lg mx-auto px-5 -mt-16 relative z-10">
        ${hasData ? renderDashboardStats(stats) : renderEmptyDashboard()}

        ${hasData ? `
          <!-- Quick Actions -->
          <div class="grid grid-cols-2 gap-3 mb-6 animate-slide-up" style="animation-delay:0.15s">
            <button onclick="window.app.navigate('upload')" class="glass-card p-4 flex items-center gap-3 active:scale-95 transition-transform group">
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md" style="background:linear-gradient(135deg,#833AB4,#E1306C)">
                <svg class="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              </div>
              <div class="text-left">
                <p class="text-sm font-bold text-white">Scan Ulang</p>
                <p class="text-[11px] text-white/40 mt-0.5">Upload data baru</p>
              </div>
            </button>
            <button onclick="window.app.navigate('results')" class="glass-card p-4 flex items-center gap-3 active:scale-95 transition-transform group">
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md" style="background:linear-gradient(135deg,#F77737,#FCAF45)">
                ${ICONS.results}
              </div>
              <div class="text-left">
                <p class="text-sm font-bold text-white">Lihat Detail</p>
                <p class="text-[11px] text-white/40 mt-0.5">Semua hasil</p>
              </div>
            </button>
          </div>
        ` : ''}

        ${scanHistory.length > 0 ? renderRecentHistory(scanHistory.slice(0, 3)) : ''}
      </div>
    </div>
  `;
}

function renderDashboardStats(stats) {
  return `
    <!-- Main Stats -->
    <div class="grid grid-cols-2 gap-3 mb-4 animate-slide-up">
      <div class="stat-card text-center">
        <p class="text-3xl font-extrabold text-white count-animate">${stats.totalFollowers.toLocaleString()}</p>
        <p class="text-[11px] text-white/40 mt-1.5 font-semibold uppercase tracking-wider">Followers</p>
      </div>
      <div class="stat-card text-center">
        <p class="text-3xl font-extrabold text-white count-animate">${stats.totalFollowing.toLocaleString()}</p>
        <p class="text-[11px] text-white/40 mt-1.5 font-semibold uppercase tracking-wider">Following</p>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-2 mb-6 animate-slide-up" style="animation-delay:0.05s">
      <button onclick="window.app.navigate('results','unfollowers')" class="stat-card text-center p-3 active:scale-95 transition-transform">
        <div class="w-8 h-8 icon-box-danger rounded-lg mx-auto mb-2">
          <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"/></svg>
        </div>
        <p class="text-lg font-extrabold ${stats.unfollowerCount > 0 ? 'text-red-400' : 'text-white'}">${stats.unfollowerCount}</p>
        <p class="text-[9px] text-white/35 mt-0.5 font-semibold uppercase tracking-wider">Unfollow</p>
      </button>
      <button onclick="window.app.navigate('results','not_following_back')" class="stat-card text-center p-3 active:scale-95 transition-transform">
        <div class="w-8 h-8 icon-box-warning rounded-lg mx-auto mb-2">
          <svg class="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <p class="text-lg font-extrabold text-white">${stats.notFollowingBackCount}</p>
        <p class="text-[9px] text-white/35 mt-0.5 font-semibold uppercase tracking-wider leading-tight">Gak Follback</p>
      </button>
      <button onclick="window.app.navigate('results','fans')" class="stat-card text-center p-3 active:scale-95 transition-transform">
        <div class="w-8 h-8 icon-box-purple rounded-lg mx-auto mb-2">
          <svg class="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </div>
        <p class="text-lg font-extrabold text-white">${stats.fansCount}</p>
        <p class="text-[9px] text-white/35 mt-0.5 font-semibold uppercase tracking-wider">Fans</p>
      </button>
      <button onclick="window.app.navigate('results','mutual')" class="stat-card text-center p-3 active:scale-95 transition-transform">
        <div class="w-8 h-8 icon-box-success rounded-lg mx-auto mb-2">
          <svg class="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        </div>
        <p class="text-lg font-extrabold text-white">${stats.mutualCount}</p>
        <p class="text-[9px] text-white/35 mt-0.5 font-semibold uppercase tracking-wider">Teman</p>
      </button>
    </div>

    ${stats.hasHistory && stats.newFollowerCount > 0 ? `
      <div class="glass-card p-4 mb-6 animate-slide-up flex items-center gap-3" style="animation-delay:0.1s">
        <div class="w-10 h-10 rounded-xl icon-box-success flex items-center justify-center flex-shrink-0">
          ${ICONS.userPlus}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-green-400">+${stats.newFollowerCount} Follower Baru</p>
          <p class="text-[11px] text-white/40">Sejak scan terakhir</p>
        </div>
      </div>
    ` : ''}

    <!-- Ratio Card -->
    <div class="glass-card p-4 mb-6 animate-slide-up" style="animation-delay:0.1s">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs text-white/40 font-semibold uppercase tracking-wider">Follow Ratio</span>
        <span class="text-sm font-bold ig-gradient-text">${stats.ratio}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-fill" style="width:${Math.min((stats.totalFollowers / Math.max(stats.totalFollowing, 1)) * 100, 100)}%"></div>
      </div>
      <p class="text-[11px] text-white/30 mt-2">${parseFloat(stats.ratio) >= 1 ? '✨ Rasio bagus! Followers lebih banyak dari following' : '💡 Following lebih banyak dari followers'}</p>
    </div>
  `;
}

function renderEmptyDashboard() {
  return `
    <div class="glass-card p-8 text-center mb-6 animate-slide-up">
      <div class="w-20 h-20 rounded-3xl ig-gradient flex items-center justify-center mx-auto mb-5 animate-float shadow-ig">
        ${ICONS.instagram}
      </div>
      <h2 class="text-xl font-extrabold text-white mb-2">Selamat Datang!</h2>
      <p class="text-sm text-white/50 mb-6 leading-relaxed max-w-xs mx-auto">
        Upload data Instagram kamu untuk mulai tracking siapa yang unfollow dan analisis followers.
      </p>
      <button onclick="window.app.navigate('upload')" class="btn-ig w-full text-center flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
        Mulai Upload Data
      </button>

      <div class="section-divider mt-6 mb-5"></div>

      <div class="text-left space-y-4">
        <p class="text-xs text-white/50 font-semibold uppercase tracking-wider mb-3">Cara Mendapatkan Data:</p>
        <div class="flex gap-3 items-start">
          <span class="step-number">1</span>
          <div>
            <p class="text-sm font-semibold text-white/80">Buka Instagram → Settings</p>
            <p class="text-xs text-white/35 mt-0.5">Accounts Center → Your Information and Permissions</p>
          </div>
        </div>
        <div class="flex gap-3 items-start">
          <span class="step-number">2</span>
          <div>
            <p class="text-sm font-semibold text-white/80">Download Your Information</p>
            <p class="text-xs text-white/35 mt-0.5">Pilih "Download or transfer information" → Format JSON</p>
          </div>
        </div>
        <div class="flex gap-3 items-start">
          <span class="step-number">3</span>
          <div>
            <p class="text-sm font-semibold text-white/80">Upload di sini</p>
            <p class="text-xs text-white/35 mt-0.5">Upload file <code class="text-ig-pink bg-ig-pink/10 px-1.5 py-0.5 rounded text-[11px]">followers_1.json</code> dan <code class="text-ig-pink bg-ig-pink/10 px-1.5 py-0.5 rounded text-[11px]">following.json</code></p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRecentHistory(history) {
  return `
    <div class="animate-slide-up" style="animation-delay:0.2s">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-extrabold text-white">Riwayat Scan</h2>
        <button onclick="window.app.navigate('history')" class="text-xs ig-gradient-text font-bold">Lihat Semua →</button>
      </div>
      <div class="space-y-3">
        ${history.map((item, i) => `
          <div class="glass-card p-4 animate-slide-up" style="animation-delay:${0.25 + i * 0.05}s">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-white">${timeAgo(item.date)}</p>
                <p class="text-xs text-white/35 mt-0.5">${item.followers} followers · ${item.following} following</p>
              </div>
              <div class="flex items-center gap-2">
                ${item.unfollowerCount > 0 ? `<span class="badge-unfollowed">-${item.unfollowerCount}</span>` : ''}
                ${item.newFollowerCount > 0 ? `<span class="badge-new">+${item.newFollowerCount}</span>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Render the Upload page
 */
export function renderUpload(followerFile, followingFile) {
  return `
    <div class="page-content">
      <div class="header-gradient pt-14 pb-20 px-5">
        <div class="max-w-lg mx-auto relative z-10">
          <div class="animate-fade-in">
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Upload Data</h1>
            <p class="text-sm text-white/40 mt-1">Upload file JSON dari Instagram Data Download</p>
          </div>
        </div>
        <div class="floating-shape floating-shape-1"></div>
      </div>

      <div class="max-w-lg mx-auto px-5 -mt-12 relative z-10 space-y-4">
        <!-- Followers Upload -->
        <div class="animate-slide-up">
          <label class="text-xs text-white/50 font-semibold uppercase tracking-wider mb-2 block">File Followers</label>
          <div id="upload-followers" class="upload-zone ${followerFile ? 'has-file' : ''}" data-type="followers">
            ${followerFile ? `
              <div class="flex items-center gap-3 justify-center">
                <div class="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                  ${ICONS.check}
                </div>
                <div class="text-left">
                  <p class="text-sm font-bold text-green-400">${followerFile.name}</p>
                  <p class="text-xs text-white/35 mt-0.5">${followerFile.count} followers terdeteksi</p>
                </div>
              </div>
            ` : `
              <div class="mb-3">
                <div class="w-14 h-14 rounded-2xl ig-gradient-soft flex items-center justify-center mx-auto">
                  <svg class="w-7 h-7 text-ig-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                </div>
              </div>
              <p class="text-sm font-semibold text-white/70">Tap atau drop file di sini</p>
              <p class="text-xs text-white/30 mt-1">followers_1.json</p>
            `}
            <input type="file" accept=".json" class="hidden" id="input-followers">
          </div>
        </div>

        <!-- Following Upload -->
        <div class="animate-slide-up" style="animation-delay:0.1s">
          <label class="text-xs text-white/50 font-semibold uppercase tracking-wider mb-2 block">File Following</label>
          <div id="upload-following" class="upload-zone ${followingFile ? 'has-file' : ''}" data-type="following">
            ${followingFile ? `
              <div class="flex items-center gap-3 justify-center">
                <div class="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                  ${ICONS.check}
                </div>
                <div class="text-left">
                  <p class="text-sm font-bold text-green-400">${followingFile.name}</p>
                  <p class="text-xs text-white/35 mt-0.5">${followingFile.count} following terdeteksi</p>
                </div>
              </div>
            ` : `
              <div class="mb-3">
                <div class="w-14 h-14 rounded-2xl ig-gradient-soft flex items-center justify-center mx-auto">
                  <svg class="w-7 h-7 text-ig-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                </div>
              </div>
              <p class="text-sm font-semibold text-white/70">Tap atau drop file di sini</p>
              <p class="text-xs text-white/30 mt-1">following.json</p>
            `}
            <input type="file" accept=".json" class="hidden" id="input-following">
          </div>
        </div>

        <!-- Analyze Button -->
        <div class="animate-slide-up pt-2" style="animation-delay:0.2s">
          <button id="btn-analyze"
                  class="btn-ig w-full text-center flex items-center justify-center gap-2 ${(!followerFile || !followingFile) ? 'opacity-40 cursor-not-allowed' : ''}"
                  ${(!followerFile || !followingFile) ? 'disabled' : ''}>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            Analisis Data
          </button>
        </div>

        <!-- How it works -->
        <div class="glass-card p-5 animate-slide-up" style="animation-delay:0.3s">
          <div class="flex items-center gap-2 mb-4">
            ${ICONS.info}
            <span class="text-sm font-bold text-white/70">Cara Download Data Instagram</span>
          </div>
          <div class="space-y-3 text-xs text-white/40 leading-relaxed">
            <div class="flex gap-2.5 items-start">
              <span class="step-number text-[10px] w-6 h-6">1</span>
              <p>Buka <span class="text-ig-pink font-semibold">Instagram</span> → Settings → Accounts Center</p>
            </div>
            <div class="flex gap-2.5 items-start">
              <span class="step-number text-[10px] w-6 h-6">2</span>
              <p>Your Information and Permissions → <span class="text-ig-pink font-semibold">Download Your Information</span></p>
            </div>
            <div class="flex gap-2.5 items-start">
              <span class="step-number text-[10px] w-6 h-6">3</span>
              <p>Pilih akun → Request a Download → Format: <span class="text-ig-pink font-semibold">JSON</span></p>
            </div>
            <div class="flex gap-2.5 items-start">
              <span class="step-number text-[10px] w-6 h-6">4</span>
              <p>Download & extract zip → cari file <code class="text-ig-pink bg-ig-pink/10 px-1 py-0.5 rounded">followers_1.json</code> dan <code class="text-ig-pink bg-ig-pink/10 px-1 py-0.5 rounded">following.json</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the Results page
 */
export function renderResults(analysis, unfollowerData, activeTab = 'unfollowers', searchQuery = '') {
  if (!analysis) {
    return `
      <div class="page-content">
        <div class="header-gradient pt-14 pb-20 px-5">
          <div class="max-w-lg mx-auto relative z-10 animate-fade-in">
            <h1 class="text-2xl font-extrabold text-white">Hasil Analisis</h1>
            <p class="text-sm text-white/40 mt-1">Upload data terlebih dahulu</p>
          </div>
        </div>
        <div class="max-w-lg mx-auto px-5 -mt-12 relative z-10">
          <div class="empty-state glass-card">
            <div class="empty-state-icon">
              ${ICONS.results}
            </div>
            <p class="text-base font-bold text-white/70 mb-2">Belum Ada Data</p>
            <p class="text-sm text-white/35 mb-6">Upload file followers & following untuk melihat hasil analisis</p>
            <button onclick="window.app.navigate('upload')" class="btn-ig mx-auto flex items-center gap-2">
              ${ICONS.upload} Upload Data
            </button>
          </div>
        </div>
      </div>
    `;
  }

  const tabs = [
    { id: 'unfollowers', label: 'Unfollow', count: unfollowerData.unfollowerCount, badge: 'badge-unfollowed' },
    { id: 'not_following_back', label: 'Gak Follback', count: analysis.notFollowingBackCount, badge: 'badge-not-following' },
    { id: 'fans', label: 'Fans', count: analysis.fansCount, badge: 'badge-fans' },
    { id: 'mutual', label: 'Teman', count: analysis.mutualCount, badge: 'badge-mutual' },
    { id: 'new_followers', label: 'Baru', count: unfollowerData.newFollowerCount, badge: 'badge-new' },
  ];

  let users = [];
  let emptyMsg = '';
  switch (activeTab) {
    case 'unfollowers':
      users = unfollowerData.unfollowers || [];
      emptyMsg = unfollowerData.hasHistory
        ? '🎉 Tidak ada yang unfollow!'
        : '📊 Upload data 2x untuk mendeteksi unfollowers';
      break;
    case 'not_following_back':
      users = analysis.notFollowingBack || [];
      emptyMsg = '✨ Semua yang kamu ikuti sudah mengikuti kamu balik!';
      break;
    case 'fans':
      users = analysis.fans || [];
      emptyMsg = 'Tidak ada fans yang belum kamu follow';
      break;
    case 'mutual':
      users = analysis.mutual || [];
      emptyMsg = 'Belum ada mutual followers';
      break;
    case 'new_followers':
      users = unfollowerData.newFollowers || [];
      emptyMsg = unfollowerData.hasHistory
        ? 'Tidak ada follower baru sejak scan terakhir'
        : '📊 Upload data 2x untuk mendeteksi follower baru';
      break;
  }

  // Apply search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    users = users.filter(u => u.username.includes(q) || (u.displayName && u.displayName.toLowerCase().includes(q)));
  }

  return `
    <div class="page-content">
      <div class="header-gradient pt-14 pb-24 px-5">
        <div class="max-w-lg mx-auto relative z-10 animate-fade-in">
          <h1 class="text-2xl font-extrabold text-white">Hasil Analisis</h1>
          <p class="text-sm text-white/40 mt-1">${analysis.followers} followers · ${analysis.following} following</p>
        </div>
        <div class="floating-shape floating-shape-3"></div>
      </div>

      <div class="max-w-lg mx-auto px-5 -mt-16 relative z-10">
        <!-- Search -->
        <div class="mb-4 animate-slide-up">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30">
              ${ICONS.search}
            </div>
            <input type="text" id="search-users" class="input-field pl-12" placeholder="Cari username..." value="${searchQuery}">
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide animate-slide-up" style="animation-delay:0.05s;-ms-overflow-style:none;scrollbar-width:none">
          ${tabs.map(tab => `
            <button onclick="window.app.switchTab('${tab.id}')" class="filter-chip ${activeTab === tab.id ? 'active' : ''} flex items-center gap-1.5">
              ${tab.label}
              <span class="text-[10px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/5'} px-1.5 py-0.5 rounded-full font-bold">${tab.count}</span>
            </button>
          `).join('')}
        </div>

        <!-- Tab Description -->
        <div class="mb-4 animate-slide-up" style="animation-delay:0.08s">
          <div class="glass-card-light px-4 py-2.5 rounded-xl">
            <p class="text-xs text-white/45 leading-relaxed">
              ${activeTab === 'unfollowers' ? '👤 Orang yang sebelumnya mengikuti kamu tapi sekarang sudah unfollow'
                : activeTab === 'not_following_back' ? '⚠️ <b>Gak Follback:</b> ada di <i>Following</i> namun <span class="text-orange-400 font-semibold">TIDAK ADA</span> di <i>Followers</i> (kamu ikuti tapi tidak mengikuti kamu balik)'
                : activeTab === 'fans' ? '💜 <b>Fans:</b> ada di <i>Followers</i> namun <span class="text-purple-400 font-semibold">TIDAK ADA</span> di <i>Following</i> (mengikuti kamu tapi belum kamu ikuti balik)'
                : activeTab === 'mutual' ? '🤝 <b>Teman (Mutual):</b> ada di <span class="text-green-400 font-semibold">kedua-duanya</span> (saling mengikuti satu sama lain)'
                : activeTab === 'new_followers' ? '✨ Orang yang baru mengikuti kamu sejak scan terakhir'
                : ''}
            </p>
          </div>
        </div>

        <!-- User List -->
        <div class="space-y-2 animate-slide-up" style="animation-delay:0.1s">
          ${users.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">
                ${activeTab === 'unfollowers' ? ICONS.userMinus : activeTab === 'new_followers' ? ICONS.userPlus : ICONS.users}
              </div>
              <p class="text-sm text-white/50 font-medium">${emptyMsg}</p>
            </div>
          ` : `
            <p class="text-xs text-white/30 font-semibold mb-3">${users.length} akun ditemukan</p>
            ${users.slice(0, 100).map((user, i) => renderUserCard(user, i)).join('')}
            ${users.length > 100 ? `
              <div class="text-center py-4">
                <p class="text-xs text-white/30">Menampilkan 100 dari ${users.length} akun</p>
              </div>
            ` : ''}
          `}
        </div>
      </div>
    </div>
  `;
}

function renderUserCard(user, index) {
  const initial = (user.displayName || user.username).charAt(0).toUpperCase();
  const delay = Math.min(index * 0.02, 0.5);

  return `
    <a href="https://www.instagram.com/${user.username}/" target="_blank" rel="noopener"
       class="user-card animate-slide-up" style="animation-delay:${delay}s">
      <div class="user-avatar">${initial}</div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold text-white truncate">@${user.username}</p>
        ${user.displayName && user.displayName !== user.username ? `
          <p class="text-xs text-white/35 truncate mt-0.5">${user.displayName}</p>
        ` : ''}
      </div>
      <div class="text-white/20 flex-shrink-0">
        ${ICONS.external}
      </div>
    </a>
  `;
}

/**
 * Render the History page
 */
export function renderHistory(history) {
  return `
    <div class="page-content">
      <div class="header-gradient pt-14 pb-20 px-5">
        <div class="max-w-lg mx-auto relative z-10 animate-fade-in">
          <h1 class="text-2xl font-extrabold text-white">Riwayat Scan</h1>
          <p class="text-sm text-white/40 mt-1">${history.length} scan tercatat</p>
        </div>
      </div>

      <div class="max-w-lg mx-auto px-5 -mt-12 relative z-10">
        ${history.length === 0 ? `
          <div class="empty-state glass-card">
            <div class="empty-state-icon">
              ${ICONS.history}
            </div>
            <p class="text-base font-bold text-white/70 mb-2">Belum Ada Riwayat</p>
            <p class="text-sm text-white/35 mb-6">Mulai scan pertama kamu untuk melihat riwayat di sini</p>
            <button onclick="window.app.navigate('upload')" class="btn-ig mx-auto flex items-center gap-2">
              ${ICONS.upload} Upload Data
            </button>
          </div>
        ` : `
          <div class="space-y-4">
            ${history.map((item, i) => `
              <div class="timeline-item animate-slide-up" style="animation-delay:${i * 0.05}s">
                <div class="timeline-dot ${i === 0 ? 'active' : ''}"></div>
                <div class="glass-card p-4">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <p class="text-sm font-bold text-white">${formatDate(item.date)}</p>
                      <p class="text-xs text-white/35 mt-0.5">${timeAgo(item.date)}</p>
                    </div>
                    <button onclick="window.app.deleteHistory('${item.id}')" class="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      ${ICONS.trash}
                    </button>
                  </div>
                  <div class="grid grid-cols-2 gap-2 mb-3">
                    <div class="bg-white/[0.03] rounded-xl p-2.5 text-center">
                      <p class="text-lg font-extrabold text-white">${item.followers}</p>
                      <p class="text-[10px] text-white/30 font-semibold uppercase">Followers</p>
                    </div>
                    <div class="bg-white/[0.03] rounded-xl p-2.5 text-center">
                      <p class="text-lg font-extrabold text-white">${item.following}</p>
                      <p class="text-[10px] text-white/30 font-semibold uppercase">Following</p>
                    </div>
                  </div>
                  <div class="flex gap-2 flex-wrap">
                    ${item.unfollowerCount > 0 ? `<span class="badge-unfollowed">-${item.unfollowerCount} unfollow</span>` : ''}
                    ${item.newFollowerCount > 0 ? `<span class="badge-new">+${item.newFollowerCount} baru</span>` : ''}
                    <span class="badge-mutual">${item.mutualCount} teman</span>
                    <span class="badge-not-following">${item.notFollowingBackCount} gak follback</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

/**
 * Render the Settings page
 */
export function renderSettings(storageInfo) {
  return `
    <div class="page-content">
      <div class="header-gradient pt-14 pb-20 px-5">
        <div class="max-w-lg mx-auto relative z-10 animate-fade-in">
          <h1 class="text-2xl font-extrabold text-white">Pengaturan</h1>
          <p class="text-sm text-white/40 mt-1">Kelola data & info aplikasi</p>
        </div>
      </div>

      <div class="max-w-lg mx-auto px-5 -mt-12 relative z-10 space-y-4">
        <!-- App Info Card -->
        <div class="glass-card p-6 text-center animate-slide-up">
          <div class="w-16 h-16 rounded-3xl ig-gradient flex items-center justify-center mx-auto mb-4 shadow-ig">
            ${ICONS.instagram}
          </div>
          <h2 class="text-xl font-extrabold ig-gradient-text">InstaTrack</h2>
          <p class="text-xs text-white/35 mt-1">v1.0.0 — Instagram Unfollower Tracker</p>
        </div>

        <!-- Storage Info -->
        <div class="glass-card p-5 animate-slide-up" style="animation-delay:0.05s">
          <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <svg class="w-4 h-4 text-ig-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
            Data Tersimpan
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-white/40">Riwayat Scan</span>
              <span class="text-xs text-white/70 font-semibold">${storageInfo.historyCount} scan</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-white/40">Data Followers</span>
              <span class="text-xs ${storageInfo.hasFollowerData ? 'text-green-400' : 'text-white/30'} font-semibold">${storageInfo.hasFollowerData ? '✓ Tersimpan' : 'Belum ada'}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-white/40">Data Following</span>
              <span class="text-xs ${storageInfo.hasFollowingData ? 'text-green-400' : 'text-white/30'} font-semibold">${storageInfo.hasFollowingData ? '✓ Tersimpan' : 'Belum ada'}</span>
            </div>
            <div class="section-divider"></div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-white/40">Penggunaan Storage</span>
              <span class="text-xs text-white/70 font-semibold">${storageInfo.usedKB} KB</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3 animate-slide-up" style="animation-delay:0.1s">
          <button onclick="window.app.exportData()" class="glass-card p-4 w-full flex items-center gap-3 active:scale-95 transition-transform group">
            <div class="w-10 h-10 rounded-xl bg-blue-500/12 flex items-center justify-center">
              ${ICONS.download}
            </div>
            <div class="text-left flex-1">
              <p class="text-sm font-bold text-white">Export Data</p>
              <p class="text-xs text-white/35">Backup semua data ke file JSON</p>
            </div>
            <span class="text-white/20">${ICONS.chevronRight}</span>
          </button>

          <button onclick="window.app.confirmClearData()" id="btn-clear-data" class="glass-card p-4 w-full flex items-center gap-3 active:scale-95 transition-transform group">
            <div class="w-10 h-10 rounded-xl bg-red-500/12 flex items-center justify-center">
              ${ICONS.trash}
            </div>
            <div class="text-left flex-1">
              <p class="text-sm font-bold text-red-400">Hapus Semua Data</p>
              <p class="text-xs text-white/35">Hapus riwayat & data tersimpan</p>
            </div>
            <span class="text-white/20">${ICONS.chevronRight}</span>
          </button>
        </div>

        <!-- About / Privacy -->
        <div class="glass-card p-5 animate-slide-up" style="animation-delay:0.15s">
          <h3 class="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-ig-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Privasi & Keamanan
          </h3>
          <div class="space-y-2 text-xs text-white/40 leading-relaxed">
            <p>✅ Semua data diproses <span class="text-white/60 font-semibold">lokal di browser</span> — tidak ada data yang dikirim ke server</p>
            <p>✅ Data disimpan di <span class="text-white/60 font-semibold">localStorage</span> browser kamu</p>
            <p>✅ Tidak memerlukan <span class="text-white/60 font-semibold">login</span> atau autentikasi Instagram</p>
            <p>✅ <span class="text-white/60 font-semibold">100% offline</span> — bisa digunakan tanpa internet</p>
          </div>
        </div>

        <div class="text-center py-6">
          <p class="text-xs text-white/20">Made with 💜 — InstaTrack v1.0.0</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the bottom navigation
 */
export function renderBottomNav(activePage) {
  const items = [
    { id: 'home', label: 'Home', icon: ICONS.home },
    { id: 'upload', label: 'Upload', icon: ICONS.upload },
    { id: 'results', label: 'Analisis', icon: ICONS.results },
    { id: 'history', label: 'Riwayat', icon: ICONS.history },
    { id: 'settings', label: 'Settings', icon: ICONS.profile },
  ];

  return `
    <nav class="bottom-nav">
      <div class="bottom-nav-inner">
        <div class="flex justify-around items-center py-1">
          ${items.map(item => `
            <button onclick="window.app.navigate('${item.id}')"
                    class="bottom-nav-item ${activePage === item.id ? 'active' : ''}"
                    id="nav-${item.id}">
              ${item.icon}
              <span class="text-[10px] font-semibold mt-0.5">${item.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </nav>
  `;
}

/**
 * Show a toast notification
 */
export function showToast(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="flex-1">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white/60 hover:text-white transition-colors">
        ${ICONS.close}
      </button>
    </div>
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Show confirmation modal
 */
export function showConfirmModal(title, message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay animate-fade-in';
  overlay.id = 'confirm-modal';

  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-handle"></div>
      <h3 class="text-lg font-extrabold text-white mb-2">${title}</h3>
      <p class="text-sm text-white/50 mb-6">${message}</p>
      <div class="flex gap-3">
        <button onclick="document.getElementById('confirm-modal').remove()" class="btn-outline flex-1 text-center">Batal</button>
        <button id="modal-confirm-btn" class="flex-1 py-3 px-5 rounded-xl font-semibold text-white transition-all active:scale-95 text-center" style="background:linear-gradient(135deg,#EF4444,#DC2626);box-shadow:0 4px 14px rgba(239,68,68,0.3)">Hapus</button>
      </div>
    </div>
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);

  document.getElementById('modal-confirm-btn').addEventListener('click', () => {
    onConfirm();
    overlay.remove();
  });
}

/**
 * Show loading overlay
 */
export function showLoading(message = 'Menganalisis...') {
  const loading = document.createElement('div');
  loading.id = 'loading-overlay';
  loading.className = 'fixed inset-0 z-[200] bg-dark-900/90 backdrop-blur-md flex items-center justify-center animate-fade-in';

  loading.innerHTML = `
    <div class="flex flex-col items-center gap-5">
      <div class="relative">
        <div class="spinner-ig"></div>
        <div class="absolute inset-0 w-8 h-8 rounded-full" style="background:radial-gradient(circle,rgba(225,48,108,0.2),transparent);animation:pulseSoft 2s ease-in-out infinite"></div>
      </div>
      <span class="text-sm text-white/60 font-semibold">${message}</span>
    </div>
  `;

  document.body.appendChild(loading);
}

export function hideLoading() {
  const loading = document.getElementById('loading-overlay');
  if (loading) loading.remove();
}
