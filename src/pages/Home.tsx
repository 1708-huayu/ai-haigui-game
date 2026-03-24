import { GameCard } from "@/components/game"
import { stories } from "@/data/stories"

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.05),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.05),transparent_40%)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Hero Section */}
        <section className="pt-12 pb-8 px-4 text-center flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="inline-block px-4 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm">
                多人在线推理游戏
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-amber-400 bg-clip-text text-transparent">
              AI海龟汤
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              在悬疑与推理的世界中，与AI主持人展开一场智力对决。
              <br />
              每个故事背后都藏着不为人知的真相……
            </p>
          </div>
        </section>

        {/* Game Stories Section */}
        <section className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">选择你的剧本</h2>
              <p className="text-slate-500 text-sm">点击卡片开始推理之旅</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {stories.map((story) => (
                <GameCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-4 px-4 text-center text-slate-600 text-sm flex-shrink-0">
          <p>AI海龟汤 · 多人情境推理游戏</p>
        </footer>
      </div>
    </div>
  )
}