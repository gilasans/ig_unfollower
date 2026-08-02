/**
 * Follower Analysis Engine
 * Compares followers vs following data to generate insights
 */

/**
 * Analyze followers vs following data
 * @param {Array} followers - List of follower user objects
 * @param {Array} following - List of following user objects
 * @returns {Object} Analysis results
 */
export function analyzeData(followers, following) {
  const followerSet = new Set(followers.map(u => u.username.toLowerCase().trim()));
  const followingSet = new Set(following.map(u => u.username.toLowerCase().trim()));

  const followerMap = new Map(followers.map(u => [u.username.toLowerCase().trim(), u]));
  const followingMap = new Map(following.map(u => [u.username.toLowerCase().trim(), u]));

  // Teman (Mutual): ada di following DAN ada di followers
  const mutual = [];
  // Gak Follback: ada di following NAMUN TIDAK ADA di followers
  const notFollowingBack = [];
  // Fans: ada di followers NAMUN TIDAK ADA di following
  const fans = [];

  for (const user of following) {
    const uname = user.username.toLowerCase().trim();
    if (followerSet.has(uname)) {
      mutual.push({ ...user, username: uname, category: 'mutual' });
    } else {
      notFollowingBack.push({ ...user, username: uname, category: 'not_following_back' });
    }
  }

  for (const user of followers) {
    const uname = user.username.toLowerCase().trim();
    if (!followingSet.has(uname)) {
      fans.push({ ...user, username: uname, category: 'fans' });
    }
  }

  // Sort descending by timestamp (newest first), fallback to username
  const sortDesc = (a, b) => {
    const tA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const tB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    if (tA !== tB) return tB - tA; // descending: newest first
    return a.username.localeCompare(b.username);
  };
  mutual.sort(sortDesc);
  notFollowingBack.sort(sortDesc);
  fans.sort(sortDesc);

  const ratio = followers.length > 0
    ? (followers.length / following.length).toFixed(2)
    : '0.00';

  return {
    followers: followers.length,
    following: following.length,
    mutual,
    notFollowingBack,
    fans,
    mutualCount: mutual.length,
    notFollowingBackCount: notFollowingBack.length,
    fansCount: fans.length,
    ratio,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Detect unfollowers by comparing current scan with previous scan
 * @param {Array} currentFollowers - Current followers list
 * @param {Array} previousFollowers - Previous followers list
 * @returns {Object} Unfollower detection results
 */
export function detectUnfollowers(currentFollowers, previousFollowers) {
  if (!previousFollowers || previousFollowers.length === 0) {
    return {
      unfollowers: [],
      newFollowers: [],
      unfollowerCount: 0,
      newFollowerCount: 0,
      hasHistory: false,
    };
  }

  const currentSet = new Set(currentFollowers.map(u => u.username));
  const previousSet = new Set(previousFollowers.map(u => u.username));

  const previousMap = new Map(previousFollowers.map(u => [u.username, u]));
  const currentMap = new Map(currentFollowers.map(u => [u.username, u]));

  // People who were following before but not anymore = unfollowed
  const unfollowers = [];
  for (const user of previousFollowers) {
    if (!currentSet.has(user.username)) {
      unfollowers.push({ ...user, category: 'unfollowed' });
    }
  }

  // People who are following now but weren't before = new followers
  const newFollowers = [];
  for (const user of currentFollowers) {
    if (!previousSet.has(user.username)) {
      newFollowers.push({ ...user, category: 'new_follower' });
    }
  }

  const sortDesc = (a, b) => {
    const tA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const tB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    if (tA !== tB) return tB - tA;
    return a.username.localeCompare(b.username);
  };
  unfollowers.sort(sortDesc);
  newFollowers.sort(sortDesc);

  return {
    unfollowers,
    newFollowers,
    unfollowerCount: unfollowers.length,
    newFollowerCount: newFollowers.length,
    hasHistory: true,
  };
}

/**
 * Generate summary statistics
 */
export function generateStats(analysis, unfollowerData) {
  return {
    totalFollowers: analysis.followers,
    totalFollowing: analysis.following,
    mutualCount: analysis.mutualCount,
    notFollowingBackCount: analysis.notFollowingBackCount,
    fansCount: analysis.fansCount,
    ratio: analysis.ratio,
    unfollowerCount: unfollowerData.unfollowerCount,
    newFollowerCount: unfollowerData.newFollowerCount,
    hasHistory: unfollowerData.hasHistory,
    analyzedAt: analysis.analyzedAt,
  };
}

/**
 * Search users across all categories
 */
export function searchUsers(analysis, unfollowerData, query) {
  if (!query || query.trim() === '') return null;

  const q = query.toLowerCase().trim();
  const results = {
    mutual: analysis.mutual.filter(u => u.username.includes(q) || u.displayName.toLowerCase().includes(q)),
    notFollowingBack: analysis.notFollowingBack.filter(u => u.username.includes(q) || u.displayName.toLowerCase().includes(q)),
    fans: analysis.fans.filter(u => u.username.includes(q) || u.displayName.toLowerCase().includes(q)),
    unfollowers: unfollowerData.unfollowers.filter(u => u.username.includes(q) || u.displayName.toLowerCase().includes(q)),
    newFollowers: unfollowerData.newFollowers.filter(u => u.username.includes(q) || u.displayName.toLowerCase().includes(q)),
  };

  results.totalResults = results.mutual.length + results.notFollowingBack.length +
    results.fans.length + results.unfollowers.length + results.newFollowers.length;

  return results;
}
