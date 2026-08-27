# Employees Directory

### [Live Demo](https://employes-app.vercel.app/?sortBy=birthDate)

A responsive, Pixel-Perfect Single Page Application (SPA) built with React and TypeScript for searching, filtering, sorting, and viewing employee information. The application loads employee data from an external API, preserves selected parameters in the URL, and closely follows the provided Figma layouts and reference application.

---

### Key Features

- **Pixel-Perfect & Adaptive Layout:** Responsive implementation matching the Figma design and demo application across Desktop, Tablet, and Mobile devices.
- **API-Based Employee Directory:** Employee information is loaded dynamically from the [MockAPI endpoint](https://68f747b1f7fb897c66152f05.mockapi.io/employees) instead of being stored manually in the project.
- **Real-Time Search:** Instantly filters employees by first name, last name, tag, or email after every entered character.
- **Position Filtering:** Filters the directory by employee specialization, including Designers, Analysts, Managers, Developers, and Recruiters.
- **Flexible Sorting:** Supports alphabetical sorting by first name and birth-date sorting with visual year dividers.
- **Employee Profiles:** Each employee has a dedicated profile page containing their avatar, full name, specialization, birth date, age, and phone number.
- **Persistent URL Parameters:** Search, filtering, and sorting values are stored in the URL and remain available after refreshing, sharing the link, or returning from an employee profile.
- **Browser Navigation Support:** Profile transitions work with direct URLs and browser Back/Forward navigation while preserving the selected directory state.
- **Loading & Error States:** Includes list skeletons, a dedicated profile loader, empty-search feedback, API error handling, and retry functionality.
- **Interactive UI States:** Implements hover effects, animated specialization indicators, a responsive sorting dialog, and a mobile bottom sheet matching the demo behavior.

---

### Tech Stack

- **Framework & Language:** [React](https://react.dev/) (Functional Components, Hooks), [TypeScript](https://www.typescriptlang.org/) (Strict Typing)
- **Styling & Methodology:** [Sass (SCSS)](https://sass-lang.com/), [BEM Methodology](https://en.bem.info/methodology/) (Block-Element-Modifier)
- **Data & Navigation:** Fetch API, React Router v6, URL Search Parameters
- **Build Tooling:** [Vite](https://vite.dev/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Deployment:** [Vercel](https://vercel.com/)

---

### Breakpoint Management

The layout adapts across the required device viewports:

- **Desktop:** `1280px` and above — expanded search header, full-width employee list, and centered sorting dialog.
- **Tablet:** From `768px` up to `1279px` — fluid directory layout with horizontally scrollable specialization filters.
- **Mobile:** From `375px` up to `767px` — compact search interface, touch-friendly controls, and sorting bottom sheet.

---

### Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the code quality check:

```bash
npm run lint
```

---

### Author

- **Maksym Shavryhin** — _Main Developer_ ([GitHub Profile](https://github.com/sh00tn1ck29))
