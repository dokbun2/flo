# Design Document

## Overview

The flower shop homepage is built using Next.js 14+ with App Router, TypeScript, and Tailwind CSS. The page follows a vertical stack layout pattern with clearly defined sections that guide users from hero content through categories to product displays. The design emphasizes visual appeal with high-quality product imagery, smooth interactions, and a mobile-first responsive approach.

The architecture leverages Next.js server components for initial page load performance, with client components used selectively for interactive elements like carousels and sliders.

## Architecture

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (for Carousel, Card, Button primitives)
- **Image Optimization**: next/image
- **State Management**: React hooks (useState, useEffect) for client components
- **Data Fetching**: Server-side data fetching with async/await in Server Components

### Page Structure

```
app/
├── (main)/
│   ├── layout.tsx          # Contains Header and Footer
│   └── page.tsx            # Homepage (this design)
└── ...

components/
├── domain/
│   └── product/
│       └── ProductCard.tsx # Reusable product card
├── ui/                     # shadcn/ui components
│   ├── carousel.tsx
│   ├── card.tsx
│   └── button.tsx
└── homepage/
    ├── HeroCarousel.tsx
    ├── CategoryQuickNav.tsx
    ├── ProductSlider.tsx
    ├── ProductGrid.tsx
    ├── WideBanner.tsx
    └── PromotionalBanners.tsx

lib/
└── utils.ts               # Utility functions (formatPrice, cn, etc.)
```

## Components and Interfaces

### 1. ProductCard Component

**Location**: `src/components/domain/product/ProductCard.tsx`

**Purpose**: Core reusable component for displaying product information consistently across the site.

**Props Interface**:
```typescript
interface ProductCardProps {
  imageUrl: string;
  title: string;
  price: number;
  originalPrice?: number;
  reviewCount?: number;
  rating?: number;
  productId: string;
  href?: string;
}
```

**Design Details**:
- Uses Next.js Image component with aspect-square class for 1:1 ratio
- Implements hover effects (scale transform, shadow increase)
- Displays discount badge when originalPrice is provided
- Shows star rating icons when rating is provided
- Clickable card that navigates to product detail page
- Responsive text sizing (smaller on mobile)

**Visual Hierarchy**:
1. Product image (dominant visual element)
2. Product title (truncated to 2 lines with ellipsis)
3. Price information (original price struck through, sale price prominent)
4. Rating and review count (subtle, informational)

### 2. HeroCarousel Component

**Location**: `src/components/homepage/HeroCarousel.tsx`

**Purpose**: Auto-playing carousel showcasing featured promotions and seasonal collections.

**Props Interface**:
```typescript
interface HeroSlide {
  id: string;
  imageUrl: string;
  alt: string;
  href?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoPlayInterval?: number; // default: 5000ms
}
```

**Design Details**:
- Built using shadcn/ui Carousel component with Embla Carousel
- Client component (uses useState, useEffect for auto-play)
- Full-width container with max-width constraint
- Height: 400px (desktop), 300px (mobile)
- Auto-play with pause on hover
- Keyboard navigation support (arrow keys)
- Touch/swipe gestures on mobile
- Dot indicators with active state styling
- Previous/Next arrow buttons with hover states
- Smooth transitions (300ms ease-in-out)

### 3. CategoryQuickNav Component

**Location**: `src/components/homepage/CategoryQuickNav.tsx`

**Purpose**: Grid of category shortcuts for quick navigation.

**Props Interface**:
```typescript
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
}

interface CategoryQuickNavProps {
  categories: Category[];
}
```

**Design Details**:
- Server component (static content)
- Grid layout: 4 columns (desktop), 2 columns (mobile)
- Each category item:
  - Icon (48px × 48px, centered)
  - Label (14px, centered below icon)
  - Hover effect (background color change, scale)
  - Rounded corners (border-radius: 12px)
  - Padding: 24px vertical, 16px horizontal
- Gap between items: 16px
- Icons use lucide-react or custom SVG icons

### 4. ProductSlider Component

**Location**: `src/components/homepage/ProductSlider.tsx`

**Purpose**: Horizontal scrollable carousel for product collections (MD recommendations, new products).

**Props Interface**:
```typescript
interface Product {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  originalPrice?: number;
  reviewCount?: number;
  rating?: number;
}

interface ProductSliderProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
}
```

**Design Details**:
- Client component (uses Carousel for scrolling)
- Section title (H2, 24px, bold) with optional "View All" link
- Shows 4 products on desktop, 2 on tablet, 1.5 on mobile (peek effect)
- Horizontal scroll with arrow navigation
- Scroll snap behavior for smooth alignment
- Gap between cards: 16px
- Uses ProductCard component for each item
- Loading state with skeleton cards

### 5. ProductGrid Component

**Location**: `src/components/homepage/ProductGrid.tsx`

**Purpose**: Static grid display for best-selling products.

**Props Interface**:
```typescript
interface ProductGridProps {
  title: string;
  products: Product[];
  columns?: number; // default: 4
}
```

**Design Details**:
- Server component (static grid)
- Section title (H2, 24px, bold)
- Grid layout: 4 columns (desktop), 2 columns (mobile)
- Displays exactly 8 products (2 rows on desktop)
- Gap between cards: 16px
- Uses ProductCard component for each item
- No scrolling, fixed display

### 6. WideBanner Component

**Location**: `src/components/homepage/WideBanner.tsx`

**Purpose**: Full-width promotional banner with click-through.

**Props Interface**:
```typescript
interface WideBannerProps {
  imageUrl: string;
  alt: string;
  href: string;
  height?: number; // default: 200px
}
```

**Design Details**:
- Server component (static image)
- Full-width container with max-width constraint
- Next.js Image with fill layout
- Aspect ratio maintained via container height
- Hover effect (slight opacity change)
- Clickable (wraps in Link component)
- Rounded corners (border-radius: 8px)
- Margin: 40px top and bottom

### 7. PromotionalBanners Component

**Location**: `src/components/homepage/PromotionalBanners.tsx`

**Purpose**: Grid of 4 promotional cards (트렌드픽, 정기구독, 매거진, 이벤트).

**Props Interface**:
```typescript
interface PromoBanner {
  id: string;
  title: string;
  imageUrl: string;
  href: string;
}

interface PromotionalBannersProps {
  banners: PromoBanner[];
}
```

**Design Details**:
- Server component (static grid)
- Grid layout: 4 columns (desktop), 2×2 (mobile)
- Each banner card:
  - Image with overlay gradient
  - Title text overlaid on image (white, bold, 18px)
  - Hover effect (scale, brightness increase)
  - Rounded corners (border-radius: 12px)
  - Aspect ratio: 4:3
- Gap between cards: 16px

## Data Models

### Product Type

```typescript
interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating?: number;
  reviewCount?: number;
  category: string;
  tags: string[];
  inStock: boolean;
  createdAt: Date;
  salesCount: number;
}
```

### Category Type

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  productCount: number;
}
```

### Banner Type

```typescript
interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  mobileImageUrl?: string;
  href: string;
  alt: string;
  displayOrder: number;
  isActive: boolean;
}
```

## Page Layout Flow

The homepage follows this vertical structure:

```
┌─────────────────────────────────────┐
│         Header (from layout)        │
├─────────────────────────────────────┤
│         HeroCarousel                │
│         (400px / 300px)             │
├─────────────────────────────────────┤
│      CategoryQuickNav               │
│      (8 categories, 4×2 / 2×4)      │
├─────────────────────────────────────┤
│      PromotionalBanners             │
│      (4 banners, 4×1 / 2×2)         │
├─────────────────────────────────────┤
│      Spacer (40px)                  │
├─────────────────────────────────────┤
│      ProductSlider                  │
│      "MD의 추천"                     │
├─────────────────────────────────────┤
│      Spacer (40px)                  │
├─────────────────────────────────────┤
│      ProductSlider                  │
│      "신상품"                        │
├─────────────────────────────────────┤
│      WideBanner                     │
│      (Subscription promo)           │
├─────────────────────────────────────┤
│      Spacer (40px)                  │
├─────────────────────────────────────┤
│      ProductGrid                    │
│      "베스트셀러" (8 products)       │
├─────────────────────────────────────┤
│      Spacer (60px)                  │
├─────────────────────────────────────┤
│         Footer (from layout)        │
└─────────────────────────────────────┘
```

## Styling Guidelines

### Color Palette

```typescript
// Tailwind config extension
colors: {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',  // Main brand color
    600: '#16a34a',
    700: '#15803d',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    500: '#737373',
    700: '#404040',
    900: '#171717',
  }
}
```

### Typography

- **Headings (H2)**: 24px, font-bold, text-neutral-900
- **Product Title**: 16px, font-semibold, text-neutral-900
- **Price**: 16px, font-bold, text-primary-600
- **Original Price**: 14px, line-through, text-neutral-400
- **Body Text**: 14px, text-neutral-700
- **Small Text**: 12px, text-neutral-500

### Spacing

- **Section Spacing**: 40px between major sections
- **Card Gap**: 16px between cards in grids/sliders
- **Container Padding**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Max Width**: 1280px (centered with mx-auto)

### Responsive Breakpoints

```typescript
// Tailwind default breakpoints
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
```

### Animations

- **Hover Scale**: scale-105 (transform: scale(1.05))
- **Transition Duration**: 200ms (transition-all duration-200)
- **Carousel Transition**: 300ms ease-in-out
- **Loading Skeleton**: pulse animation

## Error Handling

### Image Loading Errors

- Implement fallback placeholder image for failed product images
- Use Next.js Image onError handler
- Display gray placeholder with icon when image fails to load

```typescript
const [imageError, setImageError] = useState(false);

<Image
  src={imageError ? '/placeholder-product.png' : imageUrl}
  onError={() => setImageError(true)}
  alt={title}
/>
```

### Empty States

- **No Products**: Display message "상품이 없습니다" with icon
- **No Banners**: Hide section entirely if no banners available
- **Loading State**: Show skeleton loaders during data fetch

### Network Errors

- Implement error boundaries for component-level errors
- Display user-friendly error messages
- Provide retry mechanism for failed data fetches

## Testing Strategy

### Unit Tests

- **ProductCard**: Test rendering with various prop combinations
- **formatPrice**: Test number formatting with different inputs
- **Utility Functions**: Test helper functions in isolation

### Component Tests

- **HeroCarousel**: Test auto-play, navigation, keyboard controls
- **ProductSlider**: Test scrolling behavior, responsive display
- **CategoryQuickNav**: Test link navigation, hover states

### Integration Tests

- **Homepage**: Test full page rendering with mock data
- **Responsive Behavior**: Test layout changes across breakpoints
- **Navigation**: Test all links navigate to correct routes

### Visual Regression Tests

- Capture screenshots of homepage at different viewport sizes
- Compare against baseline images to detect unintended visual changes

### Performance Tests

- Measure Largest Contentful Paint (LCP) < 2.5s
- Measure First Input Delay (FID) < 100ms
- Measure Cumulative Layout Shift (CLS) < 0.1
- Test image lazy loading behavior
- Verify Next.js Image optimization is working

### Accessibility Tests

- Verify keyboard navigation works for all interactive elements
- Test screen reader compatibility
- Check color contrast ratios meet WCAG AA standards
- Verify all images have appropriate alt text
- Test with automated tools (axe, Lighthouse)

## Performance Optimization

### Image Optimization

- Use Next.js Image component with appropriate sizes prop
- Implement priority loading for hero carousel images
- Use lazy loading for below-the-fold images
- Serve WebP format with fallbacks
- Define explicit width/height to prevent layout shift

### Code Splitting

- Use dynamic imports for client components when appropriate
- Separate carousel library code into separate chunk
- Lazy load non-critical components

### Data Fetching

- Fetch product data server-side for initial render
- Implement caching strategy for product lists
- Use React Suspense for streaming server components
- Consider implementing ISR (Incremental Static Regeneration) for product data

### Bundle Size

- Tree-shake unused UI components
- Use modular imports for icon libraries
- Minimize client-side JavaScript
- Analyze bundle with @next/bundle-analyzer

## Accessibility

- All interactive elements have focus states
- Carousel has aria-labels and role="region"
- Product cards have semantic HTML structure
- Images have descriptive alt text
- Color contrast meets WCAG AA standards (4.5:1 for text)
- Keyboard navigation fully supported
- Skip links for screen readers
- Proper heading hierarchy (H1 in header, H2 for sections)
