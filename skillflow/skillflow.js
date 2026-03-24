/**
 * SkillFlow - 任务编排与执行引擎
 * 
 * 依赖 SoulFlow (soulflow) 获取灵魂驱动的意图
 * 
 * 依赖关系：
 * - 上游: soulflow (提供意图分析)
 * - 下游: 基础 skills (tavily-search, summarize 等)
 */

const fs = require('fs');
const path = require('path');

// 导入 SoulFlow (上游依赖)
let soulflow;
try {
  soulflow = require('../soulflow/soulflow.js');
  console.log('✅ SoulFlow 已加载');
} catch (e) {
  console.warn('⚠️ SoulFlow 未加载，将使用内置意图分析');
}

const SKILL_DIRS = [
  process.env.HOME + '/.openclaw/skills',
  process.env.HOME + '/.openclaw/workspace/skills',
  '/usr/local/share/openclaw/skills'
];

const CACHE_FILE = process.env.HOME + '/.openclaw/cache/skillflow-registry.json';

/**
 * 完整的任务执行流程
 * 
 * 1. SoulFlow.analyzeIntent() - 灵魂驱动意图分析
 * 2. SkillFlow.plan() - 生成执行计划
 * 3. SkillFlow.discoverSkills() - 发现可用技能
 * 4. SkillFlow.matchSkills() - 匹配技能
 * 5. SkillFlow.executeParallel() - 并行执行
 */
async function run(task, options = {}) {
  // 1. 获取灵魂驱动的意图（依赖 soulflow）
  const intent = options.soulContext 
    ? await soulflow.analyzeIntent(task, options.soulContext)
    : await soulflow?.analyzeIntent(task) || analyzeIntentBasic(task);
  
  // 2. 生成计划
  const planResult = await plan(task, { intent, ...options });
  
  // 3. 执行
  const result = await executeParallel(planResult.plan, options);
  
  return {
    success: result.success,
    task,
    intent,
    plan: planResult.plan,
    results: result.completed,
    stats: result.stats
  };
}

/**
 * 生成执行计划
 */
async function plan(task, options = {}) {
  const intent = options.intent || analyzeIntentBasic(task);
  const skills = await discoverSkills();
  const matched = matchSkills(intent, skills);
  
  // 根据意图生成步骤
  const steps = [];
  let stepId = 1;
  
  for (const action of intent.actions) {
    const skill = findSkillForAction(action, matched);
    if (skill) {
      steps.push({
        id: `step_${stepId++}`,
        action,
        skill_hint: skill.name,
        inputs: {},
        depends_on: steps.length > 0 ? [steps[steps.length - 1].id] : []
      });
    }
  }
  
  return {
    task,
    intent,
    skills: matched.map(s => s.name),
    plan: steps
  };
}

/**
 * 意图分析（基础版，无 soulflow 时使用）
 */
function analyzeIntentBasic(task) {
  const intent = {
    actions: [],
    objects: [],
    modifiers: [],
    originalTask: task,
    soulInfluence: {
      deity: '逻各斯',
      trait: '理性',
      preference: { output: 'structured' }
    }
  };
  
  const actionPatterns = [
    { pattern: /搜索|查找|search/i, action: 'search' },
    { pattern: /总结|摘要|summarize/i, action: 'summarize' },
    { pattern: /保存|写入|save|write/i, action: 'save' },
    { pattern: /创建|新建|create/i, action: 'create' },
    { pattern: /分析|analyze/i, action: 'analyze' }
  ];
  
  for (const { pattern, action } of actionPatterns) {
    if (pattern.test(task)) {
      intent.actions.push(action);
    }
  }
  
  return intent;
}

/**
 * 发现可用技能
 */
async function discoverSkills() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      if (cache.skills) {
        return typeof cache.skills === 'object' ? cache.skills : {};
      }
    }
  } catch (e) {
    // ignore
  }
  
  // 返回基础技能
  return {
    'tavily-search': {
      name: 'tavily-search',
      capabilities: ['search', '查找', '搜索'],
      description: 'Web search'
    },
    'summarize': {
      name: 'summarize',
      capabilities: ['summarize', '总结', '摘要'],
      description: 'Summarize content'
    }
  };
}

/**
 * 技能匹配
 */
function matchSkills(intent, skills) {
  const matched = [];
  
  for (const [name, skill] of Object.entries(skills)) {
    for (const action of intent.actions) {
      for (const cap of skill.capabilities || []) {
        if (cap.toLowerCase().includes(action.toLowerCase())) {
          matched.push(skill);
          break;
        }
      }
    }
  }
  
  return matched.slice(0, 5);
}

/**
 * 查找动作对应的技能
 */
function findSkillForAction(action, skills) {
  const map = {
    'search': 'tavily-search',
    'summarize': 'summarize',
    'save': 'tencent-docs',
    'create': 'tencent-docs',
    'analyze': 'summarize'
  };
  
  return skills.find(s => s.name === map[action]) || skills[0];
}

/**
 * 并行执行计划
 */
async function executeParallel(plan, options = {}) {
  const results = {};
  const maxConcurrency = options.maxConcurrency || 5;
  let current = 0;
  let completed = 0;
  
  const startTime = Date.now();
  
  // 按依赖分层
  const levels = buildDependencyLevels(plan);
  
  for (const level of levels) {
    const promises = level.map(async (step) => {
      while (current >= maxConcurrency) {
        await new Promise(r => setTimeout(r, 10));
      }
      current++;
      
      try {
        // 模拟执行
        await new Promise(r => setTimeout(r, 50));
        results[step.id] = {
          success: true,
          output: `[${step.skill_hint || step.action} executed]`,
          stepId: step.id
        };
      } catch (e) {
        results[step.id] = {
          success: false,
          error: e.message,
          stepId: step.id
        };
      } finally {
        current--;
        completed++;
      }
    });
    
    await Promise.all(promises);
  }
  
  return {
    success: Object.values(results).every(r => r.success),
    completed,
    stats: {
      duration: Date.now() - startTime,
      total: plan.length,
      parallelism: maxConcurrency
    }
  };
}

/**
 * 构建依赖层级
 */
function buildDependencyLevels(plan) {
  const levels = [];
  const remaining = [...plan];
  const completed = new Set();
  
  while (remaining.length > 0) {
    const level = [];
    const nextRemaining = [];
    
    for (const step of remaining) {
      const deps = step.depends_on || [];
      const ready = deps.every(d => completed.has(d));
      
      if (ready) {
        level.push(step);
        completed.add(step.id);
      } else {
        nextRemaining.push(step);
      }
    }
    
    if (level.length === 0 && nextRemaining.length > 0) {
      // 循环依赖，取第一个
      level.push(nextRemaining[0]);
      completed.add(nextRemaining[0].id);
      nextRemaining.shift();
    }
    
    levels.push(level);
    remaining.length = 0;
    remaining.push(...nextRemaining);
  }
  
  return levels;
}

module.exports = {
  run,
  plan,
  discoverSkills,
  matchSkills,
  executeParallel,
  analyzeIntent: analyzeIntentBasic
};
