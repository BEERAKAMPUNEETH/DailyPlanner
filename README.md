# AuraRoutine — Daily Routine Planner & Habit Tracker

A modern, minimalist daily routine planner and atomic habit matrix designed to help you structure time blocks, measure real work metrics, maintain unbroken habit streaks, and stay in flow with calming focus timers.

Built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Capacitor** for seamless web and Android mobile support.

---

## ✨ Features & Core Functions

### 📅 Daily Routine Planner & Time Blocking
- **Structured Time Blocks:** Organize your day into distinct blocks (Morning Rituals, Deep Work, Health & Vitality, Evening Wind-Down).
- **Quantitative Work Units:** Measure measurable targets beyond simple checkboxes (e.g. pages read, kilometers run, glasses of water logged).
- **Subtasks & Notes:** Break down complex routines into micro-checklists with custom cues and intention notes.
- **Priority & Categories:** Filter and manage routines by priority levels (High, Medium, Low) and categories (Work, Health, Learning, Mindset).
- **Celebratory Feedback:** Built-in Web Audio synthesis chimes and celebratory confetti when you complete your routines.

### 🎯 Atomic Habit Tracker & Streak Matrix
- **Visual Punch Card Matrix:** Track 7-day recurring daily habits with visual progress indicators.
- **Unbroken Streaks:** Real-time streak tracking to build compound momentum and eliminate daily friction.
- **Completion Rates:** Instant overview of daily and weekly habit compliance percentages.

### ⏱️ Integrated Focus Timer (Pomodoro & Stopwatch)
- **Deep Work Modes:** Switch between countdown pomodoro sessions (25m, 50m, custom) and continuous stopwatch tracking.
- **Calming Visual Dial:** Smooth circular progress ring with ambient theme styling.
- **Audio & Browser Alerts:** Audio completion chimes and native notification alerts when focus intervals conclude.

### 📊 Performance Analytics & Daily Score Matrix
- **Weighted Productivity Score (0–100%):** Intelligent algorithm balancing task execution, metric targets, and habit consistency.
- **Visual Charts:** Interactive weekly performance charts, task category distributions, and completion trends.
- **Insight Metrics:** Track total focused time, current active streaks, and historical completion records.

### 🗓️ Interactive Calendar View
- Visual timeline to review past logs and schedule upcoming routine days.
- Jump to any date to inspect historical performance or prepare ahead.

### 💾 Offline-First & Data Portability
- **100% Local Storage:** Your routines and habits stay private on your device with instant offline persistence.
- **JSON Backup & Restore:** Export full backups of your tasks, habits, and history, or restore them anytime.

### 📱 Android Mobile App Ready (Capacitor)
- Native Android wrap via Ionic Capacitor.
- Responsive mobile-first layout with smooth touch interactions and dark mode styling.

---

## 🛠️ Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Animation:** [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/), [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Mobile Engine:** [Capacitor](https://capacitorjs.com/) (Android platform)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation & Local Run

1. Clone the repository:
   ```bash
   git clone https://github.com/BEERAKAMPUNEETH/DailyPlanner.git
   cd DailyPlanner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to view the app.

---

## 📱 Building for Android

This project includes a pre-configured **Capacitor** Android project inside the `android/` folder.

1. Build the web app for production:
   ```bash
   npm run build
   ```

2. Sync web assets with the Android native project:
   ```bash
   npx cap sync
   ```

3. Open in Android Studio to run or build an APK:
   ```bash
   npx cap open android
   ```
   - In Android Studio, click **Run (▶)** to test on a connected phone or emulator.
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate a standalone `.apk` file.

---

## 📁 Project Structure

```text
DailyPlanner/
├── android/             # Native Android Gradle project (Capacitor)
├── src/
│   ├── components/      # UI components (Planner, Habits, Timer, Analytics, Calendar)
│   ├── data/            # Seed routines and starter habits
│   ├── types/           # TypeScript data models and interfaces
│   ├── utils/           # Score algorithm, audio synthesis & notification helpers
│   ├── App.tsx          # Main application container & view router
│   ├── main.tsx         # Application root entry point
│   └── index.css        # Tailwind styles & theme variables
├── capacitor.config.ts  # Capacitor mobile configuration
├── vite.config.ts       # Vite bundler configuration
└── package.json         # Dependencies and scripts
```

---

## 📄 License

MIT License. Free to use, modify, and distribute.
