import type { IStory } from '@/types/models'
import { useNavigate } from 'react-router-dom'

interface GameCardProps {
  story: IStory
}

export default function GameCard({ story }: GameCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/room?storyId=${story.id}`)
  }

  const getDifficultyColor = (difficulty: IStory['difficulty']) => {
    switch (difficulty) {
      case '入门':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case '烧脑':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case '诡异':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Frosted glass background */}
      <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl shadow-black/50 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30" />
      
      {/* Content */}
      <div className="relative p-6">
        {/* Difficulty badge */}
        <div className="mb-4">
          <span 
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(story.difficulty)}`}
          >
            {story.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
          {story.title}
        </h3>

        {/* Surface preview (first 80 characters) */}
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
          {story.surface.length > 80 
            ? `${story.surface.substring(0, 80)}...` 
            : story.surface}
        </p>

        {/* Hover indicator */}
        <div className="mt-4 flex items-center text-slate-400 group-hover:text-amber-400 transition-colors duration-300">
          <span className="text-sm">开始推理</span>
          <svg 
            className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 5l7 7m0 0l-7 7m7-7H3" 
            />
          </svg>
        </div>
      </div>
    </div>
  )
}