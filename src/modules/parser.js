/**
 * Instagram JSON Data Parser
 * Parses followers_1.json and following.json from Instagram Data Download
 */

/**
 * Parse a single Instagram JSON file and extract usernames
 * Instagram format: { relationships_followers: [{ string_list_data: [{ href, value, timestamp }] }] }
 * Or for following: { relationships_following: [{ string_list_data: [{ href, value, timestamp }] }] }
 * 
 * Also supports newer flat format: [{ string_list_data: [{ href, value, timestamp }] }]
 */
export function parseInstagramJSON(jsonData, fileType = 'followers') {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    let entries = [];

    // Format 1: { relationships_followers: [...] } or { relationships_following: [...] }
    if (data.relationships_followers) {
      entries = data.relationships_followers;
    } else if (data.relationships_following) {
      entries = data.relationships_following;
    }
    // Format 2: Direct array [ { string_list_data: [...] } ]
    else if (Array.isArray(data)) {
      entries = data;
    }
    // Format 3: Just the string_list_data directly (some exports)
    else if (data.string_list_data) {
      entries = [data];
    }
    // Format 4: Generic fallback — look for any array property
    else {
      const keys = Object.keys(data);
      for (const key of keys) {
        if (Array.isArray(data[key])) {
          entries = data[key];
          break;
        }
      }
    }

    if (!entries || entries.length === 0) {
      throw new Error(`Tidak dapat menemukan data ${fileType} dalam file JSON. Pastikan format file sesuai.`);
    }

    const userMap = new Map();
    for (const entry of entries) {
      if (entry.string_list_data && Array.isArray(entry.string_list_data)) {
        for (const item of entry.string_list_data) {
          const username = extractCleanUsername(entry, item);
          if (username) {
            const existing = userMap.get(username);
            const ts = item.timestamp ? new Date(item.timestamp * 1000) : null;
            if (!existing || (ts && (!existing.timestamp || ts > existing.timestamp))) {
              userMap.set(username, {
                username,
                displayName: item.value || entry.title || username,
                href: item.href || `https://www.instagram.com/${username}`,
                timestamp: ts,
              });
            }
          }
        }
      }
    }
    const users = Array.from(userMap.values());

    return {
      success: true,
      users,
      count: users.length,
      type: fileType,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      users: [],
      count: 0,
      type: fileType,
    };
  }
}

/**
 * Extract clean username from Instagram entry and item
 * Reliably handles profile URLs (including _u/ paths), titles, and values
 */
function extractCleanUsername(entry, item) {
  let username = null;

  // 1. Try extracting from href first as it reliably contains the Instagram handle
  if (item && item.href) {
    try {
      let str = item.href.toString();
      str = str.split('?')[0].split('#')[0]; // remove query params and hash
      str = str.replace(/\/+$/, ''); // remove trailing slash
      const parts = str.split('/');
      let lastPart = parts[parts.length - 1];
      if (lastPart === '_u' && parts.length > 1) {
        lastPart = parts[parts.length - 2];
      }
      if (lastPart && lastPart !== '_u' && lastPart !== 'www.instagram.com' && lastPart !== 'instagram.com') {
        username = lastPart;
      }
    } catch (e) {
      // ignore
    }
  }

  // 2. Fallback to entry.title if it exists and looks like a handle
  if (!username && entry && entry.title) {
    username = entry.title;
  }

  // 3. Fallback to item.value
  if (!username && item && item.value) {
    username = item.value;
  }

  if (!username) return null;

  // Clean up prefix @ or any accidental URL leftovers
  username = username.toString()
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\/(_u\/)?/i, '')
    .replace(/\//g, '')
    .toLowerCase()
    .trim();

  return username || null;
}

/**
 * Read a File object and parse as Instagram JSON
 */
export function readAndParseFile(file, fileType = 'followers') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = parseInstagramJSON(e.target.result, fileType);
        resolve(result);
      } catch (err) {
        reject(new Error(`Gagal membaca file: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsText(file);
  });
}

/**
 * Validate if a file is valid Instagram JSON
 */
export function validateFile(file) {
  if (!file) return { valid: false, error: 'File tidak ditemukan' };

  const validExtensions = ['.json'];
  const ext = '.' + file.name.split('.').pop().toLowerCase();

  if (!validExtensions.includes(ext)) {
    return { valid: false, error: 'File harus berformat .json' };
  }

  if (file.size > 50 * 1024 * 1024) {
    return { valid: false, error: 'Ukuran file terlalu besar (maks 50MB)' };
  }

  return { valid: true };
}

/**
 * Detect file type (followers or following) from filename
 */
export function detectFileType(fileName) {
  const name = fileName.toLowerCase();
  if (name.includes('follower')) return 'followers';
  if (name.includes('following')) return 'following';
  return 'unknown';
}
