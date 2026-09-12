import { cityArghyaData } from '../../data/astronomy';
import { chhathGhatsData } from '../../data/ghats';
import { chhathSongs } from '../../data/songs';
import { chhathPrasadItems } from '../../data/prasad';
import { chhathDaysByLang } from '../../data/days';
import { chhathWishesData } from '../../data/wishes';
import { ReelsStorage } from '../reelsStorage';
import { GlobalSearchService } from '../search/globalSearchService';
import { DynamicReel, ReelUser, Song, Ghat, PrasadItem } from '../../types';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required?: string[];
  };
  requiresConfirmation?: boolean;
}

export interface ToolExecutionResult {
  toolName: string;
  success: boolean;
  data?: any;
  error?: string;
  userConfirmationNeeded?: boolean;
  actionMessage?: string;
}

export const AGENT_TOOLS_DEFINITIONS: ToolDefinition[] = [
  {
    name: 'get_user_profile',
    description: 'Get current logged-in user profile, avatar, bio, location, and verified status.',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_user_preferences',
    description: 'Get user devotional preferences, selected interests (songs, ghats, vidhi, prasad), and language preference.',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_arghya_time',
    description: 'Get authentic astronomical sunrise and sunset arghya timings for a specific city or region.',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City or state name (e.g. "Patna", "Varanasi", "Ranchi", "Delhi")'
        },
        date: {
          type: 'string',
          description: 'Optional date or festival phase (e.g. "sandhya", "usha", "today")'
        }
      },
      required: ['location']
    }
  },
  {
    name: 'get_weather',
    description: 'Get authentic temperature, sky clarity, and ghat weather advisory for a specific location.',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City or state name'
        }
      },
      required: ['location']
    }
  },
  {
    name: 'search_ghats',
    description: 'Search official Chhath ghats by location with facilities, river safety, coordinates, and crowd status flags.',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City or district name'
        },
        query: {
          type: 'string',
          description: 'Optional specific ghat name or amenity'
        }
      },
      required: ['location']
    }
  },
  {
    name: 'search_internal_content',
    description: 'Unified search across internal Chhath Mahaparv database (songs, reels, ghats, recipes, vidhi, and articles).',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query in Hindi, English, or Hinglish'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_reels',
    description: 'Search short video reels by keyword, category, or creator.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keywords to match against title, caption, tags, or creator'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_songs',
    description: 'Search traditional Chhath geet and bhajans by singer, title, or lyric snippet.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Song title, singer (e.g., "Sharda Sinha", "Maithili Thakur"), or lyric words'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_users',
    description: 'Search community devotees and creators by name or @username.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Username or devotee name'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'search_youtube',
    description: 'Search curated and embeddable external Chhath video sources via secure backend.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for external Chhath videos'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_recipe',
    description: 'Retrieve authentic step-by-step recipe, ingredients, and sacred preparation rules for Chhath prasad (Thekua, Rasiyaw, Kasar).',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the prasad (e.g., "Thekua", "Rasiyaw", "Kheer", "Kasar")'
        }
      },
      required: ['name']
    }
  },
  {
    name: 'get_puja_information',
    description: 'Get authentic Vedic vidhi, rituals, and spiritual significance for any of the 4 Chhath days or specific rituals.',
    parameters: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Topic or day name (e.g. "Nahay Khay", "Kharna", "Sandhya Arghya", "Usha Arghya", "Samagri", "Vrat Vidhi")'
        }
      },
      required: ['topic']
    }
  },
  {
    name: 'create_checklist',
    description: 'Create or add items to the user’s personal Chhath puja checklist.',
    parameters: {
      type: 'object',
      properties: {
        items: {
          type: 'string',
          description: 'Comma-separated list of items to add to checklist'
        }
      },
      required: ['items']
    }
  },
  {
    name: 'save_reel',
    description: 'Save a specific reel to user’s devotional collection.',
    parameters: {
      type: 'object',
      properties: {
        reelId: {
          type: 'string',
          description: 'The unique ID of the reel to save'
        }
      },
      required: ['reelId']
    }
  },
  {
    name: 'like_reel',
    description: 'Like a specific reel on behalf of the user.',
    parameters: {
      type: 'object',
      properties: {
        reelId: {
          type: 'string',
          description: 'The unique ID of the reel to like'
        }
      },
      required: ['reelId']
    }
  },
  {
    name: 'follow_user',
    description: 'Follow a creator or devotee.',
    parameters: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The user ID or @username to follow'
        }
      },
      required: ['userId']
    },
    requiresConfirmation: true
  },
  {
    name: 'create_reminder',
    description: 'Create a time-based Chhath reminder (e.g., "Remind me at 4:30 PM for Sandhya Arghya").',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the reminder'
        },
        time: {
          type: 'string',
          description: 'Time or duration for the reminder'
        },
        note: {
          type: 'string',
          description: 'Optional additional instructions or context'
        }
      },
      required: ['title', 'time']
    },
    requiresConfirmation: true
  },
  {
    name: 'get_family_data',
    description: 'Get current family circle tasks, family name, and assignment statuses.',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'create_family_task',
    description: 'Create and assign a Chhath task to a family member in the Family Hub.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Task description (e.g. "Bring 5 sugarcanes and brass soop")'
        },
        assignee: {
          type: 'string',
          description: 'Name of family member (e.g. "Papa", "Mummy", "Brother", "Sister")'
        },
        category: {
          type: 'string',
          description: 'Category: Puja, Samagri, Ghat, Prasad, Travel',
          enum: ['Puja', 'Samagri', 'Ghat', 'Prasad', 'Travel']
        }
      },
      required: ['title', 'assignee']
    },
    requiresConfirmation: true
  },
  {
    name: 'generate_wish',
    description: 'Generate an emotional, traditional, or poetic Chhath greeting/wish in Hindi, Bhojpuri, Maithili, or English.',
    parameters: {
      type: 'object',
      properties: {
        recipient: {
          type: 'string',
          description: 'Who the wish is for (e.g. "Family", "Papa", "Friends", "Elders", "Colleagues")'
        },
        tone: {
          type: 'string',
          description: 'Tone: emotional, traditional, short, poetic, spiritual',
          enum: ['emotional', 'traditional', 'short', 'poetic', 'spiritual']
        },
        language: {
          type: 'string',
          description: 'Language code: hi, bho, mai, en',
          enum: ['hi', 'bho', 'mai', 'en']
        }
      },
      required: ['tone']
    }
  },
  {
    name: 'generate_caption',
    description: 'Generate devotional captions with trending Chhath hashtags for reels, photos, or status.',
    parameters: {
      type: 'object',
      properties: {
        theme: {
          type: 'string',
          description: 'Subject of the post (e.g. "Thekua making", "Ghat sunset", "Daura procession")'
        },
        tone: {
          type: 'string',
          description: 'Tone of caption (devotional, festive, poetic, modern)'
        }
      },
      required: ['theme']
    }
  },
  {
    name: 'generate_reel_metadata',
    description: 'Generate complete metadata for a new reel: title, description, category, tags, and suggested licensed Chhath audio track.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Tentative title or description of video'
        },
        category: {
          type: 'string',
          description: 'Video category'
        }
      },
      required: ['title']
    }
  }
];

export class AgentToolExecutor {
  /**
   * Execute an agent tool by name with provided arguments
   */
  public static async executeTool(name: string, args: Record<string, any>): Promise<ToolExecutionResult> {
    try {
      switch (name) {
        case 'get_user_profile': {
          const user = ReelsStorage.getSession();
          if (!user) {
            return {
              toolName: name,
              success: true,
              data: {
                status: 'guest',
                message: 'अतिथि भक्त (Guest Devotee). कोई व्यक्तिगत लॉगिन सत्र सक्रिय नहीं है।'
              }
            };
          }
          return {
            toolName: name,
            success: true,
            data: {
              id: user.id,
              name: user.name,
              username: user.username,
              bio: user.bio,
              city: user.city || 'Patna',
              language: user.language || 'hi',
              verified: user.verified || false,
              followersCount: user.followersCount || 0,
              followingCount: user.followingCount || 0
            }
          };
        }

        case 'get_user_preferences': {
          const user = ReelsStorage.getSession();
          const interests = user?.interests || ['songs', 'vidhi', 'arghya', 'ghats', 'prasad'];
          return {
            toolName: name,
            success: true,
            data: {
              language: user?.language || 'hi',
              city: user?.city || 'Patna',
              interests
            }
          };
        }

        case 'get_arghya_time': {
          const loc = (args.location || 'Patna').toLowerCase().trim();
          const matched = cityArghyaData.find(c =>
            c.cityName.toLowerCase().includes(loc) ||
            c.state.toLowerCase().includes(loc)
          );

          if (!matched) {
            return {
              toolName: name,
              success: true,
              data: {
                cityName: args.location,
                status: 'Data unavailable for this specific city',
                fallbackNote: 'डेटा केवल 12 प्रमुख शहरों के लिए उपलब्ध है। निकटतम शहर पटना या वाराणसी का समय मान्य करें।',
                defaultPatna: cityArghyaData[0]
              }
            };
          }

          return {
            toolName: name,
            success: true,
            data: {
              cityName: matched.cityName,
              state: matched.state,
              river: matched.river,
              sandhyaSunset: matched.sandhyaSunset,
              ushaSunrise: matched.ushaSunrise,
              weatherTemp: matched.weatherTemp,
              weatherCondition: matched.weatherCondition,
              festivalDates: {
                sandhyaArghyaDate: '15 नवंबर 2026 (कार्तिक शुक्ल षष्ठी)',
                ushaArghyaDate: '16 नवंबर 2026 (कार्तिक शुक्ल सप्तमी)'
              },
              source: 'Astronomical Ephemeris & Solar Almanac (100% Calculated)'
            }
          };
        }

        case 'get_weather': {
          const loc = (args.location || 'Patna').toLowerCase().trim();
          const matched = cityArghyaData.find(c =>
            c.cityName.toLowerCase().includes(loc) ||
            c.state.toLowerCase().includes(loc)
          ) || cityArghyaData[0];

          return {
            toolName: name,
            success: true,
            data: {
              city: matched.cityName,
              temperature: matched.weatherTemp,
              condition: matched.weatherCondition,
              advisory: 'शाम के समय नदी तट पर 14°-16°C ठंड व शीतल हवाएं रह सकती हैं। व्रतियों एवं बच्चों हेतु गर्म शॉल/वस्त्र अवश्य साथ रखें।'
            }
          };
        }

        case 'search_ghats': {
          const loc = (args.location || '').toLowerCase().trim();
          const q = (args.query || '').toLowerCase().trim();
          
          let results = chhathGhatsData.filter(g => {
            const matchLoc = !loc || g.city.toLowerCase().includes(loc) || g.state.toLowerCase().includes(loc);
            const matchQuery = !q || g.name.toLowerCase().includes(q) || g.river.toLowerCase().includes(q);
            return matchLoc && matchQuery;
          });

          if (results.length === 0) {
            results = chhathGhatsData.slice(0, 3);
          }

          return {
            toolName: name,
            success: true,
            data: {
              query: args.query || args.location,
              count: results.length,
              ghats: results.map(g => ({
                id: g.id,
                name: g.name,
                city: g.city,
                river: g.river,
                crowdStatus: g.crowdStatus || 'Live crowd data unavailable',
                facilities: g.facilities,
                parking: g.parkingInfo,
                waterQuality: g.waterQuality,
                helpline: g.emergencyHelpline,
                mapsQuery: g.googleMapsQuery
              }))
            }
          };
        }

        case 'search_internal_content': {
          const q = args.query || '';
          const results = await GlobalSearchService.search(q, {
            userCity: 'Patna'
          });

          return {
            toolName: name,
            success: true,
            data: {
              query: q,
              intent: results.analysis?.intent,
              topResultsCount: results.results?.length || 0,
              items: (results.results || []).slice(0, 5).map(item => ({
                id: item.id,
                type: item.type,
                title: item.title,
                subtitle: item.description,
                badge: item.badge
              }))
            }
          };
        }

        case 'search_reels': {
          const q = (args.query || '').toLowerCase().trim();
          const all = ReelsStorage.getReels();
          const matched = all.filter((r: DynamicReel) => 
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.tags.some((t: string) => t.toLowerCase().includes(q)) ||
            r.creatorName.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q)
          );

          return {
            toolName: name,
            success: true,
            data: {
              query: q,
              totalFound: matched.length,
              reels: matched.slice(0, 4).map((r: DynamicReel) => ({
                id: r.id,
                title: r.title,
                creatorName: r.creatorName,
                viewsCount: r.viewsCount,
                likesCount: r.likesCount,
                category: r.category
              }))
            }
          };
        }

        case 'search_songs': {
          const q = (args.query || '').toLowerCase().trim();
          const matched = chhathSongs.filter(s =>
            s.title.toLowerCase().includes(q) ||
            s.singer.toLowerCase().includes(q) ||
            s.lyricsSnippet?.toLowerCase().includes(q) ||
            s.language.toLowerCase().includes(q)
          );

          return {
            toolName: name,
            success: true,
            data: {
              query: q,
              totalFound: matched.length,
              songs: matched.slice(0, 4).map(s => ({
                id: s.id,
                title: s.title,
                singer: s.singer,
                language: s.language,
                duration: s.duration,
                lyrics: s.lyricsSnippet
              }))
            }
          };
        }

        case 'search_users': {
          const q = (args.query || '').toLowerCase().trim();
          const users = ReelsStorage.getUsers();
          const matched = users.filter((u: ReelUser) =>
            u.name.toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q) ||
            u.city?.toLowerCase().includes(q)
          );

          return {
            toolName: name,
            success: true,
            data: {
              query: q,
              users: matched.slice(0, 4).map((u: ReelUser) => ({
                id: u.id,
                name: u.name,
                username: u.username,
                city: u.city,
                verified: u.verified,
                followersCount: u.followersCount
              }))
            }
          };
        }

        case 'search_youtube': {
          const q = args.query || 'Chhath geet';
          const results = await GlobalSearchService.search(q);
          const ytItems = (results.categorized?.videos || results.results || []).filter(i => i.source === 'youtube' || i.type === 'video');
          return {
            toolName: name,
            success: true,
            data: {
              query: q,
              count: ytItems.length,
              videos: ytItems.slice(0, 4).map(v => ({
                id: v.id,
                title: v.title,
                channel: v.creator || v.description,
                thumbnail: v.thumbnail,
                isYouTube: true
              }))
            }
          };
        }

        case 'get_recipe': {
          const q = (args.name || 'thekua').toLowerCase();
          const found = chhathPrasadItems.find(p => 
            p.name.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            p.shortDesc.toLowerCase().includes(q)
          ) || chhathPrasadItems[0];

          return {
            toolName: name,
            success: true,
            data: {
              id: found.id,
              name: found.name,
              shortDesc: found.shortDesc,
              ingredients: found.ingredients,
              method: found.method,
              culturalSignificance: found.culturalSignificance,
              safetyTips: 'शुद्ध देशी घी में धीमी आंच पर तलें। पवित्रता का विशेष ध्यान रखें।'
            }
          };
        }

        case 'get_puja_information': {
          const topic = (args.topic || '').toLowerCase();
          const days = chhathDaysByLang.hi;
          
          let matchedDay = days.find(d => 
            d.title.toLowerCase().includes(topic) ||
            d.meaning.toLowerCase().includes(topic) ||
            d.rituals.some(r => r.toLowerCase().includes(topic))
          );

          if (!matchedDay) {
            matchedDay = days[0];
          }

          return {
            toolName: name,
            success: true,
            data: {
              dayNumber: matchedDay.dayNumber,
              title: matchedDay.title,
              date: matchedDay.date2026,
              meaning: matchedDay.meaning,
              rituals: matchedDay.rituals,
              food: matchedDay.food,
              importance: matchedDay.importance
            }
          };
        }

        case 'create_checklist': {
          const rawItems = args.items || '';
          const splitItems = rawItems.split(/[,;\n]+/).map((s: string) => s.trim()).filter(Boolean);
          
          const existingKey = 'chhath_user_checklist_items';
          let saved: string[] = [];
          try {
            const prev = localStorage.getItem(existingKey);
            saved = prev ? JSON.parse(prev) : [];
          } catch {
            saved = [];
          }

          const combined = Array.from(new Set([...saved, ...splitItems]));
          try {
            localStorage.setItem(existingKey, JSON.stringify(combined));
          } catch {}

          return {
            toolName: name,
            success: true,
            data: {
              addedCount: splitItems.length,
              totalItems: combined.length,
              items: combined
            },
            actionMessage: `चेकलिस्ट में ${splitItems.length} नई सामग्री सफलतापूर्वक जोड़ी गई।`
          };
        }

        case 'save_reel': {
          const user = ReelsStorage.getSession();
          if (!user) {
            return {
              toolName: name,
              success: false,
              error: 'कृपया रील सहेजने हेतु पहले लॉगिन करें।'
            };
          }
          const reelId = args.reelId;
          const isSaved = ReelsStorage.toggleReelSave(user.id, reelId);
          return {
            toolName: name,
            success: true,
            data: { reelId, isSaved },
            actionMessage: isSaved ? 'रील आपकी सहेजी गई सूची में जोड़ दी गई है ✅' : 'रील सूची से हटा दी गई है।'
          };
        }

        case 'like_reel': {
          const user = ReelsStorage.getSession();
          if (!user) {
            return {
              toolName: name,
              success: false,
              error: 'कृपया रील लाइक करने हेतु लॉगिन करें।'
            };
          }
          const reelId = args.reelId;
          const isLiked = ReelsStorage.toggleReelLike(user.id, reelId);
          return {
            toolName: name,
            success: true,
            data: { reelId, isLiked },
            actionMessage: isLiked ? 'रील को लाइक किया गया ❤️' : 'लाइक हटा दिया गया।'
          };
        }

        case 'follow_user': {
          const user = ReelsStorage.getSession();
          if (!user) {
            return {
              toolName: name,
              success: false,
              error: 'फॉलो करने हेतु लॉगिन आवश्यक है।'
            };
          }
          const target = args.userId;
          const isFollowed = ReelsStorage.toggleFollow(user.id, target);
          return {
            toolName: name,
            success: true,
            data: { targetUserId: target, isFollowed },
            actionMessage: isFollowed ? `आप अब ${target} को फॉलो कर रहे हैं ✅` : `अनफॉलो किया गया।`
          };
        }

        case 'create_reminder': {
          const title = args.title;
          const time = args.time;
          const note = args.note || '';

          const reminderObj = {
            id: `rem-${Date.now()}`,
            title,
            time,
            note,
            createdAt: new Date().toISOString()
          };

          const key = 'chhath_user_reminders';
          let list: any[] = [];
          try {
            const prev = localStorage.getItem(key);
            list = prev ? JSON.parse(prev) : [];
          } catch {}
          list.push(reminderObj);
          localStorage.setItem(key, JSON.stringify(list));

          return {
            toolName: name,
            success: true,
            data: reminderObj,
            actionMessage: `स्मरण पत्र (Reminder) सुरक्षित किया गया: "${title}" समय: ${time} ⏰`
          };
        }

        case 'get_family_data': {
          let familyName = 'हमर छठ परिवार';
          try {
            const saved = localStorage.getItem('chhath_family_name');
            if (saved) familyName = saved;
          } catch {}

          let tasks: any[] = [];
          try {
            const savedTasks = localStorage.getItem('chhath_family_tasks');
            tasks = savedTasks ? JSON.parse(savedTasks) : [
              { id: '1', taskTitle: 'फल एवं 5 गांठदार ईख (गन्ना) लाना', assignedTo: 'पापा', category: 'Samagri', completed: true },
              { id: '2', taskTitle: 'शुद्ध देशी घी और गुड़ का ठेकुआ बनाना', assignedTo: 'माताजी', category: 'Prasad', completed: false },
              { id: '3', taskTitle: 'गंगा तट पर स्थान सुरक्षित करना व दीया सजाना', assignedTo: 'भैया', category: 'Ghat', completed: false }
            ];
          } catch {}

          return {
            toolName: name,
            success: true,
            data: {
              familyName,
              tasksCount: tasks.length,
              completedCount: tasks.filter(t => t.completed).length,
              tasks
            }
          };
        }

        case 'create_family_task': {
          const { title, assignee, category } = args;
          const key = 'chhath_family_tasks';
          let tasks: any[] = [];
          try {
            const prev = localStorage.getItem(key);
            tasks = prev ? JSON.parse(prev) : [];
          } catch {}

          const newTask = {
            id: `task-${Date.now()}`,
            taskTitle: title,
            assignedTo: assignee || 'परिवार सदस्य',
            category: category || 'Puja',
            completed: false
          };

          tasks.push(newTask);
          localStorage.setItem(key, JSON.stringify(tasks));

          return {
            toolName: name,
            success: true,
            data: newTask,
            actionMessage: `पारिवारिक कार्य जोड़ा गया: "${title}" (${assignee} जी हेतु) 👨‍👩‍👧‍👦`
          };
        }

        case 'generate_wish': {
          const tone = args.tone || 'emotional';
          const lang = args.language || 'hi';
          const recipient = args.recipient || 'परिवार';

          const matchingWishes = chhathWishesData.filter(w => 
            w.category.toLowerCase().includes(tone) ||
            (lang === 'bho' && w.category === 'bhojpuri') ||
            (lang === 'mai' && w.category === 'maithili') ||
            (lang === 'hi' && w.category === 'hindi')
          );

          const baseWish = matchingWishes[0] || chhathWishesData[0];

          let customText = baseWish.text;
          if (recipient && !customText.includes(recipient)) {
            customText = `${recipient} के लिए: ` + customText;
          }

          return {
            toolName: name,
            success: true,
            data: {
              tone,
              language: lang,
              recipient,
              text: customText,
              hashtags: '#ChhathPuja2026 #ChhathiMaiya #SuryaDev #JaiChhathiMaiya'
            }
          };
        }

        case 'generate_caption': {
          const theme = args.theme || 'Chhath Mahaparv';
          const tone = args.tone || 'devotional';

          const captionTemplates = [
            `सूर्य उपासना और अगाध आस्था का महापर्व छठ। ${theme} की पावन छटा अलौकिक है। जय छठी मईया! 🌅🙏✨ #ChhathPuja #ChhathiMaiya #Bihar #Arghya`,
            `पवित्रता, अनुशासन और लोक-संस्कृति का संगम — ${theme}। छठी मईया सबका कल्याण करें! 🌾🪔 #MahaParv #Chhath2026 #Devotion`,
            `मन में श्रद्धा, होठों पर गीत और हाथों में पूजा का दउरा। ${theme} के पावन क्षण। 🙏🌞 #BhojpuriCulture #SandhyaArghya`
          ];

          const selected = captionTemplates[Math.floor(Math.random() * captionTemplates.length)];

          return {
            toolName: name,
            success: true,
            data: {
              theme,
              caption: selected,
              hashtags: ['#ChhathPuja', '#ChhathiMaiya', '#Chhath2026', '#BiharCulture', '#SuryaDev']
            }
          };
        }

        case 'generate_reel_metadata': {
          const title = args.title || 'छठ महापर्व दर्शन';
          const cat = args.category || 'Devotional';
          const tracks = ReelsStorage.getAudioTracks();
          const suggestedAudio = tracks[0] || { id: 'audio_1', title: 'कांच ही बांस के बहंगिया', artist: 'शारदा सिन्हा' };

          return {
            toolName: name,
            success: true,
            data: {
              title: title,
              suggestedCaption: `जय छठी मईया! 🙏✨ ${title} की पावन झलकियां।`,
              suggestedCategory: cat,
              suggestedHashtags: ['#ChhathPuja', '#ChhathiMaiya', '#Bihar', '#MahaParv'],
              suggestedAudioTrack: {
                id: suggestedAudio.id,
                title: suggestedAudio.title,
                artist: suggestedAudio.artist
              }
            }
          };
        }

        default:
          return {
            toolName: name,
            success: false,
            error: `Unknown agent tool "${name}".`
          };
      }
    } catch (err: any) {
      return {
        toolName: name,
        success: false,
        error: `Tool execution failed: ${err?.message || 'Unknown error'}`
      };
    }
  }
}
