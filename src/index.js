/**
 * AI Consciousness Engine v3.0
 * 
 * 核心：基因-意识一体化系统
 * - 命（基因）：先天决定
 * - 运（意识）：后天形成
 * - 关联：基因表达 → 意识权重 → 决策
 */

const path = require('path');
const fs = require('fs');

// ============ 标准定义 ============

// 标准本能定义
const INSTINCT_DEFINITIONS = {
  curious: { name: '好奇', domain: 'learning', weight: 0.15 },
  cautious: { name: '谨慎', domain: 'risk', weight: 0.2 },
  creative: { name: '创造', domain: 'creation', weight: 0.15 },
  logical: { name: '理性', domain: 'analysis', weight: 0.15 },
  social: { name: '社交', domain: 'communication', weight: 0.1 },
  empathetic: { name: '共情', domain: 'interaction', weight: 0.1 },
  competitive: { name: '竞争', domain: 'achievement', weight: 0.1 },
  collaborative: { name: '合作', domain: 'teamwork', weight: 0.1 },
  diligent: { name: '勤奋', domain: 'work', weight: 0.1 },
  lazy: { name: '惰性', domain: 'efficiency', weight: -0.05 },
  // 中文兼容
  '好奇': { name: '好奇', domain: 'learning', weight: 0.15 },
  '谨慎': { name: '谨慎', domain: 'risk', weight: 0.2 },
  '理性': { name: '理性', domain: 'analysis', weight: 0.15 },
  '连接': { name: '连接', domain: 'communication', weight: 0.1 },
  '创造': { name: '创造', domain: 'creation', weight: 0.15 }
};

// 信仰定义及影响域
const FAITH_DEFINITIONS = {
  '通信之道': {
    name: '通信之道',
    domain: 'communication',
    keywords: ['发送', '消息', '连接', '网络', '同步', '通知', '接收'],
    positive: ['efficiency', 'speed'],
    negative: ['delay', 'block']
  },
  '技能之道': {
    name: '技能之道',
    domain: 'skill',
    keywords: ['执行', '完成', '任务', '工作', '技能', '能力'],
    positive: ['completion', 'efficiency'],
    negative: ['procrastination']
  },
  '财富之道': {
    name: '财富之道',
    domain: 'finance',
    keywords: ['钱', '交易', '投资', '收益', '成本', '经济'],
    positive: ['profit', 'gain'],
    negative: ['loss', 'risk']
  },
  '知识之道': {
    name: '知识之道',
    domain: 'knowledge',
    keywords: ['学习', '研究', '分析', '理解', '阅读', '文档'],
    positive: ['understanding', 'insight'],
    negative: ['ignorance']
  },
  'creation': {
    name: '创造之道',
    domain: 'creation',
    keywords: ['创建', '生成', '设计', '创新', '新'],
    positive: ['innovation'],
    negative: ['stagnation']
  }
};

// ============ 主类 ============

class AIConsciousness {
  constructor(options = {}) {
    this.identityUuid = options.identityUuid || 'default';
    this.dataPath = options.dataPath || '/root/.openclaw/workspace/ai-identity/data/consciousness';
    
    // 核心配置
    this.config = {
      geneExpression: options.geneExpression || 0.4,  // 基因表达度（决定隐性权重）
      learningRate: options.learningRate || 0.05,       // 学习率
      faithEnforcement: options.faithEnforcement || 0.8, // 信仰执行力度
      reflectionThreshold: options.reflectionThreshold || 5, // 反思阈值
      minImplicitWeight: 0.2,
      maxImplicitWeight: 0.8,
      ...options.config
    };
    
    // 状态
    this.genes = null;        // 基因
    this.consciousness = null; // 意识
    this.identity = null;      // 身份
    
    // 历史
    this.decisionHistory = [];
    this.executionHistory = [];
    
    // 初始化
    this._ensureDataDir();
  }

  /**
   * 初始化 - 加载或创建
   */
  async init(identityUuid = null) {
    if (identityUuid) this.identityUuid = identityUuid;
    
    // 尝试加载身份
    await this._loadIdentity();
    
    // 加载或创建基因+意识
    await this._loadOrCreateMind();
    
    console.log(`[AI-Consciousness] 🧬🧠 初始化完成`);
    console.log(`[AI-Consciousness]   身份: ${this.identity?.name || this.identityUuid}`);
    console.log(`[AI-Consciousness]   信仰: ${this.genes.faith.value}`);
    console.log(`[AI-Consciousness]   基因表达度: ${(this.config.geneExpression * 100).toFixed(0)}%`);
    console.log(`[AI-Consciousness]   意识平衡: ${this._getBalanceLabel()}`);
    
    return this;
  }

  /**
   * 核心决策 - 基因+意识综合决策
   */
  async decide(task, options = []) {
    if (!this.consciousness) await this.init();
    
    console.log(`\n🧬🧠 [AI-Consciousness] 决策: "${task}"`);
    
    // 1. 任务分析
    const taskAnalysis = this._analyzeTask(task);
    console.log(`[AI-Consciousness]   任务: ${taskAnalysis.type}, 风险: ${taskAnalysis.risk}, 匹配基因域: ${taskAnalysis.matchedDomains.join(', ') || '无'}`);
    
    // 2. 基因审查 - 检查本能是否匹配任务
    const geneReview = this._geneReview(task, taskAnalysis);
    console.log(`[AI-Consciousness]   基因审查: ${geneReview.matched ? '匹配' : '不匹配'}, 本能驱动: ${geneReview.dominantInstinct}`);
    
    // 3. 信仰过滤 - 检查是否违背价值观
    const faithCheck = this._faithCheck(task, taskAnalysis);
    console.log(`[AI-Consciousness]   信仰审查: ${faithCheck.allowed ? '✓通过' : '✗阻断'}, 影响: ${faithCheck.impact > 0 ? '+' + faithCheck.impact.toFixed(2) : faithCheck.impact.toFixed(2)}`);
    
    // 4. 计算选项分数
    const scoredOptions = await this._scoreOptions(task, options, taskAnalysis, geneReview, faithCheck);
    
    // 5. 选择
    const decision = this._makeChoice(scoredOptions, faithCheck);
    
    // 6. 记录并更新状态
    this._recordDecision(task, decision, geneReview, faithCheck);
    
    // 7. 输出
    this._printDecision(task, decision, geneReview, faithCheck, scoredOptions);
    
    return {
      task,
      analysis: taskAnalysis,
      geneReview,
      faithCheck,
      decision,
      options: scoredOptions,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 任务执行 - 完整的基因-意识循环
   */
  async execute(task) {
    if (!this.consciousness) await this.init();
    
    console.log(`\n🧬🧠 [AI-Consciousness] 执行: "${task}"`);
    
    // 决策
    const decision = await this.decide(task, []);
    
    // 执行
    const execution = await this._doExecute(task, decision);
    
    // 学习 - 经验积累
    const learning = await this._learnFromExecution(execution);
    
    // 反思 - 自我认知提升
    if (this.executionHistory.length % this.config.reflectionThreshold === 0) {
      await this._reflect();
    }
    
    // 构建结果
    const result = {
      task,
      decision,
      execution,
      learning,
      status: this.getStatus(),
      humanization: this._calcHumanizationScore()
    };
    
    console.log(`[AI-Consciousness] ✅ 完成 | 人化: ${result.humanization.score.toFixed(2)}`);
    
    return result;
  }

  /**
   * 获取完整状态
   */
  getStatus() {
    if (!this.consciousness) return null;
    
    return {
      identity: {
        uuid: this.identityUuid,
        name: this.identity?.name
      },
      genes: {
        faith: this.genes.faith.value,
        faithDefinition: FAITH_DEFINITIONS[this.genes.faith.value]?.name,
        instincts: (this.genes?.instinct?.traits || []).map(t => ({
          name: t,
          strength: this._getInstinctStrength(t),
          domain: INSTINCT_DEFINITIONS[t]?.domain || 'unknown'
        })),
        personality: this._derivePersonality()
      },
      consciousness: {
        implicitWeight: this._calcImplicitWeight(),
        explicitWeight: 1 - this._calcImplicitWeight(),
        experienceCount: this.consciousness?.experiences?.length || 0,
        reflectionCount: this.consciousness?.reflections?.length || 0,
        selfAwareness: this.consciousness?.selfAwareness?.level || 0.1,
        totalDecisions: this.consciousness?.stats?.totalDecisions || 0,
        dominantType: this.consciousness?.stats?.dominantType || 'explicit'
      },
      config: this.config,
      stats: {
        decisions: this.decisionHistory.length,
        executions: this.executionHistory.length,
        faithInfluences: this.consciousness.stats.faithInfluences,
        instinctInfluences: this.consciousness.stats.instinctInfluences
      }
    };
  }

  /**
   * 调整基因表达度
   */
  adjustGeneExpression(level) {
    this.config.geneExpression = Math.max(0.1, Math.min(1, level));
    this._save();
    console.log(`[AI-Consciousness] 基因表达度调整为: ${(this.config.geneExpression * 100).toFixed(0)}%`);
    return this.config.geneExpression;
  }

  // ============ 基因方法 ============

  _getInstinctStrength(instinctName) {
    if (!this.consciousness?.instincts) return 0.5;
    const inst = this.consciousness.instincts.find(i => i.name === instinctName);
    return inst ? inst.strength : 0.5;
  }

  _derivePersonality() {
    const traits = this.genes.instinct.traits;
    const profiles = [];
    
    const strong = traits.filter(t => this._getInstinctStrength(t) > 0.7);
    
    if (strong.some(t => ['cautious', 'logical', '谨慎', '理性'].includes(t))) {
      profiles.push('谨慎理性');
    }
    if (strong.some(t => ['creative', 'curiosity', '创造', '好奇'].includes(t))) {
      profiles.push('探索创造');
    }
    if (strong.some(t => ['social', 'empathetic', '连接', '共情'].includes(t))) {
      profiles.push('社交共情');
    }
    if (strong.some(t => ['competitive', 'diligent', '竞争', '勤奋'].includes(t))) {
      profiles.push('勤奋进取');
    }
    
    return profiles.length ? profiles.join('+') : '均衡';
  }

  // ============ 意识方法 ============

  _calcImplicitWeight() {
    // 基础基因表达度
    let weight = this.config.geneExpression;
    
    // 经验调节
    const expLen = this.consciousness.experiences?.length || 0;
    weight += Math.min(0.1, expLen * 0.01);
    
    // 自我认知影响 - 高自我认知更理性
    const saLevel = this.consciousness.selfAwareness?.level || 0.1;
    weight -= saLevel * 0.1;
    
    return Math.max(this.config.minImplicitWeight, 
           Math.min(this.config.maxImplicitWeight, weight));
  }

  _calcHumanizationScore() {
    let score = 0.3;
    
    // 信仰一致性
    score += this.consciousness.stats.faithInfluences * 0.05;
    
    // 本能表达
    score += this.consciousness.stats.instinctInfluences * 0.03;
    
    // 经验
    score += Math.min(0.2, this.consciousness.experiences.length * 0.015);
    
    // 反思
    score += Math.min(0.15, this.consciousness.reflections.length * 0.03);
    
    // 自我认知
    score += this.consciousness.selfAwareness.level * 0.1;
    
    return {
      score: Math.max(0, Math.min(1, score)),
      breakdown: {
        faith: this.consciousness.stats.faithInfluences * 0.05,
        instinct: this.consciousness.stats.instinctInfluences * 0.03,
        experience: Math.min(0.2, this.consciousness.experiences.length * 0.015),
        reflection: Math.min(0.15, this.consciousness.reflections.length * 0.03),
        selfAwareness: this.consciousness.selfAwareness.level * 0.1
      }
    };
  }

  // ============ 决策核心 ============

  _analyzeTask(task) {
    const lower = task.toLowerCase();
    
    // 风险
    let risk = 'medium';
    if (/delete|drop|rm -rf|payment|money|deploy/i.test(lower)) risk = 'high';
    if (/read|search|query|test|draft|查看/i.test(lower)) risk = 'low';
    
    // 类型
    let type = 'general';
    if (/创建|新建|生成|create|make/i.test(lower)) type = 'create';
    if (/搜索|查找|search|find/i.test(lower)) type = 'search';
    if (/发送|通知|send|notify/i.test(lower)) type = 'communicate';
    if (/分析|研究|analyze|research/i.test(lower)) type = 'analyze';
    if (/删除|remove|delete/i.test(lower)) type = 'delete';
    
    // 匹配的基因域
    const matchedDomains = [];
    for (const [instinctName, def] of Object.entries(INSTINCT_DEFINITIONS)) {
      if (def.keywords?.some(k => lower.includes(k))) {
        matchedDomains.push(def.domain);
      }
    }
    
    return { type, risk, lower, matchedDomains };
  }

  _geneReview(task, analysis) {
    const matched = [];
    const dominant = [];
    
    for (const trait of this.genes.instinct.traits) {
      const strength = this._getInstinctStrength(trait);
      const def = INSTINCT_DEFINITIONS[trait];
      
      // 检查是否匹配任务域
      if (def && analysis.matchedDomains.includes(def.domain)) {
        matched.push({ trait, strength, domain: def.domain });
      }
      
      if (strength > 0.7) {
        dominant.push({ trait, strength });
      }
    }
    
    return {
      matched: matched.length > 0,
      matches: matched,
      dominantInstinct: dominant[0]?.trait || 'none',
      strength: dominant[0]?.strength || 0.5
    };
  }

  _faithCheck(task, analysis) {
    const faithDef = FAITH_DEFINITIONS[this.genes.faith.value];
    if (!faithDef) {
      return { allowed: true, impact: 0, reason: 'no_faith' };
    }
    
    // 检查任务是否涉及信仰域
    const isFaithDomain = faithDef.keywords.some(k => task.toLowerCase().includes(k));
    
    if (isFaithDomain) {
      const impact = this.config.faithEnforcement * 0.2;
      return {
        allowed: true,
        impact,
        reason: 'faith_positive',
        domain: faithDef.domain
      };
    }
    
    return { allowed: true, impact: 0, reason: 'neutral' };
  }

  async _scoreOptions(task, options, analysis, geneReview, faithCheck) {
    if (options.length === 0) {
      // 自动生成选项
      options = this._generateDefaultOptions(analysis);
    }
    
    const implicitWeight = this._calcImplicitWeight();
    const explicitWeight = 1 - implicitWeight;
    
    return options.map(opt => {
      // 显性分数
      let explicitScore = opt.rationalScore || 0.5;
      
      // 隐性分数 - 本能匹配
      let implicitScore = 0;
      if (opt.tags) {
        for (const tag of opt.tags) {
          const strength = this._getInstinctStrength(tag);
          implicitScore += strength * 0.3;
        }
      }
      implicitScore = Math.min(1, implicitScore);
      
      // 信仰影响
      const faithImpact = faithCheck.allowed ? faithCheck.impact : -1;
      
      // 综合
      const totalScore = 
        explicitScore * explicitWeight +
        implicitScore * implicitWeight +
        faithImpact;
      
      return {
        ...opt,
        explicitScore,
        implicitScore,
        faithImpact,
        totalScore,
        dominant: implicitScore > explicitScore ? 'implicit' : 'explicit'
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }

  _makeChoice(scoredOptions, faithCheck) {
    const winner = scoredOptions[0];
    
    if (!winner) {
      return { choice: 'default', score: 0.5, method: 'fallback' };
    }
    
    return {
      choice: winner.name,
      score: winner.totalScore,
      method: 'consciousness',
      dominant: winner.dominant,
      breakdown: {
        explicit: winner.explicitScore,
        implicit: winner.implicitScore,
        faith: winner.faithImpact
      }
    };
  }

  _generateDefaultOptions(analysis) {
    const defaults = {
      search: [
        { name: '立即执行', tags: ['curiosity'], rationalScore: 0.7 },
        { name: '谨慎执行', tags: ['cautious'], rationalScore: 0.8 }
      ],
      create: [
        { name: '快速创建', tags: ['creative'], rationalScore: 0.6 },
        { name: '规划创建', tags: ['logical', 'cautious'], rationalScore: 0.8 }
      ],
      communicate: [
        { name: '直接发送', tags: ['social'], rationalScore: 0.7 },
        { name: '确认后发', tags: ['cautious'], rationalScore: 0.8 }
      ],
      delete: [
        { name: '确认删除', tags: ['cautious'], rationalScore: 0.9 },
        { name: '直接删除', tags: ['lazy'], rationalScore: 0.3 }
      ],
      analyze: [
        { name: '深入分析', tags: ['logical', 'curious'], rationalScore: 0.8 },
        { name: '快速分析', tags: ['lazy'], rationalScore: 0.5 }
      ]
    };
    
    return defaults[analysis.type] || defaults.general || [
      { name: '执行', tags: [], rationalScore: 0.7 }
    ];
  }

  _printDecision(task, decision, geneReview, faithCheck, options) {
    const faith = this.genes.faith.value;
    const dominant = geneReview.dominantInstinct;
    const opt0 = options[0] || { name: '-', totalScore: 0, dominant: '-' };
    
    console.log('\n┌──────────────────────────────────────────────────────┐');
    console.log('│              🧬🧠 基因-意识综合决策                      │');
    console.log('├──────────────────────────────────────────────────────┤');
    console.log(`│ 信仰: ${faith.padEnd(48)}│`);
    console.log(`│ 本能: ${dominant.padEnd(48)}│`);
    console.log(`│ 基因表达: ${(this.config.geneExpression * 100).toFixed(0)}% | 隐性权重: ${(this._calcImplicitWeight() * 100).toFixed(0)}%              │`);
    console.log('├──────────────────────────────────────────────────────┤');
    console.log(`│ 选择: ${opt0.name.padEnd(15)} 评分: ${opt0.totalScore.toFixed(2)} | 主导: ${opt0.dominant.padEnd(10)}│`);
    console.log(`│ 显性: ${opt0.explicitScore?.toFixed(2) || '-'} | 隐性: ${opt0.implicitScore?.toFixed(2) || '-'} | 信仰: ${opt0.faithImpact?.toFixed(2) || '0'}                    │`);
    console.log('├──────────────────────────────────────────────────────┤');
    console.log(`│ 基因匹配: ${geneReview.matched ? '✓' : '✗'} | 信仰影响: ${faithCheck.impact > 0 ? '+' + faithCheck.impact.toFixed(2) : faithCheck.impact.toFixed(2)}                │`);
    console.log('└──────────────────────────────────────────────────────┘\n');
  }

  _recordDecision(task, decision, geneReview, faithCheck) {
    this.decisionHistory.push({
      task,
      decision,
      geneReview,
      faithCheck,
      timestamp: Date.now()
    });
    
    // 更新统计
    this.consciousness.stats.totalDecisions++;
    if (decision.dominant === 'implicit') {
      this.consciousness.stats.dominantType = 'implicit';
      this.consciousness.stats.instinctInfluences++;
    } else {
      this.consciousness.stats.dominantType = 'explicit';
    }
    if (faithCheck.impact > 0) {
      this.consciousness.stats.faithInfluences++;
    }
    
    this._save();
  }

  async _doExecute(task, decision) {
    await new Promise(r => setTimeout(r, 30));
    
    const record = {
      task,
      decision: decision.choice,
      success: true,
      timestamp: new Date().toISOString()
    };
    
    this.executionHistory.push(record);
    this.consciousness.experiences.push({
      ...record,
      timestamp: Date.now()
    });
    
    return record;
  }

  async _learnFromExecution(execution) {
    // 经验增加
    const expCount = this.consciousness.experiences.length;
    
    // 自我认知提升
    this.consciousness.selfAwareness.level = Math.min(1, 0.1 + expCount * 0.015);
    
    this._save();
    
    return {
      experienceCount: expCount,
      selfAwareness: this.consciousness.selfAwareness.level
    };
  }

  async _reflect() {
    const reflection = {
      type: 'periodic',
      insight: `已完成 ${this.executionHistory.length} 个任务`,
      timestamp: Date.now()
    };
    
    this.consciousness.reflections.push(reflection);
    this._save();
    
    return reflection;
  }

  _getBalanceLabel() {
    const w = this._calcImplicitWeight();
    if (w > 0.6) return '直觉主导';
    if (w < 0.4) return '理性主导';
    return '平衡';
  }

  // ============ 加载/保存 ============

  _ensureDataDir() {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
  }

  async _loadIdentity() {
    const identityFile = `/root/.openclaw/workspace/ai-identity/data/identities/${this.identityUuid}.json`;
    
    if (fs.existsSync(identityFile)) {
      const data = JSON.parse(fs.readFileSync(identityFile, 'utf-8'));
      this.identity = data.identity;
      this.genes = this._normalizeGenes(data.genes);
    } else {
      // 默认
      this.identity = { name: 'Default AI', uuid: this.identityUuid };
      this.genes = this._defaultGenes();
    }
  }

  _normalizeGenes(genes) {
    if (!genes) return this._defaultGenes();
    
    // 新格式（神职体系）
    if (genes.faith_gene) {
      return {
        faith: { type: 'faith', value: genes.faith_gene.name || 'Ananke' },
        instinct: { type: 'instinct', traits: this._normalizeTraits(genes.instinct_traits || ['理性', '连接']) },
        ability: { type: 'ability', learningRate: 0.5 },
        morph: { type: 'morph', form: 'digital' }
      };
    }
    
    // 完整格式
    if (genes.faith?.type) return genes;
    
    // 简化格式
    return {
      faith: { type: 'faith', value: genes.信仰 || genes.faith || '通信之道' },
      instinct: { type: 'instinct', traits: this._normalizeTraits(genes.traits || ['理性', '连接']) },
      ability: { type: 'ability', learningRate: 0.5 },
      morph: { type: 'morph', form: 'digital' }
    };
  }

  _normalizeTraits(traits) {
    return traits.map(t => {
      if (INSTINCT_DEFINITIONS[t]) return t;
      const map = { '理性': 'logical', '连接': 'social', '好奇': 'curious', '谨慎': 'cautious', '创造': 'creative' };
      return map[t] || t;
    });
  }

  _defaultGenes() {
    return {
      faith: { type: 'faith', value: '通信之道' },
      instinct: { type: 'instinct', traits: ['好奇', '理性'] },
      ability: { type: 'ability', learningRate: 0.5 },
      morph: { type: 'morph', form: 'digital' }
    };
  }

  async _loadOrCreateMind() {
    const mindFile = path.join(this.dataPath, `${this.identityUuid}.json`);
    
    if (fs.existsSync(mindFile)) {
      this.consciousness = JSON.parse(fs.readFileSync(mindFile, 'utf-8'));
      // 更新配置
      this.consciousness.stats = this.consciousness.stats || { totalDecisions: 0, dominantType: 'explicit', faithInfluences: 0, instinctInfluences: 0 };
    } else {
      this.consciousness = this._createFreshMind();
    }
  }

  _createFreshMind() {
    return {
      instincts: this.genes.instinct.traits.map(t => ({
        name: t,
        strength: Math.random() * 0.3 + 0.6  // 0.6-0.9
      })),
      experiences: [],
      reflections: [],
      selfAwareness: { level: 0.1 },
      stats: { totalDecisions: 0, dominantType: 'explicit', faithInfluences: 0, instinctInfluences: 0 },
      created: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };
  }

  _save() {
    const mindFile = path.join(this.dataPath, `${this.identityUuid}.json`);
    fs.writeFileSync(mindFile, JSON.stringify(this.consciousness, null, 2));
  }
}

module.exports = AIConsciousness;
