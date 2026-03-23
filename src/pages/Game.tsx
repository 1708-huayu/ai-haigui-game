import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChatBox } from '@/components/chat'
import ConfirmModal from '@/components/common/ConfirmModal'
import { stories } from '@/data/stories'
import { askAI, checkWinCondition } from '@/api/ai'

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
}

type GameStatus = 'playing' | 'won' | 'abandoned' | 'revealed'

export default function Game() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const story = stories.find(s => s.id === id)
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'reveal' | 'end' | null>(null)
  const messagesRef = useRef<ChatMessage[]>([])

  // 防止意外离开页面
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (gameStatus === 'playing') {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [gameStatus])

  // 处理发送消息的回调
  const handleSendMessage = async (message: string): Promise<string> => {
    if (!story) {
      return '故事加载失败，请刷新页面重试。'
    }

    if (gameStatus !== 'playing') {
      return '游戏已结束，请返回大厅或开始新游戏。'
    }

    try {
      // 检查是否猜中真相
      if (checkWinCondition(message, story)) {
        setGameStatus('won')
        
        // 延迟跳转到结果页面
        setTimeout(() => {
          navigate(`/result/${id}`, { 
            state: { 
              messages: messagesRef.current,
              gameStatus: 'won'
            } 
          })
        }, 2000)
        
        return `恭喜你！你猜中了真相！\n\n汤底：${story.bottom}`
      }

      // 调用AI API
      const response = await askAI(message, story)
      
      // 根据回答类型添加不同的格式
      switch (response) {
        case '是':
          return '是。'
        case '否':
          return '否。'
        case '无关':
          return '无关。'
        default:
          return response
      }
    } catch (error) {
      console.error('AI调用失败:', error)
      return '抱歉，AI主持人暂时无法回答，请稍后再试。'
    }
  }

  // 更新消息引用
  const handleMessagesChange = (messages: ChatMessage[]) => {
    messagesRef.current = messages
  }

  // 初始消息
  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      role: 'ai',
      content: `欢迎来到海龟汤游戏！\n\n汤面：${story?.surface || '故事加载中...'}\n\n请开始提问，我会回答"是"、"否"或"无关"。`,
    },
  ]

  // 查看汤底（显示确认对话框）
  const handleRevealBottom = () => {
    setConfirmAction('reveal')
    setShowConfirmModal(true)
  }

  // 结束游戏（显示确认对话框）
  const handleEndGame = () => {
    setConfirmAction('end')
    setShowConfirmModal(true)
  }

  // 确认操作
  const handleConfirm = () => {
    setShowConfirmModal(false)
    
    if (confirmAction === 'reveal') {
      setGameStatus('revealed')
      navigate(`/result/${id}`, { 
        state: { 
          messages: messagesRef.current,
          gameStatus: 'revealed'
        } 
      })
    } else if (confirmAction === 'end') {
      setGameStatus('abandoned')
      navigate('/')
    }
  }

  // 取消操作
  const handleCancel = () => {
    setShowConfirmModal(false)
    setConfirmAction(null)
  }

  // 重新开始游戏
  const handleRestart = () => {
    setGameStatus('playing')
    window.location.reload()
  }

  // 获取状态显示
  const getStatusDisplay = () => {
    switch (gameStatus) {
      case 'won':
        return { text: '已猜中真相！', color: 'text-amber-400', bg: 'bg-amber-500/20' }
      case 'revealed':
        return { text: '已查看汤底', color: 'text-blue-400', bg: 'bg-blue-500/20' }
      case 'abandoned':
        return { text: '已放弃', color: 'text-slate-400', bg: 'bg-slate-500/20' }
      default:
        return { text: '进行中', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
    }
  }

  const status = getStatusDisplay()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.03),transparent_40%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 h-screen flex flex-col">
        {/* Top Section - Story Info */}
        <div className="mb-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    story?.difficulty === '入门' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : story?.difficulty === '烧脑'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}>
                    {story?.difficulty || '未知难度'}
                  </span>
                  <span className="text-slate-500 text-sm">剧本ID: {id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} border border-current/20`}>
                    {status.text}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  {story?.title || '加载中...'}
                </h1>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                  <p className="text-slate-300 leading-relaxed">
                    <span className="text-amber-400 font-medium">汤面：</span>
                    {story?.surface || '故事加载中...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Chat */}
        <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden mb-6 min-h-0">
          <ChatBox 
            initialMessages={initialMessages}
            onSendMessage={handleSendMessage}
            onMessagesChange={handleMessagesChange}
          />
        </div>

        {/* Bottom Section - Actions */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {gameStatus === 'playing' ? (
              <>
                <button
                  onClick={handleRevealBottom}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white font-medium hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  查看汤底
                </button>
                <button
                  onClick={handleEndGame}
                  className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  放弃游戏
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  再玩一次
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  返回大厅
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title={confirmAction === 'reveal' ? '查看汤底' : '放弃游戏'}
        message={confirmAction === 'reveal' 
          ? '确定要查看汤底吗？这将结束当前游戏。'
          : '确定要放弃当前游戏吗？你的进度将会丢失。'
        }
        confirmText={confirmAction === 'reveal' ? '查看汤底' : '放弃游戏'}
        cancelText='继续游戏'
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        variant={confirmAction === 'end' ? 'danger' : 'warning'}
      />
    </div>
  )
}