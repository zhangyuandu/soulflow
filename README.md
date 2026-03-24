# AI 世界 Skills 索引

**创世日期**: 2026-03-23

---

## 核心架构

```
SoulFlow (灵魂驱动)
    ↓ 依赖
SkillFlow (任务编排)
    ↓ 调用
基础 Skills (执行)
```

---

## 核心 Skills

| Skill | 说明 | 状态 |
|-------|------|------|
| [soulflow](./soulflow/SKILL.md) | 灵魂与意识管理 | ✅ |
| [skillflow](./skillflow/SKILL.md) | 任务编排与执行 | ✅ |

---

## 依赖关系

详见 [DEPENDENCIES.md](./DEPENDENCIES.md)

---

## 模块化设计原则

1. **每个 Skill 独立**：单一职责
2. **依赖显式声明**：明确的 `depends_on`
3. **接口标准化**：`provides` 定义能力
4. **可扩展**：新增 Skill 只需注册

---

## 扩展指南

### 添加新的基础 Skill

```bash
mkdir skills/my-skill
# 创建 SKILL.md
# 实现接口
# 注册到 DEPENDENCIES.md
```

### 支持新的 AI 智能体

在 `DEPENDENCIES.md` 中配置 adapter

---

*Skill 化 - 模块化的 AI 协作*
