# TraderDeck Frontend

## Overview
TraderDeck Frontend is a modern web application built with React and Vite, providing the user interface for TraderDeck. It enables users to interact with AI-powered agents, view stock picks, and analyze financial data in real time.

## Architecture
- **React + TypeScript** for robust, type-safe UI development
- **Vite** for fast builds and hot module replacement
- **SPA (Single Page Application)** served from S3 via CloudFront
- **API Integration:** Communicates with backend via REST endpoints for analysis, picks, agent workflows
- **Component Structure:** Organized into pages (Picks, Agents, Home, Login, Register) and reusable components
- **State Management:** Context API and custom hooks for managing user state, analysis jobs, and agent results
- **Assets:** Logos, data, and static files managed in S3 and referenced in the UI

## Key Features
- Picks tab: Displays curated stock picks and analysis results
- Agents tab: Runs agentic workflows and shows AI-driven analysis
- Authentication: User login/register flows
- Responsive design for desktop and mobile

## Cloud Integration
- Deployed as a static site to S3, distributed via CloudFront
- API calls routed through CloudFront to backend ALB

## How to Run

### Development
1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```
   The app will be available at `http://localhost:5173` by default.

### Production Build
1. Build the app:
   ```
   npm run build
   ```
2. Preview the production build locally:
   ```
   npm run preview
   ```

