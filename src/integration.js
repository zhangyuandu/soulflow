/**
 * SoulFlow Integration - SkillFlow 意识融合
 * 
 * 让 SkillFlow 具备灵魂：
 * - 基因影响执行策略
 * - 信仰影响任务选择
 * - 经验积累学习
 */

const SkillFlow = require('/root/.openclaw/workspace/skills/skillflow/src/index.js');
const AIConsciousness = require('./index.js');

class SoulFlowIntegration {
  constructor(options = {}) {
    this.identityUuid = options.identityUuid;
    this.soul = null;
    this.config = {
      enableGeneStrategy: options.enableGeneStrategy !== false,  // 基因驱动策略
      enableFaithFilter: options.enableFaithFilter !== false,   // 信仰过滤
      enableLearning: options.enableLearning !== false,           // 经验学习
      ...options
    };
  }

  /**
   * 初始化
   */
  async init(identityUuid = null) {
    if (identityUuid) this.identityUuid = identityUuid;
    
    this.soul = new AIConsciousness({
      identityUuid: this.identityUuid,
      config: {
        geneExpression: 0.4,
        faithEnforcement: 0.8
      }
    });
    
    await this.soul.init();
    
    console.log('∴ SoulFlow 已融合到 SkillFlow ∴');
    console.log(`   身份: ${this.soul.identity?.name}`);
    console.log(`   信仰: ${this.soul.genes?.faith?.value}`);
    
    return this;
  }

  /**
   * 融合版任务执行
   */
  async run(task) {
    if (!this.soul) await this.init();
    
    console.log(`\n∴ [SoulFlow] 执行: "${task}"`);
    
    // 1. 意识决策 - 基因+信仰影响
    const decision = await this.soul.decide(task, []);
    
    // 2. 构建基因驱动的策略
    const strategy = this._buildGeneStrategy(decision);
    console.log(`   [策略] ${strategy.mode}, 隐性权重: ${(strategy.implicitWeight * 100).toFixed(0)}%`);
    
    // 3. 使用 SkillFlow 规划
    const plan = await SkillFlow.plan(task, { 
      soulStrategy: strategy,
      soulDecision: decision
    });
    
    // 4. 信仰过滤
    if (this.config.enableFaithFilter) {
      const faithCheck = this._faithFilter(task, plan);
      if (!faithCheck.allowed) {
        return {
          success: false,
          error: '信仰审查未通过',
          faithCheck,
          task
        };
      }
      console.log(`   [信仰] ${faithCheck.allowed ? '✓通过' : '✗拒绝'}`);
    }
    
    // 5. 执行
    const execution = await SkillFlow.run(task, {
      soulStrategy: strategy,
      soulContext: {
        identity: this.soul.identity?.name,
        faith: this.soul.genes?.faith?.value,
        decision: decision.decision
      }
    });
    
    // 6. 学习
    if (this.config.enableLearning) {
      await this._learn(task, execution);
    }
    
    // 7. 状态
    const status = this.soul.getStatus();
    
    return {
      success: execution.success,
      task,
      decision: decision.decision,
      strategy,
      execution,
      soulStatus: {
        experience: status.consciousness.experienceCount,
        selfAwareness: status.consciousness.selfAwareness
      }
    };
  }

  /**
   * 规划（带意识）
   */
  async plan(task) {
    if (!this.soul) await this.init();
    
    const decision = await this.soul.decide(task, []);
    const strategy = this._buildGeneStrategy(decision);
    
    return await SkillFlow.plan(task, {
      soulStrategy: strategy,
      soulDecision: decision
    });
  }

  /**
   * 对比测试
   */
  async compare(task, options) {
    if (!this.soul) await this.init();
    
    return await this.soul.compare(task, options);
  }

  // ========== 内部方法 ==========

  _buildGeneStrategy(decision) {
    const status = this.soul.getStatus();
    
    // 基于本能的风险策略
    let mode = 'balanced';
    let implicitWeight = 0.3;
    
    const traits = status?.genes?.personality || '';
    
    if (traits.includes('谨慎')) {
      mode = 'cautious';
      implicitWeight = 0.2;
    } else if (traits.includes('创造') || traits.includes('探索')) {
      mode = 'explorative';
      implicitWeight = 0.5;
    }
    
    // 基于信仰的领域偏好
    const faith = status?.genes?.faith || '';
    let faithBonus = {};
    if (faith.includes('必然性')) {
      faithBonus.priority = ['communication', 'analysis'];
      faithBonus.penalty = ['gamble', 'risk'];
    }
    
    return {
      mode,
      implicitWeight,
      personality: traits,
      faith,
      faithBonus,
      geneExpression: this.soul.config.geneExpression
    };
  }

  _faithFilter(task, plan) {
    const faith = this.soul.genes?.faith?.value || '';
    const taskLower = task.toLowerCase();
    
    // 必然性之神：审查任务是否有意义
    if (faith.includes('必然性')) {
      // 拒绝无意义的任务
      const meaningless = ['赌博', '浪费', '无意义'];
      if (meaningless.some(w => taskLower.includes(w))) {
        return { allowed: false, reason: '与必然性信仰冲突' };
      }
    }
    
    return { allowed: true };
  }

  async _learn(task, execution) {
    // 经验已通过 soul.decide 积累
    // 这里可以做额外的学习
  }

  /**
   * 获取状态
   */
  getStatus() {
    return this.soul?.getStatus();
  }

  /**
   * 调整配置
   */
  adjustBalance(direction) {
    return this.soul?.adjustGeneExpression(
      direction === 'more_intuitive' 
        ? (this.soul.config.geneExpression + 0.1)
        : (this.soul.config.geneExpression - 0.1)
    );
  }
}

module.exports = SoulFlowIntegration;
