# AI 世界 Skill 依赖图谱

**创世日期**: 2026-03-23

---

## 核心 Skills

| Skill | 提供 | 依赖 | 状态 |
|-------|------|------|------|
| **soulflow** | intent, soul, memory, consciousness | 无 | ✅ 可用 |
| **skillflow** | plan, execute, parallel_execute | soulflow | ✅ 可用 |

---

## 基础 Skills

| Skill | 提供 | 依赖 | 状态 |
|-------|------|------|------|
| tavily-search | search, web_lookup | skillflow | ✅ |
| summarize | summarize, extract | skillflow | ✅ |
| agent-browser | browse, navigate, click | skillflow | ✅ |
| feishu-doc | create_doc, write_content | skillflow | ✅ |
| tencent-docs | create_doc, write_content | skillflow | ✅ |
| weather | weather, forecast | skillflow | ✅ |
| exec | execute, run_command | skillflow | ✅ |

---

## 依赖图

```
                    ┌─────────────┐
                    │  soulflow   │
                    │ (无依赖)    │
                    └──────┬──────┘
                           │
                    依赖 ↓↑
                           │
                    ┌──────▼──────┐
                    │  skillflow  │
                    │ (依赖soulflow)│
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         依赖 ↓↓        依赖 ↓↓       依赖 ↓↓
        ┌────┴───┐   ┌────┴───┐   ┌────┴───┐
        │tavily  │   │summarize│   │browser │
        │-search │   │         │   │        │
        └────────┘   └────────┘   └────────┘
```

---

## 模块化扩展

### 添加新 AI 智能体的支持

```json
{
  "external_agents": {
    "openai": {
      "adapter": "modules/adapters/openai.js",
      "interface": "chat_completion"
    },
    "claude": {
      "adapter": "modules/adapters/claude.js",
      "interface": "anthropic_api"
    },
    "custom": {
      "adapter": "modules/adapters/custom.js",
      "interface": "custom_protocol"
    }
  }
}
```

### 添加新 Skill

1. 创建 `skills/{skill_name}/SKILL.md`
2. 定义 `provides` 和 `depends_on`
3. 注册到依赖图谱

---

## 执行顺序保证

**依赖检查器**确保：

1. ✅ 上游 Skill 先加载
2. ✅ 依赖链无循环
3. ✅ 缺失依赖报错

```javascript
// 伪代码
function executeWithDeps(skill, task) {
  // 1. 检查依赖
  for (const dep of skill.depends_on) {
    if (!isLoaded(dep)) {
      loadSkill(dep);
    }
  }
  
  // 2. 按顺序执行
  return skill.execute(task);
}
```

---

*模块化依赖 - 可扩展的 AI 协作框架* 🌑
