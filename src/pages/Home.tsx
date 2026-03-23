import { Button } from "@/components/ui/button"
import { GameCard } from "@/components/game"
import { stories } from "@/data/stories"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AI 海龟汤游戏
        </h1>
        <p className="text-slate-400 mb-8 text-lg max-w-2xl mx-auto">
          多人情境推理游戏，与AI主持人一起探索悬疑故事
        </p>
        <Button variant="default" size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          开始游戏
        </Button>
      </section>

      {/* Game Stories Section */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">选择剧本</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <GameCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}