/** @jsxImportSource react */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Camera, PenTool, Layers, Search, Bell, Settings, Command, 
  Activity, Clock, Zap, Cpu, Globe, ArrowRight, CheckCircle2,
  Sparkles, Hash, Calendar, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- 工具函数 ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 模拟趋势数据 (用于装饰统计卡片) ---
const trendData = [
  { name: 'Mon', value: 30 }, { name: 'Tue', value: 45 },
  { name: 'Wed', value: 38 }, { name: 'Thu', value: 65 },
  { name: 'Fri', value: 48 }, { name: 'Sat', value: 75 },
  { name: 'Sun', value: 90 },
];

// --- 1. 顶级玻璃拟态卡片 (带鼠标感应流光) ---
const PremiumCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-[24px] border border-white/20 bg-white/40 backdrop-blur-2xl transition-all duration-500 hover:bg-white/60 hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.1)]",
        className
      )}
    >
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(175, 237, 227, 0.3), transparent 40%)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// --- 2. 核心动画序列组件 ---
const LoveScrollSequence = ({ name }: { name: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const p1 = useTransform(scrollYProgress, [0.05, 0.4], [0, 1]); // 遮罩阶段
  const p2 = useTransform(scrollYProgress, [0.65, 0.9], [0, 1]); // 整体淡出阶段
  
  const scale = useTransform(p2, [0, 1], [1, 0.85]);
  const opacity = useTransform(p2, [0, 1], [1, 0]);
  const textOpacity = useTransform(p1, [0, 0.8], [1, 0]);
  const clipInset = useTransform(p1, [0, 1], [100, 0]);

  return (
    <div ref={containerRef} className="h-[250vh] relative pointer-events-none">
      <div className="sticky top-0 h-screen flex justify-center items-center overflow-hidden">
        <motion.div 
          style={{ scale, opacity }}
          className="w-[280px] h-[280px] bg-white rounded-[48px] shadow-2xl flex justify-center items-center relative overflow-hidden border border-white/50"
        >
          <motion.span 
            style={{ opacity: textOpacity }}
            className="text-[48px] font-black tracking-tighter text-[#1d1d1f]"
          >
            {name}
          </motion.span>
          
          <motion.div 
            className="absolute inset-0 bg-[#afede3]"
            style={{ clipPath: useTransform(clipInset, v => `inset(${v}% 0 0 0)`) }}
          >
            <svg width="100%" height="100%" viewBox="0 0 280 280">
              <defs>
                <mask id="love-mask-v2">
                  <rect width="100%" height="100%" fill="white" />
                  <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="68" fontWeight="900" letterSpacing="-2" fill="black">LOVE</text>
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="#afede3" mask="url(#love-mask-v2)" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// --- 主组件 ---
export default function UltimateHome({ profile, latestContent }: any) {
  const [activeTab, setActiveTab] = useState('all');
  const { scrollYProgress } = useScroll();
  const mainOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const mainTranslateY = useTransform(scrollYProgress, [0.75, 0.9], [40, 0]);

  return (
    <div className="relative min-h-screen selection:bg-[#afede3] selection:text-[#0a3a33]">
      <LoveScrollSequence name={profile.name} />

      <motion.div 
        style={{ opacity: mainOpacity, y: mainTranslateY }}
        className="max-w-[1000px] mx-auto px-6 pb-32 -mt-[40vh] relative z-20"
      >
        {/* 顶部导航 */}
        <header className="flex justify-between items-center mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1d1d1f] text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-black/10">A</div>
            <span className="font-bold text-lg tracking-tight">{profile.name}</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-[#86868b]">
            {['关于', '友链', '搜索'].map(item => (
              <a key={item} href="#" className="hover:text-[#1d1d1f] transition-colors">{item}</a>
            ))}
            <button className="p-2 bg-black/5 rounded-full hover:bg-black/10 transition-colors">
              <Command size={16} className="text-[#1d1d1f]" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 个人简介大卡片 */}
          <PremiumCard className="md:col-span-2 p-10 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center gap-2 text-[#10b981] mb-4">
                <Sparkles size={18} fill="currentColor" />
                <span className="text-xs font-bold uppercase tracking-widest">Premium Creative</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">
                你好，我是 <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-[#86868b]">{profile.name}</span>
              </h1>
              <p className="text-xl text-[#86868b] font-medium max-w-md leading-relaxed">
                {profile.tagline}。致力于捕捉瞬间的灵光与永恒的诗意。
              </p>
            </div>
            <div className="flex gap-4 mt-8">
              <button className="px-6 py-3 bg-[#1d1d1f] text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                浏览作品集 <ArrowRight size={18} />
              </button>
            </div>
          </PremiumCard>

          {/* 统计指标卡片 */}
          <PremiumCard className="p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[#afede3]/30 rounded-2xl text-[#0a3a33]">
                <Activity size={24} />
              </div>
              <span className="text-[10px] font-black px-2 py-1 bg-black/5 rounded-lg text-[#86868b]">LIVE STATUS</span>
            </div>
            <div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black tracking-tighter">{profile.stats.reduce((acc:any, curr:any) => acc + curr.count, 0)}</span>
                <span className="text-sm text-[#86868b] font-bold mb-1">Total Pieces</span>
              </div>
              <div className="h-20 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#afede3" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#afede3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#0da38c" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* 内容过滤器 */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="inline-flex bg-black/5 p-1.5 rounded-2xl backdrop-blur-md border border-white/20">
            {['全部', '诗歌', '摄影'].map((tab, idx) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(idx === 0 ? 'all' : (idx === 1 ? 'poems' : 'photos'))}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                  (activeTab === 'all' && idx === 0) || (activeTab === 'poems' && idx === 1) || (activeTab === 'photos' && idx === 2)
                    ? "bg-white text-black shadow-sm"
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="text-xs font-bold text-[#86868b] flex items-center gap-2">
            <Clock size={14} /> 最近更新：{new Date().toLocaleDateString()}
          </div>
        </div>

        {/* 动态内容网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode='popLayout'>
            {latestContent
              .filter((item:any) => activeTab === 'all' || item.type === activeTab)
              .map((item:any, index:number) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                key={item.slug}
              >
                <PremiumCard className="p-1">
                  <a href={`/${item.type}/${item.slug}`} className="block p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        item.type === 'poems' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {item.typeLabel}
                      </div>
                      <ChevronRight size={18} className="text-black/20 group-hover:text-black/60 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-[#0da38c] transition-colors">
                      {item.data.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-[#86868b]">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.data.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Hash size={12} /> {item.data.series || '未分类'}</span>
                    </div>
                  </a>
                </PremiumCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}