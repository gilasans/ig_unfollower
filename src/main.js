/**
 * InstaTrack — Instagram Unfollower Tracker
 * Main Application Entry Point
 */

import './style.css';
import { readAndParseFile, validateFile, detectFileType } from './modules/parser.js';
import { analyzeData, detectUnfollowers, generateStats } from './modules/analyzer.js';
import {
  saveScanToHistory, getScanHistory, saveFollowers, saveFollowing,
  getPreviousFollowers, clearAllData, getStorageInfo, exportData,
  deleteScanFromHistory
} from './modules/storage.js';
import {
  renderDashboard, renderUpload, renderResults, renderHistory, renderSettings,
  renderBottomNav, showToast, showConfirmModal, showLoading, hideLoading
} from './modules/ui.js';

class InstaTrackApp {
  constructor() {
    this.currentPage = 'home';
    this.analysis = null;
    this.unfollowerData = { unfollowers: [], newFollowers: [], unfollowerCount: 0, newFollowerCount: 0, hasHistory: false };
    this.stats = null;
    this.activeTab = 'unfollowers';
    this.searchQuery = '';

    // Upload state
    this.followerFile = null;
    this.followingFile = null;
    this.followerData = null;
    this.followingData = null;

    // DOM references
    this.appEl = document.getElementById('app');
    this.navEl = document.getElementById('bottom-nav');

    // Expose for inline event handlers
    window.app = this;

    this.init();
  }

  init() {
    // Load any existing analysis from last session (we store raw users for re-analysis)
    this.loadExistingData();

    // Render
    this.render();

    // Handle back button
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.currentPage = e.state.page;
        this.render();
      }
    });
  }

  loadExistingData() {
    // If we have stored followers/following data from a previous session,
    // we can pre-populate stats for the dashboard
    const prevFollowers = getPreviousFollowers();
    if (prevFollowers.length > 0) {
      // We have stored data but can't fully re-analyze without following data
      // Just show basic stats from history
      const history = getScanHistory();
      if (history.length > 0) {
        const last = history[0];
        this.stats = {
          totalFollowers: last.followers,
          totalFollowing: last.following,
          mutualCount: last.mutualCount,
          notFollowingBackCount: last.notFollowingBackCount,
          fansCount: last.fansCount,
          unfollowerCount: last.unfollowerCount || 0,
          newFollowerCount: last.newFollowerCount || 0,
          ratio: last.ratio,
          hasHistory: history.length > 1,
          analyzedAt: last.date,
        };
      }
    }
  }

  navigate(page, tab = null) {
    this.currentPage = page;
    if (tab) this.activeTab = tab;
    this.searchQuery = '';

    history.pushState({ page }, '', `#${page}`);
    this.render();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    this.searchQuery = '';
    this.renderContent();
    this.setupEventListeners();
  }

  render() {
    this.renderContent();
    this.navEl.innerHTML = renderBottomNav(this.currentPage);
    this.setupEventListeners();
  }

  renderContent() {
    const history = getScanHistory();

    switch (this.currentPage) {
      case 'home':
        this.appEl.innerHTML = renderDashboard(this.stats, history);
        break;
      case 'upload':
        this.appEl.innerHTML = renderUpload(
          this.followerData ? { name: this.followerFile.name, count: this.followerData.count } : null,
          this.followingData ? { name: this.followingFile.name, count: this.followingData.count } : null
        );
        break;
      case 'results':
        this.appEl.innerHTML = renderResults(this.analysis, this.unfollowerData, this.activeTab, this.searchQuery);
        break;
      case 'history':
        this.appEl.innerHTML = renderHistory(history);
        break;
      case 'settings':
        this.appEl.innerHTML = renderSettings(getStorageInfo());
        break;
      default:
        this.currentPage = 'home';
        this.appEl.innerHTML = renderDashboard(this.stats, history);
    }
  }

  setupEventListeners() {
    // Upload zone listeners
    this.setupUploadZone('upload-followers', 'input-followers', 'followers');
    this.setupUploadZone('upload-following', 'input-following', 'following');

    // Analyze button
    const btnAnalyze = document.getElementById('btn-analyze');
    if (btnAnalyze) {
      btnAnalyze.addEventListener('click', () => this.runAnalysis());
    }

    // Search
    const searchInput = document.getElementById('search-users');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.searchQuery = e.target.value;
          this.renderContent();
          this.setupEventListeners();
          // Re-focus and restore cursor
          const newInput = document.getElementById('search-users');
          if (newInput) {
            newInput.focus();
            newInput.selectionStart = newInput.selectionEnd = newInput.value.length;
          }
        }, 300);
      });
    }
  }

  setupUploadZone(zoneId, inputId, type) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);

    if (!zone || !input) return;

    // Click to upload
    zone.addEventListener('click', () => input.click());

    // Drag & Drop
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) this.handleFileSelect(file, type);
    });

    // File input change
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) this.handleFileSelect(file, type);
    });
  }

  async handleFileSelect(file, type) {
    const validation = validateFile(file);
    if (!validation.valid) {
      showToast(validation.error, 'error');
      return;
    }

    // Auto-detect file type from filename
    const detectedType = detectFileType(file.name);
    if (detectedType !== 'unknown') {
      type = detectedType;
    }

    try {
      const result = await readAndParseFile(file, type);

      if (!result.success) {
        showToast(`Error: ${result.error}`, 'error');
        return;
      }

      if (result.count === 0) {
        showToast('File tidak mengandung data user', 'error');
        return;
      }

      if (type === 'followers') {
        this.followerFile = file;
        this.followerData = result;
        showToast(`✅ ${result.count} followers berhasil dimuat`, 'success');
      } else {
        this.followingFile = file;
        this.followingData = result;
        showToast(`✅ ${result.count} following berhasil dimuat`, 'success');
      }

      // Re-render upload page to show file status
      this.renderContent();
      this.setupEventListeners();
    } catch (err) {
      showToast(`Gagal membaca file: ${err.message}`, 'error');
    }
  }

  async runAnalysis() {
    if (!this.followerData || !this.followingData) {
      showToast('Upload kedua file terlebih dahulu', 'error');
      return;
    }

    showLoading('Menganalisis data...');

    // Small delay for smooth loading transition
    await new Promise(r => setTimeout(r, 800));

    try {
      // Run analysis
      this.analysis = analyzeData(this.followerData.users, this.followingData.users);

      // Detect unfollowers (compare with previous scan)
      const prevFollowers = getPreviousFollowers();
      this.unfollowerData = detectUnfollowers(this.followerData.users, prevFollowers);

      // Generate stats
      this.stats = generateStats(this.analysis, this.unfollowerData);

      // Save current followers for future unfollower detection
      saveFollowers(this.followerData.users);
      saveFollowing(this.followingData.users);

      // Save to history
      saveScanToHistory({
        followers: this.analysis.followers,
        following: this.analysis.following,
        mutualCount: this.analysis.mutualCount,
        notFollowingBackCount: this.analysis.notFollowingBackCount,
        fansCount: this.analysis.fansCount,
        unfollowerCount: this.unfollowerData.unfollowerCount,
        newFollowerCount: this.unfollowerData.newFollowerCount,
        ratio: this.analysis.ratio,
      });

      hideLoading();

      // Navigate to results
      this.activeTab = this.unfollowerData.unfollowerCount > 0 ? 'unfollowers' : 'not_following_back';
      this.navigate('results');

      // Show summary toast
      const msgs = [];
      if (this.unfollowerData.unfollowerCount > 0) msgs.push(`${this.unfollowerData.unfollowerCount} unfollow`);
      if (this.unfollowerData.newFollowerCount > 0) msgs.push(`${this.unfollowerData.newFollowerCount} follower baru`);
      if (msgs.length > 0) {
        showToast(`📊 Ditemukan: ${msgs.join(', ')}`, 'info', 4000);
      } else {
        showToast('✅ Analisis selesai!', 'success');
      }

    } catch (err) {
      hideLoading();
      showToast(`Error saat analisis: ${err.message}`, 'error');
      console.error('Analysis error:', err);
    }
  }

  deleteHistory(id) {
    showConfirmModal(
      'Hapus Riwayat',
      'Yakin ingin menghapus riwayat scan ini?',
      () => {
        deleteScanFromHistory(id);
        showToast('Riwayat berhasil dihapus', 'success');
        this.renderContent();
        this.setupEventListeners();
      }
    );
  }

  confirmClearData() {
    showConfirmModal(
      'Hapus Semua Data',
      'Semua riwayat scan dan data tersimpan akan dihapus permanen. Aksi ini tidak bisa dibatalkan.',
      () => {
        clearAllData();
        this.analysis = null;
        this.unfollowerData = { unfollowers: [], newFollowers: [], unfollowerCount: 0, newFollowerCount: 0, hasHistory: false };
        this.stats = null;
        this.followerFile = null;
        this.followingFile = null;
        this.followerData = null;
        this.followingData = null;
        showToast('✅ Semua data berhasil dihapus', 'success');
        this.navigate('home');
      }
    );
  }

  exportData() {
    try {
      exportData();
      showToast('📦 Data berhasil diexport', 'success');
    } catch (err) {
      showToast('Gagal export data', 'error');
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new InstaTrackApp();
});
