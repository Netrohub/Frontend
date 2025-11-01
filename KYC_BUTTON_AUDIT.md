# KYC Button Not Showing - Audit Report

## Issue
The "ابدأ عملية التحقق" (Start Verification) button is not appearing on the KYC page (`/kyc`).

## Root Causes Identified

### 1. **hasLoadedOnce State Never Gets Set**
**Problem**: The `hasLoadedOnce` state controls when the button becomes visible. It was only checking `!isLoading`, but when React Query's `enabled: !!user` is false (user not authenticated), `isLoading` might remain `false` without the query ever running.

**Location**: `frontend/src/pages/KYC.tsx:104-110`

**Fix Applied**:
- Added `isFetched` from React Query to reliably detect when query completes
- Changed condition to check `user && isFetched` instead of just `!isLoading`
- Added fallback logic for compatibility

### 2. **canStartVerification Missing User Check**
**Problem**: `canStartVerification` didn't check if user is authenticated before allowing button to show.

**Location**: `frontend/src/pages/KYC.tsx:241-256`

**Fix Applied**:
- Added `if (!user) return false;` check at the start of `canStartVerification`
- Added `user` to dependency array

### 3. **Loading State Condition**
**Problem**: Loading state check `isLoading && kyc === undefined` might not account for when user is not authenticated.

**Location**: `frontend/src/pages/KYC.tsx:274`

**Fix Applied**:
- Changed to `isLoading && (!user || kyc === undefined)`

### 4. **Enhanced Debug Information**
**Problem**: Limited debug info made it hard to diagnose the issue.

**Location**: `frontend/src/pages/KYC.tsx:302-307`

**Fix Applied**:
- Added comprehensive debug panel showing:
  - `user`: Whether user is authenticated
  - `isLoading`: Query loading state
  - `hasLoadedOnce`: Whether initial load completed
  - `hasKyc`: Whether KYC record exists
  - `status`: Current KYC status
  - `canStart`: Whether button should show
  - `kyc`: Raw kyc data value (null/undefined/object)

## Changes Made

### File: `frontend/src/pages/KYC.tsx`

1. **Added `isFetched` to useQuery** (line 24):
   ```typescript
   const { data: kyc, isLoading, error: kycError, refetch, isRefetching, isFetched } = useQuery({
   ```

2. **Fixed hasLoadedOnce useEffect** (lines 104-116):
   ```typescript
   useEffect(() => {
     if (user && isFetched && !hasLoadedOnce) {
       setHasLoadedOnce(true);
     } else if (user && !isLoading && (kyc !== undefined || kycError) && !hasLoadedOnce) {
       setHasLoadedOnce(true);
     }
   }, [user, isLoading, isFetched, kyc, kycError, hasLoadedOnce]);
   ```

3. **Added user check to canStartVerification** (lines 241-256):
   ```typescript
   const canStartVerification = useMemo(() => {
     if (!user) {
       return false;
     }
     // ... rest of logic
   }, [user, hasLoadedOnce, hasKyc, isFailed, isExpired, createKycMutation.isPending, isPending]);
   ```

4. **Fixed loading condition** (line 274):
   ```typescript
   {isLoading && (!user || kyc === undefined) ? (
   ```

5. **Enhanced debug panel** (lines 302-307):
   ```typescript
   Debug: user={user ? 'yes' : 'no'}, isLoading={String(isLoading)}, hasLoadedOnce={String(hasLoadedOnce)}, hasKyc={String(hasKyc)}, status={kycStatus || 'null'}, canStart={String(canStartVerification)}, kyc={kyc === null ? 'null' : kyc === undefined ? 'undefined' : 'object'}
   ```

## Testing Checklist

- [ ] Button shows when user is authenticated and has no KYC record
- [ ] Button shows when user is authenticated and KYC status is `failed`
- [ ] Button shows when user is authenticated and KYC status is `expired`
- [ ] Button does NOT show when user is authenticated and KYC status is `pending`
- [ ] Button does NOT show when user is authenticated and KYC status is `verified`
- [ ] Button does NOT show when user is not authenticated
- [ ] Button does NOT flash/disappear during refetches
- [ ] Debug panel shows correct values in development mode

## Expected Behavior

1. **User authenticated, no KYC**: Button should appear after initial load completes
2. **User authenticated, KYC pending**: Button should NOT appear
3. **User authenticated, KYC verified**: Button should NOT appear
4. **User authenticated, KYC failed/expired**: Button should appear
5. **User not authenticated**: Button should NOT appear (login prompt shows instead)

## Next Steps

1. Deploy changes and test in production
2. Monitor debug panel (development mode) to verify state values
3. Remove debug panel before production deployment (or keep if useful)
4. Test all scenarios listed in testing checklist

