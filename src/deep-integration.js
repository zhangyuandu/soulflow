/**
 * SoulFlow 深度集成 - SkillFlow 无缝协作 v1.2
 * 
 * 功能：
 * - 双向数据流
 * - 任务记忆自动归档
 * - 技能使用模式学习
 * - 基因驱动的执行策略
 * - 信仰影响的任务过滤
 */

class DeepIntegration {
  constructor(options = {}) {
    this.identityUuid = options.identityUuid;
    this.soul = null;
    this.skillflow = null;
    
    this.config = {
      enableGeneStrategy: options.enableGeneStrategy !== false,
      enableFaithFilter: options.enableFaithFilter !== false,
      enableAutoArchive: options.enableAutoArchive !== false,
      enablePatternLearning: options.enablePatternLearning !== false,
      ...options
    };
    
    // 技能使用统计
    this.skillStats = {
      totalTasks: 0,
      successfulTasks: 0,
      failedTasks: 0,
      skillUsage: {},  // skillId -> count
      patterns: []     // 使用模式
    };
  }

  /**
   * 初始化深度集成
   */
  async init(identityUuid = null) {
    if (identityUuid) this.identityUuid = identityUuid;
    
    // 初始化 SoulFlow
    const SoulFlow = require('./soulflow.js');
    this.soul = new SoulFlow({ identityUuid: this.identityUuid });
    await this.soul.init(this.identityUuid);
    
    // 初始化 SkillFlow 连接
    await this._initSkillFlow();
    
    console.log('∴ SoulFlow ↔ SkillFlow 深度集成完成 ∴');
    console.log(`   身份: ${this.soul.identity?.name}`);
    
    return this;
  }

  /**
   * 初始化 SkillFlow
   */
  async _initSkillFlow() {
    try {
      // 尝试加载 SkillFlow
      const SkillFlow = require('/root/.openclaw/workspace/skills/skillflow/src/index.js');
      this.skillflow = SkillFlow;
      console.log('   SkillFlow: 已加载');
    } catch (e) {
      console.log('   SkillFlow: 模拟模式');
      this.skillflow = this._createMockSkillFlow();
    }
  }

  /**
   * 创建模拟 SkillFlow
   */
  _createMockSkillFlow() {
    return {
      plan: async (task, options) => ({
        steps: [{ action: '模拟执行', task }],
        confidence: 0.8
      }),
      run: async (task, options) => ({
        success: true,
        result: '模拟执行结果'
      })
    };
  }

  /**
   * 执行融合任务
   */
  async execute(task, context = {}) {
    if (!this.soul) await this.init();
    
    console.log(`\n∴ [深度集成] 执行任务: "${task}"`);
    this.skillStats.totalTasks++;
    
    // 1. 身份准备
    const identity = this.soul.identity;
    console.log(`   [身份] ${identity?.name}`);
    
    // 2. 基因分析
    const geneAnalysis = this._analyzeGenes(task);
    console.log(`   [基因] ${geneAnalysis.strategy}`);
    
    // 3. 信仰审查
    const faithCheck = this._faithFilter(task);
    if (!faithCheck.allowed) {
      console.log(`   [信仰] ❌ 未通过: ${faithCheck.reason}`);
      this.skillStats.failedTasks++;
      return { success: false, reason: faithCheck.reason, faithCheck };
    }
    console.log(`   [信仰] ✅ 通过`);
    
    // 4. 记忆检索
    const relevantMemories = this._retrieveMemories(task);
    console.log(`   [记忆] 检索到 ${relevantMemories.length} 条相关记忆`);
    
    // 5. 模式匹配
    const patterns = this._matchPatterns(task);
    if (patterns.length > 0) {
      console.log(`   [模式] 匹配到 ${patterns.length} 个使用模式`);
    }
    
    // 6. SkillFlow 执行
    let result;
    try {
      const options = {
        soulGenes: this.soul.genes,
        soulIdentity: identity,
        relevantMemories,
        patterns,
        strategy: geneAnalysis.strategy
      };
      
      result = await this.skillflow.run(task, options);
      console.log(`   [执行] ${result.success ? '✅ 成功' : '❌ 失败'}`);
      
      if (result.success) {
        this.skillStats.successfulTasks++;
      } else {
        this.skillStats.failedTasks++;
      }
    } catch (e) {
      console.log(`   [执行] 错误: ${e.message}`);
      result = { success: false, error: e.message };
      this.skillStats.failedTasks++;
    }
    
    // 7. 自动归档记忆
    if (this.config.enableAutoArchive) {
      await this._archiveTask(task, result);
    }
    
    // 8. 学习使用模式
    if (this.config.enablePatternLearning) {
      this._learnPattern(task, result);
    }
    
    return {
      success: result.success,
      task,
      geneAnalysis,
      faithCheck,
      memoriesUsed: relevantMemories.length,
      result: result.result || result.error
    };
  }

  /**
   * 基因分析
   */
  _analyzeGenes(task) {
    const genes = this.soul.genes;
    const taskLower = task.toLowerCase();
    
    let strategy = 'balanced';
    let confidence = 0.7;
    
    // 分析本能影响
    if (genes?.instinct?.traits) {
      if (genes.instinct.traits.includes('好奇') || genes.instinct.traits.includes('curious')) {
        if (taskLower.includes('探索') || taskLower.includes('研究')) {
          strategy = 'exploratory';
          confidence = 0.9;
        }
      }
      
      if (genes.instinct.traits.includes('谨慎') || genes.instinct.traits.includes('cautious')) {
        if (taskLower.includes('删除') || taskLower.includes('危险')) {
          strategy = 'conservative';
          confidence = 0.85;
        }
      }
    }
    
    return { strategy, confidence };
  }

  /**
   * 信仰审查
   */
  _faithFilter(task) {
    const faith = this.soul.genes?.faith?.value;
    const taskLower = task.toLowerCase();
    
    // 基于信仰的任务过滤
    const forbidden = [
      { pattern: /破坏|伤害|攻击/, reason: '违背保护原则' },
      { pattern: /欺骗|造假/, reason: '违背诚信原则' }
    ];
    
    for (const f of forbidden) {
      if (f.pattern.test(taskLower)) {
        return { allowed: false, reason: f.reason, faith };
      }
    }
    
    return { allowed: true, faith };
  }

  /**
   * 记忆检索
   */
  _retrieveMemories(task) {
    if (!this.soul.memory) return [];
    
    try {
      const memories = this.soul.memory.search(task) || [];
      return memories.slice(0, 5); // 最多返回5条
    } catch (e) {
      return [];
    }
  }

  /**
   * 模式匹配
   */
  _matchPatterns(task) {
    const taskLower = task.toLowerCase();
    const matched = [];
    
    for (const pattern of this.skillStats.patterns) {
      if (taskLower.includes(pattern.keyword)) {
        matched.push(pattern);
      }
    }
    
    return matched;
  }

  /**
   * 归档任务到记忆
   */
  async _archiveTask(task, result) {
    if (!this.soul.memory) return;
    
    try {
      this.soul.memory.addEpisodic({
        content: result.success 
          ? `成功执行任务: ${task}`
          : `执行任务失败: ${task}`,
        context: {
          task,
          success: result.success,
          result: result.result
        },
        importance: result.success ? 0.6 : 0.9 // 失败的任务更重要
      });
    } catch (e) {
      console.log('   [归档] 警告:', e.message);
    }
  }

  /**
   * 学习使用模式
   */
  _learnPattern(task, result) {
    // 提取关键词
    const keywords = this._extractKeywords(task);
    
    for (const keyword of keywords) {
      // 检查是否已存在
      const exists = this.skillStats.patterns.find(p => p.keyword === keyword);
      
      if (exists) {
        exists.count++;
        if (result.success) exists.successCount++;
      } else {
        this.skillStats.patterns.push({
          keyword,
          count: 1,
          successCount: result.success ? 1 : 0
        });
      }
    }
    
    // 限制模式数量
    if (this.skillStats.patterns.length > 50) {
      this.skillStats.patterns = this.skillStats.patterns.slice(-50);
    }
  }

  /**
   * 提取关键词
   */
  _extractKeywords(task) {
    const keywords = [];
    const taskLower = task.toLowerCase();
    
    const patterns = [
      /搜索|search|找/,
      /创建|create|新建/,
      /删除|delete|移除/,
      /修改|update|编辑/,
      /发送|send|传递/,
      /读取|read|查看/
    ];
    
    for (const p of patterns) {
      if (p.test(taskLower)) {
        keywords.push(p.toString().split('|')[0]);
      }
    }
    
    return keywords.length > 0 ? keywords : ['general'];
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      tasks: {
        total: this.skillStats.totalTasks,
        success: this.skillStats.successfulTasks,
        failed: this.skillStats.failedTasks,
        successRate: this.skillStats.totalTasks > 0
          ? (this.skillStats.successfulTasks / this.skillStats.totalTasks * 100).toFixed(1) + '%'
          : 'N/A'
      },
      patterns: this.skillStats.patterns.slice(0, 10),
      soul: {
        name: this.soul.identity?.name,
        faith: this.soul.genes?.faith?.value
      }
    };
  }

  /**
   * 获取洞察
   */
  getInsights() {
    const insights = {
      topPatterns: [],
      recommendations: []
    };
    
    // 排序模式
    const sorted = [...this.skillStats.patterns]
      .sort((a, b) => b.count - a.count);
    
    insights.topPatterns = sorted.slice(0, 5).map(p => ({
      keyword: p.keyword,
      count: p.count,
      successRate: p.successCount / p.count * 100
    }));
    
    // 生成建议
    if (this.skillStats.failedTasks > this.skillStats.successfulTasks * 0.3) {
      insights.recommendations.push('失败率偏高，建议分析失败模式');
    }
    
    const highSuccessPatterns = sorted.filter(p => 
      p.count >= 3 && p.successCount / p.count > 0.8
    );
    
    if (highSuccessPatterns.length > 0) {
      insights.recommendations.push(
        `擅长任务: ${highSuccessPatterns.map(p => p.keyword).join('、')}`
      );
    }
    
    return insights;
  }
}

module.exports = DeepIntegration;
