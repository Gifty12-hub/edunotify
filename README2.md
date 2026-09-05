# EduNotify

**Keeping every parent informed, one result at a time.**

EduNotify is a web-based platform that helps schools in Ghana digitally
manage student academic records and keep parents informed through SMS,
WhatsApp, email, and (eventually) a dedicated mobile app — with multilingual
support and AI-powered features on the roadmap.

This repository contains the **frontend** of EduNotify, built for the Women
Techsters Digital Accelerator sprint, using **React + TypeScript**.

---

## 1. The problem

In many Ghanaian basic and second-cycle schools, report cards and school
updates still travel home in a child's schoolbag, or are announced only at
in-person PTA meetings. This creates a communication gap:

- Parents miss results, fee deadlines, and school announcements because the
  paper never arrives, or arrives too late to act on.
- Schools have no reliable, auditable way to confirm a message reached a
  parent.
- Parents who work away from home, or who have children boarding at school,
  are structurally disadvantaged by paper-based communication.
- There is no early-warning system: a parent typically only finds out their
  child is struggling at the end of a term, when it is hardest to help.

## 2. The solution

EduNotify digitises the school-to-parent communication link. Once a school
uploads results, an individual grade, or a general update through the
EduNotify dashboard, the platform automatically delivers that information to
every linked parent or guardian over the channel **they** have chosen:

- **SMS** — for parents without a smartphone or reliable data, and as a
  guaranteed fallback channel.
- **WhatsApp** — for rich, low-cost delivery where data is available.
- **Email** — for schools and parents who prefer a written, filed record.
- **Mobile app** *(planned)* — a dedicated EduNotify app for parents who want
  a running history of every result and update in one place.

Every notification can be sent in the parent's preferred language (starting
with English and Twi, with Ga and Ewe planned), so language is never the
reason a parent misses a report.

## 3. Who this is for

| User type | What they get |
|---|---|
| **School administrators / teachers** | A dashboard to upload results (individually or in bulk), publish general announcements, and see delivery status per parent. |
| **Parents / guardians** | Automatic, real-time notifications about their child/children's results and school updates, in the channel and language they prefer. |
| **Students** *(future scope)* | Optional direct access to their own results through the parent's account or a student login. |

## 4. How it's expected to operate

1. **A school signs up** and is onboarded with its student roster (name,
   class, and each student's linked parent/guardian contact details).
2. **Parents register** once — via the signup flow in this app — providing a
   phone number and/or email, and selecting their preferred notification
   channel(s) and language.
3. **The school publishes results or an update** from its dashboard (this
   repository currently ships the *public-facing* pages; the authenticated
   school dashboard is a subsequent build phase — see §8).
4. **EduNotify's backend/notification service** (not yet built — see §8)
   picks up the published data and sends it out through the appropriate
   channel(s) using an SMS gateway (e.g. a local aggregator), the WhatsApp
   Business API, and a transactional email provider.
5. **Delivery is logged**, so the school can see which parents were reached
   and follow up directly with those who weren't (e.g. an outdated number).
6. **AI-powered features** *(planned)* layer on top of this pipeline:
   automatic translation of notification text, and early flags for students
   whose results suggest they need extra support, surfaced to teachers
   before end-of-term.

This frontend is designed so that steps 3–5 can be wired up to a real backend
without changing the page structure — forms in `Login`, `Signup`, and
`Contact` already isolate their submit handlers (see the `TODO` comments in
each file) so a REST or GraphQL API can be dropped in later without
reshaping the components around it.

## 5. What's in this repository

This is the **frontend** of EduNotify — a React + TypeScript single-page
application built with Vite, Tailwind CSS, and React Router. It currently
covers the public-facing side of the product:

- **Home / Landing page** — explains what EduNotify does, how it works, and
  drives sign-ups.
- **Login page** — authentication UI (stubbed; not yet connected to a
  backend).
- **Sign up page** — registration UI with a role selector (parent vs. school
  administrator).
- **About page** — the problem EduNotify solves, the approach, and who it's
  for.
- **Contact us page** — a contact form plus direct contact details.

Shared UI is built from reusable, typed components: `Navbar`, `Footer`, and
a small set of `Form` primitives (`FormShell`, `FormField`, `FormTextarea`,
`SubmitButton`) used consistently across Login, Signup, and Contact so the
three flows look and behave the same way.

## 6. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Language | [TypeScript](https://www.typescriptlang.org) | Catches prop/type mistakes at build time — every component, form value, and event handler in this project is typed. |
| Build tool | [Vite](https://vite.dev) | Fast dev server and builds, minimal config, first-class TypeScript support out of the box. |
| UI library | [React 19](https://react.dev) | Component-based UI, widely used, matches the rest of my stack (Next.js projects, etc.). |
| Routing | [`react-router-dom`](https://reactrouter.com) (v7) | Client-side routing between Home, Login, Signup, About and Contact without full page reloads — see §7 for details. |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling, wired directly into Vite via `@tailwindcss/vite` (no separate PostCSS config needed in v4). |
| Icons | [`lucide-react`](https://lucide.dev) | Lightweight, consistent, typed icon set used across the navbar, forms, and feature sections. |
| Linting | [`oxlint`](https://oxc.rs) | Fast linting, included in the default Vite React template. |

### Design system

The visual identity is intentionally rooted in the product itself rather
than a generic template: a deep indigo (`#1B3A4B`) as the primary brand
colour, a brushed-gold accent (`#D4A24C`) standing in for the moment a
notification lands, and a warm ivory background — paired with `Sora` for
display type and `Inter` for body text. Tokens live in `src/index.css` under
Tailwind v4's `@theme` block, so colours and fonts can be adjusted from one
place.

## 7. About `react-router-dom`

This project uses [`react-router-dom`](https://www.npmjs.com/package/react-router-dom)
(installed via `npm install react-router-dom`) to handle client-side
navigation between pages **without full page reloads**, which is essential
for a fast, app-like feel.

What it does in this project:

- `<BrowserRouter>` (in `src/main.tsx`) wraps the whole app and enables
  routing using the browser's History API (clean URLs, no `#` hashes).
- `<Routes>` and `<Route>` (in `src/App.tsx`) map each URL path to a page
  component:
  - `/` → `Home`
  - `/login` → `Login`
  - `/signup` → `Signup`
  - `/about` → `About`
  - `/contact` → `Contact`
- `<Link>` and `<NavLink>` (used throughout `Navbar`, `Footer`, and the
  pages themselves) replace plain `<a>` tags for internal navigation, so
  clicking between pages doesn't reload the whole app. `NavLink` is used
  specifically in the navbar because it can tell us when a link matches the
  current URL (`isActive`), which is how the active nav item gets
  highlighted. `react-router-dom` ships its own TypeScript types, so props
  like `to`, `end`, and the `isActive` render prop are all type-checked.

In short: React Router is what turns this project from a single static page
into a proper multi-page web app, while keeping navigation instant.

## 8. Project structure

```
edunotify/
├── index.html
├── package.json
├── tsconfig.json            # References tsconfig.app.json + tsconfig.node.json
├── tsconfig.app.json         # TS config for the app source (src/)
├── tsconfig.node.json        # TS config for Vite's own config file
├── vite.config.ts            # Vite config, includes the Tailwind plugin
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx               # App entry point, wraps <App /> in <BrowserRouter>
    ├── App.tsx                # Route definitions (Home, Login, Signup, About, Contact)
    ├── index.css              # Tailwind import + design tokens (@theme)
    ├── components/
    │   ├── Navbar.tsx          # Site navigation, responsive (desktop + mobile menu)
    │   ├── Footer.tsx          # Site footer with links and contact info
    │   ├── Form.tsx            # Shared, typed form building blocks (FormShell, FormField, etc.)
    │   └── NotificationShowcase.tsx  # Hero visual: a result reaching a parent on 3 channels
    └── pages/
        ├── Home.tsx            # Landing page: hero, features, how-it-works, CTA
        ├── Login.tsx           # Login form
        ├── Signup.tsx          # Signup form with parent/school role selector
        ├── About.tsx           # Mission, problem statement, approach
        └── Contact.tsx         # Contact form + contact details
```

## 9. Getting started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# type-check + build for production
npm run build

# preview the production build locally
npm run preview
```

`npm run build` runs `tsc -b` (a full TypeScript project build/type-check)
before `vite build`, so a type error will fail the build rather than slip
into production.

## 10. Roadmap / what's next

This repository is intentionally scoped to the **frontend, public-facing**
side of EduNotify for the current sprint. The following are the next logical
build phases, in order:

1. **Backend & database** — a REST or GraphQL API (e.g. Node.js/Express +
   MongoDB, matching my existing stack) to persist schools, students,
   parents, and results.
2. **Authentication** — wire the Login/Signup forms to real endpoints with
   secure password handling and session/token management.
3. **School dashboard** — an authenticated area for schools to upload
   results (individually and in bulk), publish announcements, and view
   delivery status.
4. **Notification service** — integration with an SMS gateway, the
   WhatsApp Business API, and a transactional email provider, triggered
   whenever a school publishes a result or update.
5. **Multilingual notification templates** — starting with English and
   Twi.
6. **AI-powered features** — automatic translation, and early-warning
   flags for students whose results indicate they may need extra support.
7. **Parent-facing mobile app** — a dedicated app for parents as an
   additional channel alongside SMS, WhatsApp, and email.

## 11. Feasibility notes

EduNotify's core delivery mechanism (SMS, WhatsApp, email) relies on
services that already operate at scale in Ghana — local SMS aggregators,
the WhatsApp Business API, and standard email providers — so the technical
risk sits mainly in integration work rather than unproven technology. The
SMS channel in particular is deliberately treated as the guaranteed
fallback, since it doesn't require a smartphone or a data plan, which keeps
the product usable for the widest possible range of parents. The phased
roadmap above reflects that: the notification pipeline is designed to be
added incrementally behind the UI that already exists in this repository,
and TypeScript's type-checking is intended to keep that integration work
safer as the codebase grows past a single contributor.

---

Built by Gifty Akosua Arkoh as part of the Women Techster Sprint programme.