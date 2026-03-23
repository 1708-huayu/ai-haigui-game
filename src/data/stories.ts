import type { IStory } from '@/types/models'

export const stories: IStory[] = [
  {
    id: '1',
    title: '酒吧的水',
    difficulty: '入门',
    surface: '一个男人走进酒吧，向酒保要了一杯水。酒保突然拔枪指着他。男人愣了一下，然后说声"谢谢"就离开了。为什么？',
    bottom: '男人打嗝不止，想喝水止嗝。酒保发现他打嗝，用拔枪的方式吓他，结果打嗝被吓好了，所以他说谢谢。',
    winConditions: ['打嗝', '止嗝', '被吓到', '惊吓治疗'],
  },
  {
    id: '2',
    title: '沙漠中的火柴',
    difficulty: '烧脑',
    surface: '一个男人被发现死在沙漠中，手里紧紧握着半根火柴，周围没有任何脚印或交通工具痕迹。他是怎么到沙漠中的？怎么死的？',
    bottom: '一群人乘坐热气球横跨沙漠，途中气球漏气开始下降。所有人扔掉行李后仍然超重，于是大家抽火柴决定谁跳下去减轻重量。这个男人抽到了短火柴，被迫跳下气球摔死。',
    winConditions: ['热气球', '超重', '抽签', '跳下去', '短火柴'],
  },
  {
    id: '3',
    title: '灯塔守夜人',
    difficulty: '诡异',
    surface: '一个女人每天晚上都坐在灯塔里读书，读完一页就关灯睡觉。第二天早上，总会有人死去。她明明知道会发生什么，却仍然每晚重复同样的事情。',
    bottom: '女人是灯塔看守员，她每晚负责点亮灯塔为船只指引方向。某晚她读书太入迷，忘记开灯，导致船只触礁沉没，船员全部遇难。从此她患上精神疾病，每晚都会重演那个夜晚：关灯睡觉，第二天假装不知道有人死亡。',
    winConditions: ['灯塔', '船只触礁', '忘记开灯', '精神疾病', '创伤后遗症'],
  },
  {
    id: '4',
    title: '修理工的电话',
    difficulty: '入门',
    surface: '男人打电话叫电话修理工来家里修理电话。修理工来检查后说："电话没问题啊。"挂断电话后，男人发现电话真的不能用了。为什么？',
    bottom: '男人自己就是电话修理工。他打电话叫同事来修电话，同事检查后发现是男人家的电话线插头松了。同事离开后，男人不小心又踢到了插头，导致电话再次不能用。',
    winConditions: ['男人是修理工', '插头松了', '同事', '踢到插头'],
  },
  {
    id: '5',
    title: '最后一封信',
    difficulty: '烧脑',
    surface: '一个女人每天都在家门口等邮差，终于收到一封信。看完信后，她走进屋里自杀了。信里写了什么？',
    bottom: '女人的丈夫是船员，出海后遭遇海难失踪。保险公司规定：失踪满7年才能宣告死亡并理赔。7年来她每天等邮差盼着丈夫的消息。第7年最后一天，她收到的是保险公司的拒赔信——因为丈夫在失踪第6年364天被发现还活着，但昨天刚去世，差一天满7年，保险无效。她失去了一切希望。',
    winConditions: ['保险', '7年', '宣告死亡', '丈夫船员', '差一天'],
  },
]

export const getStoryById = (id: string): IStory | undefined => {
  return stories.find((story) => story.id === id)
}

export const getStoriesByDifficulty = (difficulty: IStory['difficulty']): IStory[] => {
  return stories.filter((story) => story.difficulty === difficulty)
}
