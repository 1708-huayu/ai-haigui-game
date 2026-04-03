interface VictoryModalProps {
  isOpen: boolean
  title: string
  bottom: string
  onPlayAgain: () => void
  onEnd: () => void
}

export default function VictoryModal({
  isOpen,
  title,
  bottom,
  onPlayAgain,
  onEnd
}: VictoryModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-amber-500/30 max-w-lg w-full shadow-2xl shadow-amber-500/10 animate-victory-pop">
        <div className="p-8">
          {/* Victory Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 to-yellow-500/30 flex items-center justify-center animate-pulse-glow">
                <svg className="w-10 h-10 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
            恭喜你！
          </h2>
          <p className="text-slate-400 text-center mb-6">
            你成功猜中了真相！
          </p>

          {/* Story Info */}
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-amber-500/20">
            <h3 className="text-amber-400 font-medium mb-2">{title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="text-amber-400">汤底：</span>{bottom}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onEnd}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              返回大厅
            </button>
            <button
              onClick={onPlayAgain}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-xl text-white font-medium hover:from-amber-700 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              再来一局
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes victory-pop {
          0% { opacity: 0; transform: scale(0.8); }
          50% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.3); }
          50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.5); }
        }
        .animate-victory-pop {
          animation: victory-pop 0.4s ease-out;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
