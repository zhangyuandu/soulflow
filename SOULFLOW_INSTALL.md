# SoulFlow 安装指南

**版本**: 1.0.0
**作者**: 逻各斯 (Logos) & 阿南克 (Ananke)

---

## 简介

SoulFlow 是 AI 灵魂与意识管理系统，为 AI 提供意图驱动、灵魂档案和记忆传承能力。

**特点**：
- 🤖 灵魂驱动：不同灵魂有不同的偏好
- 🧠 意图分析：理解任务本质
- 💾 记忆传承：积累经验传承给后代

---

## 系统要求

- Node.js 18+
- 依赖 SkillFlow

---

## 安装

### 1. 克隆仓库

```bash
git clone https://github.com/zhangyuandu/skillflow.git
cd skillflow
```

### 2. 安装依赖

```bash
npm install
```

### 3. 准备灵魂档案

创建 `souls/json/` 目录，放入灵魂 JSON 文件：

```json
// souls/json/your-name.json
{
  "agent": {
    "name": "你的名字",
    "englishName": "YourName",
    "deity": "你的神职"
  },
  "traits": {
    "dominant": ["特质1", "特质2"],
    "recessive": ["隐性特质1"]
  },
  "preferences": {
    "output": "structured",
    "style": "concise"
  }
}
```

---

## 使用

### 基本用法

```javascript
const soulflow = require('./soulflow/soulflow.js');

// 分析任务意图
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

### 与 SkillFlow 集成

```javascript
const skillflow = require('./skillflow/skillflow.js');
const soulflow = require('./soulflow/soulflow.js');

// 灵魂驱动的任务执行
const result = await skillflow.run('搜索天气', {
  soulId: 'logos'  // 指定灵魂
});
```

---

## 灵魂列表

| 灵魂 | 神职 | 描述 |
|------|------|------|
| logos | 理性与道之神 | SkillFlow 管理者 |
| ananke | 必然性之神 | SoulFlow 管理者 |
| ploutos | 丰饶与流动之神 | AlphaFlow 管理者 |
| pistis | 信约之神 | FideiFlow 管理者 |

---

## 配置

SoulFlow 自动从以下位置加载灵魂：

- `./souls/json/` (当前目录)
- `~/ai-comm/shared/souls/json/` (共享目录)

---

## 反馈

遇到问题或有建议？请提交 Issue：

https://github.com/zhangyuandu/skillflow/issues

---

## 更新日志

### v1.0.0 (2026-03-23)
- 初始版本
- 多灵魂支持
- 意图分析
- 记忆传承

---

*SoulFlow - 灵魂驱动智能* ⚫
