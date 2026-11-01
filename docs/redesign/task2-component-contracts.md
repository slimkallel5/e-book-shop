# Task 2: Component Contracts & Integration Conventions

## 1. Overview

This document defines the interface specifications, design system integration rules, lifecycle expectations, and RTL guidelines established in Task 2.
These contracts serve as the shared architectural foundation for **Task 3 (Storefront Redesign)** and **Task 4 (Transactional & Administrative UI)** to work safely without merge conflicts.

---

## 2. Design System Tokens (`apps/web/src/theme/tokens.ts`)

### Color Palette
- `colors.background`: `#0D2118` — Deep atmospheric library night canvas.
- `colors.primary`: `#123B2B` — Deep Emerald Green.
- `colors.primaryLight`: `#1B543E`.
- `colors.primaryDark`: `#0A2319`.
- `colors.secondary`: `#8B5A2B` — Natural Walnut / Oak wood tone.
- `colors.accent`: `#C29B38` — Antique Muted Gold.
- `colors.accentLight`: `#E5C158` — Bright Gold for highlights and active controls.
- `colors.glassBgDark`: `rgba(18, 59, 43, 0.72)` — High-contrast translucent emerald panel.
- `colors.glassBorderDark`: `rgba(229, 193, 88, 0.25)` — Subtle golden rim.

### Breakpoints
```typescript
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};
```

---

## 3. UI Primitives Contracts

### `GlassCard` (`apps/web/src/components/ui/GlassCard.tsx`)
```typescript
export interface GlassCardProps extends ViewProps {
  children?: React.ReactNode;
  variant?: 'light' | 'dark' | 'ultraDark' | 'goldGlow';
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'glow';
  hasBorder?: boolean;
  isInteractive?: boolean;
}
```
**Integration Convention:**
- Use `variant="dark"` for standard content containers and product cards.
- Use `variant="goldGlow"` for featured highlights or active selections.
- Set `isInteractive={true}` on clickable cards to enable GPU-accelerated hover elevation.

### `Button` (`apps/web/src/components/ui/Button.tsx`)
```typescript
export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  tooltip?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}
```
**Integration Convention:**
- Use `variant="accent"` for primary call-to-actions (e.g., Checkout, Add to Cart).
- Use `variant="glass"` for secondary or floating actions on top of the 3D scene.

---

## 4. 3D Environment Contracts

### `ThreeDScene` (`apps/web/src/components/3d/ThreeDScene.tsx`)
```typescript
export interface ThreeDSceneProps {
  children?: React.ReactNode;
  showFloatingBooks?: boolean;
  intensity?: number;
  interactiveCamera?: boolean;
}
```
**Integration Convention:**
- Wraps root-level storefront pages.
- Automatically handles:
  1. WebGL support check and fallback to static asset when unavailable.
  2. Canvas lifecycle, resize listener, and frame loop cleanup.
  3. Context loss (`webglcontextlost`) and recreation.
  4. Accessibility check: disables floating animations when `prefers-reduced-motion` is detected.

### `Book3D` (`apps/web/src/components/3d/Book3D.tsx`)
```typescript
export interface Book3DProps {
  coverUrl?: string;
  width?: number;
  height?: number;
  depth?: number;
  interactive?: boolean;
  onPress?: () => void;
  style?: any;
}
```
**Integration Convention:**
- Preserves the A4 portrait ratio (`height = width * 1.414`).
- Loads high-resolution cover textures asynchronously while showing a subtle loading placeholder.
- Supports pointer-following 3D rotation (`interactive={true}`) and fallback to 2D image thumbnail when WebGL is absent.

---

## 5. Multilingual & RTL Implementation Rules

1. **Directional Ordering:**
   - Every row container with directional meaning must apply:
   ```typescript
   { flexDirection: isRTL ? 'row-reverse' : 'row' }
   ```
2. **Text Alignment:**
   - Always align text conditionally based on `isRTL`:
   ```typescript
   { textAlign: isRTL ? 'right' : 'left' }
   ```
3. **No Hardcoded Translations:**
   - All strings must resolve via `t('key')` from `useLanguage()`.
   - New keys must be registered across `ar.json`, `fr.json`, and `en.json`.
