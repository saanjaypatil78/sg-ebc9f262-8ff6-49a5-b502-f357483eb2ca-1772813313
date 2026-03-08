# P0: Auth (Registration + Login) Triage — Bravecom/Sunray

## Symptoms (production)
1) **Login fails with:** `TypeError: Failed to fetch` during `supabase.auth.signInWithPassword(...)`
2) **Registration fails with:** “Invalid referral code” for real codes like `INVEST2025`
3) Logo on Login must be Bravecom PNG:
   - `/WhatsApp_Image_2026-01-27_at_23.16.51-removebg-preview.png`

---

## What “Failed to fetch” means here (highest priority)
This error means the browser could not complete the network request to Supabase at all (not “wrong password”, not RBAC).

### Most common root cause (platform-managed Vercel)
**Production environment variables missing / incorrect**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- (recommended) `NEXT_PUBLIC_SITE_URL=https://bravecom.info`

**Repo evidence:** Supabase client uses non-null assertions:
```ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```
So builds can succeed even if production env vars are not set, and runtime then fails with `Failed to fetch`.

### How to verify in 30 seconds (hard proof)
DevTools → Network → Click “Sign In”:
- Look for request to: `https://<project>.supabase.co/auth/v1/token?grant_type=password`
  - If host is missing / malformed / `undefined` → env vars missing.
  - If correct host but blocked (`(blocked:cors)` / `(failed)`), check extensions/firewall/CORS.

### Required action (no code can bypass this)
In the platform-managed Vercel deployment, add the env vars to **Production** and redeploy.

---

## Referral Code failure (separate P0)
### Why it’s happening
Referral validation is inconsistent across the app and can be blocked by RLS for guest/anon registration.

**Repo evidence:** `user_profiles` is referenced **19 places** across pages/services. That implies multiple legacy/new sources exist and the app is not using one canonical resolver.

### Requirement
Support both:
- **A (modern):** `profiles`, `investor_network`
- **B (legacy):** `users`, `user_profiles`

### One-shot solution (non-breaking)
Create one DB function (RPC) callable by `anon` + `authenticated`:
- `resolve_referrer_user_id_v1(code text) -> uuid | null`
- It checks the known sources in a safe priority order and returns the referrer’s user_id.
- Registration and all referral validation must call this RPC (not query tables directly).

This prevents:
- UI hardcoding a single table that may not contain the referral code
- RLS blocking anon reads on tables during registration

---

## Logo requirement
Login page must use:
- `/WhatsApp_Image_2026-01-27_at_23.16.51-removebg-preview.png`

---

## Security P0 (must fix)
`public/RBAC_CREDENTIALS.txt` is publicly accessible. This must be removed/moved out of `/public` immediately.

---

## Test Matrix (must pass before closing P0)

### Registration
- Register with valid referral code (alphanumeric like `INVEST2025`) → success
- Register with invalid referral code → fails with friendly message
- Register with referral link (uuid as `ref`) → success
- Verify DB records created/updated in the intended tables (profiles/users/user_profiles as configured)

### Login (must not show “Failed to fetch”)
- Login using Supabase Auth users for each role:
  - REGISTERED, INVESTOR, VENDOR, FINANCE, COMPLIANCE, ADMIN, SUPER_ADMIN, ROOT
Expected:
- Success toast
- Redirect to correct dashboard
- Session persists after refresh

---

## One-shot implementation checklist (code + config)
1) Fix Vercel Production env vars for Supabase + redeploy (mandatory)
2) Implement RPC `resolve_referrer_user_id_v1` (A + B)
3) Update registration page + referralService to use RPC only
4) Harden authService to fetch role/profile from canonical table(s) with fallback
5) Fix login logo
6) Remove public credentials file
7) Run Bug Finder (lint + tsc + runtime) and complete test matrix