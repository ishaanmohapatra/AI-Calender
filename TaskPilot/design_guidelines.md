# Design Guidelines: AI-Powered Calendar App

## Design Approach
**Reference-Based: Apple Calendar Aesthetic**

This application draws primary inspiration from Apple Calendar's clean, minimal design philosophy. The interface should feel native to macOS/iOS with smooth animations, crisp typography, and a focus on clarity and usability. The addition of an AI Copilot sidebar differentiates this from standard calendar apps while maintaining the familiar Apple design language.

## Color Palette

### Light Mode (Default)
- **Background**: #F9FAFB (soft white)
- **Primary Accent**: #007AFF (Apple blue) - for active states, CTAs, and selected elements
- **Event Colors**: Apple-style pastels
  - Blue: 210 100% 85%
  - Green: 150 60% 75%
  - Red: 0 70% 85%
  - Orange: 30 80% 80%
  - Purple: 270 60% 85%
  - Pink: 330 70% 85%

### Dark Mode
- **Background**: #1C1C1E (matte black)
- **Surface**: #2C2C2E (elevated dark)
- **Primary Accent**: #0A84FF (neon blue highlight)
- **Event Colors**: Muted neon pastels with reduced saturation
- **Text**: #FFFFFF (primary), #98989D (secondary)

## Typography
**Primary Font**: SF Pro Rounded (fallback: Inter)

- **Headings**: 
  - H1: 28px, Semi-bold (Month/Year display)
  - H2: 20px, Semi-bold (Section headers)
  - H3: 16px, Medium (Sidebar labels)
- **Body**: 
  - Regular: 14px, Regular (Event titles, general text)
  - Small: 12px, Regular (Time labels, metadata)
- **AI Copilot**: 
  - User messages: 14px, Medium
  - AI responses: 14px, Regular
  - Commands: 13px, Mono (for command palette)

## Layout System

### Spacing Units
Use Tailwind spacing: **2, 3, 4, 6, 8, 12, 16** units for consistent rhythm

### Three-Panel Layout
1. **Left Sidebar** (280px fixed):
   - Mini-month calendar (hover states with soft blue)
   - View toggles: Day / Week / Month / AI Summary
   - Upcoming events list
   - Padding: p-4

2. **Center Panel** (flex-1):
   - Apple-style calendar grid
   - Hour lines with subtle gradient time indicator
   - Rounded event blocks with soft shadows
   - Drag-and-drop zones with visual feedback
   - Padding: p-6

3. **Right Sidebar** (360px fixed, collapsible):
   - AI Copilot chat interface
   - Prompt input area (sticky bottom)
   - Suggestion chips for quick actions
   - Padding: p-4

### Responsive Breakpoints
- Desktop: All three panels visible
- Tablet: Collapse right sidebar, show toggle button
- Mobile: Stack panels, use bottom sheet for AI Copilot

## Component Library

### Calendar Grid
- **Hour Cells**: 60px height, subtle border dividers (opacity 0.1)
- **Event Blocks**: 
  - Rounded-lg (8px radius)
  - Soft shadow: 0 1px 3px rgba(0,0,0,0.1)
  - Left border: 3px solid (event color)
  - Padding: p-2
  - Smooth transitions on drag/resize

### AI Copilot Panel
- **Chat Messages**: 
  - User: Right-aligned, blue background, rounded-2xl
  - AI: Left-aligned, gray background, rounded-2xl
  - Avatar icons (16px) for each message
  - Spacing: gap-3 between messages

- **Prompt Input**: 
  - Sticky bottom with backdrop blur
  - Rounded-xl input field
  - Floating "+" button (56px) with gradient shadow
  - Voice input icon (microphone) toggle

### Floating Action Button
- **Position**: Fixed bottom-right (24px offset)
- **Size**: 64px diameter
- **Style**: Gradient from #007AFF to #0A84FF
- **Shadow**: 0 8px 24px rgba(0,122,255,0.4)
- **Icon**: Plus or microphone (animated toggle)

### Command Palette (⌘K)
- **Overlay**: Backdrop blur with dark overlay (opacity 0.4)
- **Modal**: Centered, 600px width, rounded-2xl
- **Input**: Large (18px), with icon prefix
- **Results**: List with keyboard navigation highlights

### Scenario Templates
- **Cards**: 
  - Grid layout (grid-cols-3 gap-4)
  - White background with hover lift effect
  - Icon + Title + Description
  - Border on hover: 2px solid #007AFF

## Animations

### Event Interactions
- **Drag**: Subtle scale (1.02) with elevated shadow
- **Drop**: Smooth settle animation (spring physics)
- **AI Regeneration**: Fade out old events (200ms) → Slide in new events (300ms, stagger 50ms)

### Panel Transitions
- **Sidebar Toggle**: Slide from right (300ms ease-out)
- **View Switch**: Cross-fade (200ms) between Day/Week/Month
- **AI Response**: Typing indicator → Fade in message (150ms)

### Micro-interactions
- **Hour Line**: Subtle pulse animation (1s interval)
- **Button Press**: Scale 0.95 on active
- **Event Hover**: Lift with shadow increase (0 2px 8px rgba)

**Animation Library**: Framer Motion for all transitions

## Dark Mode Implementation
- Automatic system preference detection
- Manual toggle in top-right corner
- Smooth color transition (300ms) on mode switch
- Maintain contrast ratios (WCAG AA minimum)
- Invert event colors to muted neons in dark mode
- Blur effects use darker backdrop in dark mode

## Accessibility
- Keyboard navigation for all calendar interactions
- ARIA labels for screen readers
- Focus indicators with 2px outline in accent color
- High contrast mode option
- Voice input as alternative interaction method
- Proper heading hierarchy for navigation

## Images & Visual Assets
**Icons**: Use SF Symbols style icons via Heroicons or Lucide React
- Calendar, Clock, Microphone, Settings, Moon/Sun (mode toggle)
- AI Sparkle icon for Copilot
- Command icon (⌘) for keyboard shortcuts

**No hero images required** - this is a utility-focused application where the calendar grid itself is the primary visual element.