import React, { createContext, useContext, useState, useEffect } from 'react';
import { Song, Ghat, BlogPost, WishItem, UserLocationPreference, DedicatedVirtualDiya, FamilyTask } from '../types';
import { chhathSongs as defaultSongs } from '../data/songs';
import { chhathGhatsData as defaultGhats } from '../data/ghats';
import { chhathBlogPosts as defaultBlogs } from '../data/blog';
import { chhathWishesData as defaultWishes } from '../data/wishes';

const DEFAULT_DIYAS: DedicatedVirtualDiya[] = [
  {
    id: 'diya-1',
    dedicationFor: 'परिवार के आरोग्य व सुख-समृद्धि हेतु',
    senderName: 'रोहन व प्रिया मिश्रा',
    city: 'पटना (बिहार)',
    timestamp: '5 मिनट पहले',
    blessingMessage: 'छठी मईया आपके समस्त परिवार को अखंड सुख व आरोग्य प्रदान करें।'
  },
  {
    id: 'diya-2',
    dedicationFor: 'माता-पिता के दीर्घायु जीवन हेतु',
    senderName: 'अमित कुमार सिंह',
    city: 'वाराणसी (उत्तर प्रदेश)',
    timestamp: '12 मिनट पहले',
    blessingMessage: 'भगवान भास्कर का दिव्य तेज आपके परिवार पर सदा बना रहे।'
  },
  {
    id: 'diya-3',
    dedicationFor: 'संतान के उज्ज्वल भविष्य व विद्या हेतु',
    senderName: 'सुनीता देवी',
    city: 'रांची (झारखंड)',
    timestamp: '25 मिनट पहले',
    blessingMessage: 'छठी मईया की पावन कृपा से समस्त मनोकामनाएं पूर्ण हों।'
  }
];

const DEFAULT_FAMILY_TASKS: FamilyTask[] = [
  { id: 'ft-1', assignedTo: 'पिताजी', taskTitle: 'गंगा किनारे से पवित्र मिट्टी व ईख (गन्ना) लाना', category: 'Ghat', completed: true },
  { id: 'ft-2', assignedTo: 'माताजी', taskTitle: 'ठेकुआ व कसार हेतु गेहूं की शुद्धि व पिसाई', category: 'Prasad', completed: true },
  { id: 'ft-3', assignedTo: 'रोहन', taskTitle: 'बांस का दउरा, पीतल का सूप व कलश की तैयारी', category: 'Puja', completed: false },
  { id: 'ft-4', assignedTo: 'चाचाजी', taskTitle: 'देशी घी, गुड़, मेवा व मौसमी फल संकलन', category: 'Shopping', completed: false },
  { id: 'ft-5', assignedTo: 'प्रिया', taskTitle: 'पीला-नारंगी सूती वस्त्र व सिन्दूर संचय', category: 'Clothes', completed: false }
];

interface ChhathDataContextType {
  songs: Song[];
  ghats: Ghat[];
  blogs: BlogPost[];
  wishes: WishItem[];
  adminPin: string;
  userLocation: UserLocationPreference;
  favoriteSongs: string[];
  favoriteGhats: string[];
  virtualDiyas: DedicatedVirtualDiya[];
  totalGlobalDiyas: number;
  familyTasks: FamilyTask[];
  familyName: string;
  setUserLocation: (loc: UserLocationPreference) => void;
  toggleFavoriteSong: (id: string) => void;
  toggleFavoriteGhat: (id: string) => void;
  lightVirtualDiya: (diya: { dedicationFor: string; senderName: string; city: string }) => void;
  addFamilyTask: (task: Omit<FamilyTask, 'id' | 'completed'>) => void;
  toggleFamilyTask: (id: string) => void;
  deleteFamilyTask: (id: string) => void;
  setFamilyName: (name: string) => void;
  addSong: (song: Omit<Song, 'id'>) => void;
  deleteSong: (id: string) => void;
  addGhat: (ghat: Omit<Ghat, 'id'>) => void;
  deleteGhat: (id: string) => void;
  addBlog: (blog: Omit<BlogPost, 'id'>) => void;
  deleteBlog: (id: string) => void;
  addWish: (wish: Omit<WishItem, 'id'>) => void;
  deleteWish: (id: string) => void;
  updateAdminPin: (newPin: string) => void;
}

const ChhathDataContext = createContext<ChhathDataContextType | undefined>(undefined);

export const ChhathDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Songs with localStorage persistence
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_custom_songs');
      if (!saved) return defaultSongs;
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map((s: Song) => s.id));
      const missing = defaultSongs.filter(d => !existingIds.has(d.id));
      return [...parsed, ...missing];
    } catch {
      return defaultSongs;
    }
  });

  // 2. Ghats
  const [ghats, setGhats] = useState<Ghat[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_custom_ghats');
      return saved ? JSON.parse(saved) : defaultGhats;
    } catch {
      return defaultGhats;
    }
  });

  // 3. Blogs
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_custom_blogs');
      return saved ? JSON.parse(saved) : defaultBlogs;
    } catch {
      return defaultBlogs;
    }
  });

  // 4. Wishes
  const [wishes, setWishes] = useState<WishItem[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_custom_wishes');
      return saved ? JSON.parse(saved) : defaultWishes;
    } catch {
      return defaultWishes;
    }
  });

  // 5. User Location Personalization
  const [userLocation, setUserLocationState] = useState<UserLocationPreference>(() => {
    try {
      const saved = localStorage.getItem('chhath_user_location');
      return saved ? JSON.parse(saved) : { state: 'Bihar', city: 'Patna' };
    } catch {
      return { state: 'Bihar', city: 'Patna' };
    }
  });

  // 6. Favorites
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_favorite_songs');
      return saved ? JSON.parse(saved) : ['song-1', 'song-2'];
    } catch {
      return ['song-1', 'song-2'];
    }
  });

  const [favoriteGhats, setFavoriteGhats] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_favorite_ghats');
      return saved ? JSON.parse(saved) : ['ghat-1', 'ghat-2'];
    } catch {
      return ['ghat-1', 'ghat-2'];
    }
  });

  // 7. Virtual Diyas & Community
  const [virtualDiyas, setVirtualDiyas] = useState<DedicatedVirtualDiya[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_dedicated_diyas');
      return saved ? JSON.parse(saved) : DEFAULT_DIYAS;
    } catch {
      return DEFAULT_DIYAS;
    }
  });

  const [totalGlobalDiyas, setTotalGlobalDiyas] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('chhath_global_diyas_count');
      return saved ? parseInt(saved, 10) : 12482;
    } catch {
      return 12482;
    }
  });

  // 8. Family Chhath Circle
  const [familyName, setFamilyNameState] = useState<string>(() => {
    return localStorage.getItem('chhath_family_name') || 'हमारा पावन छठ परिवार';
  });

  const [familyTasks, setFamilyTasks] = useState<FamilyTask[]>(() => {
    try {
      const saved = localStorage.getItem('chhath_family_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_FAMILY_TASKS;
    } catch {
      return DEFAULT_FAMILY_TASKS;
    }
  });

  // 9. Admin Password / PIN
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('chhath_admin_pin');
      return saved || '1008';
    } catch {
      return '1008';
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('chhath_custom_songs', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('chhath_custom_ghats', JSON.stringify(ghats));
  }, [ghats]);

  useEffect(() => {
    localStorage.setItem('chhath_custom_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('chhath_custom_wishes', JSON.stringify(wishes));
  }, [wishes]);

  useEffect(() => {
    localStorage.setItem('chhath_user_location', JSON.stringify(userLocation));
  }, [userLocation]);

  useEffect(() => {
    localStorage.setItem('chhath_favorite_songs', JSON.stringify(favoriteSongs));
  }, [favoriteSongs]);

  useEffect(() => {
    localStorage.setItem('chhath_favorite_ghats', JSON.stringify(favoriteGhats));
  }, [favoriteGhats]);

  useEffect(() => {
    localStorage.setItem('chhath_dedicated_diyas', JSON.stringify(virtualDiyas));
  }, [virtualDiyas]);

  useEffect(() => {
    localStorage.setItem('chhath_global_diyas_count', totalGlobalDiyas.toString());
  }, [totalGlobalDiyas]);

  useEffect(() => {
    localStorage.setItem('chhath_family_name', familyName);
  }, [familyName]);

  useEffect(() => {
    localStorage.setItem('chhath_family_tasks', JSON.stringify(familyTasks));
  }, [familyTasks]);

  useEffect(() => {
    localStorage.setItem('chhath_admin_pin', adminPin);
  }, [adminPin]);

  // Actions
  const setUserLocation = (loc: UserLocationPreference) => {
    setUserLocationState(loc);
  };

  const toggleFavoriteSong = (id: string) => {
    setFavoriteSongs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleFavoriteGhat = (id: string) => {
    setFavoriteGhats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const lightVirtualDiya = (diyaData: { dedicationFor: string; senderName: string; city: string }) => {
    const newDiya: DedicatedVirtualDiya = {
      id: `diya-${Date.now()}`,
      dedicationFor: diyaData.dedicationFor || 'सकल परिवार के कल्याण व आरोग्य हेतु',
      senderName: diyaData.senderName || 'सच्चा श्रद्धालु',
      city: diyaData.city || userLocation.city,
      timestamp: 'अभी-अभी',
      blessingMessage: `छठी मईया की पावन अनुकम्पा से ${diyaData.dedicationFor || 'आपके परिवार'} की सुख-शांति व समृद्धि अक्षुण्ण रहे।`
    };
    setVirtualDiyas(prev => [newDiya, ...prev.slice(0, 49)]);
    setTotalGlobalDiyas(prev => prev + 1);
  };

  const setFamilyName = (name: string) => {
    setFamilyNameState(name);
  };

  const addFamilyTask = (taskData: Omit<FamilyTask, 'id' | 'completed'>) => {
    const newTask: FamilyTask = {
      ...taskData,
      id: `ft-${Date.now()}`,
      completed: false
    };
    setFamilyTasks(prev => [newTask, ...prev]);
  };

  const toggleFamilyTask = (id: string) => {
    setFamilyTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteFamilyTask = (id: string) => {
    setFamilyTasks(prev => prev.filter(t => t.id !== id));
  };

  const addSong = (newSongData: Omit<Song, 'id'>) => {
    const newSong: Song = {
      ...newSongData,
      id: `song-${Date.now()}`
    };
    setSongs(prev => [newSong, ...prev]);
  };

  const deleteSong = (id: string) => {
    setSongs(prev => prev.filter(s => s.id !== id));
  };

  const addGhat = (newGhatData: Omit<Ghat, 'id'>) => {
    const newGhat: Ghat = {
      ...newGhatData,
      id: `ghat-${Date.now()}`
    };
    setGhats(prev => [newGhat, ...prev]);
  };

  const deleteGhat = (id: string) => {
    setGhats(prev => prev.filter(g => g.id !== id));
  };

  const addBlog = (newBlogData: Omit<BlogPost, 'id'>) => {
    const newBlog: BlogPost = {
      ...newBlogData,
      id: `blog-${Date.now()}`
    };
    setBlogs(prev => [newBlog, ...prev]);
  };

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  const addWish = (newWishData: Omit<WishItem, 'id'>) => {
    const newWish: WishItem = {
      ...newWishData,
      id: `wish-${Date.now()}`
    };
    setWishes(prev => [newWish, ...prev]);
  };

  const deleteWish = (id: string) => {
    setWishes(prev => prev.filter(w => w.id !== id));
  };

  const updateAdminPin = (newPin: string) => {
    setAdminPin(newPin);
  };

  return (
    <ChhathDataContext.Provider
      value={{
        songs,
        ghats,
        blogs,
        wishes,
        adminPin,
        userLocation,
        favoriteSongs,
        favoriteGhats,
        virtualDiyas,
        totalGlobalDiyas,
        familyTasks,
        familyName,
        setUserLocation,
        toggleFavoriteSong,
        toggleFavoriteGhat,
        lightVirtualDiya,
        addFamilyTask,
        toggleFamilyTask,
        deleteFamilyTask,
        setFamilyName,
        addSong,
        deleteSong,
        addGhat,
        deleteGhat,
        addBlog,
        deleteBlog,
        addWish,
        deleteWish,
        updateAdminPin
      }}
    >
      {children}
    </ChhathDataContext.Provider>
  );
};

export const useChhathData = () => {
  const context = useContext(ChhathDataContext);
  if (!context) {
    throw new Error('useChhathData must be used within a ChhathDataProvider');
  }
  return context;
};
