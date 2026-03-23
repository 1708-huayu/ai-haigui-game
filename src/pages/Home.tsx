import React from 'react';
import { stories } from '../stories';
import GameCard from '../components/game/GameCard';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="py-12 text-center relative overflow-hidden">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-300"></div>
          
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 mb-6 tracking-tight">
              AI 海龟汤
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
              一款由 AI 驱动的多人在线情境推理游戏。挑战你的逻辑思维，揭开层层谜团，探索隐藏在表象之下的真相。
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-slate-300 text-sm">
                🧩 逻辑推理
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-slate-300 text-sm">
                👥 多人协作
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-slate-300 text-sm">
                🤖 AI主持
              </div>
            </div>
          </div>
        </header>

        <section className="py-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">精选故事</h2>
            <p className="text-slate-400">选择一个故事开始你的推理之旅</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stories.map((story) => (
              <div key={story.id} className="transform hover:scale-105 transition-all duration-300">
                <GameCard story={story} />
              </div>
            ))}
          </div>
        </section>
        
        <footer className="py-12 text-center text-slate-500 text-sm">
          <p>© 2026 AI 海龟汤 - 挑战你的逻辑极限</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;