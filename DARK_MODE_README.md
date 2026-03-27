# Dark Mode Implementation Guide

## Features Implemented

✅ **Dark Mode Toggle** - Users can now switch between light and dark modes
- Toggle button with sun/moon icons in the Header and Settings
- Persists user preference across sessions
- Smooth transitions between modes

## Setup Instructions (Supabase)

### 1. Create the `user_preferences` Table in Supabase

**Option A: Using Supabase Console (Recommended)**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS user_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences" 
  ON user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
  ON user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

## 🚀 Quick Start (No Setup Required!)

Dark mode works **immediately** out of the box:

✅ Click the **sun/moon icon** in the Header
✅ Your preference is saved locally  
✅ It persists when you refresh or logout

**WITHOUT Supabase setup:**
- Dark mode preference works perfectly ✓
- Persists across sessions in the same browser ✓
- Persists even after logout/login ✓

**WITH Supabase setup (optional):**
- All above + syncs across different devices ✓
- User switches to dark mode on phone
- Logs in on laptop → automatically dark mode on laptop ✓

---

---

## 2. Optional: Enable Cross-Device Sync (Supabase)

If you want dark mode preference to sync across multiple devices/browsers, set up the Supabase table:

**Steps:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS user_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences" 
  ON user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
  ON user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

6. Click **Run** ▶️
7. Done! Cross-device sync is now enabled ✓

---

## 3. How to Use Dark Mode

**In Settings Tab:**
- Click the "Dark Mode" / "Light Mode" button in the Account Actions section
- Toggle switches between modes instantly

**In Header (Quick Access):**
- Click the ☀️ (sun) or 🌙 (moon) icon in the top right
- Provides quick access without navigating to Settings

---

## How It Works

**Storage:**
1. **localStorage** - Stores preference locally for instant persistence
2. **Supabase Database** - (Optional) Syncs preference across devices when table is set up

**Sync Behavior:**
- Preference persists if user logs out and back in ✓
- Preference syncs across multiple devices/tabs (if Supabase table is set up) ✓
- Works offline with localStorage fallback ✓

## Technical Details

### Files Created:
- `app/lib/ThemeContext.tsx` - React Context for theme management  
- `tailwind.config.ts` - Tailwind dark mode configuration
- `DARK_MODE_SETUP.sql` - Supabase table migration (reference)

### Files Modified:
- `app/layout.tsx` - Added ThemeProvider wrapper
- `app/dashboard/page.tsx` - Added dark mode styling
- `app/dashboard/components/Header.tsx` - Added theme toggle button
- `app/dashboard/components/SettingsTab.tsx` - Added theme toggle in settings
- `app/dashboard/components/Hometab.tsx` - Dark mode styling
- `app/dashboard/components/Learningstreak.tsx` - Dark streak card styling

### How It Works:

1. **ThemeProvider** hooks into React context to manage isDark state
2. Applies `dark` class to `<html>` element for Tailwind dark mode
3. Uses `useTheme()` hook in components to access toggleTheme and isDark
4. Saves preference to localStorage with key `sabiskill_theme`
5. Attempts to save to Supabase for cross-device persistence
6. Falls back gracefully if Supabase is unavailable

## Customization

To adjust dark mode colors, edit the Tailwind classes in components using:
- `dark:` prefix for dark mode specific styles
- Example: `bg-white dark:bg-slate-900`

Common color mappings:
- Backgrounds: `bg-slate-50` → `dark:bg-zinc-950`
- Text: `text-slate-900` → `dark:text-white`
- Borders: `border-slate-200` → `dark:border-slate-700`

## Troubleshooting

**Dark mode not persisting after logout:**
- Ensure the `user_preferences` table exists and RLS policies are enabled
- Check browser console for any Supabase errors
- Clear localStorage if needed: `localStorage.removeItem('sabiskill_theme')`

**Colors not updating:**
- Make sure Tailwind CSS is properly configured
- Restart the dev server
- Check that `tailwind.config.ts` has `darkMode: "class"` set

## Note About Streak Counter

A fix was also applied to the learning streak counter - it now correctly resets to 0 (instead of 1) when you miss a day.
