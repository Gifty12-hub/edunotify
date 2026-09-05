# MyReactSoFar

A walkthrough of the React conventions used across the EduNotify codebase so
far — what each one is, why I used it, how it works, and when to reach for
it — followed by my own explanation of what I've actually built and how the
installed packages fit into it.

---

## 1. React conventions used in this codebase

### 1. Functional components (no class components)

**What / why:** Every component in this project — `Home`, `Navbar`,
`Dashboard`, all of them — is a plain function that returns JSX. This is
the modern standard; class components (`class X extends React.Component`)
are legacy and mostly only seen in old codebases now. Functions are shorter,
easier to read, and work with hooks (`useState`, `useEffect`, etc.), which
class components can't use directly.

**How/when:** Any time you need a piece of UI, write a function that
returns JSX and export it.

```tsx
export default function Footer() {
  return <footer>...</footer>;
}
```

### 2. Component composition (breaking the UI into small, reusable pieces)

**What / why:** Instead of one giant file with the whole page in it, the UI
is split into small, focused components — `Navbar`, `Footer`, `Sidebar`,
and a set of form pieces (`FormShell`, `FormField`, `FormTextarea`,
`SubmitButton`). Each one does one job. This makes each piece easy to
reason about on its own, and lets the same piece be reused — `FormField` is
used identically in `Login`, `Signup`, `Contact`, `ForgotPassword`, and
`ResetPassword`.

**How/when:** When a chunk of UI is used more than once, or when a single
file is doing too many unrelated things, pull it out into its own
component.

```tsx
<FormField label="Email address" type="email" name="email" value={values.email} onChange={handleChange} icon={Mail} />
```

### 3. Props, typed with TypeScript interfaces

**What / why:** Data flows into a component through **props** — the
attributes you pass when using it, like `label`, `value`, `onChange` above.
Because this project is TypeScript, every component that takes props
defines an `interface` describing exactly what it expects. This catches
mistakes (like forgetting a required prop, or passing a string where a
function is expected) before the code even runs.

**How/when:** Any component that needs outside data gets a props interface.

```tsx
interface FormFieldProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon; // the "?" means optional
}
```

### 4. `useState` — local component state

**What / why:** `useState` gives a component memory that survives between
renders — like whether the mobile menu is open, or what someone typed in a
form field. You never edit that value directly; you call the setter
function it gives you, and React redraws the component with the new value.

**How/when:** Any time a component needs to remember something that
changes over time and affects what's shown on screen.

```tsx
// Navbar.tsx
const [open, setOpen] = useState(false);
<button onClick={() => setOpen((v) => !v)}>{open ? <X /> : <Menu />}</button>
```

### 5. `useEffect` — running code in response to something changing

**What / why:** Some logic needs to run *after* a render, in reaction to
something — not during the render itself. `useEffect` takes a function and
a dependency array; the function re-runs whenever a value in that array
changes.

**How/when:** Side effects like fetching data, subscribing to something, or
(as used here) resetting scroll position whenever the route changes.

```tsx
// Wrapper.tsx
const { pathname } = useLocation();
useEffect(() => {
  window.scrollTo(0, 0);
}, [pathname]); // re-runs every time pathname changes
```

### 6. Context API (`createContext` / `useContext`) for shared state

**What / why:** Some data needs to be available to many components that
aren't directly related to each other — like whether the user is logged
in. Passing that down manually through every layer of components ("prop
drilling") gets messy fast. Context solves this: one `Provider` holds the
value, and any component anywhere below it can read it directly.

**How/when:** Use Context for truly global, cross-cutting state — auth
status, theme, current user. Don't use it for state that's only relevant
to one small part of the tree; `useState` in the right component is
simpler for that.

```tsx
// AuthContext.tsx
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return <AuthContext.Provider value={{ isAuthenticated, /* ... */ }}>{children}</AuthContext.Provider>;
}
```

### 7. Custom hooks

**What / why:** A custom hook is just a function, prefixed with `use`, that
wraps other hooks so the logic can be reused cleanly. `useAuth()` wraps
`useContext(AuthContext)` and adds a safety check (throwing a clear error
if it's used outside the provider) so every component that needs auth
state doesn't have to repeat that check itself.

**How/when:** When the same combination of hooks/logic is needed in more
than one place, or when you want to hide setup details behind a simple
name.

```tsx
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
// used anywhere as:
const { isAuthenticated, login, logout } = useAuth();
```

### 8. `.map()` to turn data into JSX

**What / why:** Instead of writing out every nav link, feature card, or
route by hand, an array of data is defined once and `.map()` turns each
entry into a piece of JSX. This is the single biggest reason the codebase
stays short — adding a new route or feature card is a one-line change to
an array, not a new block of JSX.

**How/when:** Any time you're rendering a list of similar things — nav
links, cards, table rows, routes.

```tsx
// routes.tsx + AppRoutes.tsx
export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
];
// AppRoutes.tsx
{publicRoutes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
```

Note the `key={path}` — React requires a unique `key` on each item produced
by `.map()` so it can track which item is which across re-renders.

### 9. Conditional rendering

**What / why:** JSX can include or exclude pieces of UI based on a
condition, using `&&` (render-if-true) or a ternary (`? :`, render one
thing or another).

**How/when:** Showing a banner only if something is true, switching between
a form and a "success" state, showing/hiding a mobile menu.

```tsx
// Contact.tsx
{sent ? <SuccessMessage /> : <FormShell onSubmit={handleSubmit}>...</FormShell>}

// ResetPassword.tsx
{state?.justLoggedIn && <div>Welcome back — you just logged in.</div>}
```

### 10. Default vs. named exports, and `import`/`export` generally

**What / why:** Every page and component in this project uses `export
default function ComponentName()`, which means whoever imports it can name
it whatever they want (though matching the file name is convention). The
shared `Form.tsx` file uses **named exports** instead (`export function
FormShell`, `export function FormField`, etc.) because it exports several
things from one file, and named exports must be imported with their exact
name — which is clearer when there are multiple.

**How/when:** One main thing per file → default export. Several related
things in one file → named exports.

```tsx
// default export (Navbar.tsx)
export default function Navbar() { ... }
import Navbar from "./components/Navbar";

// named exports (Form.tsx)
export function FormField() { ... }
import { FormField, SubmitButton } from "./components/Form";
```

### 11. Destructuring

**What / why:** Instead of writing `props.label`, `props.value`, etc.,
function parameters and objects are destructured to pull out just the
pieces needed, by name. This makes components easier to read at a glance —
the destructured parameter list *is* the list of what the component uses.

**How/when:** Almost everywhere — props, state updates, array items in
`.map()`.

```tsx
export function FormField({ label, value, onChange, icon: Icon }: FormFieldProps) { ... }
//                                                    ^ renamed while destructuring
setValues((v) => ({ ...v, [e.target.name]: e.target.value })); // spread + destructure-ish update
```

### 12. Controlled inputs

**What / why:** Every text input in this project has both a `value` (from
state) and an `onChange` (that updates that state). This means React state
is always the "single source of truth" for what's in the input — the DOM
never holds data React doesn't know about. This is what makes it possible
to validate, reset, or pre-fill a form field programmatically.

**How/when:** Any form field where the app needs to read, validate, or
react to what's typed — which in practice is almost every input.

```tsx
<input value={values.email} onChange={handleChange} name="email" />
```

---

## 2. In my own words — what I've actually built

At its core, this project is a single-page app: one HTML page
(`index.html`) that never fully reloads, where React swaps out what's on
screen as the URL changes. `react-router-dom` is what makes that possible —
`BrowserRouter` turns on that URL-based navigation, and `Routes`/`Route`
decide which page component to show for which URL. I split the app into
two "sides": public pages that anyone can see (Home, About, Contact, Login,
Signup, and the two password-recovery pages), and an authenticated side
(the dashboard area) that's only reachable once someone is "logged in."

The layout components (`Wrapper`, `UnauthLayout`, `AuthLayout`) exist so I
don't have to repeat the Navbar/Footer or Sidebar on every single page —
`<Outlet />` (from react-router-dom) is the placeholder inside each layout
where the actual matched page gets dropped in. `AppRoutes.tsx` is where all
of this actually gets wired together: it loops over two arrays of routes
(one public, one protected) and turns them into real `<Route>` elements,
with the protected ones nested inside `ProtectedRoute` — a small component
that checks `isAuthenticated` and either lets the person through or bounces
them to `/login`.

Since there's no backend yet, "being logged in" is currently faked:
`AuthContext` holds a single `isAuthenticated` boolean in React state, and
mirrors it into `localStorage` so it survives a page refresh. Calling
`login()` (from the Login page, on submit) flips that flag to `true`;
`logout()` (from the Sidebar) flips it back. Every component that needs to
know the auth status calls `useAuth()`, which is a small custom hook around
`useContext`.

The icon components (`lucide-react`) are used throughout — imported
individually (e.g. `import { Mail, Lock } from "lucide-react"`) and
rendered like any other component (`<Mail size={16} />`). In a couple of
places (`Navbar`'s links, `Home`'s feature cards, `Sidebar`'s nav items) I
store the icon itself inside a data array and render it dynamically —
`const Icon = item.icon; <Icon />` — so the array can loop with `.map()`
instead of writing out each icon by hand.

Styling comes from Tailwind CSS (`tailwindcss` + `@tailwindcss/vite`) —
rather than writing separate CSS files, classes like `flex`,
`rounded-full`, or `text-indigo` are applied directly in the JSX. The
custom colours and fonts (`--color-indigo`, `--font-display`, etc.) are
defined once in `src/index.css` under Tailwind's `@theme` block, so
`text-indigo` or `font-display` work anywhere in the app without repeating
hex codes.

TypeScript sits underneath all of it, and its whole job here is to catch
mistakes before they become bugs — a missing prop, a typo in a state key, a
function that returns the wrong type. `npm run build` runs `tsc -b`
(a full type-check) before Vite even bundles anything, so a type error
fails the build instead of quietly shipping.

---

Built by Gifty Akosua Arkoh as part of the Women Techsters Digital
Accelerator programme.