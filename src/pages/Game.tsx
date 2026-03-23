import { useParams } from 'react-router-dom'
import { Message } from '@/components/chat'
import { stories } from '@/data/stories'

export default function Game() {
  const { id } = useParams<{ id: string }>()
  const story = stories.find(s => s.id === id)

  // 示例消息
  const sampleMessages = [
    {
      role: 'ai' as const,
      content: `欢迎来到海龟汤游戏！\n\n汤面：${story?.surface || '故事加载中...'}`,
    },
    {
      role: 'user' as const,
      content: '这个人是不是遇到了危险？',
    },
    {
      role: 'ai' as const,
      content: '否。',
    },
    {
      role: 'user' as const,
      content: '他是不是故意去那个地方的？',
    },
    {
      role: 'ai' as const,
      content: '是。',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{story?.title || '加载中...'}</h1>
          <p className="text-slate-400">剧本ID: {id}</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 min-h-[500px]">
          <div className="space-y-4">
            {sampleMessages.map((msg, index) => (
              <Message key={index} message={msg} />
            ))}
          </div>
        </div>

        {/* Input Area (placeholder) */}
        <div className="mt-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="输入你的问题..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-400"
                disabled
              />
              <button className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white text-sm font-medium">
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}