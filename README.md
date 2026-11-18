# Brand To Business Studio

Build CH Business Services in stages, beginning with a launch-ready public website and working inquiry process.

### Locked
- Business details:
  - Name: CH Business Services
  - Domain: chbusinessservices.pro
  - Email: office@chbusinessservices.pro (link: mailto:office@chbusinessservices.pro)
  - Phone: (929) 515-5434 (link: tel:+19295155434)
  - Category: Brand architecture and business systems studio
  - Positioning headline: "We build the business behind the brand."
  - Supporting statement: "We help founders connect a clear brand promise with the structure to deliver it—from positioning and websites to organized onboarding, clear responsibilities, and repeatable workflows."
  - Audience: Service-business founders who need greater clarity in how they present their business and organize the client experience.
  - Voice: Clear, calm, specific, professional. Question-led rather than pressure-led. Explain practical outcomes before framework terminology. Do not invent testimonials, fake client metrics, unverified biographies, or fake guarantees.
- Design & Branding:
  - Static files in `public/`: `ch-logo-light.png` (light backgrounds), `ch-logo-dark.png` (dark backgrounds), `ch-monogram.png` / `ch-monogram-light.png` (compact marks), plus `favicon.png` and `apple-touch-icon.png`.
  - Maintain exact logo aspect ratios and clear space.
  - Editorial, structured visual aesthetic: deep blacks, pure whites, warm charcoal/stone accents, sharp precision borders, elegant typography with generous whitespace and restrained micro-interactions.
- Public Website Content Structure:
  1. Header / Navigation: CH logo, links to Services, Method, How It Works, About, FAQ, Contact, and primary CTA button.
  2. Hero Section:
     - Headline: "We build the business behind the brand."
     - Supporting copy: "A clear promise needs a clear way to deliver. CH connects brand strategy with the structure behind the client experience."
     - Primary CTA: "Request a Free 15-Minute Clarity Call" (smooth scrolls to inquiry form).
     - Secondary CTA: "Explore Our Services".
  3. Recognizable Problems Section:
     - Heading: "Where does your business feel disconnected?"
     - Four cards:
       * "Your offer takes too much explaining."
       * "Your website leaves the next step unclear."
       * "Onboarding changes from client to client."
       * "Too much depends on you remembering everything."
     - Helpful, empathetic tone without shame or fear.
  4. Services Section:
     - Heading: "Connect the promise with the process."
     - Four core pillars:
       * CODE — Brand clarity (Audience, promise, positioning, messaging, voice, identity).
       * SHIELD — Responsibilities and review coordination (Clarify ownership, document open issues, identify items requiring licensed professional review).
       * SIGNAL — Websites and market presence (Explain promise, supporting proof, process, inquiry path).
       * SYSTEM — Client experience and operations (Organize onboarding, workflows, SOPs, responsibilities, delivery tracking).
     - Callout note: "Not every engagement needs every phase. We identify the starting point before recommending scope."
  5. Method Section:
     - Heading: "The CH Trust OS"
     - "Define the promise. Address the risks. Make the value visible. Build the systems to deliver." Presented as connected areas, not rigid mandatory packages.
  6. How It Works Section:
     - 4 steps: 1. Tell us what feels disconnected. 2. Discuss your situation on a clarity call. 3. Receive a recommended next step. 4. Review scope, responsibilities, and pricing before proceeding.
  7. About Section:
     - Clean, professional introduction to CH Business Services and founder Elias Chouchani. Editable placeholder without inventing unverified claims.
  8. FAQ Section:
     - Answers the 6 questions from the brief: Do I need all four phases?; Can CH help with one specific project?; What happens on the clarity call?; How is custom work priced?; What responsibilities remain with the client?; When is another professional needed?
     - Clear disclaimer: CH coordination and operational consulting do not replace advice from appropriately licensed legal, tax, or accounting professionals.
  9. Contact & Working Inquiry Form:
     - Fields: Name, Email, Business Name, Website (optional), "What prompted you to reach out?", Service interest (optional multi-select: CODE, SHIELD, SIGNAL, SYSTEM, General Inquiry).
     - Submission validates data, prevents spam, and stores directly in the Lovable Cloud database.
     - On successful submission: Displays clear confirmation ("Your inquiry has been received. CH will contact you to discuss the next step.") AND presents the immediate next-step action: "Want to secure a time right away? Schedule directly on our calendar: [Book 15-Minute Clarity Call](https://zbooking.us/cjlJ1)".
  10. Footer: Full contact info (office@chbusinessservices.pro, (929) 515-5434), navigation links, legal/privacy disclaimer, copyright EST. 2023.
- Protected Owner Dashboard:
  - Accessible via `/admin` or `/dashboard` with authentication.
  - Displays all captured inquiries with columns: Date, Name, Email, Business, Service Interest, Message, Status (New, Contacted, Scheduled, Completed, Archived).
  - Ability to update status, add internal notes, and filter inquiries.
- Privacy Information Draft:
  - Dedicated `/privacy` page outlining transparent data handling for inquiries, cookies, and booking links. Marked as reviewable draft for owner review.

### Open
- Technical architecture: TanStack Start / React, Tailwind CSS, shadcn/ui components, Lucide icons, Lovable Cloud backend (Postgres database table `inquiries`, admin role checks).
- Responsive mobile design tuned for performance and touch targets.
- Error handling, form field validation with React Hook Form + Zod, accessible contrast and keyboard navigation.

build a real working app, not a clickable prototype; the screen and kit files show layout, content and look (a wireframe's, structure only) and are never code to copy. The screens are the moments the user designed, not the whole product. Before building, walk through each flow as its user would and design what the pictures leave out, as a product designer would for this product: the steps a flow needs to finish and how the app responds to what the user does, including the moments its users will actually run into, like waiting on something or finding nothing yet. Add nothing a user of this product would never meet, and keep an app the user wants simple, simple. Never leave a step the product's core flows need as "coming soon", unless the brief says the user chose to. Where such a step needs an outside service, build every part up to it and say in your reply what's left to connect. Fill product gaps only, never a look the design set: an added step reuses the UI kit's tokens, chrome and parts and the nearest designed screen's layout, with no new visual direction. Look at every screen's picture before writing code; design.md says which picture or sheet holds each screen. Open the UI kit's shells and parts HTML for the header, tab bar, composer and components, not only its tokens. Use each finished screen's copy exactly as design.md lists it; never invent copy for one. A wireframe under design.md's Wireframes gives structure only: build it in the design's look, as design.md says. The screens' photos are placeholders for the mockups only: replace every photo design.md lists with the user's own upload for it, else as design.md says (a photo without people re-composed with imagegen--edit_image from it as a reference, a photo of people generated from its brief and never from the photo), and ship no set photo or its URL. For a design that came with no design.md, every photo on assets.lovable.dev or images.unsplash.com is a set photo: replace it with the user's own upload for it, else a new image generated for its slot, any person in it one who doesn't exist, never from the photo or a picture showing it. Build and check each screen at the canvas it was drawn at: phone 393×764, tablet landscape 1133×744, tablet portrait 744×1133, desktop 1280×832. After building, screenshot the app at those sizes and states, compare each finished screen with its picture, and fix every visual difference you didn't choose; check a wireframe's screen against its structure, never its grey look. End your reply with "Changed from the mockups": each deliberate change and why, and "Added beyond the mockups": each step, state or interaction you built that no screen shows.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://brand-to-business-studio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ef607033-0cc6-4e0b-962d-864c8a1293c3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
