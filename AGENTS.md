# AI 海龟汤游戏前端开发指令 (React + TS)

## 1. 项目与架构概述
- **项目定位**：基于 React + TypeScript + Tailwind CSS + shadcn-ui 开发的 AI 驱动多人情境推理（海龟汤）Web 应用。
- **核心交互**：包含大厅房间流转、WebSocket 实时公屏聊天、多人动态投票共识机制，以及与 AI 主持人的多轮对话渲染。
- **状态管理**：引入 Zustand（或同等轻量级库）处理复杂的全局状态（如：当前房间在线玩家、投票倒计时、实时弹幕流）。

## 2. UI/UX 设计规范 (核心视觉)
- **整体风格**：深邃、悬疑的极简科技风（Dark Mystery）。全局背景使用深蓝色调 (`bg-slate-900` 或 `bg-slate-950`)。
- **排版布局**：游戏大厅的剧本列表、游戏页面的线索板与玩家列表，**强制采用 Bento Box（便当盒）模块化排版**，确保不同信息区块错落有致、边界清晰。
- **材质与质感**：
  - 聊天界面、弹窗、Bento 容器广泛使用 **Frosted Glass（磨砂玻璃/毛玻璃）** 效果。Tailwind 参考类名：`bg-white/10 backdrop-blur-lg border border-white/20`。
  - **圆角与阴影**：统一使用大圆角 (`rounded-2xl`) 和柔和的深色阴影 (`shadow-2xl shadow-black/50`)。
- **交互强调色**：
  - 关键线索/胜利状态：使用金色 (`text-amber-400`) 并配合微发光效（glow）。
  - AI 回答状态分类：【是】使用绿色系，【否】使用红色系，【无关】使用灰色系。

## 3. 开发与命名规范
- **语言严格度**：开启 TypeScript Strict 模式，禁止使用 `any`，必须定义清晰的 Interface 或 Type。
- **组件化原则**：使用纯函数式组件 + Hooks。UI 展示组件（Dumb Components）与业务逻辑 Hooks（Smart Hooks）必须分离。
- **命名规范**：
  - React 组件：`PascalCase` (如 `ChatBubble`, `BentoCard`)
  - 函数与 Hooks：`camelCase` (如 `useRoomState`, `handleVote`)
  - 常量定义：`UPPER_SNAKE_CASE` (如 `MAX_PLAYERS`, `VOTE_TIMEOUT`)
  - 类型声明：以 `T` 或 `I` 开头 (如 `TStory`, `IRoomInfo`, `TPlayer`)

## 4. 核心功能实现优先级 (MVP 路径)
1. **基础设施**：搭建全局共享的 Zustand Store，定义好 `TPlayer`, `TMessage`, `TVoteState` 等核心数据结构。
2. **WebSocket 封装**：创建一个自定义 Hook `useGameSocket`，集中处理进退房间、接收聊天广播、同步投票状态的逻辑，并处理断线重连。
3. **Bento UI 搭建**：实现大厅的静态页面和游戏房间的基础占位布局。
4. **聊天流渲染**：实现类似微信的对话流，支持自动滚动到底部，并对 AI 返回的特定判定（如判定玩家猜中真相）做出 UI 高亮反应。
5. **权限与拦截**：实现投票弹窗组件。点击“查看汤底”或“踢出”时，拦截默认行为，向服务端发起投票请求，并监听全员同意后的回调。

## 5. 质量与安全边界
- **响应式要求**：移动端优先（Mobile First），必须确保在手机屏幕下聊天输入框不会被软键盘遮挡，Bento 布局在小屏幕下能优雅降级为单列堆叠 (`flex-col`)。
- **防抖与节流**：对聊天发送按钮、投票按钮、创建房间按钮必须加上防抖（Debounce）处理，防止高频点击造成的无效并发。
- **环境变量**：所有后端 WebSocket 地址、API Base URL 必须使用 `.env` 注入（如 `VITE_API_BASE_URL`）。**严禁在前端代码中硬编码任何 AI 厂商的 API Key**，所有 AI 请求必须由后端/Serverless 代理转发。
- **极端状态降级**：当 WebSocket 断开或网络极差时，需在顶部提供柔和的“正在重新连接...” Toast 提示，并在此期间禁用用户输入框。