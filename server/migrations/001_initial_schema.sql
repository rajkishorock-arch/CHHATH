-- ==============================================================================
-- CHHATH MAHAPARV: PRODUCTION RELATIONAL DATABASE SCHEMA & RLS POLICIES
-- Target: PostgreSQL / Supabase
-- Version: 1.0.0
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. PROFILES TABLE (Linked 1-to-1 with auth.users)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE, -- Foreign key referencing auth.users(id) in Supabase
    username VARCHAR(30) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT DEFAULT 'जय छठी मइया! 🙏 पावन महापर्व व्रती व सेवक।',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80',
    cover_url TEXT DEFAULT 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
    website TEXT DEFAULT '',
    city VARCHAR(100) DEFAULT 'Patna',
    state VARCHAR(100) DEFAULT 'Bihar',
    country VARCHAR(100) DEFAULT 'India',
    language VARCHAR(10) DEFAULT 'hi',
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'creator', 'moderator', 'admin', 'super_admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    followers_count INT DEFAULT 0 CHECK (followers_count >= 0),
    following_count INT DEFAULT 0 CHECK (following_count >= 0),
    reels_count INT DEFAULT 0 CHECK (reels_count >= 0),
    total_likes_count INT DEFAULT 0 CHECK (total_likes_count >= 0),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case-insensitive unique username index
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username_lower ON public.profiles(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- ==========================================
-- 2. SOCIAL GRAPH: FOLLOWS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follows_status ON public.follows(status);

-- ==========================================
-- 3. USER BLOCKING
-- ==========================================
CREATE TABLE IF NOT EXISTS public.blocked_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id),
    CHECK (blocker_id <> blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker ON public.blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON public.blocked_users(blocked_id);

-- ==========================================
-- 4. MUTED ENTITIES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.muted_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('user', 'reel', 'topic', 'conversation')),
    entity_id VARCHAR(100) NOT NULL,
    mute_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_muted_entities_user ON public.muted_entities(user_id);

-- ==========================================
-- 5. RESTRICTED USERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.restricted_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    restricted_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, restricted_id),
    CHECK (user_id <> restricted_id)
);

-- ==========================================
-- 6. REELS (SHORT-FORM VIDEO PLATFORM)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    caption TEXT DEFAULT '',
    category VARCHAR(50) DEFAULT 'Traditional',
    tags TEXT[] DEFAULT '{}',
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
    views_count INT DEFAULT 0 CHECK (views_count >= 0),
    likes_count INT DEFAULT 0 CHECK (likes_count >= 0),
    comments_count INT DEFAULT 0 CHECK (comments_count >= 0),
    shares_count INT DEFAULT 0 CHECK (shares_count >= 0),
    saves_count INT DEFAULT 0 CHECK (saves_count >= 0),
    audio_id VARCHAR(100),
    youtube_video_id VARCHAR(50),
    source_type VARCHAR(20) DEFAULT 'FIRST_PARTY',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reels_user_id ON public.reels(user_id);
CREATE INDEX IF NOT EXISTS idx_reels_created_at ON public.reels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reels_category ON public.reels(category);
CREATE INDEX IF NOT EXISTS idx_reels_status_visibility ON public.reels(status, visibility);

-- ==========================================
-- 7. REEL COMMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reel_id UUID NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    likes_count INT DEFAULT 0 CHECK (likes_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_reel_id ON public.comments(reel_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);

-- ==========================================
-- 8. REEL LIKES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reel_likes (
    reel_id UUID NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (reel_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reel_likes_user ON public.reel_likes(user_id);

-- ==========================================
-- 9. SAVED REELS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.saved_reels (
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    reel_id UUID NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, reel_id)
);

-- ==========================================
-- 10. CONVERSATIONS (CHHATH CONNECT)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('direct', 'group', 'event')),
    created_by UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    is_message_request BOOLEAN DEFAULT FALSE,
    request_status VARCHAR(20) DEFAULT 'accepted' CHECK (request_status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_last_msg ON public.conversations(last_message_at DESC);

-- ==========================================
-- 11. CONVERSATION MEMBERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.conversation_members (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    is_pinned BOOLEAN DEFAULT FALSE,
    mute_until TIMESTAMPTZ,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conversation_members_user ON public.conversation_members(user_id);

-- ==========================================
-- 12. GROUP METADATA
-- ==========================================
CREATE TABLE IF NOT EXISTS public.group_metadata (
    conversation_id UUID PRIMARY KEY REFERENCES public.conversations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    created_by UUID NOT NULL REFERENCES public.profiles(user_id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 13. MESSAGES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'image', 'video', 'voice', 'reel', 'song', 'ghat', 'plan', 'poll', 'system', 'rich_card')),
    text TEXT DEFAULT '',
    media_url TEXT,
    voice_duration INT,
    voice_waveform INT[],
    rich_card JSONB,
    reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'delivered' CHECK (status IN ('sending', 'sent', 'delivered', 'read', 'failed')),
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted_for_everyone BOOLEAN DEFAULT FALSE,
    deleted_for UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conv_id ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- ==========================================
-- 14. MESSAGE REACTIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.message_reactions (
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (message_id, user_id, emoji)
);

-- ==========================================
-- 15. CALLS (WEBRTC AUDIO & VIDEO SESSIONS)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
    caller_id UUID NOT NULL REFERENCES public.profiles(user_id),
    receiver_id UUID NOT NULL REFERENCES public.profiles(user_id),
    call_type VARCHAR(10) CHECK (call_type IN ('voice', 'video')),
    status VARCHAR(20) DEFAULT 'ringing' CHECK (status IN ('ringing', 'connected', 'ended', 'declined', 'missed')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_calls_caller ON public.calls(caller_id);
CREATE INDEX IF NOT EXISTS idx_calls_receiver ON public.calls(receiver_id);

-- ==========================================
-- 16. NOTIFICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('follow', 'follow_request', 'like', 'comment', 'reply', 'mention', 'message', 'group_invite', 'call', 'missed_call', 'system', 'ai')),
    entity_type VARCHAR(30),
    entity_id VARCHAR(100),
    text TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, created_at DESC);

-- ==========================================
-- 17. USER SETTINGS & PRIVACY
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    account_visibility VARCHAR(10) DEFAULT 'public' CHECK (account_visibility IN ('public', 'private')),
    who_can_message VARCHAR(15) DEFAULT 'everyone' CHECK (who_can_message IN ('everyone', 'followers', 'following', 'nobody')),
    who_can_call VARCHAR(15) DEFAULT 'everyone' CHECK (who_can_call IN ('everyone', 'followers', 'nobody')),
    who_can_comment VARCHAR(15) DEFAULT 'everyone' CHECK (who_can_comment IN ('everyone', 'followers', 'nobody')),
    who_can_tag VARCHAR(15) DEFAULT 'everyone' CHECK (who_can_tag IN ('everyone', 'followers', 'nobody')),
    activity_status BOOLEAN DEFAULT TRUE,
    ai_personalization BOOLEAN DEFAULT TRUE,
    ai_voice_enabled BOOLEAN DEFAULT TRUE,
    ai_chat_suggestions BOOLEAN DEFAULT TRUE,
    notification_likes BOOLEAN DEFAULT TRUE,
    notification_comments BOOLEAN DEFAULT TRUE,
    notification_messages BOOLEAN DEFAULT TRUE,
    notification_calls BOOLEAN DEFAULT TRUE,
    theme VARCHAR(15) DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 18. ACTIVE SESSIONS & DEVICES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.active_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    device_info VARCHAR(255) NOT NULL,
    ip_address VARCHAR(50),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_active_sessions_user ON public.active_sessions(user_id);

-- ==========================================
-- 19. REPORTS & CONTENT MODERATION
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('profile', 'reel', 'comment', 'message', 'group')),
    content_id VARCHAR(100) NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR POSTGRESQL / SUPABASE
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muted_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restricted_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view public profiles. Owner can update.
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Reels: Viewable if public OR if follower of private creator
CREATE POLICY "Public reels are viewable by everyone" ON public.reels
    FOR SELECT USING (
        visibility = 'public' OR 
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.follows 
            WHERE follower_id = auth.uid() AND following_id = reels.user_id AND status = 'accepted'
        )
    );

CREATE POLICY "Users can create their own reels" ON public.reels
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reels" ON public.reels
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reels" ON public.reels
    FOR DELETE USING (auth.uid() = user_id);

-- Saved Reels: STRICTLY PRIVATE to the user
CREATE POLICY "Users can only view their own saved reels" ON public.saved_reels
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save reels for themselves" ON public.saved_reels
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own saved reels" ON public.saved_reels
    FOR DELETE USING (auth.uid() = user_id);

-- Messages: Only participants in the conversation can read
CREATE POLICY "Users can view messages in conversations they belong to" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversation_members 
            WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages to conversations they belong to" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.conversation_members 
            WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
        )
    );

-- User Settings: STRICTLY PRIVATE to owner
CREATE POLICY "Users can view and edit only their own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Notifications: STRICTLY PRIVATE to recipient
CREATE POLICY "Users can view only their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = recipient_id);
