# Design System Document: Industrial Tactility

## 1. Overview & Creative North Star
The Creative North Star for this system is **"The Architectural Monolith."** 

Moving away from the generic "B2B portal" aesthetic, this design system treats the digital interface as a physical construction of premium materials. It bridges the gap between the raw, industrial power of plywood manufacturing and the refined, high-end world of international architecture. 

We break the "template" look by utilizing **Intentional Asymmetry** and **Massive Typography Scale**. Layouts should feel like a high-end editorial magazine—where white space isn't just "empty," but serves as a structural element that allows the product's texture and the brand's authoritative voice to breathe. We reject standard grid-bound boxes in favor of overlapping elements and layered surfaces that mimic the stacking of fine wood veneers.

---

## 2. Colors & Tonal Architecture
The palette is rooted in organic, earthy tones with high-contrast industrial accents. 

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through:
- **Background Color Shifts:** Use `surface-container-low` sections against a `surface` background to denote change.
- **Tonal Transitions:** A clean break from `#fbf9f8` to `#4b2e2b` creates a more powerful architectural boundary than any line ever could.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. Each depth level uses a specific token:
- **Level 0 (Base):** `surface` (#fbf9f8) - The foundational "floor."
- **Level 1 (Subtle Inset):** `surface-container-low` (#f5f3f2) - For large secondary content areas.
- **Level 2 (Elevated):** `surface-container-highest` (#e4e2e1) - For prominent interactive elements or cards.

### The "Glass & Wood" Principle
To create a premium feel, floating elements (like sticky headers or product overlays) should use **Glassmorphism**:
- **Token:** Use a semi-transparent version of `surface` with a `20px` backdrop-blur. 
- **Signature Texture:** Apply a subtle 3% opacity grain or noise overlay to `primary-container` (#4b2e2b) areas to mimic the tactile nature of timber.

---

## 3. Typography: The Editorial Voice
Our typography balance is "Industrial Precision."

- **Headings (Display/Headline):** Utilizing **Epilogue**. All H1 through H3 tags must be set to **Bold Uppercase** with a slight letter-spacing increase (+0.05em). This conveys the "stamped" authority of industrial export crates.
- **Body & Titles:** Utilizing **Manrope**. This provides a clean, modern contrast to the brutalist headlines, ensuring readability for complex B2B specifications.
- **Labels:** Utilizing **Inter**. Reserved for technical data and metadata, providing a utilitarian, "blue-print" feel.

---

## 4. Elevation & Depth
We achieve hierarchy through **Tonal Layering**, not shadows.

- **The Layering Principle:** Depth is created by stacking. Place a `surface-container-lowest` card on a `surface-container-low` section. The contrast is felt, not seen.
- **Ambient Shadows:** Only use shadows for floating "Action" elements. Shadows must be extra-diffused: `box-shadow: 0 20px 40px rgba(51, 25, 23, 0.06)`. Note the tint: we use a fraction of the `primary` color, never pure black.
- **The "Ghost Border" Fallback:** If a container requires definition against a similar background, use a "Ghost Border": the `outline-variant` token at **15% opacity**.
- **Interaction:** Hovering over an element should never just "pop" up. Use a smooth transition where the background color shifts from `surface-container` to `surface-bright`, creating a "glow" from within the material.

---

## 5. Components

### Buttons (The "Precision Tool" Style)
- **Primary:** `primary` background with `on-primary` text. No rounded corners (use `sm` scale - 0.125rem) to maintain an industrial edge.
- **Secondary:** `outline` Ghost Border with `primary` text.
- **Hover Behavior:** On hover, the button should fill with `secondary` (Forest Green) using a 400ms ease-in-out transition.

### Input Fields
- **Styling:** Underline-only or subtle `surface-container-high` backgrounds. 
- **States:** Focus state moves from `outline-variant` to a 2px `secondary` (Forest Green) bottom-border. Labels should use `label-md` and remain uppercase.

### Cards & Lists
- **Rule:** **Strictly no divider lines.** 
- **Structure:** Separate list items with `24px` of vertical space. 
- **Cards:** Use `surface-container-lowest` with a "Ghost Border." If featuring wood imagery, the image should bleed to the edges, emphasizing the material.

### Specialized Component: The "Spec-Sheet" Chip
- For B2B export data (e.g., "Grade A," "Phenolic Glue").
- **Style:** Small, `tertiary-fixed` background with `on-tertiary-fixed` text. Uppercase `label-sm`. These should look like labels stuck onto a shipping crate.

---

## 6. Do's and Don'ts

### Do:
- **DO** use expansive margins (64px+) between major sections to emphasize the "High-End" feel.
- **DO** overlap typography over images. An H1 in `surface` color overlapping a dark factory photo creates a high-end, layered editorial look.
- **DO** use sticky headers that transition from transparent to a Glassmorphic `surface-container` state upon scroll.

### Don't:
- **DON'T** use standard 1px borders or heavy drop shadows. It cheapens the "Industrial" aesthetic.
- **DON'T** use rounded "pill" shapes. Keep the geometry rectangular and architectural.
- **DON'T** clutter the UI. If a technical spec isn't essential for the first glance, hide it in a "Technical Deep Dive" accordion that uses a tonal shift to expand.

### Interaction Note:
All hover animations should feel "heavy" and intentional. Use longer durations (300ms-500ms) with `cubic-bezier(0.2, 0.8, 0.2, 1)` to mimic the momentum of moving large-scale industrial goods.