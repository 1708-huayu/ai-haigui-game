import React from 'react';
import { stories } from '../stories';
import GameCard from '../components/game/GameCard';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="py-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-4">
            AI 海龟汤
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            一款由 AI 驱动的多人在线情境推理游戏。挑战你的逻辑思维，揭开层层谜团，探索隐藏在表象之下的真相。
          </p>
        </header>

        <section className="py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stories.map((story) => (
              <GameCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;