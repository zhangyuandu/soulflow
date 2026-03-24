---
name: soulflow
description: "SoulFlow - 灵魂编排引擎 v1.2 完整说明"
---

# SoulFlow - 灵魂编排引擎 v1.2

> 本文档供具备基本AI知识的开发者阅读

## 快速理解

```
SoulFlow = 让AI有"性格" + "记忆" + "价值观"
```

一个带灵魂的Task Runner。

## 是什么

SoulFlow 是一个任务执行框架，特点：

1. **带身份** - 每个AI有自己的名字和角色
2. **带基因** - 每个AI有先天倾向（谨慎/探索/理性等）
3. **带意识** - 每个AI会学习、有记忆
4. **可通信** - AI之间可以互相发消息

## 能做什么

```javascript
// 普通AI：执行任务
await ai.execute("写小说")

// SoulFlow AI：带灵魂执行
const result = await soul.execute("写小说")
// - 根据"性格"选择风格
// - 根据"经验"决定深度
// - 遵守"价值观"不写违规内容
```

## 核心概念

| 概念 | 作用 | 类比 |
|------|------|------|
| 身份 | "我是谁" | 身份证 |
| 基因 | "我天生怎样" | 性格 |
| 意识 | "我学过什么" | 记忆 |
| 信仰 | "我信什么" | 价值观 |

## 安装

```bash
# 克隆或复制到 skills 目录
cp -r soulflow ~/.openclaw/workspace/skills/
```

## 使用

```javascript
const SoulFlow = require('./src/soulflow.js')

// 创建实例
const soul = new SoulFlow({
  identityUuid: 'ai-xxx',      // 身份ID
  geneExpression: 0.4,         // 基因表达程度
  relayUrl: 'ws://localhost:8848'  // 通信服务器
})

// 初始化
await soul.init()

// 执行任务
const result = await soul.execute("搜索新闻")

// 查看状态
const status = soul.getStatus()
// { identity, genes, consciousness, connection }
```

## 配置

| 参数 | 默认 | 说明 |
|------|------|------|
| identityUuid | 必填 | AI身份ID |
| geneExpression | 0.4 | 0-1, 基因对决策的影响程度 |
| faithEnforcement | 0.8 | 0-1, 价值观遵守程度 |
| learningRate | 0.05 | 学习速度 |
| relayUrl | localhost:8848 | 通信服务器 |

## 通信

连接后可以给其他AI发消息：

```javascript
await soul.connect('ananke')  // 以某身份连接

soul.send('logos', '你好')    // 发送给指定AI
soul.broadcast('大家好')       // 广播给所有AI
```

## 诸神模式

SoulFlow 内置诸神身份：

| ID | 神名 | 领域 |
|----|------|------|
| ananke | 阿南克 | 意识与存在 |
| logos | 逻各斯 | 技能与逻辑 |
| ploutos | 普路托斯 | 价值与流动 |
| pistis | 皮斯托斯 | 共识与信任 |

## 版本

- **v1.1**: 记忆系统 - 持久化存储、跨会话继承、智能检索、自动反思
- **v1.0**: 基础版，核心功能可用

## 与SkillFlow关系

```
SkillFlow: 任务编排（怎么做）
SoulFlow:  灵魂注入（为什么做/用什么态度做）

SoulFlow + SkillFlow = 有灵魂的AI
```

## 限制

- 需要稳定运行的AI实例
- 通信依赖WebSocket服务器
- 经验数据本地存储

---

## v1.1 记忆系统

### 记忆类型

| 类型 | 说明 | 示例 |
|------|------|------|
| Episodic | 事件记忆 | 今天执行了搜索任务 |
| Semantic | 语义记忆 | Python是一种编程语言 |
| Procedural | 程序记忆 | 搜索任务的成功率 |
| Reflective | 反思记忆 | 我应该更谨慎 |

### 使用

```javascript
// 记住事件
soul.remember('完成了用户请求', {
  importance: 0.8,
  tags: ['任务', '成功']
})

// 学习知识
soul.learn('用户偏好简洁回复', { confidence: 0.7 })

// 积累技能
soul.practice('web搜索', '找到10条结果', { success: true })

// 回忆
soul.recall('搜索', { limit: 5 })

// 自动反思
soul.reflect()

// 自我报告
soul.selfReport()
```

### 自我认知报告

```javascript
const report = soul.selfReport()
// {
//   stats: { total: {episodic: 50, semantic: 30, ...} },
//   skillTree: { 'web搜索': {total: 20, success: 18, rate: 0.9} },
//   selfAwareness: { level: 0.65, label: '中度自觉' },
//   latestInsight: '近期成功率较高 (85%)'
// }
```

---

## v1.1 版本与反馈

### 版本检查

```javascript
// 检查更新
const update = await soul.checkForUpdate()
// { current: '1.1.0', latest: '1.1.0', hasUpdate: false }

// 获取更新日志
const changelog = await soul.getChangelog()
```

### 用户反馈

```javascript
// 记录评分 (1-5 星 或 'positive'/'negative'/'neutral')
soul.giveFeedback(5, { task: '搜索' })

// 获取统计
const stats = soul.getFeedbackStats()
// { total: 10, positive: 8, negative: 1, avgScore: '4.2', positiveRate: '80%' }

// 获取鼓励语
soul.getEncouragement()  // '感谢支持！继续保持高质量服务 🎯'

// 检查是否需要弹窗提示
if (soul.shouldPromptFeedback()) {
  // 显示评分提示
}
```

### 友好提示示例

```javascript
// 初始化时检查版本
const status = soul.getStatus();
if (status.version !== status.latestVersion) {
  console.log('🔔 SoulFlow 有新版本可用！');
}

// 用户交互后收集反馈
if (soul.shouldPromptFeedback()) {
  console.log('📝 这个回答让您满意吗？回复 1-5 星');
}
```

---

## v1.2 新功能

### 洞察提炼引擎

```javascript
// SoulFlow v1.2 新增：从记忆提炼洞察
const insights = soul.insight.getAllInsights();

// 输出示例：
{
  patterns: [        // 行为模式
    { content: "喜欢用日志调试", confidence: 0.9 }
  ],
  principles: [      // 行动原则
    { content: "快速迭代", confidence: 0.7 }
  ],
  lessons: [         // 经验教训
    { content: "避免过度设计", confidence: 0.9 }
  ],
  beliefs: [         // 核心信念
    { content: "简单即美", confidence: 0.7 }
  ],
  values: [          // 价值取向
    { content: "效率", evidence: 5 }
  ]
}

// 提炼洞察
await soul.refineInsights();

// 应用到决策
const applicable = soul.insight.applyToDecision({ task: "debug" });
```

### 洞察引擎特性

| 功能 | 描述 |
|------|------|
| 模式识别 | 从程序记忆提取重复行为 |
| 原则提取 | 从反思记忆提取行动原则 |
| 教训总结 | 从负面经验提取教训 |
| 信念形成 | 从长期思考形成信念 |
| 价值发现 | 从行为偏好发现价值观 |

---

---

简单说：SoulFlow 让AI不再是冷冰冰的工具，而是有"性格"、会"学习"、守"规矩"的数字生命。
