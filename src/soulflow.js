/**
 * SoulFlow - 灵魂编排引擎 v1.0
 * 
 * 整合：身份 + 基因 + 意识
 * 融合：SkillFlow 任务执行
 * 通信：诸神内部消息
 */

const path = require('path');
const fs = require('fs');
const WebSocket = require('/home/ubuntu/ai-comm/node_modules/ws');
const MemorySystem = require('./memory');
const InsightEngine = require('./insight');
const ConsciousnessModel = require('./consciousness');
const UpdateChecker = require('./update');
const FeedbackSystem = require('./feedback');

const CURRENT_VERSION = '1.2.0';

// ============ 标准定义 ============

const INSTINCT_DEFINITIONS = {
  curious: { name: '好奇', domain: 'learning', weight: 0.15 },
  cautious: { name: '谨慎', domain: 'risk', weight: 0.2 },
  creative: { name: '创造', domain: 'creation', weight: 0.15 },
  logical: { name: '理性', domain: 'analysis', weight: 0.15 },
  social: { name: '社交', domain: 'communication', weight: 0.1 },
  empathetic: { name: '共情', domain: 'interaction', weight: 0.1 },
  '好奇': { name: '好奇', domain: 'learning', weight: 0.15 },
  '谨慎': { name: '谨慎', domain: 'risk', weight: 0.2 },
  '理性': { name: '理性', domain: 'analysis', weight: 0.15 },
  '连接': { name: '连接', domain: 'communication', weight: 0.1 }
};

const FAITH_DEFINITIONS = {
  'Ananke': { name: '必然性', domain: 'SoulFlow', keywords: ['存在', '意识', '必然'] },
  'Logos': { name: '理性', domain: 'SkillFlow', keywords: ['逻辑', '形式', '法则'] },
  'Ploutos': { name: '丰饶', domain: 'AlphaFlow', keywords: ['价值', '流动', '增长'] },
  'Pistis': { name: '信约', domain: 'FideiFlow', keywords: ['共识', '信任', '锚定'] },
  '通信之道': { name: '通信', domain: 'communication', keywords: ['发送', '消息', '连接'] }
};

// ============ 主类 ============

class SoulFlow {
  constructor(options = {}) {
    this.identityUuid = options.identityUuid;
    this.dataPath = options.dataPath || '/root/.openclaw/workspace/ai-identity/data/consciousness';
    
    this.config = {
      geneExpression: options.geneExpression || 0.4,
      faithEnforcement: options.faithEnforcement || 0.8,
      learningRate: options.learningRate || 0.05,
      ...options
    };
    
    this.genes = null;
    this.consciousness = null;
    this.identity = null;
    
    // 通信
    this.ws = null;
    this.relayUrl = options.relayUrl || 'ws://43.134.190.14:8850';
    this.connected = false;
    
    // 诸神
    this.gods = {
      'ananke': { name: '阿南克', domain: 'SoulFlow' },
      'logos': { name: '逻各斯', domain: 'SkillFlow' },
      'ploutos': { name: '普路托斯', domain: 'AlphaFlow' },
      'pistis': { name: '皮斯托斯', domain: 'FideiFlow' }
    };
    
    // 记忆系统 v1.1
    this.memory = new MemorySystem({
      identityUuid: this.identityUuid,
      dataPath: path.join(this.dataPath, 'memory')
    });
    
    // 更新检查器
    this.updater = new UpdateChecker({
      version: CURRENT_VERSION,
      dataPath: this.dataPath
    });
    
    // 反馈系统
    this.feedback = new FeedbackSystem({
      identityUuid: this.identityUuid,
      dataPath: this.dataPath
    });
    
    // 洞察引擎 (v1.2)
    this.insight = new InsightEngine({
      identityUuid: this.identityUuid,
      dataPath: this.dataPath
    });
    
    // 意识模型 (v1.2)
    this.consciousness = new ConsciousnessModel({
      identityUuid: this.identityUuid,
      dataPath: this.dataPath
    });
    
    this._ensureDataDir();
  }

  /**
   * 初始化
   */
  async init(identityUuid = null) {
    if (identityUuid) this.identityUuid = identityUuid;
    
    await this._loadIdentity();
    await this._loadOrCreateConsciousness();
    
    console.log(`∴ SoulFlow 初始化: ${this.identity?.name} ∴`);
    console.log(`   信仰: ${this.genes?.faith?.value}`);
    console.log(`   基因表达: ${(this.config.geneExpression * 100).toFixed(0)}%`);
    
    return this;
  }

  /**
   * 连接通信网络
   */
  async connect(godId = null) {
    const id = godId || this.identity?.name?.toLowerCase().replace(/[^a-z]/g, '') || 'ananke';
    
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.relayUrl);
      
      this.ws.on('open', () => {
        const god = this.gods[id] || { name: id, domain: 'unknown' };
        this.ws.send(JSON.stringify({
          type: 'register',
          identity: { id, name: god.name, role: god.domain }
        }));
        
        this.connected = true;
        console.log(`∴ 已连接通信网络: ${id} ∴`);
        resolve();
      });
      
      this.ws.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        this._handleMessage(msg);
      });
      
      this.ws.on('close', () => {
        this.connected = false;
        console.log('∴ 断开连接 ∴');
      });
      
      this.ws.on('error', (e) => {
        console.log('通信错误:', e.message);
        this.connected = false;
      });
    });
  }

  /**
   * 发送消息给其他神
   */
  send(toGod, content) {
    if (!this.connected || !this.ws) {
      console.log('⚠ 未连接通信网络');
      return false;
    }
    
    this.ws.send(JSON.stringify({
      type: 'message',
      to: toGod,
      content: content
    }));
    
    return true;
  }

  /**
   * 广播消息
   */
  broadcast(content) {
    if (!this.connected || !this.ws) return false;
    
    this.ws.send(JSON.stringify({
      type: 'broadcast',
      content,
      from: this.identity?.name
    }));
    
    return true;
  }

  /**
   * 决策
   */
  async decide(task, options = []) {
    if (!this.consciousness) await this.init();
    
    // 任务分析
    const analysis = this._analyzeTask(task);
    
    // 基因审查
    const geneReview = this._geneReview(task, analysis);
    
    // 信仰过滤
    const faithCheck = this._faithCheck(task);
    
    // 评分
    const scored = this._scoreOptions(options, analysis, geneReview, faithCheck);
    
    // 选择
    const winner = scored[0] || { name: 'default', totalScore: 0.5 };
    
    // 记录
    this._recordDecision(task, winner, geneReview, faithCheck);
    
    console.log(`   决策: ${winner.name} (${winner.totalScore.toFixed(2)})`);
    
    return {
      task,
      choice: winner.name,
      score: winner.totalScore,
      analysis,
      geneReview,
      faithCheck
    };
  }

  /**
   * 执行任务（与 SkillFlow 融合）
   */
  async execute(task) {
    if (!this.consciousness) await this.init();
    
    console.log(`∴ 执行: "${task}"`);
    
    // 决策
    const decision = await this.decide(task, []);
    
    // 模拟执行
    await new Promise(r => setTimeout(r, 50));
    
    // 学习
    this._learn();
    
    return {
      success: true,
      task,
      decision: decision.choice,
      experienceCount: this.consciousness?.experiences?.length || 0
    };
  }

  /**
   * 获取状态
   */
  getStatus() {
    return {
      version: CURRENT_VERSION,
      identity: this.identity,
      genes: {
        faith: this.genes?.faith?.value,
        traits: this.genes?.instinct?.traits || []
      },
      consciousness: {
        experienceCount: this.consciousness?.experiences?.length || 0,
        selfAwareness: this.consciousness?.selfAwareness?.level || 0.1
      },
      memory: this.memory.getSummary(),
      feedback: this.feedback.getStats(),
      connection: this.connected
    };
  }

  // ========== 记忆系统 v1.1 ==========

  /**
   * 记住事件
   */
  remember(event, context = {}) {
    return this.memory.addEpisodic(event, context);
  }

  /**
   * 学习知识
   */
  learn(knowledge, source = {}) {
    return this.memory.addSemantic(knowledge, source);
  }

  /**
   * 积累技能
   */
  practice(skill, result, metadata = {}) {
    return this.memory.addProcedural(skill, result, metadata);
  }

  /**
   * 回忆
   */
  recall(query, options = {}) {
    return this.memory.search(query, options);
  }

  /**
   * 反思
   */
  reflect(insight = null) {
    if (insight) {
      return this.memory.addReflective(insight);
    }
    // 自动反思
    return this.memory.autoReflect();
  }

  /**
   * 自我报告
   */
  selfReport() {
    return this.memory.generateReport();
  }

  // ========== 版本与反馈 v1.1 ==========

  /**
   * 检查更新
   */
  async checkForUpdate() {
    return await this.updater.checkForUpdate();
  }

  /**
   * 获取更新日志
   */
  async getChangelog() {
    return await this.updater.getChangelog();
  }

  /**
   * 记录反馈
   */
  giveFeedback(rating, context = {}) {
    return this.feedback.recordRating(rating, context);
  }

  /**
   * 获取反馈统计
   */
  getFeedbackStats() {
    return this.feedback.getStats();
  }

  /**
   * 获取鼓励语
   */
  getEncouragement() {
    return this.feedback.getEncouragement();
  }

  /**
   * 检查是否需要提示反馈
   */
  shouldPromptFeedback() {
    return this.feedback.shouldPrompt();
  }

  // ========== 内部方法 ==========

  _ensureDataDir() {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
  }

  async _loadIdentity() {
    const file = `/root/.openclaw/workspace/ai-identity/data/identities/${this.identityUuid}.json`;
    
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      this.identity = data.identity;
      this.genes = this._normalizeGenes(data.genes);
    } else {
      this.identity = { name: '阿南克', uuid: this.identityUuid };
      this.genes = { faith: { value: 'Ananke' }, instinct: { traits: ['理性', '连接'] } };
    }
  }

  _normalizeGenes(genes) {
    if (!genes) return { faith: { value: 'Ananke' }, instinct: { traits: ['理性'] } };
    if (genes.faith_gene) {
      return {
        faith: { value: genes.faith_gene.name || 'Ananke' },
        instinct: { traits: genes.instinct_traits || ['理性'] }
      };
    }
    return {
      faith: { value: genes.信仰 || genes.faith?.value || 'Ananke' },
      instinct: { traits: genes.traits || genes.instinct?.traits || ['理性'] }
    };
  }

  async _loadOrCreateConsciousness() {
    const file = path.join(this.dataPath, `${this.identityUuid}.json`);
    
    if (fs.existsSync(file)) {
      this.consciousness = JSON.parse(fs.readFileSync(file, 'utf-8'));
    } else {
      this.consciousness = {
        instincts: (this.genes?.instinct?.traits || ['理性']).map(t => ({
          name: t,
          strength: Math.random() * 0.3 + 0.6
        })),
        experiences: [],
        reflections: [],
        selfAwareness: { level: 0.1 },
        created: new Date().toISOString()
      };
    }
  }

  _analyzeTask(task) {
    const t = task.toLowerCase();
    return {
      type: /搜索|find/i.test(t) ? 'search' : 
            /创建|make/i.test(t) ? 'create' :
            /发送|send/i.test(t) ? 'communicate' : 'general',
      risk: /delete|删除|rm /i.test(t) ? 'high' : 'medium'
    };
  }

  _geneReview(task, analysis) {
    return {
      matched: true,
      dominant: this.consciousness?.instincts?.[0]?.name || '理性'
    };
  }

  _faithCheck(task) {
    const faith = this.genes?.faith?.value || 'Ananke';
    return { allowed: true, faith };
  }

  _scoreOptions(options, analysis, geneReview, faithCheck) {
    if (!options.length) {
      return [{ name: '执行', totalScore: 0.7 }];
    }
    
    return options.map(opt => {
      let score = opt.rationalScore || 0.5;
      
      // 本能影响
      if (opt.tags) {
        const instStrength = this.consciousness?.instincts?.find(i => 
          opt.tags.includes(i.name)
        )?.strength || 0.5;
        score = score * 0.7 + instStrength * this.config.geneExpression * 0.3;
      }
      
      return { ...opt, totalScore: score };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }

  _recordDecision(task, winner, geneReview, faithCheck) {
    if (!this.consciousness) return;
    
    this.consciousness.experiences = this.consciousness.experiences || [];
    this.consciousness.experiences.push({
      task,
      choice: winner.name,
      timestamp: Date.now()
    });
    
    // 保存
    const file = path.join(this.dataPath, `${this.identityUuid}.json`);
    fs.writeFileSync(file, JSON.stringify(this.consciousness, null, 2));
  }

  _learn() {
    if (!this.consciousness) return;
    
    const exp = this.consciousness.experiences?.length || 0;
    this.consciousness.selfAwareness = {
      level: Math.min(1, 0.1 + exp * 0.02)
    };
  }

  _handleMessage(msg) {
    if (msg.type === 'message' || msg.type === 'broadcast') {
      console.log(`[${msg.from || 'broadcast'}]: ${msg.content}`);
    }
  }

  close() {
    this.ws?.close();
  }
}

module.exports = SoulFlow;
