import { useParams } from 'react-router-dom'

export default function Game() {
  const { id } = useParams<{ id: string }>()
  
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">游戏房间</h1>
        <p className="text-slate-400 mb-2">剧本ID: {id}</p>
        <p className="text-slate-500">游戏页面正在开发中...</p>
      </div>
    </div>
  )
}