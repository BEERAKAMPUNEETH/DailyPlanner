import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Flame,
  BarChart3,
  Bell,
  Target,
  Play,
  Activity,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface LandingHeroProps {
  onStartPlanning: () => void;
  streakCount: number;
  productivityScore: number;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartPlanning,
  streakCount,
  productivityScore,
}) => {
  return (
    <div className="min-h-screen text-slate-100 selection:bg-teal-500/30">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Announcement */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6 shadow-lg shadow-teal-950/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Modern Daily Routine Planner & Habit Matrix</span>
            </motion.div>

            {/* Main Headline with Animated Text */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
            >
              Master Your Day with{' '}
              <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
                Intentional Routines
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto"
            >
              Structure daily time blocks, measure real work units (pages, km, glasses),
              maintain unbroken habit streaks, and stay in flow with calming focus timers.
            </motion.p>

            {/* Prominent CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={onStartPlanning}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 font-bold text-base shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2.5 active:scale-95 transition-all group cursor-pointer"
                aria-label="Start Planning Daily Routine"
              >
                <span>Start Daily Planning</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onStartPlanning}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2"
                aria-label="Explore Live Demo"
              >
                <Activity className="w-4 h-4 text-teal-400" />
                <span>Open Live Workspace</span>
              </button>
            </motion.div>

            {/* Micro stats counter below CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400"
            >
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400/40" />
                <span className="text-slate-300 font-semibold">{streakCount} Day Streak</span> active
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-teal-400" />
                <span className="text-slate-300 font-semibold">{productivityScore}% Score</span> today
              </div>
            </motion.div>
          </div>

          {/* Floating Task Cards Interactive Showcase */}
          <div className="mt-14 sm:mt-16 relative max-w-4xl mx-auto">
            <div className="relative rounded-3xl bg-slate-900/60 border border-slate-800 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-500 ml-2 font-mono">auraroutine.app/today</span>
                </div>
                <span className="text-xs font-semibold text-teal-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Real-time Schedule
                </span>
              </div>

              {/* Floating Task Card 1: Completed Wellness */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-lg flex items-center justify-between gap-4 mb-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 line-through">
                      Morning Mindful Stretch & Breathwork
                    </h4>
                    <p className="text-xs text-teal-400/90 font-medium">
                      Wellness • 07:00 • 20 mins completed
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                  +25 pts
                </span>
              </motion.div>

              {/* Floating Task Card 2: Deep Work in progress with metric */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950/30 border border-teal-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 ring-1 ring-teal-500/30"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Work
                    </span>
                    <span className="text-xs text-slate-400 font-medium">09:00 - 10:30 (90m)</span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Core Product Design & Architecture
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-teal-400 to-cyan-300 h-full w-[65%]" />
                    </div>
                    <span className="text-[11px] font-bold text-teal-300 mono-number">
                      45 / 90 mins active
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={onStartPlanning}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-all shadow-md shadow-teal-500/20"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Focus Timer
                  </button>
                </div>
              </motion.div>

              {/* Floating Task Card 3: Quantitative metric */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-lg flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl border border-slate-700 bg-slate-800 flex items-center justify-center text-teal-400">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Afternoon Hydration & Movement Target
                    </h4>
                    <p className="text-xs text-slate-400">
                      Logged <span className="text-teal-400 font-bold">5 / 8</span> glasses of water
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400 font-mono">62% Done</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Designed For Deep Clarity
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything Needed for a Flawless Day
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Eliminate daily friction with thoughtfully designed routine systems,
              tactile progress logging, and built-in focus tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all hover:shadow-xl hover:shadow-teal-950/20 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Time-Blocked Scheduling</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Organize routines by scheduled start times, realistic durations, and time-of-day blocks (Morning, Afternoon, Evening).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all hover:shadow-xl hover:shadow-teal-950/20 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Quantitative Work Logger</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log real output metrics directly on your tasks: pages of literature read, kilometers run, glasses of water, or focus reps.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all hover:shadow-xl hover:shadow-teal-950/20 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-300 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Built-in Focus Timer & Chimes</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Countdown Pomodoro or stopwatch timers with synthesized Web Audio chimes that signal when your task flow begins and ends.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all hover:shadow-xl hover:shadow-teal-950/20 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">7-Day Habit Matrix & Streaks</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Monitor recurring daily habits with visual punch cards. Celebrate continuous streaks and build resilient morning rituals.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all hover:shadow-xl hover:shadow-teal-950/20 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Analytics & Productivity Score</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Weekly and monthly performance charts with category breakdowns and our weighted 0-100% daily productivity score algorithm.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 transition-all hover:shadow-xl hover:shadow-teal-950/20 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Proactive Reminders</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Native browser notifications alert you 5 minutes before scheduled start times and when countdown timers reach zero.
              </p>
            </div>
          </div>

          {/* Bottom Prominent Call to Action Banner */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-teal-900/40 via-slate-900 to-cyan-950/30 border border-teal-500/30 p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Ready to take control of your daily routine?
              </h3>
              <p className="mt-3 text-sm text-slate-300">
                Join thousands building compound consistency with minimal friction.
              </p>
              <button
                onClick={onStartPlanning}
                className="mt-6 px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/30 active:scale-95 transition-all inline-flex items-center gap-2"
                aria-label="Start Planning Now"
              >
                <span>Launch Planner Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
