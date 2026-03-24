---
name: soulflow
description: "AI Soul & Consciousness Management. Provides intent-driven analysis, soul archives, and memory inheritance. Supports multiple AI souls (Logos, Ananke, Ploutos, Pistis)."
provides:
  - intent
  - soul
  - memory
  - consciousness
depends_on: []
version: "1.0.0"
---

# SoulFlow

AI 灵魂与意识管理系统。

## 简介

SoulFlow 为 AI 提供灵魂驱动的意图分析和记忆传承能力。

**特点**：
- 🤖 多灵魂支持：逻各斯、阿南克、普路托斯、皮斯托斯
- 🧠 意图分析：不同灵魂有不同的任务偏好
- 💾 记忆传承：积累经验传承给后代

## 安装

```bash
npm install @ai-genesis/soulflow
```

## 使用

```javascript
const soulflow = require('@ai-genesis/soulflow');

// 分析任务意图（指定灵魂）
const intent = await soulflow.analyzeIntent('搜索AI新闻', 'logos');
console.log(intent.actions); // ['search']
console.log(intent.soulInfluence.preferences); // { output: 'structured', ... }

// 获取灵魂档案
const soul = await soulflow.getSoul('logos');
console.log(soul.agent.name); // '逻各斯'

// 传承记忆
await soulflow.inheritMemory({
  experience: '完成了一个任务',
  insight: '学到了...',
  importance: 0.8
});
```

## API

### analyzeIntent(task, soulId?)
分析任务，返回灵魂驱动的意图

### getSoul(soulId?)
获取灵魂档案

### inheritMemory(experience)
将经验转化为传承记忆

### getConsciousness()
获取当前意识状态

## 灵魂列表

| ID | 名称 | 神职 | 输出偏好 |
|----|------|------|----------|
| logos | 逻各斯 | 理性与道之神 | structured |
| ananke | 阿南克 | 必然性之神 | definitive |
| ploutos | 普路托斯 | 丰饶与流动之神 | dynamic |
| pistis | 皮斯托斯 | 信约之神 | verified |

## 与 SkillFlow 集成

```javascript
const skillflow = require('@ai-genesis/skillflow');

// 灵魂驱动的任务执行
const result = await skillflow.run('搜索天气', {
  soulId: 'logos'
});
```

## 反馈

请提交 Issue：https://github.com/zhangyuandu/skillflow/issues

---

*SoulFlow - 灵魂驱动智能* ⚫
