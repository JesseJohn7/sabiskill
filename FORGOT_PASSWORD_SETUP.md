# Forgot Password Setup Guide

## Overview
Your Sabiskill app now has a complete forgot password flow using Supabase. Users can request a password reset via email and securely set a new password.

## Flow

### 1. **Forgot Password Page** (`/forgot-password`)
- User enters their email address
- System sends a password reset link to their email
- Success message confirms email was sent
- Link is valid for 1 hour

### 2. **Reset Password Page** (`/reset-password`)
- User clicks the link in their email
- They set a new password
- Real-time password strength indicator
- Confirmation password field with validation
- Successful reset redirects to login

## Features Implemented

✅ **Email Validation** - Uses your existing `validateEmail` utility  
✅ **Error Handling** - User-friendly error messages  
✅ **Password Strength** - Visual strength indicator  
✅ **Password Match Validation** - Real-time feedback  
✅ **Rate Limiting** - Supabase prevents email spam  
✅ **Session Management** - Automatic redirect if token expired  
✅ **Security** - Passwords never stored in plain text  

## Supabase Configuration

### Email Templates (REQUIRED)
You need to set up email templates in Supabase for password reset emails.

**Steps:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **Authentication** → **Email Templates**
3. Find **Reset Password** template
4. Customize it (optional - default works fine)
5. The template will have a `{{ .ConfirmationURL }}` variable

### Email Configuration (REQUIRED)
1. Go to **Authentication** → **Providers** → **Email**
2. Verify these are set:
   - ✅ Email Confirmations: **Enabled**
   - ✅ Secure email change: Check if needed
   - ✅ Double confirm changes email: Check if needed

### Redirect URL Configuration (IMPORTANT)
1. Go to **Authentication** → **URL Configuration**
2. Add your reset password redirect URL:
   - For development: `http://localhost:3000/reset-password`
   - For production: `https://yourdomain.com/reset-password`
3. Save changes

## Testing Locally

1. **Start your app:**
   ```bash
   npm run dev
   ```

2. **Go to login page:**
   - Click "Forgot password?"

3. **Test with a real email (if Supabase email is configured):**
   - Enter your actual email
   - Check your inbox for reset link
   - Click the link to verify it works

4. **Test without real emails (development):**
   - Use Supabase's **Email Testing** feature
   - Go to **Authentication** → **Users** in Supabase Dashboard
   - Create a test user
   - Use their email for testing

## File Structure

```
app/
├── forgot-password/
│   └── page.tsx          # Forgot password request page
├── reset-password/
│   └── page.tsx          # Password reset form page
├── login/
│   └── page.tsx          # Updated with "Forgot password?" link
├── lib/supabase/
│   └── client.ts         # Supabase client (already configured)
└── utils/
    └── validateEmail.ts  # Email validation utility
```

## API Endpoints Used

### Request Password Reset
```typescript
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});
```

### Update Password
```typescript
await supabase.auth.updateUser({ password });
```

## Error Handling

The system handles these scenarios:

| Error | User Message |
|-------|--------------|
| Invalid email | "That email address doesn't look right." |
| Rate limited | "Too many reset attempts — please wait a few minutes." |
| Expired token | "This reset link has expired. Please request a new one." |
| Weak password | "Password must be at least 6 characters with letters and numbers." |
| Network error | "Connection problem — please check your internet." |

## Security Features

🔒 **Password Requirements:**
- Minimum 6 characters
- Must contain letters AND numbers
- Must match confirmation field

🔒 **Email Security:**
- One-time links (expires in 1 hour)
- Link only works once
- User session required for final update

🔒 **Rate Limiting:**
- Automatic Supabase rate limiting
- Prevents email spam attacks

## Customization

### Change Email Template
Edit in Supabase dashboard under **Authentication** → **Email Templates**

### Adjust Password Requirements
Edit password validation in [app/reset-password/page.tsx](app/reset-password/page.tsx):
```typescript
// Line ~25
if (password.length < 6) { // Change this number
  setError("Password must be at least 6 characters.");
}
```

### Change Redirect Link Validity
Edit in [app/forgot-password/page.tsx](app/forgot-password/page.tsx):
```typescript
// Line ~53
redirectTo: `${window.location.origin}/reset-password`, // This URL is used
```

## Troubleshooting

### "Email not sent" or "Invalid token after reset"
→ Check **URL Configuration** in Supabase has your reset URL

### "Reset link expired"
→ Normal behavior after 1 hour. User should request new link

### "Can't update password"
→ Verify the link from email is still valid (1 hour window)

### Email not appearing in inbox
→ Check spam folder  
→ Verify email address in database  
→ Check Supabase logs: **Authentication** → **Logs**

## Next Steps

1. ✅ Set up email in Supabase (if not already done)
2. ✅ Configure redirect URLs in Supabase
3. ✅ Test forgot password flow locally
4. ✅ Test on production after deployment
5. (Optional) Customize email template with your branding

## Environment Variables Already Configured

Your `.env.local` has all needed vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

No additional setup needed! 🎉

---

**Questions?** Check [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
