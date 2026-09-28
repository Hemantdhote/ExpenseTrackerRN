# 💰 Expense Tracker Mobile App

> A production-grade, fintech-inspired personal finance management mobile application built with **React Native**, **TypeScript**, **Redux Toolkit**, and **Supabase** (PostgreSQL + Auth + RLS).

Designed and structured as a high-standard portfolio project demonstrating scalable mobile architecture, clean state management, strong typing, and modern UI/UX principles.

---

## 📱 Features

- **🔐 Secure Authentication**:
  - Email & password sign-up and sign-in powered by **Supabase Auth**.
  - Auto session restoration with token refresh and persistence.
  - One-tap demo mode for instant reviewer evaluation.
  - Comprehensive form validation and friendly error handling.

- **📊 Intuitive Financial Dashboard**:
  - Real-time **Total Balance**, **Income**, and **Expense** summary.
  - Personalized dynamic greetings based on time of day.
  - Quick action buttons to add transactions or browse transaction history.
  - Recent transactions list with category styling and formatted currency (₹ INR).
  - Pull-to-refresh data synchronisation.

- **💳 Full Transaction CRUD**:
  - Record income or expense with customizable categories.
  - Predefined categorized icons and soft palettes for both Expense and Income.
  - Date and optional description/notes.
  - Edit existing transactions with prefilled fields.
  - Delete transactions with native confirmation alert dialogs.

- **🔍 Search & Filtering**:
  - Live search by note, category, or amount.
  - Segmented type filters: **All**, **Income**, and **Expense** with live counts.
  - Transactions grouped chronologically by month.
  - Empty states with call-to-action buttons.

- **👤 Profile & Account Management**:
  - User profile with initials avatar.
  - Overview statistics (lifetime transactions count, net balance).
  - Inline profile name editing.
  - Backend connection status indicator (Supabase vs Offline mode).
  - Secure logout with confirmation dialog.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Mobile Framework** | React Native (0.87.1) | Android & iOS cross-platform native app |
| **Language** | TypeScript (Strict) | Type safety, maintainability, and clean interfaces |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`) | Centralized state slices (`authSlice`, `transactionSlice`) |
| **Navigation** | React Navigation (`@react-navigation/native-stack`) | Native stack navigators with slide animations |
| **Backend & Auth** | Supabase (PostgreSQL) | Authentication, Database, and Row Level Security (RLS) |
| **Local Storage** | AsyncStorage | Session caching and offline fallback persistence |
| **Design System** | Custom Vanilla StyleSheet | Modern fintech design system (tokens for colors, typography, spacing, shadows) |

---

## 📂 Project Structure

```text
ExpenseTracker/
├── src/
│   ├── components/         # Reusable UI component library
│   │   ├── AmountCard.tsx         # Dashboard hero balance card
│   │   ├── CategorySelector.tsx   # Category picker with badges & colors
│   │   ├── CustomButton.tsx       # Standard button (variants, loading states)
│   │   ├── CustomInput.tsx        # Styled input with errors & password toggle
│   │   ├── EmptyState.tsx         # Graceful empty list placeholder
│   │   ├── FilterButton.tsx       # Segmented All/Income/Expense filters
│   │   ├── Header.tsx             # Unified screen header with navigation
│   │   ├── Loader.tsx             # Polished activity indicators
│   │   └── TransactionCard.tsx    # Single transaction row component
│   ├── constants/          # Design system & configuration
│   │   ├── categories.ts          # Predefined categories, icons & colors
│   │   ├── colors.ts              # Fintech color palette
│   │   ├── spacing.ts             # Spacing, radius & shadow tokens
│   │   └── typography.ts          # Font sizes, weights & line heights
│   ├── navigation/         # Navigation stacks
│   │   ├── AuthNavigator.tsx      # Login & Register stack
│   │   ├── MainNavigator.tsx      # Home, Transactions, Add, Details, Profile
│   │   └── RootNavigator.tsx      # Auth session state gate
│   ├── screens/            # Application screens
│   │   ├── auth/                  # LoginScreen, RegisterScreen
│   │   ├── home/                  # HomeScreen (Dashboard)
│   │   ├── profile/               # ProfileScreen
│   │   ├── splash/                # SplashScreen
│   │   └── transactions/          # TransactionsScreen, AddTransactionScreen, TransactionDetailsScreen
│   ├── services/           # Backend integration
│   │   └── supabase.ts            # Supabase client & fallback detector
│   ├── store/              # Redux Toolkit store & slices
│   │   ├── hooks.ts               # Typed hooks (useAppDispatch, useAppSelector)
│   │   ├── store.ts               # Store configuration
│   │   └── slices/                # authSlice, transactionSlice
│   ├── types/              # Domain & navigation TypeScript interfaces
│   └── utils/              # Utilities & helpers
│       ├── helpers.ts             # Currency formatter, date parser, groupings
│       └── validation.ts          # Form validation rules
├── supabase_schema.sql     # Database schema & RLS policies
├── App.tsx                 # Root application wrapper
└── package.json
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js >= 22
- Android Studio / Android SDK (for Android development)
- Java 17+

### 2. Installation
```bash
git clone https://github.com/Hemantdhote/ExpenseTrackerRN.git
cd ExpenseTrackerRN
npm install
```

### 3. Run the App
```bash
# Start Metro bundler
npm start

# Run on Android device / emulator
npm run android
```

### 4. Supabase Setup (Optional for Live Backend)
1. Create a free project on [Supabase](https://supabase.com).
2. Go to **SQL Editor** in Supabase and run the SQL code from [`supabase_schema.sql`](./supabase_schema.sql).
3. Update `src/services/supabase.ts` with your `url` and `anonKey`.
*(Note: If Supabase is not configured, the app automatically switches to an in-memory/AsyncStorage demo mode with preloaded mock transactions for instant previewing!)*

---

## 🧪 Testing & Code Quality

```bash
# Run ESLint
npm run lint

# Run TypeScript compilation check
npx tsc --noEmit

# Run Jest unit test suite
npm test
```

---

## 📄 Resume Description (Ready to Copy)

> **Expense Tracker Mobile App — React Native, TypeScript, Redux Toolkit, Supabase**
> - Architected a personal finance management mobile app featuring real-time transaction CRUD, monthly budget analytics, and category-based spending breakdowns.
> - Integrated Supabase for user authentication, PostgreSQL database operations, and Row Level Security (RLS) ensuring strict per-user data isolation.
> - Built a robust state management layer with Redux Toolkit and async thunks, including AsyncStorage caching for offline persistence and resilient fallback states.
> - Developed a reusable UI component design system (inputs, buttons, cards, empty states, category pickers) adhering to strict accessibility and responsive layout principles.
> - Implemented lightweight form validation, modular navigation with React Navigation 7, and automated unit tests with Jest.
