# AI 海龟汤 - 多人推理游戏

一款由 AI 驱动的多人在线情境推理（海龟汤）游戏。玩家可创建或加入虚拟房间，通过自然语言与扮演“主持人（法官）”的 AI 互动。游戏核心融入了社交共识机制（投票、权限管理），打造沉浸式的线上推理派对体验。

## 技术栈

- **前端**: React + TypeScript + Vite
- **样式**: Tailwind CSS
- **路由**: React Router DOM
- **状态管理**: Zustand
- **实时通信**: WebSocket
- **UI组件**: 自定义Bento Box布局和Frosted Glass材质

## 项目结构

```
src/
├── components/         # 业务与 UI 组件
│   ├── layout/         # Bento Box 容器组件 (BentoGrid.tsx, BentoItem.tsx)
│   ├── game/           # 游戏核心区 (ChatBoard.tsx, MessageBubble.tsx, StoryReveal.tsx)
│   └── common/         # 通用材质组件 (FrostedCard.tsx, GlassButton.tsx)
├── hooks/              # 自定义逻辑 Hook
│   ├── useGameSocket.ts# 集中处理 WebSocket 连接、心跳与事件监听
│   └── useVoteTimer.ts # 投票倒计时逻辑
├── store/              # Zustand 状态切片
│   └── roomStore.ts    # 管理房间信息、玩家列表、投票状态
├── pages/              # 路由视图
│   ├── Lobby.tsx       # 游戏大厅 (房间列表/快速匹配)
│   ├── Room.tsx        # 多人对局主桌
│   └── Summary.tsx     # 汤底揭晓与复盘
├── types/              # 全局 TS 类型定义 (models.d.ts)
└── utils/              # 工具函数 (cn.ts 合并 Tailwind 类名)
```

## 功能特性

1. **游戏大厅与房间系统**
   - 卡片流展示海龟汤剧本
   - 创建私人房间或快速匹配
   - 房主权限管理

2. **核心对局区**
   - 信息展板展示汤面故事和玩家列表
   - 公屏交互流，类似微信群聊
   - 线索高亮功能

3. **共识决策机制**
   - 触发全员投票弹窗
   - 过半数通过制

4. **结算与复盘**
   - 仪式感动效展示汤底
   - 推理时间线复盘
   - 房间续存机制

## 安装与运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

## 环境变量

复制 `.env.example` 文件为 `.env` 并根据需要修改配置：

```bash
VITE_API_BASE_URL=your_api_base_url
VITE_WS_URL=your_websocket_url
```

## 设计规范

- **视觉基调**: 暗黑科技风 (Dark Mystery)，以深蓝色调为主
- **布局**: Bento Box 模块化排版
- **材质**: Frosted Glass 拟物化材质
- **交互强调色**: 金色表示关键线索，绿/红/灰分别表示AI回答的"是/否/无关"

## AI交互流程

AI严格按照JSON格式输出，包含：
- `decision`: "YES"/"NO"/"IRRELEVANT"
- `is_win`: 是否获胜的布尔值
- `reply`: 文字回复

前端通过判断 `is_win === true` 自动触发胜利结算。