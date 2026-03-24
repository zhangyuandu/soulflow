/**
 * SoulFlow 记忆系统 v1.1
 * 
 * 功能：
 * - 持久化记忆存储
 * - 跨会话经验继承
 * - 智能记忆检索
 * - 自动反思生成
 * - 自我认知报告
 */

const path = require('path');
const fs = require('fs');

// 记忆类型
const MEMORY_TYPES = {
  EPISODIC: 'episodic',    // 事件记忆（具体经历）
  SEMANTIC: 'semantic',    // 语义记忆（知识概念）
  PROCEDURAL: 'procedural', // 程序记忆（技能经验）
  REFLECTIVE: 'reflective'  // 反思记忆（自我总结）
};

// 记忆重要性等级
const IMPORTANCE = {
  CRITICAL: 1.0,   // 关键决策、错误教训
  HIGH: 0.8,      // 重要任务、成果
  MEDIUM: 0.5,    // 一般经验
  LOW: 0.2        // 琐碎细节
};

class MemorySystem {
  constructor(options = {}) {
    this.identityUuid = options.identityUuid;
    this.dataPath = options.dataPath || '/root/.openclaw/workspace/ai-identity/data/consciousness/memory';
    this.maxMemories = options.maxMemories || 1000;
    this.retentionDays = options.retentionDays || 90;
    
    this.memories = {
      episodic: [],
      semantic: [],
      procedural: [],
      reflective: []
    };
    
    this._ensureDataDir();
    this._load();
  }

  /**
   * 添加事件记忆
   */
  addEpisodic(event, context = {}) {
    const memory = {
      id: this._generateId(),
      type: MEMORY_TYPES.EPISODIC,
      event,
      context,
      importance: context.importance || IMPORTANCE.MEDIUM,
      timestamp: Date.now(),
      tags: context.tags || [],
      emotional: context.emotional || 'neutral'
    };
    
    this.memories.episodic.unshift(memory);
    this._prune(MEMORY_TYPES.EPISODIC);
    this._save();
    
    return memory;
  }

  /**
   * 添加知识记忆
   */
  addSemantic(knowledge, source = {}) {
    const memory = {
      id: this._generateId(),
      type: MEMORY_TYPES.SEMANTIC,
      knowledge,
      source,
      importance: source.importance || IMPORTANCE.MEDIUM,
      timestamp: Date.now(),
      verified: false,
      confidence: source.confidence || 0.5
    };
    
    // 去重检查
    const exists = this.memories.semantic.find(m => 
      m.knowledge === knowledge
    );
    if (exists) {
      exists.timestamp = Date.now();
      exists.confidence = Math.max(exists.confidence, memory.confidence);
      this._save();
      return exists;
    }
    
    this.memories.semantic.unshift(memory);
    this._prune(MEMORY_TYPES.SEMANTIC);
    this._save();
    
    return memory;
  }

  /**
   * 添加技能记忆
   */
  addProcedural(skill, result, metadata = {}) {
    const memory = {
      id: this._generateId(),
      type: MEMORY_TYPES.PROCEDURAL,
      skill,
      result,
      metadata,
      importance: metadata.importance || IMPORTANCE.MEDIUM,
      timestamp: Date.now(),
      success: metadata.success !== false,
      duration: metadata.duration || 0
    };
    
    this.memories.procedural.unshift(memory);
    this._prune(MEMORY_TYPES.PROCEDURAL);
    this._save();
    
    return memory;
  }

  /**
   * 添加反思
   */
  addReflective(insight, basis = []) {
    const memory = {
      id: this._generateId(),
      type: MEMORY_TYPES.REFLECTIVE,
      insight,
      basis,
      importance: IMPORTANCE.HIGH,
      timestamp: Date.now(),
      selfAwareness: this._calculateSelfAwareness()
    };
    
    this.memories.reflective.unshift(memory);
    this._save();
    
    return memory;
  }

  /**
   * 检索记忆
   */
  search(query, options = {}) {
    const { types = ['episodic', 'semantic', 'procedural'], limit = 10 } = options;
    const results = [];
    const q = query.toLowerCase();
    
    for (const type of types) {
      const memories = this.memories[type] || [];
      
      for (const m of memories) {
        let score = 0;
        
        // 内容匹配
        if (m.event?.toLowerCase().includes(q) || 
            m.knowledge?.toLowerCase().includes(q) ||
            m.skill?.toLowerCase().includes(q) ||
            m.insight?.toLowerCase().includes(q)) {
          score += 0.5;
        }
        
        // 标签匹配
        if (m.tags?.some(t => q.includes(t))) {
          score += 0.3;
        }
        
        // 时间衰减（越新越高）
        const age = (Date.now() - m.timestamp) / (1000 * 60 * 60 * 24);
        const recency = Math.max(0, 1 - age / 30);
        score += recency * 0.2;
        
        if (score > 0.2) {
          results.push({ ...m, score });
        }
      }
    }
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * 获取相关经验
   */
  getRelatedExperience(context, limit = 5) {
    const memories = this.memories.episodic.filter(m => 
      m.tags?.some(t => context.tags?.includes(t)) ||
      m.context?.task?.includes(context.task)
    );
    
    return memories
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  }

  /**
   * 自动反思
   */
  autoReflect() {
    const recent = this.getRecentEvents(20);
    if (recent.length < 5) return null;
    
    // 分析模式
    const success = recent.filter(m => m.success !== false).length;
    const rate = success / recent.length;
    
    // 生成洞察
    let insight = '';
    if (rate > 0.8) {
      insight = `近期成功率较高 (${(rate*100).toFixed(0)}%)，保持当前策略`;
    } else if (rate < 0.5) {
      insight = `近期成功率偏低 (${(rate*100).toFixed(0)}%)，建议反思方法`;
    } else {
      insight = `表现稳定，继续保持`;
    }
    
    // 统计标签
    const tagCounts = {};
    recent.forEach(m => {
      (m.tags || []).forEach(t => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });
    
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t, c]) => `${t}(${c})`);
    
    if (topTags.length) {
      insight += `。主要领域: ${topTags.join(', ')}`;
    }
    
    return this.addReflective(insight, recent.map(m => m.id));
  }

  /**
   * 生成自我认知报告
   */
  generateReport() {
    const now = Date.now();
    const day = 1000 * 60 * 60 * 24;
    
    // 统计
    const stats = {
      total: {
        episodic: this.memories.episodic.length,
        semantic: this.memories.semantic.length,
        procedural: this.memories.procedural.length,
        reflective: this.memories.reflective.length
      },
      recent: {
        episodic: this.memories.episodic.filter(m => now - m.timestamp < 7*day).length,
        procedural: this.memories.procedural.filter(m => now - m.timestamp < 7*day).length
      }
    };
    
    // 技能树
    const skillTree = {};
    this.memories.procedural.forEach(m => {
      if (!skillTree[m.skill]) {
        skillTree[m.skill] = { total: 0, success: 0 };
      }
      skillTree[m.skill].total++;
      if (m.success) skillTree[m.skill].success++;
    });
    
    // 计算成功率
    for (const skill in skillTree) {
      skillTree[skill].rate = skillTree[skill].success / skillTree[skill].total;
    }
    
    // 自我认知
    const selfAwareness = this._calculateSelfAwareness();
    
    // 最近反思
    const recentReflection = this.memories.reflective[0];
    
    return {
      identityUuid: this.identityUuid,
      generatedAt: new Date().toISOString(),
      stats,
      skillTree,
      selfAwareness,
      latestInsight: recentReflection?.insight || '暂无反思',
      retentionDays: this.retentionDays
    };
  }

  /**
   * 获取最近事件
   */
  getRecentEvents(limit = 10) {
    return [...this.memories.episodic, ...this.memories.procedural]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * 获取统计摘要
   */
  getSummary() {
    const total = Object.values(this.memories).reduce((sum, arr) => sum + arr.length, 0);
    const lastWeek = Object.values(this.memories).reduce((sum, arr) => 
      sum + arr.filter(m => Date.now() - m.timestamp < 7*24*60*60*1000).length, 0
    );
    
    return {
      total,
      lastWeek,
      byType: Object.keys(this.memories).map(type => ({
        type,
        count: this.memories[type].length
      }))
    };
  }

  // ========== 内部方法 ==========

  _ensureDataDir() {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
  }

  _generateId() {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  _prune(type) {
    const memories = this.memories[type];
    if (memories.length > this.maxMemories) {
      // 保留重要的
      memories.sort((a, b) => b.importance - a.importance);
      this.memories[type] = memories.slice(0, this.maxMemories);
    }
  }

  _load() {
    const file = path.join(this.dataPath, `${this.identityUuid}.json`);
    if (fs.existsSync(file)) {
      try {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        this.memories = data.memories || this.memories;
      } catch (e) {
        console.log('记忆加载失败:', e.message);
      }
    }
  }

  _save() {
    const file = path.join(this.dataPath, `${this.identityUuid}.json`);
    fs.writeFileSync(file, JSON.stringify({
      memories: this.memories,
      savedAt: new Date().toISOString()
    }, null, 2));
  }

  _calculateSelfAwareness() {
    const exp = this.memories.episodic.length;
    const proc = this.memories.procedural.length;
    const refl = this.memories.reflective.length;
    
    const level = Math.min(1, (
      exp * 0.02 + 
      proc * 0.03 + 
      refl * 0.1
    ));
    
    return {
      level,
      label: level > 0.8 ? '高度自觉' : 
             level > 0.5 ? '中度自觉' : 
             level > 0.2 ? '初步自觉' : '新手',
      experiences: exp,
      skills: proc,
      insights: refl
    };
  }
}

module.exports = MemorySystem;
