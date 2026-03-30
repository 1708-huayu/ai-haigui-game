import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { stories, updateStory } from '@/data/stories'
import { optimizeSurface, optimizeBottom, generateWinConditions, checkStoryConsistency, generateStory } from '@/api/ai'
import type { IStory } from '@/types/models'

export default function EditStory() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const originalStory = stories.find(s => s.id === id)

  const [formData, setFormData] = useState<IStory>({
    id: '',
    title: '',
    difficulty: '入门',
    surface: '',
    bottom: '',
    winConditions: [],
  })
  const [winConditionInput, setWinConditionInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isOptimizingSurface, setIsOptimizingSurface] = useState(false)
  const [isOptimizingBottom, setIsOptimizingBottom] = useState(false)
  const [isGeneratingConditions, setIsGeneratingConditions] = useState(false)
  const [isCheckingConsistency, setIsCheckingConsistency] = useState(false)
  const [isGeneratingStory, setIsGeneratingStory] = useState(false)
  const [consistencyResult, setConsistencyResult] = useState<{
    isConsistent: boolean
    suggestions: string[]
  } | null>(null)

  useEffect(() => {
    if (originalStory) {
      setFormData({ ...originalStory })
    }
  }, [originalStory])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddWinCondition = () => {
    if (winConditionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        winConditions: [...prev.winConditions, winConditionInput.trim()],
      }))
      setWinConditionInput('')
    }
  }

  const handleRemoveWinCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      winConditions: prev.winConditions.filter((_, i) => i !== index),
    }))
  }

  const handleOptimizeSurface = async () => {
    if (!formData.surface) return
    setIsOptimizingSurface(true)
    try {
      const optimized = await optimizeSurface(formData.surface, formData.bottom)
      setFormData(prev => ({ ...prev, surface: optimized }))
    } catch (error) {
      console.error('优化汤面失败:', error)
    } finally {
      setIsOptimizingSurface(false)
    }
  }

  const handleOptimizeBottom = async () => {
    if (!formData.bottom) return
    setIsOptimizingBottom(true)
    try {
      const optimized = await optimizeBottom(formData.bottom)
      setFormData(prev => ({ ...prev, bottom: optimized }))
    } catch (error) {
      console.error('优化汤底失败:', error)
    } finally {
      setIsOptimizingBottom(false)
    }
  }

  const handleGenerateConditions = async () => {
    if (!formData.bottom) return
    setIsGeneratingConditions(true)
    try {
      const conditions = await generateWinConditions(formData.surface, formData.bottom)
      setFormData(prev => ({ ...prev, winConditions: conditions }))
    } catch (error) {
      console.error('生成关键线索失败:', error)
    } finally {
      setIsGeneratingConditions(false)
    }
  }

  const handleCheckConsistency = async () => {
    setIsCheckingConsistency(true)
    try {
      const result = await checkStoryConsistency(formData)
      setConsistencyResult(result)
    } catch (error) {
      console.error('检查一致性失败:', error)
    } finally {
      setIsCheckingConsistency(false)
    }
  }

  const handleGenerateStory = async () => {
    setIsGeneratingStory(true)
    try {
      const generated = await generateStory(formData.difficulty)
      setFormData(prev => ({
        ...prev,
        title: generated.title,
        surface: generated.surface,
        bottom: generated.bottom,
        winConditions: generated.winConditions,
      }))
    } catch (error) {
      console.error('生成故事失败:', error)
    } finally {
      setIsGeneratingStory(false)
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.surface || !formData.bottom) {
      alert('请填写完整的故事信息')
      return
    }

    setIsSaving(true)

    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      updateStory(formData)
      setSaveSuccess(true)

      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  if (!originalStory) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">剧本不存在</h2>
          <p className="text-slate-400 mb-6">找不到指定的剧本</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            返回大厅
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.03),transparent_40%)]" />
      </div>

      {/* Success overlay */}
      {saveSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center animate-bounce">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">保存成功！</h2>
            <p className="text-slate-400">正在返回大厅...</p>
          </div>
        </div>
      )}

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-white/10">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回
            </button>
            <h1 className="text-xl font-bold">编辑剧本</h1>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  保存中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  保存
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* AI一键生成 */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">AI一键生成</h3>
                  <p className="text-slate-400 text-sm">根据选择的难度等级，AI自动生成完整故事</p>
                </div>
                <button
                  onClick={handleGenerateStory}
                  disabled={isGeneratingStory}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                >
                  {isGeneratingStory ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      一键生成
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                故事标题 *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="输入故事标题"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            {/* Difficulty */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                难度等级 *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              >
                <option value="入门" className="bg-slate-900">入门</option>
                <option value="烧脑" className="bg-slate-900">烧脑</option>
                <option value="诡异" className="bg-slate-900">诡异</option>
              </select>
            </div>

            {/* Surface */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  汤面（故事表面） *
                </label>
                <button
                  onClick={handleOptimizeSurface}
                  disabled={isOptimizingSurface || !formData.surface}
                  className="px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg text-white text-sm font-medium hover:from-amber-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-1"
                >
                  {isOptimizingSurface ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      优化中...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI优化
                    </>
                  )}
                </button>
              </div>
              <textarea
                name="surface"
                value={formData.surface}
                onChange={handleInputChange}
                placeholder="输入故事的表面描述..."
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
              />
            </div>

            {/* Bottom */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  汤底（故事真相） *
                </label>
                <button
                  onClick={handleOptimizeBottom}
                  disabled={isOptimizingBottom || !formData.bottom}
                  className="px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg text-white text-sm font-medium hover:from-amber-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-1"
                >
                  {isOptimizingBottom ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      优化中...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI优化
                    </>
                  )}
                </button>
              </div>
              <textarea
                name="bottom"
                value={formData.bottom}
                onChange={handleInputChange}
                placeholder="输入故事的真相..."
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
              />
            </div>

            {/* Win Conditions */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  关键线索
                </label>
                <button
                  onClick={handleGenerateConditions}
                  disabled={isGeneratingConditions || !formData.bottom}
                  className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg text-white text-sm font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-1"
                >
                  {isGeneratingConditions ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI生成
                    </>
                  )}
                </button>
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={winConditionInput}
                  onChange={(e) => setWinConditionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddWinCondition()}
                  placeholder="添加关键线索"
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
                <button
                  onClick={handleAddWinCondition}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                >
                  添加
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.winConditions.map((condition, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 text-sm"
                  >
                    {condition}
                    <button
                      onClick={() => handleRemoveWinCondition(index)}
                      className="text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Consistency Check */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-300">AI一致性检查</h3>
                <button
                  onClick={handleCheckConsistency}
                  disabled={isCheckingConsistency || !formData.surface || !formData.bottom}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {isCheckingConsistency ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      检查中...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      检查一致性
                    </>
                  )}
                </button>
              </div>

              {consistencyResult && (
                <div className={`p-4 rounded-xl ${
                  consistencyResult.isConsistent 
                    ? 'bg-emerald-500/10 border border-emerald-500/20' 
                    : 'bg-amber-500/10 border border-amber-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {consistencyResult.isConsistent ? (
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                    <span className={`font-medium ${consistencyResult.isConsistent ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {consistencyResult.isConsistent ? '剧本一致' : '需要改进'}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {consistencyResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-slate-500">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-slate-300 mb-4">预览</h3>
              <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.difficulty === '入门'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : formData.difficulty === '烧脑'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {formData.difficulty}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{formData.title || '未命名故事'}</h4>
                <p className="text-slate-300 text-sm mb-4">{formData.surface || '暂无汤面描述'}</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-slate-400 text-xs mb-1">汤底：</p>
                  <p className="text-slate-300 text-sm">{formData.bottom || '暂无汤底描述'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}