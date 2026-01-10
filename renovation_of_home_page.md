Objective: Create a clean, minimal, and typographically-driven homepage that prioritizes content discovery and reading, emulating the sophisticated yet unobtrusive user experience of Medium.

1. Overall Design Philosophy
Clarity First: The interface must be instantly understandable. Every element should have a clear purpose, with no visual clutter or ambiguity.

Content is the Interface: The blog posts are the primary UI elements. The design should frame and highlight the content, not compete with it.

Consistency: Maintain consistent spacing, typography, and interactive behaviors across all elements to make users feel "at home".

Answer Key Questions Quickly: The layout should immediately communicate who you are, what the blog is about, and how it helps the reader.

2. Layout & Grid Structure
Central Focus: Use a centered, single-column layout for the main content stream. Maximum width should be 700px - 800px for optimal line length and readability.

Header: Fixed or sticky at the top. Contains:

Left: Blog logo/name (links to homepage).

Center (Optional): A minimal navigation (e.g., "Home", "Archive").

Right: A "Write" button (for /admin access) and a user avatar/icon.

Hero Section (Optional): A simple, spacious section at the very top with:

A one-line tagline describing the blog's purpose.

Possibly a brief, 1-2 sentence introduction.

Content Feed: The primary list of blog previews. Each preview is a distinct card with generous padding.

3. Typography System (Critical)
Font Family: Use a clean, highly-readable serif font for body text and headings (e.g., Charter, Source Serif Pro, Lora). Sans-serif for UI elements (buttons, metadata).

Visual Hierarchy:

Post Title: font-size: 1.875rem (30px) / font-weight: 700 / line-height: 1.2. Dark gray (e.g., #292929).

Post Excerpt/Snippet: font-size: 1.125rem (18px) / font-weight: 400 / line-height: 1.6. Medium gray (e.g., #757575). Limit to 2-3 lines.

Post Metadata (Category, Date, Read Time): font-size: 0.875rem (14px) / font-weight: 400. Light gray (e.g., #959595).

White Space: Ample use of white (negative) space is non-negotiable. Use it to:

Separate content cards (margin-bottom: 3rem).

Create clear visual groups within a card (e.g., space between title and excerpt).

Increase comprehension and reduce visual noise.

4. Color & Visual Style
Palette:

Background: Pure white (#FFFFFF).

Text: Near-black (#292929), medium gray (#757575), light gray (#959595).

Accent: A single, subtle color for interactive elements (links, hover states). A calm blue (#1a8917 - Medium's green, or #3b82f6) works well.

Post Cards:

No borders, no colored backgrounds.

Subtle shadow or border on hover only to indicate interactivity (e.g., box-shadow: 0 2px 8px rgba(0,0,0,0.08)).

Category Tags: Use a very light background (e.g., #f2f2f2) and the light gray text. Rounded corners.

5. Interactive Elements & Feedback
Clear Feedback: All interactive elements (links, cards) must have a visible hover state (color change, underline, or shadow).

Post Card Interaction: Clicking anywhere on a post card (title, excerpt, whitespace) should navigate to the full article.

"Load More": Prefer a "Load More" button at the bottom of the feed over infinite scroll for user control.

6. Responsive Behavior
Mobile-First: The single-column layout naturally adapts.

Adjustments:

Reduce horizontal padding on smaller screens.

Slightly reduce font sizes for titles and excerpts on mobile.

Ensure the header compresses neatly.

To successfully implement this, the LLM should treat typography and white space as the core visual design tools. The final look should feel quiet, professional, and entirely focused on getting the user to start reading.