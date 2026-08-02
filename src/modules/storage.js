/**
 * LocalStorage Manager
 * Handles saving/loading scan history and user data
 */

const STORAGE_KEYS = {
  SCAN_HISTORY: 'instatrack_scan_history',
  LAST_FOLLOWERS: 'instatrack_last_followers',
  LAST_FOLLOWING: 'instatrack_last_following',
  SETTINGS: 'instatrack_settings',
};

const MAX_HISTORY = 15;

/**
 * Save a scan result to history
 */
export function saveScanToHistory(scanData) {
  const history = getScanHistory();

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    date: new Date().toISOString(),
    followers: scanData.followers,
    following: scanData.following,
    mutualCount: scanData.mutualCount,
    notFollowingBackCount: scanData.notFollowingBackCount,
    fansCount: scanData.fansCount,
    unfollowerCount: scanData.unfollowerCount || 0,
    newFollowerCount: scanData.newFollowerCount || 0,
    ratio: scanData.ratio,
  };

  history.unshift(entry);

  // Keep only last MAX_HISTORY entries
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY);
  }

  try {
    localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save scan history:', e);
  }

  return entry;
}

/**
 * Get scan history
 */
export function getScanHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save current followers list (for future unfollower detection)
 */
export function saveFollowers(followers) {
  try {
    const data = followers.map(u => ({
      username: u.username,
      displayName: u.displayName,
      href: u.href,
    }));
    localStorage.setItem(STORAGE_KEYS.LAST_FOLLOWERS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save followers:', e);
  }
}

/**
 * Save current following list
 */
export function saveFollowing(following) {
  try {
    const data = following.map(u => ({
      username: u.username,
      displayName: u.displayName,
      href: u.href,
    }));
    localStorage.setItem(STORAGE_KEYS.LAST_FOLLOWING, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save following:', e);
  }
}

/**
 * Get previously saved followers
 */
export function getPreviousFollowers() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_FOLLOWERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Get previously saved following
 */
export function getPreviousFollowing() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_FOLLOWING);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Clear all stored data
 */
export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Get storage usage info
 */
export function getStorageInfo() {
  let totalSize = 0;
  Object.values(STORAGE_KEYS).forEach(key => {
    const data = localStorage.getItem(key);
    if (data) totalSize += data.length * 2; // UTF-16
  });

  return {
    usedBytes: totalSize,
    usedKB: (totalSize / 1024).toFixed(1),
    usedMB: (totalSize / (1024 * 1024)).toFixed(2),
    historyCount: getScanHistory().length,
    hasFollowerData: !!localStorage.getItem(STORAGE_KEYS.LAST_FOLLOWERS),
    hasFollowingData: !!localStorage.getItem(STORAGE_KEYS.LAST_FOLLOWING),
  };
}

/**
 * Export all data as JSON
 */
export function exportData() {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const val = localStorage.getItem(key);
    if (val) data[name] = JSON.parse(val);
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `instatrack_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Delete a specific scan from history by ID
 */
export function deleteScanFromHistory(scanId) {
  const history = getScanHistory();
  const filtered = history.filter(h => h.id !== scanId);
  localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(filtered));
}
