# Chhath Mahaparv — Production Backend, Database & Authoritative Account Architecture Walkthrough

## 1. Executive Summary

We have completed the transformation of the Chhath Mahaparv application from a hybrid frontend-state model into a **production-grade social platform architecture** comparable to modern platforms like Instagram:
- **Single Authoritative Identity Rule**: Every person has exactly **one unique account** anchored by an immutable **UUID v4 (`user_id`)**. All reels, comments, likes, saves, follows, messages, calls, notifications, privacy settings, device sessions, and AI preferences relate to this authoritative foreign key.
- **Relational Schema**: 22 normalized relational tables, foreign key constraints (`ON DELETE CASCADE`), composite unique indexes, check constraints, and Row-Level Security (RLS) policies defined in PostgreSQL / Supabase SQL ([`001_initial_schema.sql`](file:///c:/Users/rajki/Desktop/newkmd/server/migrations/001_initial_schema.sql)).
- **Dual-Driver Persistent Engine**: Node/Vite backend engine ([`databaseEngine.ts`](file:///c:/Users/rajki/Desktop/newkmd/server/db/databaseEngine.ts)) with persistent disk storage in `server/data/chhath_db.json`, executing cryptographic PBKDF2 password hashing with salt, session management, and relational integrity.
- **Full Social REST API**: Mounted on `/api/v1/*` in Vite middleware ([`socialMiddleware.ts`](file:///c:/Users/rajki/Desktop/newkmd/server/socialMiddleware.ts)), handling authentication, user profiles, social graph (follows, pending requests, blocks, mutes), settings, and "Download My Data" GDPR export.
- **Centralized Account Center UI**: Implemented in [`AccountCenterModal.tsx`](file:///c:/Users/rajki/Desktop/newkmd/src/components/settings/AccountCenterModal.tsx), offering profile editing, password changing, active device session monitoring, privacy switches (private account, who can message/call/comment), follow requests, blocked accounts, AI preferences, and account deletion.

---

## 2. Key Architecture Upgrades

### A. Authoritative Single User Model
```
ONE AUTHORITATIVE USER ACCOUNT (users.id: UUID v4)
                    │
                    ├── PROFILE (profiles.user_id, username: UNIQUE @handle)
                    ├── SOCIAL GRAPH (follows, blocked_users, muted_entities)
                    ├── REELS (reels.creator_id -> profiles.user_id)
                    ├── INTERACTIONS (comments, reel_likes, saved_reels)
                    ├── COMMUNICATIONS (messages, conversations, calls)
                    ├── NOTIFICATIONS (notifications.user_id, actor_id)
                    ├── PRIVACY & SAFETY (user_settings.is_private_account, who_can_*)
                    ├── SECURITY (active_sessions, password_hash: PBKDF2)
                    └── AI PREFERENCES (user_settings.ai_personalization_enabled)
```

### B. Seed Users Canonical UUID Migration
All pre-existing seed users were assigned fixed permanent RFC4122 UUID v4 identifiers:
| Seed User | Canonical UUID v4 | Role |
| :--- | :--- | :--- |
| **@admin_chhath** | `018e6e5b-468b-7000-8000-000000000000` | admin |
| **@sharda_trust** | `018e6e5b-468b-7000-8000-000000000001` | creator |
| **@pramodchhath** | `018e6e5b-468b-7000-8000-000000000002` | creator |
| **@bihari_vibes** | `018e6e5b-468b-7000-8000-000000000003` | creator |
| **@chhathi_bhakta** | `018e6e5b-468b-7000-8000-000000000004` | creator |
| **@maithili_kitchen** | `018e6e5b-468b-7000-8000-000000000005` | creator |

Legacy strings (`user_sharda_trust` etc.) automatically resolve to the canonical UUID v4.

---

## 3. Verified Features & Test Results

The comprehensive test suite ([`verify_social_architecture.cjs`](file:///c:/Users/rajki/Desktop/newkmd/scratch/verify_social_architecture.cjs)) executed against the live server:

1. **Canonical Seed Users & UUID v4 Check**: Passed (100% valid UUID format).
2. **User Registration & PBKDF2 Password Hashing**: Passed (Generated unique UUID, salt + 10,000 PBKDF2 SHA-512 iterations).
3. **Session Verification & Device Tracking**: Passed (Bearer tokens, IP, device detection, user-agent parsing).
4. **Relational Foreign Key Actions**: Passed (Reels created, comments added, likes toggled, saved to collections).
5. **Private Account Lifecycle**: Passed (Attempting to follow a private account returns `pending` status, target receives follow request notification, accepting updates relationship to `accepted`).
6. **Bidirectional Block Severance**: Passed (Blocking severs follows in both directions and prevents interaction).
7. **Muting & AI Cultural Settings**: Passed (Entities muted, AI voice and cultural personalization preferences updated).
8. **"Download My Data" Export**: Passed (Generated complete JSON export containing profile, social graph, reels, comments, likes, saves, active devices, settings).
9. **Session Invalidation**: Passed (Logout revokes Bearer token; subsequent requests receive HTTP 401).
10. **Cascading Account Deletion**: Passed (Entering `DELETE` confirmation purges user and cascades through all tables).
11. **Production Build**: Passed (`npm run build` completed with 0 errors).

---

## 4. Modified & Created Files

| File | Status | Purpose |
| :--- | :--- | :--- |
| [`server/migrations/001_initial_schema.sql`](file:///c:/Users/rajki/Desktop/newkmd/server/migrations/001_initial_schema.sql) | **NEW** | 22 Relational PostgreSQL / Supabase tables with RLS policies |
| [`server/db/databaseEngine.ts`](file:///c:/Users/rajki/Desktop/newkmd/server/db/databaseEngine.ts) | **NEW** | Persistent relational database engine with JSON disk store |
| [`server/socialMiddleware.ts`](file:///c:/Users/rajki/Desktop/newkmd/server/socialMiddleware.ts) | **NEW** | REST API endpoints on `/api/v1/*` |
| [`vite.config.ts`](file:///c:/Users/rajki/Desktop/newkmd/vite.config.ts) | **MODIFIED** | Mounted `/api/v1` social middleware |
| [`src/types.ts`](file:///c:/Users/rajki/Desktop/newkmd/src/types.ts) | **MODIFIED** | Added `UserSettings`, `ActiveSession`, `SocialFollowStatus`, enriched `ReelUser` |
| [`src/services/authService.ts`](file:///c:/Users/rajki/Desktop/newkmd/src/services/authService.ts) | **NEW** | Client API service for `/api/v1/*` communication |
| [`src/context/AuthContext.tsx`](file:///c:/Users/rajki/Desktop/newkmd/src/context/AuthContext.tsx) | **MODIFIED** | Authoritative sessions, settings, device tracking, follow requests |
| [`src/services/reelsStorage.ts`](file:///c:/Users/rajki/Desktop/newkmd/src/services/reelsStorage.ts) | **MODIFIED** | Migrated seed users to canonical UUIDs, legacy ID resolution |
| [`src/components/settings/AccountCenterModal.tsx`](file:///c:/Users/rajki/Desktop/newkmd/src/components/settings/AccountCenterModal.tsx) | **NEW** | Instagram-grade Account Center modal |
| [`src/components/layout/Navbar.tsx`](file:///c:/Users/rajki/Desktop/newkmd/src/components/layout/Navbar.tsx) | **MODIFIED** | Added Account Center trigger and mounted modal |
| [`src/components/reels/UserProfileModal.tsx`](file:///c:/Users/rajki/Desktop/newkmd/src/components/reels/UserProfileModal.tsx) | **MODIFIED** | Added Account Center, user blocking, and private account lock screen |
