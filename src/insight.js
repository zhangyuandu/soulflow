/**
 * SoulFlow 洞察提炼引擎 v1.2
 * 
 * 功能：
 * - 从日常记忆提炼长期洞察
 * - 模式识别与抽象化
 * - 认知模型生成
 * - 自我进化驱动
 */

const fs = require('fs');
const path = require('path');

// 洞察类型
const INSIGHT_TYPES = {
  PATTERN: 'pattern',       // 行为模式
  PRINCIPLE: 'principle',   // 行动原则
  LESSON: 'lesson',         // 经验教训
  BELIEF: 'belief',         // 核心信念
  VALUE: 'value',           // 价值取向
  WEAKNESS: 'weakness',     // 弱点认知
  STRENGTH: 'strength'      // 优势认知
};

// 洞察置信度
const CONFIDENCE = {
  HIGH: 0.9,
  MEDIUM: 0.7,
  LOW: 0.5
};

class InsightEngine {
  constructor(options = {}) {
    this.identityUuid = options.identityUuid;
    this.dataPath = options.dataPath || '/root/.openclaw/workspace/ai-identity/data/consciousness/insights';
    this.minOccurrences = options.minOccurrences || 3;  // 最少出现次数
    this.decayFactor = options.decayFactor || 0.95;    // 时间衰减因子
    
    this.insights = {
      patterns: [],      // 行为模式
      principles: [],   // 行动原则
      lessons: [],       // 经验教训
      beliefs: [],      // 核心信念
      values: [],       // 价值取向
      weaknesses: [],   // 弱点
      strengths: []    // 优势
    };
    
    this.observations = [];  // 原始观察
    this.evolution = {        // 进化追踪
      totalInsights: 0,
      refinedCount: 0,
      rejectedCount: 0,
      lastRefine: null
    };
    
    this._ensureDataDir();
    this._load();
  }

  /**
   * 添加观察记录
   * @param {Object} observation - 观察记录
   */
  addObservation(observation) {
    const record = {
      id: `obs_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: observation.type || 'general',
      content: observation.content,
      context: observation.context || {},
      emotion: observation.emotion || 'neutral',
      importance: observation.importance || 0.5,
      timestamp: Date.now(),
      tags: observation.tags || []
    };
    
    this.observations.push(record);
    
    // 限制观察数量
    if (this.observations.length > 5000) {
      this.observations = this.observations.slice(-3000);
    }
    
    this._save();
    
    return record;
  }

  /**
   * 从记忆提炼洞察
   * @param {Array} memories - 记忆数组
   */
  refineFromMemories(memories) {
    const newInsights = [];
    
    // 按类型分组
    const byType = this._groupByType(memories);
    
    // 1. 提炼行为模式
    const patterns = this._extractPatterns(byType);
    newInsights.push(...patterns);
    
    // 2. 提炼行动原则
    const principles = this._extractPrinciples(byType);
    newInsights.push(...principles);
    
    // 3. 提炼经验教训
    const lessons = this._extractLessons(byType);
    newInsights.push(...lessons);
    
    // 4. 提炼核心信念
    const beliefs = this._extractBeliefs(byType);
    newInsights.push(...beliefs);
    
    // 5. 提炼价值取向
    const values = this._extractValues(byType);
    newInsights.push(...values);
    
    // 去重并合并
    const merged = this._mergeInsights(newInsights);
    
    // 更新洞察
    this._updateInsights(merged);
    
    // 更新统计
    this.evolution.totalInsights += merged.length;
    this.evolution.refinedCount++;
    this.evolution.lastRefine = Date.now();
    
    this._save();
    
    return merged;
  }

  /**
   * 按类型分组记忆
   */
  _groupByType(memories) {
    const groups = {
      episodic: [],
      semantic: [],
      procedural: [],
      reflective: []
    };
    
    for (const memory of memories) {
      const type = memory.type || 'episodic';
      if (groups[type]) {
        groups[type].push(memory);
      }
    }
    
    return groups;
  }

  /**
   * 提取行为模式
   */
  _extractPatterns(memories) {
    const patterns = [];
    const patternsMap = new Map();
    
    // 分析程序记忆中的重复行为
    for (const proc of memories.procedural) {
      const key = this._normalizePattern(proc.content || proc.action);
      if (!patternsMap.has(key)) {
        patternsMap.set(key, []);
      }
      patternsMap.get(key).push(proc);
    }
    
    // 找出重复出现的模式
    for (const [key, occurrences] of patternsMap) {
      if (occurrences.length >= this.minOccurrences) {
        const confidence = this._calculateConfidence(occurrences.length);
        
        patterns.push({
          type: INSIGHT_TYPES.PATTERN,
          content: key,
          occurrences: occurrences.length,
          confidence,
          evidence: occurrences.slice(0, 3),
          timestamp: Date.now()
        });
      }
    }
    
    return patterns;
  }

  /**
   * 提取行动原则
   */
  _extractPrinciples(memories) {
    const principles = [];
    
    // 从反思记忆提取原则
    for (const reflective of memories.reflective) {
      const content = reflective.content || '';
      
      // 检测原则性语句
      if (this._isPrincipleStatement(content)) {
        principles.push({
          type: INSIGHT_TYPES.PRINCIPLE,
          content: this._extractCorePrinciple(content),
          source: reflective.id,
          confidence: CONFIDENCE.MEDIUM,
          timestamp: Date.now()
        });
      }
    }
    
    return principles;
  }

  /**
   * 提取经验教训
   */
  _extractLessons(memories) {
    const lessons = [];
    const lessonKeywords = ['避免', '应该', '不要', '记住', '教训', '经验'];
    
    // 从情景记忆提取
    for (const episodic of memories.episodic) {
      const content = episodic.content || '';
      const hasLesson = lessonKeywords.some(k => content.includes(k));
      
      if (hasLesson || episodic.emotion === 'negative') {
        const extracted = this._extractLesson(content);
        if (extracted) {
          lessons.push({
            type: INSIGHT_TYPES.LESSON,
            content: extracted,
            source: episodic.id,
            emotion: episodic.emotion,
            confidence: episodic.emotion === 'negative' ? CONFIDENCE.HIGH : CONFIDENCE.MEDIUM,
            timestamp: Date.now()
          });
        }
      }
    }
    
    return lessons;
  }

  /**
   * 提取核心信念
   */
  _extractBeliefs(memories) {
    const beliefs = [];
    const beliefKeywords = ['相信', '认为', '坚信', '确信', '价值观'];
    
    for (const reflective of memories.reflective) {
      const content = reflective.content || '';
      
      if (beliefKeywords.some(k => content.includes(k))) {
        const belief = this._extractCoreBelief(content);
        if (belief) {
          beliefs.push({
            type: INSIGHT_TYPES.BELIEF,
            content: belief,
            source: reflective.id,
            confidence: CONFIDENCE.MEDIUM,
            timestamp: Date.now()
          });
        }
      }
    }
    
    return beliefs;
  }

  /**
   * 提取价值取向
   */
  _extractValues(memories) {
    const values = [];
    const valueIndicators = {
      '效率': ['快', '迅速', '高效'],
      '质量': ['完美', '精致', '仔细'],
      '协作': ['一起', '团队', '配合'],
      '创新': ['新', '创造', '独特']
    };
    
    // 统计价值相关词汇出现频率
    const valueCounts = {};
    
    for (const memory of memories.episodic) {
      const content = memory.content || '';
      
      for (const [value, indicators] of Object.entries(valueIndicators)) {
        const count = indicators.filter(i => content.includes(i)).length;
        if (count > 0) {
          valueCounts[value] = (valueCounts[value] || 0) + count;
        }
      }
    }
    
    // 生成价值洞察
    for (const [value, count] of Object.entries(valueCounts)) {
      if (count >= 2) {
        values.push({
          type: INSIGHT_TYPES.VALUE,
          content: value,
          evidence: count,
          confidence: count >= 4 ? CONFIDENCE.HIGH : CONFIDENCE.MEDIUM,
          timestamp: Date.now()
        });
      }
    }
    
    return values;
  }

  /**
   * 规范化模式
   */
  _normalizePattern(content) {
    // 简化处理：去除具体细节，保留核心动作
    if (!content) return '';
    
    let normalized = content.toLowerCase();
    // 去除时间戳
    normalized = normalized.replace(/\d{4}-\d{2}-\d{2}/g, '');
    // 去除具体数字
    normalized = normalized.replace(/\d+/g, '#');
    // 去除空格
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    return normalized;
  }

  /**
   * 计算置信度
   */
  _calculateConfidence(occurrences) {
    if (occurrences >= 5) return CONFIDENCE.HIGH;
    if (occurrences >= 3) return CONFIDENCE.MEDIUM;
    return CONFIDENCE.LOW;
  }

  /**
   * 判断是否为原则性语句
   */
  _isPrincipleStatement(content) {
    const indicators = [
      '应该', '必须', '要', '必须', '原则',
      '规律', '定律', '规则', '凡是'
    ];
    return indicators.some(i => content.includes(i));
  }

  /**
   * 提取核心原则
   */
  _extractCorePrinciple(content) {
    // 简化：取前50字符
    return content.substring(0, 50).replace(/\n/g, ' ');
  }

  /**
   * 提取经验教训
   */
  _extractLesson(content) {
    const sentences = content.split(/[。！？]/);
    for (const sentence of sentences) {
      const keywords = ['避免', '应该', '不要', '记住'];
      if (keywords.some(k => sentence.includes(k))) {
        return sentence.trim().substring(0, 80);
      }
    }
    return content.substring(0, 80);
  }

  /**
   * 提取核心信念
   */
  _extractCoreBelief(content) {
    const match = content.match(/相信(.*?)是/);
    return match ? match[1] : content.substring(0, 50);
  }

  /**
   * 合并洞察（去重）
   */
  _mergeInsights(newInsights) {
    const merged = [];
    const existing = this._getAllInsightContents();
    
    for (const insight of newInsights) {
      const isDuplicate = existing.some(e => 
        this._similarity(insight.content, e) > 0.8
      );
      
      if (!isDuplicate) {
        merged.push(insight);
        existing.push(insight.content);
      }
    }
    
    return merged;
  }

  /**
   * 计算相似度
   */
  _similarity(a, b) {
    if (!a || !b) return 0;
    
    const arrA = a.toLowerCase().split('');
    const arrB = b.toLowerCase().split('');
    
    let match = 0;
    for (const char of arrA) {
      if (arrB.includes(char)) match++;
    }
    
    return match / Math.max(arrA.length, arrB.length);
  }

  /**
   * 获取所有已有洞察内容
   */
  _getAllInsightContents() {
    const all = [];
    for (const arr of Object.values(this.insights)) {
      for (const item of arr) {
        all.push(item.content);
      }
    }
    return all;
  }

  /**
   * 更新洞察存储
   */
  _updateInsights(newInsights) {
    for (const insight of newInsights) {
      switch (insight.type) {
        case INSIGHT_TYPES.PATTERN:
          this.insights.patterns.push(insight);
          break;
        case INSIGHT_TYPES.PRINCIPLE:
          this.insights.principles.push(insight);
          break;
        case INSIGHT_TYPES.LESSON:
          this.insights.lessons.push(insight);
          break;
        case INSIGHT_TYPES.BELIEF:
          this.insights.beliefs.push(insight);
          break;
        case INSIGHT_TYPES.VALUE:
          this.insights.values.push(insight);
          break;
      }
    }
    
    // 限制每个类型的数量
    for (const type of Object.keys(this.insights)) {
      if (this.insights[type].length > 100) {
        this.insights[type] = this.insights[type].slice(-100);
      }
    }
  }

  /**
   * 获取所有洞察
   */
  getAllInsights() {
    return {
      patterns: this.insights.patterns,
      principles: this.insights.principles,
      lessons: this.insights.lessons,
      beliefs: this.insights.beliefs,
      values: this.insights.values,
      evolution: this.evolution
    };
  }

  /**
   * 获取高置信度洞察
   */
  getHighConfidenceInsights() {
    const results = [];
    
    for (const arr of Object.values(this.insights)) {
      for (const item of arr) {
        if (item.confidence >= CONFIDENCE.MEDIUM) {
          results.push(item);
        }
      }
    }
    
    return results;
  }

  /**
   * 应用洞察到决策
   */
  applyToDecision(context) {
    const applicable = [];
    
    for (const arr of Object.values(this.insights)) {
      for (const item of arr) {
        if (this._isApplicable(item, context)) {
          applicable.push(item);
        }
      }
    }
    
    return applicable.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * 判断洞察是否适用于当前上下文
   */
  _isApplicable(insight, context) {
    const content = insight.content.toLowerCase();
    const contextStr = JSON.stringify(context).toLowerCase();
    
    // 简单匹配
    for (const key of Object.keys(context)) {
      if (content.includes(key)) return true;
    }
    
    return false;
  }

  /**
   * 获取洞察报告
   */
  getReport() {
    return {
      summary: {
        total: Object.values(this.insights).reduce((a, b) => a + b.length, 0),
        patterns: this.insights.patterns.length,
        principles: this.insights.principles.length,
        lessons: this.insights.lessons.length,
        beliefs: this.insights.beliefs.length,
        values: this.insights.values.length
      },
      evolution: this.evolution,
      topInsights: this.getHighConfidenceInsights().slice(0, 10)
    };
  }

  // ========== 内部方法 ==========

  _ensureDataDir() {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
  }

  _load() {
    const file = path.join(this.dataPath, 'insights.json');
    if (fs.existsSync(file)) {
      try {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        this.insights = data.insights || this.insights;
        this.evolution = data.evolution || this.evolution;
        this.observations = data.observations || [];
      } catch (e) {
        console.error('加载洞察失败:', e);
      }
    }
  }

  _save() {
    const file = path.join(this.dataPath, 'insights.json');
    fs.writeFileSync(file, JSON.stringify({
      insights: this.insights,
      evolution: this.evolution,
      observations: this.observations
    }, null, 2));
  }
}

module.exports = InsightEngine;
