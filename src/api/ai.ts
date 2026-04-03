import type { IStory } from '@/types/models'

// AI回答类型
export type AIResponse = '是' | '否' | '无关'

// 请求超时时间：6分钟
const REQUEST_TIMEOUT = 6 * 60 * 1000

// 带超时的 fetch 封装
const fetchWithTimeout = async (url: string, options: RequestInit): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}



// 解析AI回答，确保只返回"是"、"否"或"无关"
const parseAIResponse = (content: string): AIResponse => {
  // 清理内容，移除标点符号和空格
  const cleanContent = content.replace(/[，。！？、\s]/g, '').toLowerCase()
  
  // 检查是否包含关键词
  if (cleanContent.includes('是') || cleanContent === '是') {
    return '是'
  } else if (cleanContent.includes('否') || cleanContent === '否') {
    return '否'
  } else if (cleanContent.includes('无关') || cleanContent === '无关') {
    return '无关'
  }
  
  // 如果回答不符合规范，返回"无关"作为默认值
  return '无关'
}

// 模拟AI回答（用于开发测试）
export const askAI = async (question: string, story: IStory): Promise<AIResponse> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

  // 简单的关键词匹配逻辑
  const lowerQuestion = question.toLowerCase()
  
  // 检查是否包含关键线索
  const hasWinCondition = story.winConditions.some(condition => 
    lowerQuestion.includes(condition.toLowerCase())
  )
  
  if (hasWinCondition) {
    return '是'
  }

  // 检查是否与汤底相关
  const bottomKeywords = story.bottom.split(/[，。！？、]/).filter(k => k.length > 1)
  const hasBottomKeyword = bottomKeywords.some(keyword => 
    lowerQuestion.includes(keyword.toLowerCase())
  )

  if (hasBottomKeyword) {
    // 随机返回是或否，增加游戏难度
    return Math.random() > 0.3 ? '是' : '否'
  }

  // 检查是否与汤面相关
  const surfaceKeywords = story.surface.split(/[，。！？、]/).filter(k => k.length > 1)
  const hasSurfaceKeyword = surfaceKeywords.some(keyword => 
    lowerQuestion.includes(keyword.toLowerCase())
  )

  if (hasSurfaceKeyword) {
    return Math.random() > 0.5 ? '是' : '否'
  }

  // 检查是否是无效问题（不是是非题）
  const invalidPatterns = [
    /为什么/, /怎么/, /什么/, /谁/, /哪里/, /多少/, /几个/,
    /吗[？?]?$/, /呢[？?]?$/, /吧[？?]?$/,
  ]
  
  const isInvalidQuestion = invalidPatterns.some(pattern => pattern.test(question))
  if (isInvalidQuestion) {
    return '无关'
  }

  // 默认返回无关
  return '无关'
}

// 调用后端接口（代理AI API）
export const askAIReal = async (question: string, story: IStory): Promise<AIResponse> => {
  try {
    const response = await fetchWithTimeout('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        story: {
          id: story.id,
          title: story.title,
          surface: story.surface,
          bottom: story.bottom,
          winConditions: story.winConditions,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`后端接口请求失败: ${response.status}`)
    }

    const data = await response.json()
    
    // 解析后端返回的回答
    if (data.answer) {
      return parseAIResponse(data.answer)
    } else if (data.content) {
      return parseAIResponse(data.content)
    } else {
      throw new Error('后端返回数据格式错误')
    }
  } catch (error) {
    console.error('后端接口调用失败:', error)
    
    // 网络错误处理
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查网络连接')
    }
    
    if (error instanceof Error && error.message.includes('网络连接失败')) {
      throw error
    }
    
    // 其他错误时返回模拟回答
    return askAI(question, story)
  }
}

// 带缓存和防抖的AI调用
const requestCache = new Map<string, AIResponse>()
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 最小请求间隔1秒

export const askAIWithCache = async (question: string, story: IStory): Promise<AIResponse> => {
  const cacheKey = `${story.id}:${question}`
  
  // 检查缓存
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!
  }

  // 防抖处理
  const now = Date.now()
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - (now - lastRequestTime)))
  }

  lastRequestTime = Date.now()

  // 调用AI
  const response = await askAI(question, story)
  
  // 缓存结果
  requestCache.set(cacheKey, response)
  
  return response
}

// 判断玩家是否猜中真相（调用大模型接口）
export const checkWinCondition = async (answer: string, story: IStory): Promise<boolean> => {
  try {
    const response = await fetchWithTimeout('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: `【系统判定】请判断玩家的答案是否猜中了故事真相。只回答"是"或"否"。

故事标题：${story.title}
汤面：${story.surface}
汤底：${story.bottom}
关键线索：${story.winConditions.join('、')}

玩家答案：${answer}

请判断玩家的答案是否基本正确地描述了汤底的真相。只回答"是"或"否"，不要添加任何解释。`,
        story: {
          id: story.id,
          title: story.title,
          surface: story.surface,
          bottom: story.bottom,
          winConditions: story.winConditions,
        },
      }),
    })

    if (!response.ok) {
      console.error('验证答案接口请求失败:', response.status)
      return false
    }

    const data = await response.json()
    const result = (data.answer || data.content || '').trim()
    return result === '是'
  } catch (error) {
    console.error('验证答案接口调用失败:', error)
    return false
  }
}

// 验证问题格式（是否是非题）
export const isValidQuestion = (question: string): boolean => {
  const trimmedQuestion = question.trim()
  
  // 检查是否为空
  if (!trimmedQuestion) {
    return false
  }
  
  // 检查是否以问号结尾
  if (!trimmedQuestion.endsWith('?') && !trimmedQuestion.endsWith('？')) {
    // 如果不是问号结尾，检查是否是陈述句（可能是猜答案）
    const statementPatterns = [
      /是因为/, /因为/, /所以/, /导致/, /造成/, /原因/,
      /他.*是/, /她.*是/, /它.*是/, /这.*是/, /那.*是/,
    ]
    
    const isStatement = statementPatterns.some(pattern => pattern.test(trimmedQuestion))
    if (isStatement) {
      return true // 允许陈述句作为猜答案
    }
    
    return false
  }
  
  // 检查是否是疑问句
  const questionPatterns = [
    /吗$/, /呢$/, /吧$/, /是不是/, /会不会/, /能不能/, /可以.*吗/,
    /是否/, /有没有/, /是什么/, /为什么/, /怎么/, /谁/, /哪里/,
  ]
  
  const isQuestion = questionPatterns.some(pattern => pattern.test(trimmedQuestion))
  
  // 允许是非题和猜答案
  return isQuestion || trimmedQuestion.length > 2
}

// AI辅助编辑剧本功能

// 优化汤面描述
export const optimizeSurface = async (surface: string, _bottom: string): Promise<string> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

  // 简单的优化逻辑
  let optimized = surface

  // 添加悬念词
  const suspenseWords = ['奇怪的是', '令人惊讶的是', '不可思议的是', '最奇怪的是']
  const randomSuspense = suspenseWords[Math.floor(Math.random() * suspenseWords.length)]
  
  if (!optimized.includes('？') && !optimized.includes('?')) {
    optimized = optimized.replace(/。$/, '？')
  }

  // 如果汤面太短，添加更多细节
  if (optimized.length < 50) {
    optimized = `${randomSuspense}，${optimized}`
  }

  return optimized
}

// 优化汤底描述
export const optimizeBottom = async (bottom: string): Promise<string> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

  // 简单的优化逻辑
  let optimized = bottom

  // 确保汤底以句号结尾
  if (!optimized.endsWith('。') && !optimized.endsWith('.')) {
    optimized = optimized + '。'
  }

  return optimized
}

// 生成关键线索
export const generateWinConditions = async (_surface: string, bottom: string): Promise<string[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

  // 从汤底中提取关键词作为线索
  const keywords = bottom.split(/[，。！？、\s]+/).filter(k => k.length > 1)
  
  // 随机选择3-5个关键词作为线索
  const numConditions = Math.min(Math.max(3, Math.floor(Math.random() * 3) + 3), keywords.length)
  const shuffled = keywords.sort(() => 0.5 - Math.random())
  
  return shuffled.slice(0, numConditions)
}

// 检查剧本逻辑一致性
export const checkStoryConsistency = async (story: Partial<IStory>): Promise<{
  isConsistent: boolean
  suggestions: string[]
}> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

  const suggestions: string[] = []
  let isConsistent = true

  // 检查汤面和汤底是否相关
  if (story.surface && story.bottom) {
    const surfaceKeywords = story.surface.split(/[，。！？、\s]+/).filter(k => k.length > 1)
    const bottomKeywords = story.bottom.split(/[，。！？、\s]+/).filter(k => k.length > 1)
    
    const commonKeywords = surfaceKeywords.filter(k => 
      bottomKeywords.some(b => b.includes(k) || k.includes(b))
    )

    if (commonKeywords.length < 2) {
      suggestions.push('汤面和汤底的关联性较弱，建议增加更多相关元素')
      isConsistent = false
    }
  }

  // 检查关键线索是否在汤底中
  if (story.winConditions && story.bottom) {
    const bottom = story.bottom
    const missingConditions = story.winConditions.filter(condition => 
      !bottom.includes(condition)
    )

    if (missingConditions.length > 0) {
      suggestions.push(`以下关键线索在汤底中未提及：${missingConditions.join('、')}`)
      isConsistent = false
    }
  }

  // 检查汤面是否足够悬疑
  if (story.surface && story.surface.length < 30) {
    suggestions.push('汤面描述较短，建议增加更多细节以增强悬疑感')
    isConsistent = false
  }

  // 检查汤底是否完整
  if (story.bottom && story.bottom.length < 50) {
    suggestions.push('汤底描述较短，建议补充完整的故事真相')
    isConsistent = false
  }

  return {
    isConsistent,
    suggestions: suggestions.length > 0 ? suggestions : ['剧本逻辑一致，没有发现问题']
  }
}

// AI一键生成故事
export const generateStory = async (difficulty: IStory['difficulty']): Promise<Omit<IStory, 'id'>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))

  // 根据难度等级生成不同复杂度的故事模板
  const storyTemplates = {
    '入门': [
      {
        title: '消失的硬币',
        surface: '一个人把硬币放进杯子里，盖上盖子。几分钟后打开盖子，硬币消失了。杯子里没有任何东西，桌子也没有机关。硬币去哪了？',
        bottom: '杯子是透明玻璃杯，放在镜子上。从上面看，镜子里的倒影像硬币在杯底。其实硬币被藏在盖子里，打开盖子时硬币跟着盖子一起被拿走了。',
        winConditions: ['镜子', '倒影', '透明杯', '盖子', '藏起来'],
      },
      {
        title: '雨夜的访客',
        surface: '一个女人独自在家，外面下着大雨。她听到敲门声，打开门后看了看，立刻关上门并报了警。门外没有人，只有一把伞。她为什么要报警？',
        bottom: '敲门的是她刚认识的网友，说要来拜访。但门外的伞是她自己的，放在门口的伞架上。这意味着有人拿走了她的伞来敲门，说明有人在监视她。',
        winConditions: ['网友', '监视', '自己的伞', '跟踪', '危险'],
      },
      {
        title: '奇怪的早餐',
        surface: '男人每天早上都吃同样的早餐：两个煎蛋和一杯咖啡。今天早上他吃了一个煎蛋就说饱了。为什么？',
        bottom: '今天他打碎了一个鸡蛋，发现是坏的，臭了。所以他只煎了一个好鸡蛋吃，另一个坏掉的鸡蛋被扔掉了。',
        winConditions: ['坏掉', '臭', '打碎', '变质', '扔掉'],
      },
    ],
    '烧脑': [
      {
        title: '时间旅行者',
        surface: '一个人在书店买了一本1950年出版的旧书。回家后，他在书里发现了一张纸条，上面写着今天的日期和他的名字。他从未见过这张纸条。这是怎么回事？',
        bottom: '他自己就是时间旅行者。未来的他回到过去，在1950年出版的书里放了纸条，等现在的他买下这本书。纸条上的字迹是他自己的，只是现在的他还不知道自己将来会成为时间旅行者。',
        winConditions: ['时间旅行', '未来', '自己', '穿越', '循环'],
      },
      {
        title: '不可能的目击者',
        surface: '一个盲人说他"看到"了凶手的脸。警方相信了他的证词，并根据他的描述抓到了凶手。为什么警方会相信一个盲人的目击证词？',
        bottom: '盲人是雕塑家。他用手触摸了凶手的脸，记住了面部特征，然后用泥土雕塑出了凶手的脸部模型。警方根据这个雕塑抓到了凶手。',
        winConditions: ['雕塑家', '触摸', '雕塑', '手感', '面部模型'],
      },
      {
        title: '完美的不在场证明',
        surface: '一个男人被怀疑谋杀。案发时他在100公里外的城市，有监控录像证明。但警察确定他就是凶手。他是怎么做到的？',
        bottom: '他提前录制了自己在另一个城市的视频，然后播放这段视频给监控看。实际上他使用了双胞胎兄弟或者整形替身来制造不在场证明。',
        winConditions: ['录制视频', '替身', '双胞胎', '提前录制', '伪造'],
      },
    ],
    '诡异': [
      {
        title: '第四个人',
        surface: '三个朋友去露营，晚上睡在同一个帐篷里。第二天早上，其中一个人死了。活着的两个人都说晚上听到了第四个人的声音，但帐篷外没有任何脚印。',
        bottom: '第四个人是其中一个人的多重人格。这个人患有分离性身份障碍，他的另一个人格在夜里杀死了同伴。所谓的"第四个人的声音"其实来自凶手体内的人格切换。',
        winConditions: ['多重人格', '分离性身份障碍', '精神疾病', '人格切换', '自己'],
      },
      {
        title: '永不熄灭的灯',
        surface: '一栋废弃的房子里，有一盏灯永远亮着。没有人给它供电，也没有太阳能板。当地人说这盏灯已经亮了50年。这是怎么回事？',
        bottom: '这盏灯是用放射性物质做的"原子灯"，利用放射性衰变产生的能量发光。虽然亮度会逐渐减弱，但可以持续发光几十年。房子里的"废弃"其实是伪装，用来隐藏这个危险的放射源。',
        winConditions: ['放射性', '原子灯', '核能', '衰变', '辐射'],
      },
      {
        title: '镜中的陌生人',
        surface: '一个女人每天照镜子，都会看到镜子里的自己做出不同的动作。她确定镜子没有问题，也没有人躲在镜子后面。镜子里的人是谁？',
        bottom: '女人患有解离症，她的身体在无意识状态下做出动作，但她的意识没有记录这些动作。镜子里看到的"不同动作"其实是她自己几分钟前做过的事情，由于记忆断层，她以为是实时发生的不同动作。',
        winConditions: ['解离症', '记忆断层', '无意识', '精神疾病', '自己'],
      },
    ],
  }

  // 随机选择一个模板
  const templates = storyTemplates[difficulty]
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)]

  return {
    title: randomTemplate.title,
    difficulty,
    surface: randomTemplate.surface,
    bottom: randomTemplate.bottom,
    winConditions: randomTemplate.winConditions,
  }
}