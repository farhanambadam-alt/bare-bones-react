# Performance Optimization for Flutter WebView

## Problem

The app feels laggy in a Flutter WebView, especially the bottom navigation bar. WebViews on low-end Android devices have limited GPU compositing, slower JS execution, and constrained memory compared to native browsers.

## Root Causes Identified

1. **GenderBackground SVG** -- 28 dots + 18 sparkles with continuous SVG `<animate>` running indefinitely. These never pause, consuming CPU even when invisible.
2. **BottomNav spotlight** -- Uses `filter: blur(6px)`, `clipPath`, `maskImage`, and `backdrop-blur-xl` simultaneously. On WebView, each of these triggers separate compositing layers and repaints.
3. `**backdrop-blur-xl**` on the nav bar itself -- extremely expensive on low-end WebView renderers.
4. `**willChange: 'left'**` on spotlight -- animating `left` triggers layout recalculation. Should use `transform: translateX()` instead.
5. **Multiple box-shadows** on the light capsule (triple layered `boxShadow`) -- triggers paint on every frame during transition.
6. **Carousel auto-play** -- `setInterval` running continuously, triggering re-renders even when off-screen.
7. **No lazy loading of routes** -- all page components are eagerly imported, increasing initial JS parse/execute time.
8. **Missing `React.memo**` on pure list-item components (NearbySalonCard, CategoryChips items).

## Optimization Plan

### 1. BottomNav -- GPU-friendly spotlight animation

- Replace `left` positioning with `transform: translateX()` for the spotlight (GPU-composited, no layout thrashing)
- Replace `filter: blur(6px)` on the beam with a pre-blurred gradient (fake the blur with softer gradient stops -- visually identical, zero filter cost)
- Replace `backdrop-blur-xl` with a solid `bg-[rgba(20,20,25,0.94)]` -- nearly identical appearance, eliminates the single most expensive effect
- Simplify the triple `boxShadow` on the capsule to a single softer shadow
- Remove `willChange: 'left'` (no longer needed with transform)
- Add `will-change: transform` only on the spotlight container

### 2. GenderBackground -- reduce animation overhead

- Replace SVG `<animate>` elements with CSS animations using `animation-play-state` and `@media (prefers-reduced-motion)`
- Reduce dot/sparkle count from 46 to ~20 (visually indistinguishable on small screens) while slighlty increasing the size to 5%
- Add `contain: strict` on the background container to isolate its paint from the rest of the DOM
- Use `visibility: hidden` instead of `opacity: 0` for the inactive gender background to fully skip rendering

### 3. Route-level code splitting

- Convert all page imports in `App.tsx` to `React.lazy()` with a minimal `Suspense` fallback
- This reduces initial JS bundle parse time significantly on low-end devices

### 4. Component memoization

- Wrap `NearbySalonCard`, `CategoryChips`, `FeaturedCarousel` in `React.memo` to prevent unnecessary re-renders during navigation/state changes
- Memoize the `tabs` array and spotlight calculation with `useMemo`

### 5. FeaturedCarousel -- off-screen optimization

- Add `IntersectionObserver` to pause auto-play interval when carousel is not visible
- Use `translate3d` instead of `translateX` for the slide animation to force GPU compositing

### 6. CSS containment and compositing hints

- Add `contain: layout style paint` to card components and scroll containers
- Add `transform: translateZ(0)` (promote to compositor layer) on the nav bar container instead of relying on `backdrop-blur` for layer promotion
- Replace `transition-all` (very expensive -- transitions every property) with specific properties like `transition-property: transform, color`

### 7. Image optimization

- Add `decoding="async"` to all `<img>` tags to prevent blocking the main thread
- Add explicit `width`/`height` attributes to prevent layout shifts

## Files to Modify


| File                                  | Changes                                                                                 |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| `src/components/BottomNav.tsx`        | Transform-based spotlight, remove backdrop-blur, simplify shadows, specific transitions |
| `src/components/GenderBackground.tsx` | Reduce elements, CSS animations, visibility toggle, containment                         |
| `src/App.tsx`                         | `React.lazy` + `Suspense` for all routes                                                |
| `src/components/FeaturedCarousel.tsx` | IntersectionObserver pause, `translate3d`, `React.memo`, `decoding="async"`             |
| `src/components/NearbySalonCard.tsx`  | `React.memo`, `decoding="async"`, specific transitions                                  |
| `src/components/CategoryChips.tsx`    | `React.memo`, `decoding="async"`                                                        |
| `src/index.css`                       | Add containment utilities, replace `transition-all` patterns                            |
| `src/pages/Index.tsx`                 | `decoding="async"` on images, containment on scroll containers                          |


## Visual Impact

All animations and UI/UX effects are preserved. The changes are purely rendering-pipeline optimizations -- swapping expensive browser features for visually equivalent but cheaper alternatives.