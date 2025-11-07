# Requirements Document

## Introduction

This document defines the requirements for the main homepage of a flower shop e-commerce website. The homepage serves as the primary entry point for users, showcasing featured products, categories, and promotional content to drive engagement and conversions. The design is inspired by modern Korean flower shop aesthetics with a focus on visual appeal and intuitive navigation.

## Glossary

- **Homepage**: The main landing page of the flower shop website (src/app/(main)/page.tsx)
- **ProductCard**: A reusable component displaying product information including image, title, price, and optional discount/rating
- **HeroCarousel**: An auto-playing image carousel showcasing featured promotions or seasonal collections
- **CategoryQuickNav**: A grid of clickable category shortcuts with icons and labels
- **ProductSlider**: A horizontal scrollable carousel displaying multiple ProductCard components
- **ProductGrid**: A responsive grid layout displaying multiple ProductCard components
- **WideBanner**: A full-width promotional banner image with click-through functionality
- **Navigation System**: The header menu structure including main categories and subcategories
- **User**: Any visitor to the website, whether new or returning

## Requirements

### Requirement 1

**User Story:** As a User, I want to see an attractive hero section when I land on the homepage, so that I can immediately understand current promotions and featured collections

#### Acceptance Criteria

1. WHEN the Homepage loads, THE HeroCarousel SHALL display a full-width image slider
2. THE HeroCarousel SHALL automatically transition between slides every 5 seconds
3. THE HeroCarousel SHALL provide left and right arrow controls for manual navigation
4. THE HeroCarousel SHALL display dot indicators at the bottom showing the current slide position
5. THE HeroCarousel SHALL render at 400px height on desktop viewports and 300px height on mobile viewports

### Requirement 2

**User Story:** As a User, I want to quickly access main product categories, so that I can browse products that interest me without navigating through multiple pages

#### Acceptance Criteria

1. WHEN the Homepage loads, THE CategoryQuickNav SHALL display below the HeroCarousel
2. THE CategoryQuickNav SHALL include exactly 8 category shortcuts: "꽃다발", "꽃바구니", "꽃집자", "관엽식물", "동양란", "서양란", "축하화환", "근조화환"
3. THE CategoryQuickNav SHALL display categories in a 4-column grid on desktop viewports
4. THE CategoryQuickNav SHALL display categories in a 2-column grid on mobile viewports
5. WHEN a User clicks a category, THE Navigation System SHALL navigate to the corresponding category page

### Requirement 3

**User Story:** As a User, I want to see curated product recommendations, so that I can discover products selected by experts

#### Acceptance Criteria

1. WHEN the Homepage loads, THE ProductSlider SHALL display a section titled "MD의 추천"
2. THE ProductSlider SHALL display 4 ProductCard components simultaneously on desktop viewports
3. THE ProductSlider SHALL support horizontal scrolling to view additional products
4. THE ProductSlider SHALL display 2 ProductCard components simultaneously on mobile viewports
5. WHEN a User clicks a ProductCard, THE Navigation System SHALL navigate to the product detail page

### Requirement 4

**User Story:** As a User, I want to see newly added products, so that I can stay updated with the latest offerings

#### Acceptance Criteria

1. WHEN the Homepage loads, THE ProductSlider SHALL display a section titled "신상품" below the "MD의 추천" section
2. THE ProductSlider SHALL use the same layout and behavior as the "MD의 추천" section
3. THE ProductSlider SHALL fetch and display products sorted by creation date in descending order
4. THE ProductSlider SHALL display at least 8 products when available
5. THE ProductSlider SHALL include visual spacing of 40px above the section

### Requirement 5

**User Story:** As a User, I want to see promotional banners for special services, so that I can learn about subscription services and events

#### Acceptance Criteria

1. WHEN the Homepage loads, THE WideBanner SHALL display between product sections
2. THE WideBanner SHALL render as a full-width clickable image
3. WHEN a User clicks the WideBanner, THE Navigation System SHALL navigate to the associated promotional page
4. THE WideBanner SHALL maintain aspect ratio across different viewport sizes
5. THE WideBanner SHALL include visual spacing of 40px above and below the banner

### Requirement 6

**User Story:** As a User, I want to see best-selling products, so that I can make informed purchasing decisions based on popularity

#### Acceptance Criteria

1. WHEN the Homepage loads, THE ProductGrid SHALL display a section titled "베스트셀러"
2. THE ProductGrid SHALL display products in a 4-column grid layout on desktop viewports
3. THE ProductGrid SHALL display products in a 2-column grid layout on mobile viewports
4. THE ProductGrid SHALL display exactly 8 ProductCard components (2 rows on desktop)
5. THE ProductGrid SHALL fetch and display products sorted by sales volume in descending order

### Requirement 7

**User Story:** As a User, I want to see consistent product information across all product displays, so that I can easily compare products

#### Acceptance Criteria

1. THE ProductCard SHALL display a product image with 1:1 aspect ratio (square)
2. THE ProductCard SHALL display the product title in 16px bold font
3. THE ProductCard SHALL display the sale price in 16px bold font with primary brand color
4. WHERE a product has a discount, THE ProductCard SHALL display the original price with strikethrough styling in 14px gray font
5. WHERE a product has reviews, THE ProductCard SHALL display the average rating as star icons and review count in 12px font

### Requirement 8

**User Story:** As a User, I want prices to be formatted clearly, so that I can easily read and understand product costs

#### Acceptance Criteria

1. THE ProductCard SHALL format all price values using a formatPrice utility function
2. THE formatPrice function SHALL add thousand separators (commas) to numeric values
3. THE formatPrice function SHALL append the Korean Won symbol (₩) to formatted prices
4. THE ProductCard SHALL display formatted prices consistently across all instances
5. THE formatPrice function SHALL handle both integer and decimal price values

### Requirement 9

**User Story:** As a User, I want to access special promotional sections, so that I can explore trending products, subscriptions, magazine content, and events

#### Acceptance Criteria

1. WHEN the Homepage loads, THE Homepage SHALL display 4 promotional banner cards below the CategoryQuickNav
2. THE promotional banners SHALL include: "트렌드픽", "정기구독", "매거진", "이벤트"
3. THE promotional banners SHALL display in a 4-column grid on desktop viewports
4. THE promotional banners SHALL display in a 2x2 grid on mobile viewports
5. WHEN a User clicks a promotional banner, THE Navigation System SHALL navigate to the corresponding section page

### Requirement 10

**User Story:** As a User, I want the homepage to load quickly and smoothly, so that I can start browsing without delays

#### Acceptance Criteria

1. THE Homepage SHALL use Next.js Image component for all product and banner images
2. THE Homepage SHALL implement lazy loading for images below the fold
3. THE Homepage SHALL display loading skeletons while ProductCard components are fetching data
4. THE Homepage SHALL complete initial render within 2 seconds on standard broadband connections
5. THE Homepage SHALL be responsive and functional across viewport widths from 320px to 1920px
