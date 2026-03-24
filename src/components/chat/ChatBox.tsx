import { useState, useRef, useEffect } from 'react'
import Message from './Message'

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
}

interface ChatBoxProps {
  initialMessages?: ChatMessage[]
  onSendMessage?: (message: string) => Promise<string>
  onMessagesChange?: (messages: ChatMessage[]) => void
}

export default function ChatBox({ 
  initialMessages = [], 
  onSendMessage,
  onMessagesChange 
}: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 通知父组件消息变化
  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages)
    }
  }, [messages, onMessagesChange])

  // 清除错误提示
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // 验证问题格式
  const validateQuestion = (question: string): boolean => {
    const trimmedQuestion = question.trim()
    
    // 检查是否为空
    if (!trimmedQuestion) {
      return false
    }
    
    // 检查长度
    if (trimmedQuestion.length < 2) {
      return false
    }
    
    // 检查是否是无效问题（不是是非题）
    const invalidPatterns = [
      /^你好/, /^hi/, /^hello/, /^在吗/, /^在不在/,
      /^谢谢/, /^感谢/, /^thanks/, /^thank you/,
      /^你是谁/, /^你叫什么/, /^你是什么/,
    ]
    
    const isInvalid = invalidPatterns.some(pattern => 
      pattern.test(trimmedQuestion.toLowerCase())
    )
    
    return !isInvalid
  }

  // 处理发送消息
  const handleSend = async () => {
    const trimmedValue = inputValue.trim()
    if (!trimmedValue || isLoading) return

    // 验证问题格式
    if (!validateQuestion(trimmedValue)) {
      setError('请输入关于故事的是非题')
      return
    }

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedValue,
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError(null)

    try {
      // 调用AI回调
      let aiResponse = '否。'
      if (onSendMessage) {
        aiResponse = await onSendMessage(trimmedValue)
      } else {
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // 添加AI回复
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse,
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('发送消息失败:', error)
      setError('消息发送失败，请重试')
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 示例问题点击处理
  const handleExampleClick = (example: string) => {
    setInputValue(example)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full">
      {/* 错误提示 */}
      {error && (
        <div className="mx-4 mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md mx-auto">
              {/* 空状态图标 */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-slate-300 mb-2">开始你的推理之旅</h3>
              <p className="text-slate-500 text-sm mb-6">
                输入是非题，AI主持人会回答"是"、"否"或"无关"
              </p>
              
              {/* 示例问题卡片 */}
              <div className="space-y-2">
                <p className="text-xs text-slate-600 uppercase tracking-wider">示例问题</p>
                <div className="grid gap-2">
                  {[
                    '"这个人是不是遇到了危险？"',
                    '"他是不是故意去那个地方的？"',
                    '"这件事是不是发生在晚上？"'
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example.replace(/"/g, ''))}
                      className="text-left px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-400 hover:text-slate-300 text-sm transition-all duration-200 hover:border-white/20"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={message.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Message message={message} />
            </div>
          ))
        )}
        
        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex justify-start mb-4 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mr-3 flex-shrink-0 animate-pulse">
              <svg
                className="w-4 h-4 text-white animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-3 text-slate-200">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-300">思考中</span>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-white/10">
        <div className={`flex items-center space-x-3 transition-all duration-200 ${isInputFocused ? 'transform scale-[1.02]' : ''}`}>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="输入你的问题..."
              disabled={isLoading}
              className={`w-full bg-white/10 backdrop-blur-lg border rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                isInputFocused 
                  ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' 
                  : 'border-white/20 hover:border-white/30'
              }`}
            />
            {/* 字符计数 */}
            {inputValue.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-500">
                {inputValue.length}/100
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={`px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20 ${
              inputValue.trim() && !isLoading 
                ? 'hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95' 
                : ''
            }`}
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
        
        {/* 移动端提示 */}
        <div className="mt-2 text-center text-xs text-slate-600 md:hidden">
          按回车发送
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}