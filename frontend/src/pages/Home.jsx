import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Bot, Calendar, Cpu, CheckCircle, ChevronDown, Award, Star, BookOpenCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [faqOpen, setFaqOpen] = useState({});

  const toggleFaq = (idx) => {
    setFaqOpen((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const faqs = [
    {
      q: 'Which boards are supported on EduSphere AI?',
      a: 'We fully support CBSE, ICSE, and various State Boards. You can select your preferred board during the registration process.',
    },
    {
      q: 'How does the AI Study Planner work?',
      a: 'Our AI Study Planner takes your exam date, selected subjects, and daily study capacity to generate a personalized calendar, detailing daily topics and revision milestones.',
    },
    {
      q: 'Are the study resources and board papers downloadable?',
      a: 'Yes, all chapter notes, previous year question papers (PYQs), and answer solutions are available in PDF formats for instant download.',
    },
    {
      q: 'What are Revision Shorts?',
      a: 'Revision Shorts are 30-second to 1-minute concept breakdowns, highlighting core formulas, key experiments, or essential summaries in a vertical video player format.',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient Rings */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-center lg:text-left"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 dark:bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-500/20 mb-6">
            <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Next-Gen AI Learning Portal</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Master Class 10 & 12 with <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">EduSphere AI</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
            A premium full-stack learning platform providing smart study notes, video lectures, doubt assistant chatbot, board exam papers, and AI-personalized weekly study schedules.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all text-center"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto glass-card hover:bg-slate-200/50 dark:hover:bg-slate-800/50 px-8 py-4 rounded-xl font-bold border border-slate-300 dark:border-slate-700 transition-all text-center"
            >
              Student Portal Login
            </Link>
          </div>
        </motion.div>

        {/* 3D-Like Floating Card Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-md lg:max-w-lg animate-float"
        >
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative">
            <div className="absolute -top-6 -right-6 bg-amber-500 text-white p-3 rounded-2xl shadow-lg transform rotate-12">
              <Award className="h-6 w-6" />
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-500 text-white p-2.5 rounded-xl"><BookOpenCheck className="h-5 w-5" /></div>
              <div>
                <h3 className="font-bold text-sm">Target Exam preparation</h3>
                <p className="text-xs text-slate-500">Class 10 & Class 12 Boards</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-xs text-slate-600 dark:text-slate-400"><strong>Chapter-Wise Notes & Video lectures:</strong> CBSE, ICSE, & State Board syllabus mapped.</p>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl">
                <Bot className="h-5 w-5 text-indigo-500 mt-0.5" />
                <p className="text-xs text-slate-600 dark:text-slate-400"><strong>AI Assistant:</strong> Solve physics equations, clarify math concepts, and get instant summaries.</p>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl">
                <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                <p className="text-xs text-slate-600 dark:text-slate-400"><strong>Study Streaks:</strong> Complete tasks, accumulate XP points, and rank on the global leaderboard.</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-slate-400 border border-white" />
                <div className="h-8 w-8 rounded-full bg-slate-500 border border-white" />
                <div className="h-8 w-8 rounded-full bg-blue-500 border border-white" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Joined by 10k+ Board Candidates</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Showcase */}
      <section className="bg-slate-100/30 dark:bg-slate-900/30 py-24 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl mb-4">Core Ecosystem Features</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Everything you need to boost your academic ranks on a single streamlined portal.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl border hover:border-blue-500/50 transition-all tilt-card">
              <Cpu className="h-10 w-10 text-blue-500 mb-6" />
              <h3 className="text-lg font-bold mb-3">AI Solver & Doubts</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Ask any academic question or copy formulas to receive immediate visual concepts explanation and equation steps.</p>
            </div>
            <div className="glass-card p-8 rounded-2xl border hover:border-indigo-500/50 transition-all tilt-card">
              <BookOpen className="h-10 w-10 text-indigo-500 mb-6" />
              <h3 className="text-lg font-bold mb-3">5-Core Subject Sections</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Access notes, embed video lecture tracks, chapters PYQs, solved Board papers, and revision short reels.</p>
            </div>
            <div className="glass-card p-8 rounded-2xl border hover:border-purple-500/50 transition-all tilt-card">
              <Calendar className="h-10 w-10 text-purple-500 mb-6" />
              <h3 className="text-lg font-bold mb-3">Planner & Practice</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Input target exam dates to formulate dynamic study timelines, verify skills with customized tests, and track weak topics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarship Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 md:p-16 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-4">Scholarship 2026</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">EduSphere Scholarship Assessment Test (ESAT)</h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Score up to 100% scholarship for premium AI features, online tutoring cohorts, and expert CBSE/ICSE mentorship series. Registered candidates get study templates for free.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <Star className="h-4 w-4 fill-current text-amber-300" />
              <span>Next Batch starts July 1st, 2026</span>
            </div>
          </div>
          <Link
            to="/register"
            className="w-full md:w-auto bg-white hover:bg-slate-100 text-blue-700 px-8 py-4 rounded-xl font-bold text-center transition-all shadow-lg"
          >
            Apply for Scholarship
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/50 dark:border-slate-800/50">
        <h2 className="text-3xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-xl overflow-hidden border">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${faqOpen[idx] ? 'transform rotate-180' : ''}`} />
              </button>
              {faqOpen[idx] && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/10 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
