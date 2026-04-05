# Green Empire Nursery

## Current State
The review system exists in the frontend (App.tsx) with three hardcoded sample reviews and a submission form. New reviews submitted by users are stored in React `useState` only -- they are lost on page refresh and are not visible to other users. The backend (main.mo) is an empty actor.

## Requested Changes (Diff)

### Add
- Motoko backend: `Review` type with name, location, text, rating (Nat), and timestamp fields
- Backend `submitReview(name, location, text, rating)` function that appends and persists the review
- Backend `getReviews()` function that returns all reviews sorted newest-first
- Frontend: on page load, fetch all reviews from backend via actor call
- Frontend: on form submit, call backend `submitReview` then refresh the list
- Frontend: loading state while reviews are being fetched

### Modify
- Replace `userReviews` useState with backend-driven review list
- Keep the three existing sample reviews as seed data in the backend so the page is never empty
- Review count in heading should reflect actual stored count

### Remove
- Hardcoded `REVIEWS` constant used as fallback (will be seeded in backend instead)

## Implementation Plan
1. Add `Review` type and stable storage array to main.mo
2. Implement `getReviews()` and `submitReview()` public functions
3. Seed three initial reviews on first deploy
4. Regenerate backend bindings
5. Update App.tsx to call backend actor on mount and on submit
6. Add loading skeleton while fetching
7. Validate and build
