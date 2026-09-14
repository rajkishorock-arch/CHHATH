// Utility helpers for YouTube URL parsing, Playlist IDs, and Metadata parsing

export const extractYoutubeId = (urlOrId: string): string => {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  if (trimmed.length === 11 && !trimmed.includes(' ') && !trimmed.includes('/')) {
    return trimmed;
  }
  return '';
};

export const extractPlaylistId = (url: string): string => {
  if (!url) return '';
  const match = url.match(/[?&]list=([^#&]+)/);
  return match ? match[1] : '';
};

export const parseYoutubeMeta = (rawTitle: string, authorName: string, _videoId: string) => {
  let title = rawTitle.trim();
  let singer = authorName.trim() || 'पारंपरिक लोक गायक';

  title = title
    .replace(/(\(|\[)(official\s*(video|audio)?|4k|hd|lyric(s)?|full\s*song|video\s*song|audio\s*song|remaster(ed)?)(\)|\])/gi, '')
    .trim();

  if (title.includes('|')) {
    const parts = title.split('|').map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      title = parts[0];
      if (!parts[1].toLowerCase().includes('chhath') && !parts[1].toLowerCase().includes('geet')) {
        singer = parts[1];
      }
    }
  } else if (title.includes(' - ')) {
    const parts = title.split(' - ').map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      title = parts[1];
      singer = parts[0];
    }
  }

  let language = 'Bhojpuri';
  const combined = (rawTitle + ' ' + singer).toLowerCase();
  if (combined.includes('maithili') || combined.includes('मैथिली')) {
    language = 'Maithili';
  } else if (combined.includes('hindi') || combined.includes('हिंदी')) {
    language = 'Traditional';
  }

  let category = 'Traditional';
  if (combined.includes('arghya') || combined.includes('अर्घ्य')) {
    category = 'Arghya Geet';
  } else if (combined.includes('kharna') || combined.includes('खरना')) {
    category = 'Kharna';
  } else if (combined.includes('ghat') || combined.includes('घाट')) {
    category = 'Ghat Geet';
  } else if (combined.includes('surya') || combined.includes('सूरज') || combined.includes('सूर्य')) {
    category = 'Surya Dev';
  } else if (combined.includes('bhajan') || combined.includes('भजन')) {
    category = 'Chhathi Maiya Bhajan';
  } else if (language === 'Maithili') {
    category = 'Maithili';
  } else {
    category = 'Bhojpuri';
  }

  const thumbnail = `https://i.ytimg.com/vi/${_videoId}/hqdefault.jpg`;

  return { title, singer, language, category, thumbnail };
};
