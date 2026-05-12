# Kivent — AI-Powered Event Organizer Platform

<div align="center">

<img src="./public/cover-image.png" alt="Kivent Banner" width="100%" />

<br />
<br />

### Intelligent Full Stack Event Management Platform

Create, discover, and manage real-world events with AI-assisted event creation, subscription management, and a modern user experience.

<br />

[![Live Demo](https://img.shields.io/badge/Live-Demo-000?style=for-the-badge&logo=vercel)](https://kivent.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Convex](https://img.shields.io/badge/Convex-Realtime-orange?style=for-the-badge)](https://www.convex.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-purple?style=for-the-badge)](https://clerk.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-blueviolet?style=for-the-badge)](https://deepmind.google/technologies/gemini/)

</div>

---

# Live Demo

🚀 **Live Application:**  
### https://kivent.vercel.app/

---

# Overview

**Kivent** is a modern AI-powered full stack event organizing platform focused on physical events. Users can create, discover, join, and manage events through an intuitive and responsive interface.

The platform integrates AI-assisted event generation using Gemini AI, allowing organizers to instantly generate professional event titles, descriptions, and ideas. Kivent also includes authentication, subscription management, and free trial support, making it a production-style SaaS application.

Built with scalability, performance, and modern developer experience in mind using the latest web technologies.

---

# Features

## AI-Powered Event Creation
- Generate event titles and descriptions using Gemini AI
- AI-assisted event planning workflow
- Faster event publishing experience
- Smart content suggestions for organizers

## Event Management
- Create and manage physical events
- Browse and discover upcoming events
- Join events created by other users
- Event scheduling and date management
- Bangladesh location support

## Authentication & Authorization
- Secure authentication with Clerk
- Protected routes and session handling
- User profile management
- Role-based access flow

## Subscription System
- Paid subscription support
- Free trial onboarding
- Premium feature access
- Subscription-based feature gating

## Modern User Experience
- Fully responsive design
- Dark / light theme support
- Smooth animations and transitions
- Clean UI built with shadcn/ui and Tailwind CSS

---

# Tech Stack

## Frontend
- **Next.js 16**
- **React 19**
- **Tailwind CSS v4**
- **shadcn/ui**
- **Radix UI**
- **React Hook Form**
- **Zod**
- **Lucide React**

## Backend & Database
- **Convex** — Realtime backend and database

## Authentication
- **Clerk**

## AI Integration
- **Google Gemini API**

## Additional Libraries
- **date-fns**
- **lodash**
- **Embla Carousel**
- **Sonner**
- **next-themes**
- **bangladesh-location-data**

---

# Architecture Highlights

- Full stack serverless architecture
- Realtime backend with Convex
- AI-assisted content generation workflow
- Type-safe form validation with Zod
- Scalable component-based frontend architecture
- Secure authentication and protected APIs
- Clean and maintainable code structure

---

# Screenshots

## Homepage

<img src="./public/demo-homepage.png" alt="Homepage Screenshot" width="100%" />

## Create Event

<img src="./public/demo-create-event.png" alt="Create Event Screenshot" width="100%" />

## Dashboard

<img src="./public/demo-dashboard.png" alt="Dashboard Screenshot" width="100%" />

> Replace these images with actual screenshots of your application.

---

# Getting Started

## Prerequisites

Make sure you have installed:

- Node.js 20+
- npm / pnpm / yarn
- Convex account
- Clerk account
- Gemini API key

---

# Installation

```bash
# Clone the repository
git clone https://github.com/your-username/kivent.git

# Navigate to project folder
cd kivent

# Install dependencies
npm install
```

---

# Environment Variables

Create a `.env.local` file in the root directory:

```env
# Convex
CONVEX_DEPLOYMENT=

NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

CLERK_FRONTEND_API_URL=
CLERK_JWT_ISSUER_DOMAIL=

# Gemini AI
GEMINI_API_KEY=
```

---

# Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

# Folder Structure

```bash
kivent/
├── app/
├── components/
├── convex/
├── hooks/
├── lib/
├── public/
├── styles/
└── utils/
```

---

# Future Improvements

- AI-powered event recommendations
- QR-based event check-in system
- Real-time attendee chat
- Maps & geolocation integration
- Analytics dashboard
- Mobile application
- Event ticketing system
- Virtual / online event support

---

# Project Goals

This project was built to explore and demonstrate:

- Full stack SaaS architecture
- AI-assisted workflows
- Modern frontend engineering
- Authentication and access control
- Subscription monetization systems
- Realtime backend development
- Scalable UI component design

---

# Performance & Developer Experience

- Optimized rendering with Next.js App Router
- Reusable and scalable component system
- Strong focus on maintainability
- Type-safe validation patterns
- Modern developer tooling and architecture

---

# Why This Project Stands Out

Kivent combines multiple modern software engineering concepts into a single production-style application:

- AI-powered content generation
- Authentication & access control
- Subscription monetization
- Realtime backend infrastructure
- Modern responsive UI/UX
- Scalable full stack architecture

This project demonstrates practical experience building real-world SaaS applications using current industry-standard technologies.

---

# License

This project is licensed under the MIT License.

---

# Author

**Your Name**

- GitHub: https://github.com/your-username
- LinkedIn: https://linkedin.com/in/your-profile

---

<div align="center">

### ⭐ If you found this project interesting, consider giving it a star!

</div>