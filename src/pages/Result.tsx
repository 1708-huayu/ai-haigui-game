import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { stories } from '@/data/stories'
import { Message } from '@/components/chat'

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
}

export default function Result() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const story = stories.find(s => s.id === id)
  
  // 从location state获取对话历史
  const chatHistory = (location.state as { messages?: ChatMessage[] })?.messages || []
  
  // 动画状态
  const [isRevealing, setIsRevealing] = useState(true)
  const [showContent, setShowContent] = useState(false)

  // 揭晓动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealing(false)
      setTimeout(() => setShowContent(true), 500)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // 返回大厅
  const handlePlayAgain = () => {
    navigate('/')
  }

  // 返回游戏
  const handleBackToGame = () => {
    navigate(`/game/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.03),transparent_40%)]" />
      </div>

      {/* Reveal animation overlay */}
      {isRevealing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
          <div className="text-center">
            <div className="relative">
              {/* Rotating circles */}
              <div className="w-32 h-32 border-4 border-amber-500/20 rounded-full animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              <div className="w-24 h-24 border-4 border-amber-500/30 rounded-full animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
              <div className="w-16 h-16 border-4 border-amber-500/40 rounded-full animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '2s' }} />
              
              {/* Center icon */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg className="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mt-8 text-amber-400 animate-pulse">
              真相揭晓
            </h1>
            <p className="text-slate-400 mt-2">准备好了吗？</p>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBackToGame}
            className="mb-4 text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回游戏
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {story?.title || '未知故事'}
          </h1>
          <p className="text-slate-400">游戏结束</p>
        </div>

        {/* Main content */}
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Story bottom */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-lg rounded-2xl border border-amber-500/20 p-6 md:p-8 mb-8 shadow-lg shadow-amber-500/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-amber-400">汤底揭晓</h2>
            </div>
            
            <div className="bg-slate-900/50 rounded-xl p-5 border border-white/10">
              <p className="text-slate-200 leading-relaxed text-lg">
                {story?.bottom || '汤底加载中...'}
              </p>
            </div>
          </div>

          {/* Key clues */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-slate-300">关键线索</h3>
            <div className="flex flex-wrap gap-2">
              {story?.winConditions?.map((condition, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 text-sm font-medium"
                >
                  {condition}
                </span>
              )) || <span className="text-slate-500">暂无关键线索</span>}
            </div>
          </div>

          {/* Chat history */}
          {chatHistory.length > 0 && (
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-slate-300">对话历史</h3>
              <div className="max-h-96 overflow-y-auto space-y-4">
                {chatHistory.map((message, index) => (
                  <Message key={index} message={message} />
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">提问次数</p>
              <p className="text-2xl font-bold text-white">
                {chatHistory.filter(m => m.role === 'user').length}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">难度</p>
              <p className={`text-2xl font-bold ${
                story?.difficulty === '入门' 
                  ? 'text-emerald-400'
                  : story?.difficulty === '烧脑'
                    ? 'text-amber-400'
                    : 'text-purple-400'
              }`}>
                {story?.difficulty || '未知'}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">状态</p>
              <p className="text-2xl font-bold text-emerald-400">已完成</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePlayAgain}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              再来一局
            </button>
            <button
              onClick={handleBackToGame}
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回游戏
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}