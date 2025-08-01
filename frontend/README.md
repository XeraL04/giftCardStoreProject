# My React (Vite) Starter Template

A modern, opinionated React project bootstrap, powered by Vite.

## Included Essentials

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [MUI](https://mui.com/) (UI Components)
- [Zustand](https://zustand-demo.pmnd.rs/) (State) 
- [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) (Forms + Validation)
- [TanStack Query](https://tanstack.com/query/latest) (Data Fetching)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)
- [Framer Motion](https://www.framer.com/motion/) (Animation)
- [Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/) (Testing)
- [Axios](https://axios-http.com/) (HTTP)
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) (Linting/Formatting)

## Can add 

- [Redux Toolkit](https://redux-toolkit.js.org/) 
  `npm i redux`
- [emotion](https://emotion.sh/docs/introduction)
  `npm i @emotion/styled` / `npm i @emotion/react`

## Project Structure

src/
├── assets/
├── components/
├── hooks/
├── pages/
├── styles/
├── utils/
├── App.jsx
├── main.jsx

# From your project root

`mkdir -p src/components src/pages src/utils src/assets src/hooks src/styles`

## Getting Started

- `git clone <your-github-url>`
- `cd my-app`
- `npm install`
- `npm run dev`

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run test` — run tests
- `npm run lint` — lint code using ESLint

## If you want to use yarn : 

- `rm -rf node_modules package-lock.json` => to remove the npm's lockfile and the node_module directory and avoid conflicts
- `yarn install` or just `yarn`
- update package.json script (Optional but Recommended) : 

# with npm :

{
  "name": "my-react-app",
  "version": "0.1.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "lint": "eslint ."
  },
  "dependencies": {
    // ...
  }
}

# with yarn :

{
  "name": "my-react-app",
  "version": "0.1.0",
  "scripts": {
    "start": "yarn react-scripts start", // Or just "react-scripts start" if you rely on Yarn's auto-bin resolution
    "build": "yarn react-scripts build",
    "test": "yarn react-scripts test",
    "lint": "yarn eslint ."
  },
  "dependencies": {
    // ...
  }
}

- ` yarn dev  # If your script is named "dev" `
- ` yarn start # If your script is named "start" `
