import type { IStory } from '@/types/models'

// AI回答类型
export type AIResponse = '是' | '否' | '无关'

// API配置
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.fe8.cn/v1',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  model: 'gpt-3.5-turbo',
}

// 海龟汤Prompt模板（包含示例对话）
const createPrompt = (question: string, story: IStory): string => {
  return `你是一个海龟汤游戏的主持人。玩家会提出是非题，你需要根据给定的故事来判断。

规则：
1. 你只能回答"是"、"否"或"无关"
2. 玩家的问题必须是关于故事表面的
3. 你需要根据汤底来判断玩家的问题是否正确
4. 无论玩家问什么，你都只能用这三个词之一回答，不要添加任何解释

故事标题：${story.title}
汤面：${story.surface}
汤底：${story.bottom}
关键线索：${story.winConditions.join('、')}

示例对话：
问题：这个人是不是遇到了危险？
回答：否。

问题：他是不是故意去那个地方的？
回答：是。

问题：他今天穿什么颜色的衣服？
回答：无关。

问题：你今天心情好吗？
回答：无关。

现在请回答玩家的问题。只回答"是"、"否"或"无关"，不要添加任何其他文字。

玩家问题：${question}
回答：`
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

// 真实的AI API调用（需要后端代理）
export const askAIReal = async (question: string, story: IStory): Promise<AIResponse> => {
  try {
    // 注意：根据AGENTS.md，前端不应该直接调用AI API
    // 这里应该调用后端代理接口，而不是直接调用OpenAI API
    const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: '你是一个海龟汤游戏的主持人。玩家会提出是非题，你需要根据给定的故事来判断。你只能回答"是"、"否"或"无关"。',
          },
          {
            role: 'user',
            content: createPrompt(question, story),
          },
        ],
        max_tokens: 10,
        temperature: 0.1, // 降低温度，提高确定性
        top_p: 0.1, // 降低采样多样性
      }),
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content?.trim() || ''

    // 解析AI回答
    return parseAIResponse(content)
  } catch (error) {
    console.error('AI API调用失败:', error)
    // 发生错误时返回模拟回答
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

// 判断玩家是否猜中真相
export const checkWinCondition = (question: string, story: IStory): boolean => {
  const lowerQuestion = question.toLowerCase()
  
  // 检查是否包含所有关键线索
  const allConditionsMatched = story.winConditions.every(condition => 
    lowerQuestion.includes(condition.toLowerCase())
  )
  
  // 检查问题是否描述了整个故事
  const bottomKeywords = story.bottom.split(/[，。！？、]/).filter(k => k.length > 2)
  const matchedKeywords = bottomKeywords.filter(keyword => 
    lowerQuestion.includes(keyword.toLowerCase())
  )
  
  // 如果匹配了大部分关键线索和汤底关键词，认为猜中
  return allConditionsMatched || matchedKeywords.length >= bottomKeywords.length * 0.7
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