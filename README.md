# Aoun Platform - منصة عون

**Aoun** is a comprehensive digital platform designed to bridge the gap between donors, charitable organizations, and families in need. Built with scalability and security in mind, it leverages modern web technologies to provide a seamless user experience.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Custom Design System
- **UI Library**: Shadcn/ui (Radix Primitives), Lucide React Icons
- **State Management**: React Context API + Hooks
- **Forms**: Custom Form Hooks with Real-time Validation
- **Network**: Fetch API with Interceptors

---

## 🌟 Comprehensive Feature List

### 1. Landing Page (Home)
A fully responsive, informational landing page designed to build trust and guide users.
- **Hero Section**: Engaging introduction with clear Calls to Action (CTA) for Donors and Families.
- **Why Aoun**: Highlights platform advantages (Transparency, Speed, Security).
- **The Journey**: Visual guide explaining how the donation process works step-by-step.
- **Success Stories**: Real-world examples of impact to inspire community trust.
- **Partners**: Showcasing collaborating organizations and sponsors.
- **FAQ Section**: Accordion-style answers to common user questions.

### 2. Authentication & Security
- **Dual-Flow Registration**: Specialized sign-up paths for **Families** (Individuals) and **Organizations** (Charities).
- **Secure Login**: JWT-based authentication with automatic token refresh.
- **Password Recovery**: Complete flow for **Forgot Password**, **Verify Code**, and **Reset Password**.
- **Session Persistence**: Secure storage mechanisms to keep users logged in across reloads.
- **Auto-Login**: Seamless redirection after successful registration.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Users, Organizations, and Admins.

### 3. User & Organization Profiles
- **Dashboard**: Personalized landing pages (`/dashboard`) based on user account type.
- **Profile Management**:
    - **Inline Editing**: Update profile fields directly without navigating away.
    - **Avatar/Logo Upload**: Drag & drop support for profile pictures.
    - **Organization Specifics**: Manage association capacity, coverage areas, and legal data.
- **Settings Module**: Dedicated area for managing account preferences and security settings.

### 4. Core Services
- **Aid Requests**: System for families to submit and track requests for assistance (`src/features/requests`).
- **Donation Management**: Secure processing of donations via Stripe.

### 5. Advanced UI/UX Experience
- **Typography Standardisation**: Professional typographic hierarchy using optimized font weights (`Bold` & `Semibold` instead of `Black`) for a cleaner, more readable interface.
- **Enhanced RTL Navigation**:
    - **Physical Anchoring**: Sidebars specifically anchored to the right in Arabic mode for natural flow.
    - **Refined Close Mechanism**: Intuitively positioned close buttons on the inner edge of sidebars for better thumb accessibility.
- **Simplified "New Request" Flow**: A focused, centered form wizard designed for maximum usability and minimal distraction.
- **Modern Aesthetics**: Glassmorphism effects, smooth transitions, and a premium color palette (Nile Blue & Gold).

---

## 📂 Project Structure

### Frontend (`/src`)
```
src/
├── app/                 # Next.js App Router (Pages & Layouts)
│   ├── (auth)/          # Login, Register, Forgot Password
│   ├── dashboard/       # Protected User Dashboards
│   └── page.tsx         # Landing Page
├── features/            # Business Logic Modules
│   ├── auth/            # Auth logic & hooks
│   ├── home/            # Landing Page Components
│   ├── profile/         # Profile management
│   ├── requests/        # Aid Requests Logic
│   └── settings/        # Account Settings
├── shared/              # Core Utilities
│   ├── components/      # Reusable UI (Header, Button, Toaster)
│   └── providers/       # AuthProvider, ThemeProvider
└── lib/                 # Configurations (API Client, Constants)
```

---

## 🤝 Current Status
The platform is currently in **Active Development**. The Core Identity and Profile modules are complete, focusing on the UI/UX and feature implementation.
