Movie Explorer App
A modern, feature-rich movie browsing web app built with Next.js 14, TypeScript, Tailwind CSS, and TMDB API. The app enables users to browse, search, view detailed movie info, and manage favorites with a sleek, responsive design.

Features
User authentication: Sign up and login with NextAuth.js, securing access for main features.

Movie browsing: Browse popular movies with poster, title, and ratings, with infinite scroll or pagination.

Dynamic search: Search movies in real-time, fetching results from TMDB API.

Detailed pages: View comprehensive movie information, including description, release date, ratings, and more.

Favorites: Add or remove movies from favorites stored in local storage; view favorite movies on a dedicated page.

Responsive UI: Fully responsive and mobile-friendly with dark mode support.

Optimized images: Next.js next/image for fast, optimized loading.

Loading skeletons: Smooth, visually appealing loading states.

How to Run Locally
Prerequisites
Node.js (>=14)

TMDB API key (sign up at https://www.themoviedb.org/)

Steps
Clone the repo:

bash
git clone https://github.com/TanviPatil70/movie-explorer-app.git
cd movie-explorer-app
Install dependencies:

bash
npm install
# or
yarn install
Set environment variables:

Create a .env.local file in the root directory:

text
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXTAUTH_SECRET=your_nextauth_secret
Start local server:

bash
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to see the app.

Deployment
The app is live on Vercel:
https://movie-explorer-app.vercel.app

Folder Structure Overview
src/app: Next.js pages and routes

src/components: Reusable UI components

src/lib: API handling and utilities

src/styles: global styles

pages/api: API routes for authentication, data fetching

Tech Stack
Next.js 14 with App Router

TypeScript

Tailwind CSS

NextAuth.js for authentication

TMDB API for movie data

Next.js next/image optimization

How to Contribute
Fork the repo

Create a feature branch

Commit and push your changes

Submit a pull request

Contact
For queries or feedback, submit an issue or contact via GitHub.

