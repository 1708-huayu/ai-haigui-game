import { useParams } from 'react-router-dom'
import { ChatBox } from '@/components/chat'
import { stories } from '@/data/stories'

export default function Game() {
  const { id } = useParams<{ id: string }>()
  const story = stories.find(s => s.id === id)

  // 处理发送消息的回调
  const handleSendMessage = async (message: string): Promise<string> => {
    // 这里应该调用AI API，现在模拟回复
    console.log('用户提问:', message)
    
    // 模拟AI思考时间
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟AI回复
    const responses = ['是。', '否。', '无关。', '是，但不完全。', '否，但接近了。']
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // 初始消息
  const initialMessages = [
    {
      id: '1',
      role: 'ai' as const,
      content: `欢迎来到海龟汤游戏！\n\n汤面：${story?.surface || '故事加载中...'}`,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">{story?.title || '加载中...'}</h1>
          <p className="text-slate-400 text-sm">剧本ID: {id} | 难度: {story?.difficulty || '未知'}</p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
          <ChatBox 
            initialMessages={initialMessages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  )
}