import React from 'react';
import FrostedCard from '../components/common/FrostedCard';
import GlassButton from '../components/common/GlassButton';

const Summary: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <FrostedCard className="p-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-6">
            推理成功！
          </h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">真相揭晓</h2>
            <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-xl p-6 border border-amber-500/30">
              <h3 className="text-lg font-medium text-amber-400 mb-2">汤底：</h3>
              <p className="text-white">
                男人喝的酒里含有剧毒，但酒是他自己带来的。原来他知道自己患了绝症，
                决定以这种方式结束生命，并且精心策划了这场“意外”，希望死后保险公司能赔付家人。
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">推理时间线</h2>
            <div className="space-y-3 text-left">
              <div className="bg-white/10 rounded-lg p-3">
                <span className="text-amber-400">玩家A:</span> 问"死者是否喝酒？" → <span className="text-green-400">AI: 是</span>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <span className="text-amber-400">玩家B:</span> 问"酒是否有毒？" → <span className="text-green-400">AI: 是</span>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <span className="text-amber-400">玩家C:</span> 问"是否是他自己下的毒？" → <span className="text-green-400">AI: 否</span>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <span className="text-amber-400">玩家A:</span> 问"酒是不是他自带的？" → <span className="text-green-400">AI: 是 - <span className="text-amber-400">关键突破！</span></span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <GlassButton>返回大厅</GlassButton>
            <GlassButton variant="secondary">再来一局</GlassButton>
            <GlassButton variant="outline">分享战绩</GlassButton>
          </div>
        </FrostedCard>
      </div>
    </div>
  );
};

export default Summary;