// utils/validateEmail.ts
// This file checks if an email looks real BEFORE we even contact Supabase.
// That stops fake/test emails from being sent, which caused the bounce problem.

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();

  // 1. Empty check
  if (!trimmed) {
    return "Please enter your email address.";
  }

  // 2. Must have exactly one @ and a dot after it — e.g. name@example.com
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return "Please enter a valid email address — it should look like name@example.com";
  }

  // 3. Block domains that are obviously fake/test — these cause bounces
  const blockedDomains = [
    "test.com", "example.com", "fake.com", "mailinator.com",
    "tempmail.com", "yopmail.com", "guerrillamail.com", "throwaway.email",
    "sharklasers.com", "trashmail.com", "dispostable.com",
  ];
  const domain = trimmed.split("@")[1]?.toLowerCase();
  if (blockedDomains.includes(domain)) {
    return "Please use your real email address — test emails won't receive our confirmation link.";
  }

  return null; // ✅ Email passed all checks
}