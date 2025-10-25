# Design Guidelines: Barbershop PWA

## Design Approach
**Selected System:** Material Design 3  
**Justification:** Material Design excels at mobile-first experiences and PWAs, providing robust component patterns for chat interfaces, forms, and schedulers. Its emphasis on tactile interactions and clear feedback aligns perfectly with a service-booking application.

## Typography Hierarchy

**Primary Font:** Roboto (via Google Fonts CDN)  
**Secondary Font:** Roboto Condensed for compact information display

- **Hero/Headers:** text-4xl to text-5xl, font-bold (Roboto)
- **Section Titles:** text-2xl to text-3xl, font-semibold
- **Body Text:** text-base to text-lg, font-normal
- **Buttons/CTAs:** text-sm to text-base, font-medium, uppercase tracking-wide
- **Chat Messages:** text-sm to text-base, font-normal
- **Timestamps/Meta:** text-xs, font-normal (Roboto Condensed)

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16  
- Tight spacing: p-2, gap-2 (chat bubbles, compact lists)
- Standard spacing: p-4, gap-4 (cards, forms)
- Section padding: py-8 to py-16 (mobile to desktop)
- Container margins: mx-4 (mobile), mx-auto with max-w-6xl (desktop)

**Grid System:**
- Mobile-first single column
- Tablet (md:): 2-column for services, barber cards
- Desktop (lg:): max 3-column for barber availability

## Core Sections & Layout

### 1. App Header (Fixed)
- Slim header with barbershop logo/name (h-16)
- Hamburger menu icon (Material Icons)
- Install PWA prompt badge (when applicable)

### 2. Hero Section (60vh on mobile, 70vh on desktop)
- Bold headline: "Reserva tu cita en segundos"
- Subheading describing quick booking
- Two CTAs: "Reservar Ahora" (primary) + "Ver Barberos" (outlined)
- Background: Modern barbershop image with subtle gradient overlay
- Buttons with backdrop-blur-md background

### 3. Quick Access Bar
- Horizontal scroll pills/chips for: "Reservar", "Chat", "Mis Citas", "Servicios"
- Sticky positioning below header (top-16)

### 4. Chat Interface Section
- Full-screen modal or dedicated route
- Chat bubbles with rounded-2xl corners
- User messages: align-right, with subtle shadow
- Bot messages: align-left with avatar icon (scissors/comb)
- Input bar: Fixed bottom, raised surface with shadow-lg
- Quick reply chips for common questions
- Typing indicator animation when bot responds

### 5. Booking System
- Calendar view: Large touch-friendly date cells (min-h-12)
- Time slot picker: Grid of buttons showing availability
- Barber selection: Cards with photo, name, specialty
- Service selection: Expandable list with prices
- Confirmation summary: Elevated card with all details

### 6. Barber Availability Display
- 2-3 column grid of barber cards
- Each card: Photo (aspect-ratio-square), name, rating stars, "Ver disponibilidad" button
- Available/busy indicator badge

### 7. Services & Pricing
- Accordion or expandable cards
- Each service: Icon (Heroicons), name, duration, price
- "Reservar este servicio" inline CTA

### 8. Footer
- Operating hours with clock icon
- Location with map pin icon
- Phone/WhatsApp contact
- Social media icons
- Newsletter signup field
- Copyright and links (Privacidad, Términos)

## Component Library

**Buttons:**
- Primary: Rounded-full, px-6 py-3, font-medium, shadow-md
- Outlined: border-2, rounded-full, px-6 py-3
- Icon buttons: Circular, p-3, for actions

**Cards:**
- Rounded-xl with shadow-md
- Padding: p-4 to p-6
- Hover: shadow-lg transition

**Forms:**
- Input fields: Rounded-lg, border-2, px-4 py-3, focus:ring-2
- Labels: text-sm, font-medium, mb-2
- Validation messages: text-xs below inputs

**Chat Bubbles:**
- Rounded-2xl, max-w-[80%], px-4 py-3
- Tail indicator on first message of sequence

**Navigation:**
- Bottom navigation bar (fixed) for mobile with 4-5 icons
- Slide-out drawer for desktop

**Calendar:**
- Grid layout with clear day labels
- Selected dates: elevated with ring-2
- Disabled dates: opacity-40

**Icons:**
- Material Icons CDN for consistent iconography
- Icons for: calendar, clock, location, chat, scissors, user, menu

## Images

**Hero Image:** Professional barbershop interior showing modern styling chairs, good lighting, clean aesthetic. Should convey premium service and welcoming atmosphere.

**Barber Profile Images:** Placeholder for headshots of barbers in professional attire. Square aspect ratio (1:1).

**Service Icons:** Use Material Icons instead of photos for service types (scissors, razor, styling products).

## Animations

**Minimal, purposeful only:**
- Chat bubble entrance: slide-up with fade
- Button press: subtle scale-95 on active
- Page transitions: smooth fade between routes
- Loading states: Material Design circular progress

## Mobile-First Considerations

- Touch targets minimum 44x44px
- Swipe gestures for chat history
- Pull-to-refresh for availability updates
- Bottom sheet modals for forms
- Sticky CTAs above bottom navigation
- Optimized for one-handed use (important actions in thumb zone)