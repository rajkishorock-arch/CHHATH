import { NormalizedSearchResult, QueryAnalysis } from './types';
import { ReelsStorage } from '../reelsStorage';
import { chhathSongs } from '../../data/songs';
import { chhathPrasadItems } from '../../data/prasad';
import { chhathBlogPosts } from '../../data/blog';
import { chhathKathaStories } from '../../data/katha';
import { chhathGhatsData } from '../../data/ghats';
import { chhathMantrasData } from '../../data/mantras';
import { chhathSamagriList } from '../../data/samagri';
import { cityArghyaData } from '../../data/astronomy';

export class InternalSearchProvider {
  /**
   * Search all internal Chhath Mahaparv database models
   */
  static search(analysis: QueryAnalysis, userCity?: string, userLanguage?: string): {
    results: NormalizedSearchResult[];
    exactUser: NormalizedSearchResult | null;
    exactUserReels: NormalizedSearchResult[];
  } {
    const q = analysis.cleanQuery.toLowerCase();
    if (!q) {
      return { results: [], exactUser: null, exactUserReels: [] };
    }

    const allUsers = ReelsStorage.getUsers();
    const allReels = ReelsStorage.getReels().filter(r => r.status === 'approved');
    const results: NormalizedSearchResult[] = [];

    // -------------------------------------------------------------
    // 1. EXACT USERNAME & USERS SEARCH (#3 & #4)
    // -------------------------------------------------------------
    const targetHandle = (analysis.targetUsername || q.replace(/^@/, '')).toLowerCase();
    let exactUser: NormalizedSearchResult | null = null;
    let exactUserReels: NormalizedSearchResult[] = [];

    const foundUser = allUsers.find(u => 
      u.username.toLowerCase() === `@${targetHandle}` || 
      u.username.toLowerCase().replace('@', '') === targetHandle
    );

    if (foundUser) {
      exactUser = {
        id: foundUser.id,
        source: 'internal',
        type: 'user',
        title: foundUser.name,
        creatorHandle: foundUser.username,
        thumbnail: foundUser.avatarUrl,
        description: foundUser.bio || `सत्यापित छठ साधक • ${foundUser.city || 'बिहार'}`,
        relevanceScore: 100,
        badge: foundUser.verified ? '✓ Verified Creator' : 'Devotee',
        metadata: {
          followersCount: foundUser.followersCount,
          verified: foundUser.verified,
          city: foundUser.city,
          reelsCount: foundUser.reelsCount
        }
      };

      exactUserReels = allReels
        .filter(r => r.creatorId === foundUser.id)
        .map(r => ({
          id: r.id,
          source: 'internal' as const,
          type: 'reel' as const,
          title: r.title,
          description: r.description,
          thumbnail: r.thumbnailUrl,
          creator: r.creatorName,
          creatorHandle: r.creatorUsername,
          url: r.videoUrl,
          relevanceScore: 95,
          metadata: {
            category: r.category,
            views: r.viewsCount,
            duration: r.videoDuration
          }
        }));

      results.push(exactUser);
    }

    // Other matching users
    allUsers.forEach(u => {
      if (exactUser && u.id === exactUser.id) return;
      const uName = u.name.toLowerCase();
      const uHandle = u.username.toLowerCase();
      if (uName.includes(q) || uHandle.includes(q) || (u.city && u.city.toLowerCase().includes(q))) {
        const score = uHandle.includes(targetHandle) ? 85 : 70;
        results.push({
          id: u.id,
          source: 'internal',
          type: 'user',
          title: u.name,
          creatorHandle: u.username,
          thumbnail: u.avatarUrl,
          description: u.bio || `${u.city || 'बिहार'} • ${u.followersCount.toLocaleString('en-IN')} फॉलोअर्स`,
          relevanceScore: score,
          badge: u.verified ? 'Verified' : undefined,
          metadata: {
            followersCount: u.followersCount,
            verified: u.verified,
            city: u.city
          }
        });
      }
    });

    // -------------------------------------------------------------
    // 2. INTERNAL SONGS SEARCH (#2 & #16 - Highest Priority Content)
    // -------------------------------------------------------------
    chhathSongs.forEach(s => {
      const title = s.title.toLowerCase();
      const singer = s.singer.toLowerCase();
      const lyrics = (s.lyricsSnippet || '').toLowerCase();
      const cat = s.category.toLowerCase();
      const lang = s.language.toLowerCase();

      let match = false;
      let score = 0;

      if (title.includes(q) || singer.includes(q)) {
        match = true;
        score = 90;
      } else if (lyrics.includes(q)) {
        match = true;
        score = 80;
      } else if (q.includes('geet') || q.includes('song') || q.includes('गीत') || q.includes('भजन')) {
        match = true;
        score = 75;
      } else if (cat.includes(q) || lang.includes(q)) {
        match = true;
        score = 70;
      }

      // Language boost
      if (match && userLanguage && lang.includes(userLanguage.toLowerCase())) {
        score += 8;
      }

      if (match) {
        results.push({
          id: s.id,
          source: 'internal',
          type: 'song',
          title: s.title,
          description: s.lyricsSnippet || `${s.singer} • ${s.language}`,
          thumbnail: s.thumbnail,
          creator: s.singer,
          url: s.audioUrl,
          videoId: s.youtubeId,
          relevanceScore: score,
          badge: '✨ Chhath Mahaparv Original',
          metadata: {
            duration: s.duration,
            language: s.language,
            category: s.category,
            youtubeId: s.youtubeId,
            singer: s.singer
          }
        });
      }
    });

    // -------------------------------------------------------------
    // 3. REELS SEARCH
    // -------------------------------------------------------------
    allReels.forEach(r => {
      const title = r.title.toLowerCase();
      const desc = r.description.toLowerCase();
      const cat = r.category.toLowerCase();
      const tags = r.tags.map(t => t.toLowerCase());

      let match = false;
      let score = 0;

      if (title.includes(q) || tags.some(t => t.includes(q))) {
        match = true;
        score = 85;
      } else if (desc.includes(q) || cat.includes(q)) {
        match = true;
        score = 75;
      } else if (
        (q.includes('thekua') && (tags.includes('#thekuaprasad') || cat.includes('prasad'))) ||
        (q.includes('kharna') && (tags.includes('#kharna') || desc.includes('रसियाव'))) ||
        (q.includes('ghat') && (cat.includes('ghat') || tags.includes('#chhathghat')))
      ) {
        match = true;
        score = 78;
      }

      if (match) {
        results.push({
          id: r.id,
          source: 'internal',
          type: 'reel',
          title: r.title,
          description: r.description,
          thumbnail: r.thumbnailUrl,
          creator: r.creatorName,
          creatorHandle: r.creatorUsername,
          url: r.videoUrl,
          relevanceScore: score,
          badge: '🔥 Reel',
          metadata: {
            category: r.category,
            views: r.viewsCount,
            duration: r.videoDuration,
            tags: r.tags
          }
        });
      }
    });

    // -------------------------------------------------------------
    // 4. PRASAD & RECIPES SEARCH (#10)
    // -------------------------------------------------------------
    chhathPrasadItems.forEach(p => {
      const name = p.name.toLowerCase();
      const local = p.localName.toLowerCase();
      const desc = p.shortDesc.toLowerCase();
      const ingr = p.ingredients.join(' ').toLowerCase();

      let match = false;
      let score = 0;

      if (name.includes(q) || local.includes(q)) {
        match = true;
        score = 92;
      } else if (desc.includes(q) || ingr.includes(q)) {
        match = true;
        score = 82;
      } else if (q.includes('prasad') || q.includes('recipe') || q.includes('ठेकुआ') || q.includes('thekua')) {
        match = true;
        score = 80;
      }

      if (match) {
        results.push({
          id: p.id,
          source: 'internal',
          type: 'recipe',
          title: p.name,
          description: p.shortDesc,
          thumbnail: p.image,
          relevanceScore: score,
          badge: '🍪 महाप्रसाद व पाक कला',
          metadata: {
            ingredients: p.ingredients,
            method: p.method,
            culturalSignificance: p.culturalSignificance
          }
        });
      }
    });

    // -------------------------------------------------------------
    // 5. ARTICLES & STORIES SEARCH
    // -------------------------------------------------------------
    chhathBlogPosts.forEach(b => {
      const title = b.title.toLowerCase();
      const excerpt = b.excerpt.toLowerCase();
      const author = b.author.toLowerCase();
      const cat = b.category.toLowerCase();

      let match = false;
      let score = 0;

      if (title.includes(q)) {
        match = true;
        score = 85;
      } else if (excerpt.includes(q) || author.includes(q) || cat.includes(q)) {
        match = true;
        score = 75;
      }

      if (match) {
        results.push({
          id: b.id,
          source: 'internal',
          type: 'article',
          title: b.title,
          description: b.excerpt,
          thumbnail: b.image,
          creator: b.author,
          relevanceScore: score,
          badge: `📖 ${b.category}`,
          metadata: {
            readTime: b.readTime,
            date: b.date
          }
        });
      }
    });

    chhathKathaStories.forEach(k => {
      const title = k.title.toLowerCase();
      const cat = k.category.toLowerCase();
      const moral = k.moral.toLowerCase();

      let match = false;
      let score = 0;

      if (title.includes(q)) {
        match = true;
        score = 88;
      } else if (cat.includes(q) || moral.includes(q) || q.includes('katha') || q.includes('कथा')) {
        match = true;
        score = 78;
      }

      if (match) {
        results.push({
          id: k.id,
          source: 'internal',
          type: 'article',
          title: k.title,
          description: k.moral,
          thumbnail: '/images/surya_chhathi_divine.jpg',
          relevanceScore: score,
          badge: '📜 पावन व्रत कथा',
          metadata: {
            category: k.category,
            storyExcerpt: k.story[0]
          }
        });
      }
    });

    // -------------------------------------------------------------
    // 6. GHATS SEARCH
    // -------------------------------------------------------------
    chhathGhatsData.forEach(g => {
      const name = g.name.toLowerCase();
      const city = g.city.toLowerCase();
      const river = g.river.toLowerCase();

      let match = false;
      let score = 0;

      if (name.includes(q)) {
        match = true;
        score = 88;
      } else if (city.includes(q) || river.includes(q) || (q.includes('ghat') || q.includes('घाट'))) {
        match = true;
        score = 75;
      }

      // Location boost
      if (match && userCity && city.includes(userCity.toLowerCase())) {
        score += 10;
      }

      if (match) {
        results.push({
          id: g.id,
          source: 'internal',
          type: 'ghat',
          title: g.name,
          description: `${g.river} • ${g.city} • भीड़: ${g.crowdStatus}`,
          thumbnail: '/images/sandhya_arghya.jpg',
          relevanceScore: score,
          badge: '🌊 छठ घाट',
          metadata: {
            city: g.city,
            river: g.river,
            facilities: g.facilities,
            crowdStatus: g.crowdStatus
          }
        });
      }
    });

    // -------------------------------------------------------------
    // 7. MANTRAS & AARTI SEARCH
    // -------------------------------------------------------------
    chhathMantrasData.forEach(m => {
      const title = m.title.toLowerCase();
      const deity = m.deity.toLowerCase();
      const meaning = m.hindiMeaning.toLowerCase();

      let match = false;
      let score = 0;

      if (title.includes(q) || deity.includes(q)) {
        match = true;
        score = 88;
      } else if (meaning.includes(q) || q.includes('mantra') || q.includes('मंत्र') || q.includes('aarti')) {
        match = true;
        score = 75;
      }

      if (match) {
        results.push({
          id: m.id,
          source: 'internal',
          type: 'mantra',
          title: m.title,
          description: m.hindiMeaning,
          thumbnail: '/images/surya_chhathi_divine.jpg',
          relevanceScore: score,
          badge: '🪔 मंत्र व आरती',
          metadata: {
            deity: m.deity,
            sanskritShloka: m.sanskrit
          }
        });
      }
    });

    // -------------------------------------------------------------
    // 8. SAMAGRI SEARCH
    // -------------------------------------------------------------
    chhathSamagriList.forEach(sm => {
      const name = sm.name.toLowerCase();
      const desc = sm.description.toLowerCase();

      if (name.includes(q) || desc.includes(q) || (q.includes('samagri') && !name.includes('geet'))) {
        results.push({
          id: sm.id,
          source: 'internal',
          type: 'samagri',
          title: sm.name,
          description: sm.description,
          thumbnail: '/images/daura_arghya.jpg',
          relevanceScore: 70,
          badge: '🧺 पूजा सामग्री',
          metadata: {
            category: sm.category
          }
        });
      }
    });

    // -------------------------------------------------------------
    // 9. ARGHYA TIMINGS & EVENTS (#11)
    // -------------------------------------------------------------
    if (q.includes('arghya') || q.includes('अर्घ्य') || q.includes('timing') || q.includes('समय') || q.includes('surya')) {
      cityArghyaData.forEach(c => {
        if (q.includes(c.cityName.toLowerCase()) || (userCity && c.cityName.toLowerCase().includes(userCity.toLowerCase()))) {
          results.push({
            id: `timing-${c.cityName}`,
            source: 'internal',
            type: 'event',
            title: `${c.cityName} में अर्घ्य मुहूर्त २०२६`,
            description: `संध्या अर्घ्य: ${c.sandhyaSunset} • उषा अर्घ्य: ${c.ushaSunrise} • तापमान: ${c.weatherTemp}`,
            thumbnail: '/images/sandhya_arghya.jpg',
            relevanceScore: 95,
            badge: '🌅 सूर्य अर्घ्य मुहूर्त',
            metadata: {
              cityName: c.cityName,
              sandhyaSunset: c.sandhyaSunset,
              ushaSunrise: c.ushaSunrise,
              weatherTemp: c.weatherTemp
            }
          });
        }
      });
    }

    // -------------------------------------------------------------
    // 10. HASHTAGS EXTRACTION
    // -------------------------------------------------------------
    const allTags = Array.from(new Set(allReels.flatMap(r => r.tags)));
    allTags.forEach(tag => {
      const cleanTag = tag.replace('#', '').toLowerCase();
      const searchTag = q.replace('#', '');
      if (cleanTag.includes(searchTag)) {
        results.push({
          id: `tag-${cleanTag}`,
          source: 'internal',
          type: 'hashtag',
          title: tag,
          description: `छठ रील्स और पोस्ट्स में प्रयुक्त लोकप्रिय हैशटैग`,
          thumbnail: '/images/sandhya_arghya.jpg',
          relevanceScore: 75,
          badge: '#️⃣ Hashtag',
          metadata: {
            hashtag: tag
          }
        });
      }
    });

    return {
      results,
      exactUser,
      exactUserReels
    };
  }
}
