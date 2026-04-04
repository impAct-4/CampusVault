# Design System Specification: The Kinetic Ether

## 1. Overview & Creative North Star
**Creative North Star: "The Neon Observatory"**

The Kinetic Ether design system is engineered to move campus placement from a bureaucratic hurdle to a high-tech career launchpad. We are moving away from the "standard portal" look and toward a "Mission Control" aesthetic. 

This system breaks the template through **intentional asymmetry** and **kinetic depth**. We avoid the rigid, centered grid. Instead, we use a "weighted" layout where content flows like data across a futuristic HUD. Overlapping glass surfaces, high-contrast typography scales, and breathing room define the experience. Every interaction should feel like an intentional movement through a digital nebula.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, cosmic void, punctuated by high-energy neon signals.

### Core Tokens
*   **Base Background:** `#0a0a1a` to `#0d1b2a` (Linear Gradient, 135deg).
*   **Primary (Electric Purple):** `primary` (`#d2bbff`) | `primary_container` (`#7c3aed`)
*   **Secondary (Cyan):** `secondary` (`#4cd7f6`) | `secondary_container` (`#03b5d3`)
*   **Neutral Surfaces:** `surface` (`#121222`), `surface_container_lowest` (`#0c0c1d`), `surface_container_highest` (`#333345`).

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. We define boundaries through **background color shifts**. 
*   Place a `surface_container_low` section directly against the `background` to create a natural, soft edge.
*   Use `surface_container_highest` only for the smallest, most actionable interactive modules.

### The "Glass & Gradient" Rule
Floating modules (Profile Cards, Job Details) must utilize Glassmorphism.
*   **Surface:** `rgba(255, 255, 255, 0.08)`
*   **Blur:** `backdrop-filter: blur(12px)`
*   **Signature Polish:** Apply a subtle 45-degree gradient within the glass surface using `primary_container` at 5% opacity to `secondary_container` at 5% opacity to give the "glass" a colored tint.

---

## 3. Typography: The Editorial Voice
We utilize a dual-font strategy to balance futuristic character with high-density readability.

*   **Display & Headlines (Space Grotesk):** This is our "High-Tech" voice. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero headlines. Headers should feel authoritative, like a terminal readout.
*   **Body & Titles (Inter):** Our "Functional" voice. Inter provides the precision needed for complex job descriptions and student data. 
*   **Hierarchy Tip:** Pair a `label-md` in Space Grotesk (all-caps, tracked out +10%) with a `title-lg` in Inter to create a sophisticated, editorial contrast.

---

## 4. Elevation & Depth: Tonal Layering
We do not use drop shadows to indicate "elevation" in the traditional sense. We use **light and opacity.**

### The Layering Principle
Depth is achieved by stacking tiers. 
1.  **Level 0 (Base):** `surface` or `background` gradient.
2.  **Level 1 (Sections):** `surface_container_low`.
3.  **Level 2 (Active Cards):** Glassmorphism (`rgba(255,255,255,0.08)`) with `blur(12px)`.

### Ambient Glows
When a "floating" effect is required for a CTA, use a **Neon Glow** instead of a shadow.
*   **Formula:** `box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);` using the `primary_container` color. This creates an emissive light effect rather than a physical shadow.

### The "Ghost Border" Fallback
Borders are only permitted for Glassmorphism containers.
*   **Token:** `outline_variant` at 15% opacity. 
*   **Style:** `1px solid rgba(255, 255, 255, 0.15)`.

---

## 5. Components & Framer Motion States

### Buttons (Kinetic CTAs)
*   **Primary:** Background `primary_container`, text `on_primary_container`. 
    *   *Motion:* WhileHover: `scale: 1.02`, `boxShadow: "0px 0px 20px #7c3aed"`.
*   **Secondary (Glass):** Glass background with a `secondary` ghost border.
    *   *Motion:* WhileTap: `scale: 0.98`.

### Input Fields (The Terminal Style)
*   **Base:** `surface_container_lowest` with a bottom-only border of `outline_variant`.
*   **Focus State:** The bottom border animates to `secondary` (Cyan) using a Framer Motion layout transition. Helper text should appear using a staggered "typewriter" fade-in.

### Cards & Lists (Data Fragments)
*   **Constraint:** Zero divider lines. Use `vertical white space` (xl: 1.5rem) to separate list items.
*   **Hover State:** Cards should subtly tilt toward the cursor using 3D transform properties in Framer Motion.

### Status Chips
*   **Selection Chips:** Use `secondary_fixed_dim` with 10% opacity for the container and `secondary` for the text. Roundedness: `full`.

---

## 6. Do’s and Don'ts

### Do:
*   **Use Asymmetry:** Place a large `display-md` headline on the left and a floating glass card offset to the right.
*   **Embrace Glow:** Use `primary` and `secondary` glow effects to draw the eye to "Apply Now" or "Offer Accepted" states.
*   **Micro-interactions:** Use Framer Motion `staggerChildren` for list loading to make the UI feel alive.

### Don’t:
*   **No "Flat" Borders:** Never use `#000` or high-contrast grey borders. It breaks the glass illusion.
*   **No Static Hover:** If it's interactive, it must move. Even a 2px Y-axis shift is required.
*   **Avoid Over-Blurring:** Keep `backdrop-filter` at `12px`. Going higher (e.g., 40px) turns the UI into "mud" and loses the high-tech edge.

### Accessibility Note:
While we use glass and glows, ensure all text on `primary_container` or `secondary_container` meets WCAG AA contrast ratios by using the `on_primary` and `on_secondary` tokens.