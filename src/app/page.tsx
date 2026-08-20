"use client";

import React, { useState, useEffect } from 'react';
import { differenceInDays, format, isValid, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, Calendar, ArrowRight, Settings2, Plus, Minus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalData {
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

const DEFAULT_DATA: GoalData = {
  targetAmount: 1000000,
  currentAmount: 150000,
  targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
};

export default function WalletPage() {
  const [data, setData] = useState<GoalData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [addAmount, setAddAmount] = useState<string>('');

  // Hydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wallet_goal_data');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        setData(DEFAULT_DATA);
      }
    } else {
      setData(DEFAULT_DATA);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (data) {
      localStorage.setItem('wallet_goal_data', JSON.stringify(data));
    }
  }, [data]);

  if (!data) return <div className="min-h-screen bg-carbon text-chalk flex items-center justify-center">Загрузка...</div>;

  const handleUpdateGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const targetAmount = Number(formData.get('targetAmount'));
    const currentAmount = Number(formData.get('currentAmount'));
    const targetDate = String(formData.get('targetDate'));

    setData({
      targetAmount,
      currentAmount,
      targetDate
    });
    setIsEditing(false);
  };

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(addAmount);
    if (!isNaN(amount) && amount > 0) {
      setData(prev => prev ? { ...prev, currentAmount: prev.currentAmount + amount } : prev);
      setAddAmount('');
    }
  };

  // Calculations
  const remaining = Math.max(0, data.targetAmount - data.currentAmount);
  const percentComplete = Math.min(100, (data.currentAmount / data.targetAmount) * 100);
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const targetDateObj = parseISO(data.targetDate);
  let daysRemaining = isValid(targetDateObj) ? differenceInDays(targetDateObj, today) : 0;
  if (daysRemaining < 0) daysRemaining = 0;
  
  const dailyNeeded = daysRemaining > 0 ? remaining / daysRemaining : 0;

  const formattedTargetAmount = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(data.targetAmount);
  const formattedCurrentAmount = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(data.currentAmount);
  const formattedRemaining = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(remaining);
  const formattedDaily = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(dailyNeeded);

  return (
    <>
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full h-16 bg-void-black border-b border-graphite z-40 flex items-center justify-center">
        <div className="w-full max-w-[1280px] px-6 lg:px-12 flex justify-between items-center">
          <div className="font-serif text-xl tracking-wide text-chalk">
            WALLET
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 border border-signal-lime text-signal-lime px-5 py-2 rounded-[4px] font-sans text-[13px] font-medium uppercase tracking-[0.08em] shadow-sm-glow transition-all hover:bg-signal-lime hover:text-void-black"
          >
            <Settings2 size={16} className="group-hover:text-void-black transition-colors" />
            НАСТРОЙКИ
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="pt-24 pb-20 px-6 lg:px-12 max-w-[1280px] mx-auto min-h-screen flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="mt-12 mb-20 w-full flex flex-col items-center text-center relative z-10 py-12">
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 flex justify-center items-center">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotPattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#ffffff" />
                </pattern>
                <radialGradient id="fade" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="white" stopOpacity="1" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#dotPattern)" mask="url(#fade)" style={{ maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)' }} />
            </svg>
          </div>

          {/* Eyebrow */}
          <div className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ash mb-6 relative z-10">
            [ ПЕРСОНАЛЬНАЯ ЦЕЛЬ ]
          </div>
          
          <h1 className="font-serif text-[49px] sm:text-[60px] md:text-[89px] leading-[0.94] tracking-[-3.1px] text-chalk max-w-4xl relative z-10">
            Мой путь к <br/>
            <span className="italic text-signal-lime">Финансовой Свободе.</span>
          </h1>
          
          <p className="mt-8 font-sans text-sm text-bone max-w-lg leading-[1.55] relative z-10">
            Управляйте своим капиталом, отслеживайте прогресс и достигайте поставленных целей с точностью.
          </p>
        </section>

        {/* Dotted Divider */}
        <div className="w-full h-[6px] bg-signal-lime mb-20 relative shadow-sm-glow rounded-full"></div>

        {/* Dashboard Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-[16px] md:gap-[20px]">
          
          {/* Main Progress Card */}
          <div className="md:col-span-8 bg-onyx border border-graphite p-8 md:p-12 relative flex flex-col justify-between min-h-[320px]">
            <div className="flex justify-between items-start mb-12">
              <div className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ash">
                ОБЩИЙ ПРОГРЕСС
              </div>
              <div className="flex items-center gap-2 border border-signal-lime text-signal-lime px-3 py-1 rounded-full font-sans text-[11px] font-medium uppercase tracking-[0.06em]">
                <Target size={12} />
                ЦЕЛЬ АКТИВНА
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="font-serif text-[40px] md:text-[56px] text-chalk leading-none tracking-tight">
                  {formattedCurrentAmount}
                </span>
                <span className="font-mono text-[13px] text-ash">
                  / {formattedTargetAmount}
                </span>
              </div>
              
              <div className="mt-8 relative w-full h-[4px] bg-void-black rounded-full overflow-hidden border border-graphite">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentComplete}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-signal-lime shadow-sm-glow"
                />
              </div>
              <div className="mt-4 flex justify-between items-center font-mono text-[11px] text-ash uppercase tracking-widest">
                <span>0%</span>
                <span className="text-signal-lime font-medium">{percentComplete.toFixed(1)}% ВЫПОЛНЕНО</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="md:col-span-4 flex flex-col gap-[16px] md:gap-[20px]">
            {/* Quick Add Funds */}
            <div className="bg-onyx border border-graphite p-6 flex-1 flex flex-col justify-center">
              <div className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ash mb-4">
                ПОПОЛНЕНИЕ КОШЕЛЬКА
              </div>
              <form onSubmit={handleAddFunds} className="flex gap-2">
                <input 
                  type="number" 
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Сумма..."
                  className="w-full bg-void-black border border-graphite text-chalk font-mono text-[13px] p-3 focus:border-signal-lime transition-colors"
                />
                <button type="submit" disabled={!addAmount} className="bg-signal-lime text-void-black px-4 font-sans text-[13px] font-semibold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50">
                  <Plus size={18} />
                </button>
              </form>
            </div>

            {/* Remaining Amount */}
            <div className="bg-void-black border border-graphite p-6 flex-1 flex flex-col justify-center">
              <div className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ash mb-2">
                ОСТАЛОСЬ НАКОПИТЬ
              </div>
              <div className="font-mono text-[20px] text-chalk mt-2">
                {formattedRemaining}
              </div>
            </div>
          </div>

          {/* Bottom Row Stats */}
          <div className="md:col-span-6 bg-onyx border border-graphite p-8 flex flex-col justify-between">
            <div className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ash mb-8 flex items-center gap-2">
              <Calendar size={14} />
              ДЕДЛАЙН
            </div>
            <div>
              <div className="font-serif text-[32px] text-chalk mb-2">
                {isValid(targetDateObj) ? format(targetDateObj, 'dd MMMM yyyy', { locale: ru }) : 'Не задано'}
              </div>
              <div className="font-mono text-[13px] text-signal-lime">
                {daysRemaining} ДНЕЙ ОСТАЛОСЬ
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-onyx border border-graphite p-8 flex flex-col justify-between">
            <div className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ash mb-8 flex items-center gap-2">
              <TrendingUp size={14} />
              НЕОБХОДИМО В ДЕНЬ
            </div>
            <div>
              <div className="font-serif text-[32px] text-chalk mb-2">
                {formattedDaily}
              </div>
              <div className="font-mono text-[13px] text-ash">
                СРЕДНИЙ ДНЕВНОЙ ЗАРАБОТОК
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
              className="absolute inset-0 bg-void-black/80 backdrop-blur-sm"
              onClick={() => setIsEditing(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="relative w-full max-w-lg bg-onyx border border-graphite p-8 md:p-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-6 right-6 text-ash hover:text-signal-lime transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="font-serif text-[24px] text-chalk mb-8">Настройки Цели</h2>
              
              <form onSubmit={handleUpdateGoal} className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ash">
                    ЦЕЛЬ (СУММА)
                  </label>
                  <input 
                    type="number" 
                    name="targetAmount" 
                    defaultValue={data.targetAmount}
                    required
                    className="bg-void-black border border-graphite p-4 text-chalk font-mono text-[14px] focus:border-signal-lime transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ash">
                    УЖЕ НАКОПЛЕНО
                  </label>
                  <input 
                    type="number" 
                    name="currentAmount" 
                    defaultValue={data.currentAmount}
                    required
                    className="bg-void-black border border-graphite p-4 text-chalk font-mono text-[14px] focus:border-signal-lime transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ash">
                    ЦЕЛЕВАЯ ДАТА
                  </label>
                  <input 
                    type="date" 
                    name="targetDate" 
                    defaultValue={data.targetDate}
                    required
                    className="bg-void-black border border-graphite p-4 text-chalk font-mono text-[14px] focus:border-signal-lime transition-colors"
                  />
                </div>

                <button 
                  type="submit"
                  className="mt-4 bg-signal-lime text-void-black font-sans font-semibold text-[14px] uppercase tracking-[0.08em] p-4 flex items-center justify-center gap-2 hover:bg-chalk transition-colors shadow-sm-glow"
                >
                  СОХРАНИТЬ ИЗМЕНЕНИЯ
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
