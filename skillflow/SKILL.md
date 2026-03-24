---
name: skillflow
description: "任务编排与执行引擎。提供任务规划、技能匹配、并行执行、结果聚合。支持模块化依赖。"
provides:
  - plan
  - execute
  - parallel_execute
  - skill_discovery
depends_on:
  - soulflow
---

# SkillFlow

任务编排与执行引擎。

## 模块化架构

```
┌────────────────────────────────────────┐
│             SkillFlow Skill             │
│                                        │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │   Plan   │ │  Match   │ │ Execute│ │
│  │  生成器   │ │  技能匹配 │ │  执行器 │ │
│  └──────────┘ └──────────┘ └────────┘ │
│                                        │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Parallel │ │  Disco-  │ │  Dep   │ │
│  │  执行器   │ │  very   │ │  依赖图 │ │
│  └──────────┘ └──────────┘ └────────┘ │
└────────────────────────────────────────┘
          ↑
     依赖 soulflow
```

## 提供的接口

### plan(task, options?)
生成执行计划

```javascript
{
  task: "搜索AI新闻并总结",
  intent: {
    actions: ["search", "summarize"],
    soulInfluence: { ... }
  },
  plan: [
    { id: "step1", action: "search", skill: "tavily-search" },
    { id: "step2", action: "summarize", skill: "summarize", depends_on: ["step1"] }
  ]
}
```

### execute(plan)
顺序执行计划

### executeParallel(plan, options?)
并行执行计划（自动检测无依赖步骤）

```javascript
{
  success: true,
  results: { step1: {...}, step2: {...} },
  stats: { duration: 120, parallelism: 2 }
}
```

### discoverSkills()
发现可用技能

```javascript
{
  skills: {
    "tavily-search": { capabilities: ["search"], ... },
    "summarize": { capabilities: ["summarize"], ... }
  }
}
```

## 依赖关系

### 上游依赖

| Skill | 说明 |
|-------|------|
| soulflow | 必须先调用，获取灵魂驱动的意图 |

### 下游依赖

| Skill | 说明 |
|-------|------|
| tavily-search | Web 搜索 |
| summarize | 内容总结 |
| browser | 网页浏览 |
| docs | 文档操作 |

## 执行流程

```
1. soulflow.analyzeIntent(task)  ← 获取灵魂驱动的意图
   ↓
2. skillflow.plan(intent)        ← 生成执行计划
   ↓
3. skillflow.discoverSkills()    ← 发现可用技能
   ↓
4. skillflow.matchSkills()       ← 匹配技能
   ↓
5. skillflow.executeParallel()  ← 执行计划
   ↓
6. 返回结果
```

## 使用示例

```javascript
const skillflow = require('./skillflow.js');

// 完整流程（依赖 soulflow）
const result = await skillflow.run("搜索AI新闻并总结", {
  maxConcurrency: 5,
  soulContext: await soulflow.getSoul()
});

// 仅计划
const plan = await skillflow.plan("搜索天气");

// 仅执行
const result = await skillflow.executeParallel(plan);
```

## 配置文件

```json
{
  "skillflow": {
    "maxConcurrency": 5,
    "defaultTimeout": 30000,
    "skillDirs": [
      "~/.openclaw/skills",
      "~/.openclaw/workspace/skills"
    ],
    "cacheExpiry": 86400
  }
}
```

---

*SkillFlow - 秩序的执行者* 🌑
