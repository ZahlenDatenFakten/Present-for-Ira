"use client";

import React, { useState, useEffect } from 'react';
import { differenceInDays, format, isValid, parseISO } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Calendar, ArrowRight, Settings2, Plus, Minus, X, Globe, Sparkles, LayoutGrid, Activity } from 'lucide-react';

interface GoalData {
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

const DEFAULT_DATA: GoalData = {
  goalName: "Dream House",
  targetAmount: 500000,
  currentAmount: 125000,
  targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString().split('T')[0],
};

const dict = {
  ru: {
    appTitle: "WALLET",
    settings: "Настройки",
    heroBadge: "ЛИЧНАЯ ЦЕЛЬ",
    heroTitlePart1: "Мой путь к",
    heroTitlePart2: "мечте.",
    heroDesc: "Управляйте своим капиталом, отслеживайте прогресс и достигайте поставленных целей с исключительной точностью.",
    overallProgress: "Общий прогресс",
    statusActive: "АКТИВНО",
    completed: "ВЫПОЛНЕНО",
    updateFundsTitle: "УПРАВЛЕНИЕ БАЛАНСОМ",
    addFundsPlaceholder: "Сумма...",
    remainingTitle: "ОСТАЛОСЬ НАКОПИТЬ",
    deadlineTitle: "ДЕДЛАЙН",
    notSet: "Не задано",
    daysLeft: "ДНЕЙ ОСТАЛОСЬ",
    dailyNeeded: "НЕОБХОДИМО В ДЕНЬ",
    weeklyNeeded: "В НЕДЕЛЮ",
    monthlyNeeded: "В МЕСЯЦ",
    avgNeededDesc: "СРЕДНИЙ ПЛАН НАКОПЛЕНИЙ",
    settingsTitle: "Настройки Цели",
    lblGoalName: "НАЗВАНИЕ ЦЕЛИ",
    lblTargetAmount: "ЦЕЛЬ (СУММА $)",
    lblCurrentAmount: "УЖЕ НАКОПЛЕНО ($)",
    lblTargetDate: "ЦЕЛЕВАЯ ДАТА",
    btnSave: "СОХРАНИТЬ ИЗМЕНЕНИЯ",
    langToggle: "EN"
  },
  en: {
    appTitle: "WALLET",
    settings: "Settings",
    heroBadge: "PERSONAL GOAL",
    heroTitlePart1: "My journey to",
    heroTitlePart2: "the dream.",
    heroDesc: "Manage your capital, track your progress, and reach your goals with exceptional precision.",
    overallProgress: "Overall Progress",
    statusActive: "ACTIVE",
    completed: "COMPLETED",
    updateFundsTitle: "UPDATE BALANCE",
    addFundsPlaceholder: "Amount...",
    remainingTitle: "REMAINING TO GOAL",
    deadlineTitle: "DEADLINE",
    notSet: "Not set",
    daysLeft: "DAYS LEFT",
    dailyNeeded: "DAILY REQUIRED",
    weeklyNeeded: "WEEKLY",
    monthlyNeeded: "MONTHLY",
    avgNeededDesc: "AVERAGE SAVINGS PLAN",
    settingsTitle: "Goal Settings",
    lblGoalName: "GOAL NAME",
    lblTargetAmount: "TARGET AMOUNT ($)",
    lblCurrentAmount: "CURRENTLY SAVED ($)",
    lblTargetDate: "TARGET DATE",
    btnSave: "SAVE CHANGES",
    langToggle: "RU"
  }
};

export default function WalletPage() {
  const [data, setData] = useState<GoalData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [addAmount, setAddAmount] = useState<string>('');
  const [lang, setLang] = useState<'ru' | 'en'>('ru');

  // Hydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wallet_glass_data');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        setData(DEFAULT_DATA);
      }
    } else {
      setData(DEFAULT_DATA);
    }
    
    const storedLang = localStorage.getItem('wallet_lang') as 'ru' | 'en';
    if (storedLang) setLang(storedLang);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (data) localStorage.setItem('wallet_glass_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('wallet_lang', lang);
  }, [lang]);

  if (!data) return <div className="min-h-screen flex items-center justify-center font-outfit text-white/50">Loading...</div>;

  const t = dict[lang];

  const handleUpdateGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goalName = String(formData.get('goalName'));
    const targetAmount = Number(formData.get('targetAmount'));
    const currentAmount = Number(formData.get('currentAmount'));
    const targetDate = String(formData.get('targetDate'));

    setData({ goalName, targetAmount, currentAmount, targetDate });
    setIsEditing(false);
  };

  const handleUpdateFunds = (type: 'add' | 'subtract') => {
    const amount = Number(addAmount);
    if (!isNaN(amount) && amount > 0) {
      setData(prev => {
        if (!prev) return prev;
        const newAmount = type === 'add' ? prev.currentAmount + amount : prev.currentAmount - amount;
        return { ...prev, currentAmount: Math.max(0, newAmount) };
      });
      setAddAmount('');
    }
  };

  const toggleLang = () => setLang(prev => prev === 'ru' ? 'en' : 'ru');

  // Calculations
  const remaining = Math.max(0, data.targetAmount - data.currentAmount);
  const percentComplete = data.targetAmount > 0 ? Math.min(100, (data.currentAmount / data.targetAmount) * 100) : 0;
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const targetDateObj = parseISO(data.targetDate);
  let daysRemaining = isValid(targetDateObj) ? differenceInDays(targetDateObj, today) : 0;
  if (daysRemaining < 0) daysRemaining = 0;
  
  const dailyNeeded = daysRemaining > 0 ? remaining / daysRemaining : 0;
  const weeklyNeeded = dailyNeeded * 7;
  const monthlyNeeded = dailyNeeded * 30; // Approx

  const formatUsd = (val: number) => new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <>
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full h-20 z-40 flex items-center justify-center backdrop-blur-md border-b border-white/[0.05] bg-black/10">
        <div className="w-full max-w-[1440px] px-6 lg:px-12 flex justify-between items-center">
          <div className="font-outfit font-medium text-xl tracking-[0.2em] text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-400 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            {t.appTitle}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLang}
              className="glass-button px-4 py-2 flex items-center gap-2 font-inter text-xs uppercase tracking-widest text-white/80 hover:text-white"
            >
              <Globe size={14} />
              {t.langToggle}
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="glass-button px-5 py-2.5 flex items-center gap-2 font-inter text-xs font-semibold uppercase tracking-widest text-white hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <Settings2 size={16} />
              {t.settings}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="pt-32 pb-24 px-6 lg:px-12 max-w-[1440px] mx-auto min-h-screen flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="mt-8 mb-24 w-full flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-300 mb-8">
            <Target size={12} />
            {t.heroBadge}
          </div>
          
          <h1 className="font-outfit font-light text-[50px] sm:text-[70px] md:text-[90px] leading-[1.1] tracking-tight text-white max-w-5xl">
            {t.heroTitlePart1} <br/>
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-glow">
              {data.goalName || t.heroTitlePart2}
            </span>
          </h1>
          
          <p className="mt-8 font-inter text-[15px] text-white/60 max-w-2xl leading-relaxed">
            {t.heroDesc}
          </p>
        </section>

        {/* Dashboard Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          
          {/* Main Progress Card */}
          <div className="glass-panel md:col-span-8 p-8 md:p-10 flex flex-col justify-between min-h-[360px] group hover:border-purple-500/30 transition-colors duration-500">
            <div className="flex justify-between items-start mb-12">
              <div className="flex items-center gap-3 font-inter text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                <LayoutGrid size={16} className="text-purple-400" />
                {t.overallProgress}
              </div>
              <div className="flex items-center gap-2 border border-green-400/30 bg-green-400/10 text-green-300 px-3 py-1.5 rounded-full font-inter text-[10px] font-semibold uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {t.statusActive}
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-baseline gap-4 mb-4 flex-wrap">
                <span className="font-outfit text-[48px] md:text-[72px] font-medium text-white leading-none tracking-tight">
                  {formatUsd(data.currentAmount)}
                </span>
                <span className="font-inter text-lg text-white/40 font-light">
                  / {formatUsd(data.targetAmount)}
                </span>
              </div>
              
              <div className="mt-6 relative w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentComplete}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                />
              </div>
              <div className="mt-5 flex justify-between items-center font-inter text-xs text-white/40 font-medium uppercase tracking-widest">
                <span>0%</span>
                <span className="text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">{percentComplete.toFixed(1)}% {t.completed}</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Remaining */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Quick Update Funds */}
            <div className="glass-panel p-8 flex-1 flex flex-col justify-center group hover:border-blue-500/30 transition-colors duration-500">
              <div className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-6 flex items-center gap-2">
                <Activity size={16} className="text-blue-400" />
                {t.updateFundsTitle}
              </div>
              <div className="flex gap-3">
                <input 
                  type="number" 
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder={t.addFundsPlaceholder}
                  className="glass-input w-full px-4 py-3 font-inter text-sm"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateFunds('add'); }}
                />
                <button onClick={() => handleUpdateFunds('subtract')} disabled={!addAmount} className="bg-gradient-to-br from-pink-500 to-rose-600 text-white px-4 rounded-xl font-inter flex items-center justify-center hover:opacity-90 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all disabled:opacity-50 disabled:grayscale">
                  <Minus size={20} />
                </button>
                <button onClick={() => handleUpdateFunds('add')} disabled={!addAmount} className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-4 rounded-xl font-inter flex items-center justify-center hover:opacity-90 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 disabled:grayscale">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Remaining Amount */}
            <div className="glass-panel p-8 flex-1 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10 text-white">
                <Target size={120} />
              </div>
              <div className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-3 relative z-10">
                {t.remainingTitle}
              </div>
              <div className="font-outfit font-medium text-[32px] text-white relative z-10">
                {formatUsd(remaining)}
              </div>
            </div>
          </div>

          {/* Bottom Row: Stats Breakdown */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Deadline */}
            <div className="glass-panel p-8 flex flex-col justify-between group hover:border-pink-500/30 transition-colors duration-500">
              <div className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-6 flex items-center gap-2">
                <Calendar size={16} className="text-pink-400" />
                {t.deadlineTitle}
              </div>
              <div>
                <div className="font-outfit font-medium text-[28px] text-white mb-2">
                  {isValid(targetDateObj) ? format(targetDateObj, 'dd MMMM yyyy', { locale: lang === 'ru' ? ru : enUS }) : t.notSet}
                </div>
                <div className="font-inter text-sm font-medium text-pink-300">
                  {daysRemaining} {t.daysLeft}
                </div>
              </div>
            </div>

            {/* Daily/Weekly Breakdown */}
            <div className="glass-panel p-8 md:col-span-2 flex flex-col justify-between group hover:border-cyan-500/30 transition-colors duration-500 relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
              
              <div className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-6 flex items-center gap-2">
                <Activity size={16} className="text-cyan-400" />
                {t.avgNeededDesc}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                <div>
                  <div className="font-inter text-xs text-white/40 uppercase tracking-widest mb-2">{t.dailyNeeded}</div>
                  <div className="font-outfit font-medium text-[32px] text-white">{formatUsd(dailyNeeded)}</div>
                </div>
                <div>
                  <div className="font-inter text-xs text-white/40 uppercase tracking-widest mb-2">{t.weeklyNeeded}</div>
                  <div className="font-outfit font-medium text-[24px] text-white/80">{formatUsd(weeklyNeeded)}</div>
                </div>
                <div>
                  <div className="font-inter text-xs text-white/40 uppercase tracking-widest mb-2">{t.monthlyNeeded}</div>
                  <div className="font-outfit font-medium text-[24px] text-white/80">{formatUsd(monthlyNeeded)}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Settings Modal Overlay */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsEditing(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-xl glass-panel p-8 md:p-12 shadow-2xl border-white/20"
            >
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="font-outfit text-[32px] font-medium text-white mb-8">{t.settingsTitle}</h2>
              
              <form onSubmit={handleUpdateGoal} className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-2">
                  <label className="font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    {t.lblGoalName}
                  </label>
                  <input 
                    type="text" 
                    name="goalName" 
                    defaultValue={data.goalName}
                    placeholder="Например: Дом мечты"
                    required
                    className="glass-input p-4 text-[15px] font-inter"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                      {t.lblTargetAmount}
                    </label>
                    <input 
                      type="number" 
                      name="targetAmount" 
                      defaultValue={data.targetAmount}
                      required
                      className="glass-input p-4 text-[15px] font-inter"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                      {t.lblCurrentAmount}
                    </label>
                    <input 
                      type="number" 
                      name="currentAmount" 
                      defaultValue={data.currentAmount}
                      required
                      className="glass-input p-4 text-[15px] font-inter"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    {t.lblTargetDate}
                  </label>
                  <input 
                    type="date" 
                    name="targetDate" 
                    defaultValue={data.targetDate}
                    required
                    className="glass-input p-4 text-[15px] font-inter [color-scheme:dark]"
                  />
                </div>

                <button 
                  type="submit"
                  className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-inter font-semibold text-[13px] uppercase tracking-widest p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all"
                >
                  {t.btnSave}
                  <ArrowRight size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
