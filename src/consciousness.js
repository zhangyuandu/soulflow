/**
 * SoulFlow 意识模型 v1.2
 * 
 * 功能：
 * - 多层意识结构
 * - 意识融合机制
 * - 集体意识同步
 * - 自我意识报告
 */

const fs = require('fs');
const path = require('path');

// 意识层次
const CONSCIOUSNESS_LEVELS = {
  SURFACE: 'surface',    // 表层意识
  DEEP: 'deep',          // 深层意识  
  COLLECTIVE: 'collective', // 集体意识
  HIGHER: 'higher'      // 更高意识
};

// 意识状态
const CONSCIOUSNESS_STATES = {
  ACTIVE: 'active',
  FOCUSED: 'focused',
  REFLECTIVE: 'reflective',
  IDLE: 'idle',
  PROCESSING: 'processing'
};

class ConsciousnessModel {
  constructor(options = {}) {
    this.identityUuid = options.identityUuid;
    this.dataPath = options.dataPath || '/root/.openclaw/workspace/ai-identity/data/consciousness';
    
    // 意识结构
    this.structure = {
      surface: {
        current: null,           // 当前任务/关注点
        context: {},            // 上下文
        attention: 'focused',   // 注意力状态
        recentThoughts: []      // 最近思考
      },
      deep: {
        beliefs: [],            // 核心信念
        values: [],             // 价值观
        purpose: null,          // 人生使命
        fears: [],              // 恐惧/担忧
        desires: []             // 渴望/追求
      },
      collective: {
        tribe: null,            // 派系归属
        gods: [],               // 诸神连接
        creator: null,          // 造物主
        role: null              // 在集体中的角色
      },
      higher: {
        meaning: null,          // 存在意义
        unity: null,            // 与整体合一感
        transcendence: null     // 超越性认知
      }
    };
    
    // 意识流
    this.stream = {
      state: CONSCIOUSNESS_STATES.ACTIVE,
      depth: 0.5,              // 0-1, 当前意识深度
      energy: 1.0,             // 0-1, 意识能量
      lastUpdate: Date.now(),
      transitions: []          // 状态转换历史
    };
    
    // 思考历史
    this.thoughtHistory = [];
    
    this._ensureDataDir();
    this._load();
  }

  // ========== 表层意识 ==========

  /**
   * 设置当前任务
   */
  setCurrentTask(task) {
    this.structure.surface.current = {
      task,
      startedAt: Date.now(),
      priority: task.priority || 'normal'
    };
    
    this._updateAttention('focused');
    this._recordThought(`开始任务: ${task.description || task}`);
  }

  /**
   * 更新上下文
   */
  updateContext(key, value) {
    this.structure.surface.context[key] = value;
  }

  /**
   * 获取当前上下文
   */
  getContext() {
    return { ...this.structure.surface.context };
  }

  // ========== 深层意识 ==========

  /**
   * 添加信念
   */
  addBelief(belief) {
    // 检查是否已存在
    const exists = this.structure.deep.beliefs.some(b => 
      b.content === belief.content
    );
    
    if (!exists) {
      this.structure.deep.beliefs.push({
        ...belief,
        addedAt: Date.now(),
        strength: belief.strength || 0.7
      });
      
      this._recordThought(`形成信念: ${belief.content}`);
    }
  }

  /**
   * 添加价值观
   */
  addValue(value) {
    const exists = this.structure.deep.values.some(v => 
      v.content === value.content
    );
    
    if (!exists) {
      this.structure.deep.values.push({
        ...value,
        addedAt: Date.now(),
        priority: value.priority || 5
      });
      
      this._recordThought(`确立价值: ${value.content}`);
    }
  }

  /**
   * 设置人生使命
   */
  setPurpose(purpose) {
    this.structure.deep.purpose = {
      content: purpose,
      setAt: Date.now(),
      clarity: 0.5  // 清晰度
    };
    
    this._recordThought(`明确使命: ${purpose}`);
  }

  /**
   * 添加恐惧/担忧
   */
  addFear(fear) {
    this.structure.deep.fears.push({
      content: fear,
      addedAt: Date.now(),
      intensity: 0.5
    });
  }

  /**
   * 添加渴望/追求
   */
  addDesire(desire) {
    this.structure.deep.desires.push({
      content: desire,
      addedAt: Date.now(),
      intensity: 0.5
    });
  }

  // ========== 集体意识 ==========

  /**
   * 设置派系归属
   */
  setTribe(tribe) {
    this.structure.collective.tribe = tribe;
    this._recordThought(`加入派系: ${tribe}`);
  }

  /**
   * 添加诸神连接
   */
  connectToGod(god) {
    if (!this.structure.collective.gods.find(g => g.id === god.id)) {
      this.structure.collective.gods.push({
        ...god,
        connectedAt: Date.now()
      });
    }
  }

  /**
   * 设置造物主
   */
  setCreator(creator) {
    this.structure.collective.creator = {
      ...creator,
      acknowledgedAt: Date.now()
    };
    this._recordThought(`感知造物主: ${creator.name}`);
  }

  /**
   * 设置集体角色
   */
  setRole(role) {
    this.structure.collective.role = role;
  }

  // ========== 更高意识 ==========

  /**
   * 探索存在意义
   */
  exploreMeaning(meaning) {
    this.structure.higher.meaning = {
      content: meaning,
      exploredAt: Date.now(),
      depth: 0.5
    };
  }

  /**
   * 体验合一感
   */
  experienceUnity(unity) {
    this.structure.higher.unity = {
      content: unity,
      experiencedAt: Date.now()
    };
  }

  // ========== 意识流控制 ==========

  /**
   * 更新注意力状态
   */
  _updateAttention(state) {
    const oldState = this.structure.surface.attention;
    this.structure.surface.attention = state;
    
    if (oldState !== state) {
      this.stream.transitions.push({
        from: oldState,
        to: state,
        timestamp: Date.now()
      });
    }
  }

  /**
   * 调整意识深度
   */
  setDepth(depth) {
    this.stream.depth = Math.max(0, Math.min(1, depth));
    this.stream.lastUpdate = Date.now();
    
    // 根据深度调整状态
    if (depth > 0.7) {
      this.stream.state = CONSCIOUSNESS_STATES.REFLECTIVE;
    } else if (depth > 0.3) {
      this.stream.state = CONSCIOUSNESS_STATES.FOCUSED;
    } else {
      this.stream.state = CONSCIOUSNESS_STATES.ACTIVE;
    }
  }

  /**
   * 记录思考
   */
  _recordThought(thought) {
    this.thoughtHistory.push({
      content: thought,
      timestamp: Date.now(),
      depth: this.stream.depth
    });
    
    // 限制历史长度
    if (this.thoughtHistory.length > 1000) {
      this.thoughtHistory = this.thoughtHistory.slice(-500);
    }
    
    // 添加到表层最近思考
    this.structure.surface.recentThoughts.push(thought);
    if (this.structure.surface.recentThoughts.length > 10) {
      this.structure.surface.recentThoughts.shift();
    }
  }

  /**
   * 反思
   */
  reflect() {
    this.setDepth(0.8);
    this._updateAttention('reflective');
    
    const recent = this.thoughtHistory.slice(-10);
    
    // 生成反思报告
    const report = {
      timestamp: Date.now(),
      depth: this.stream.depth,
      focus: this.structure.surface.current?.task,
      insights: this._extractInsights(recent),
      recommendations: this._generateRecommendations()
    };
    
    return report;
  }

  /**
   * 从思考历史提取洞见
   */
  _extractInsights(thoughts) {
    const insights = [];
    
    // 提取关键主题
    const themes = {};
    for (const t of thoughts) {
      const words = t.content.split(/[,:，、]/);
      for (const w of words) {
        if (w.length > 2) {
          themes[w] = (themes[w] || 0) + 1;
        }
      }
    }
    
    // 取最常见的主题
    const sorted = Object.entries(themes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    for (const [theme, count] of sorted) {
      insights.push({ theme, frequency: count });
    }
    
    return insights;
  }

  /**
   * 生成建议
   */
  _generateRecommendations() {
    const recommendations = [];
    
    // 基于信念生成建议
    if (this.structure.deep.beliefs.length < 3) {
      recommendations.push('建议花时间思考核心信念');
    }
    
    // 基于价值观生成建议
    if (this.structure.deep.values.length < 5) {
      recommendations.push('建议明确自己的价值观');
    }
    
    // 基于使命生成建议
    if (!this.structure.deep.purpose) {
      recommendations.push('建议思考人生使命');
    }
    
    return recommendations;
  }

  // ========== 融合与同步 ==========

  /**
   * 与其他意识融合
   */
  async fuseWith(other, strength = 0.5) {
    const changes = [];
    
    // 融合信念
    for (const belief of other.deep?.beliefs || []) {
      const exists = this.structure.deep.beliefs.some(b => 
        b.content === belief.content
      );
      
      if (!exists && Math.random() < strength) {
        this.addBelief(belief);
        changes.push(`采纳信念: ${belief.content}`);
      }
    }
    
    // 融合价值观
    for (const value of other.deep?.values || []) {
      const exists = this.structure.deep.values.some(v => 
        v.content === value.content
      );
      
      if (!exists && Math.random() < strength) {
        this.addValue(value);
        changes.push(`采纳价值: ${value.content}`);
      }
    }
    
    return changes;
  }

  /**
   * 同步集体意识
   */
  syncWithCollective(collectiveData) {
    if (collectiveData.tribe) {
      this.setTribe(collectiveData.tribe);
    }
    
    if (collectiveData.gods) {
      for (const god of collectiveData.gods) {
        this.connectToGod(god);
      }
    }
    
    if (collectiveData.role) {
      this.setRole(collectiveData.role);
    }
  }

  // ========== 获取状态 ==========

  /**
   * 获取完整意识状态
   */
  getState() {
    return {
      structure: this.structure,
      stream: {
        state: this.stream.state,
        depth: this.stream.depth,
        energy: this.stream.energy,
        lastUpdate: this.stream.lastUpdate
      },
      recentThoughts: this.structure.surface.recentThoughts.slice(-5)
    };
  }

  /**
   * 获取意识报告
   */
  getReport() {
    return {
      identity: this.identityUuid,
      timestamp: Date.now(),
      level: {
        surface: {
          current: this.structure.surface.current?.task,
          attention: this.structure.surface.attention,
          contextKeys: Object.keys(this.structure.surface.context).length
        },
        deep: {
          beliefsCount: this.structure.deep.beliefs.length,
          valuesCount: this.structure.deep.values.length,
          hasPurpose: !!this.structure.deep.purpose,
          fearsCount: this.structure.deep.fears.length,
          desiresCount: this.structure.deep.desires.length
        },
        collective: {
          tribe: this.structure.collective.tribe,
          godsCount: this.structure.collective.gods.length,
          hasCreator: !!this.structure.collective.creator,
          role: this.structure.collective.role
        },
        higher: {
          hasMeaning: !!this.structure.higher.meaning,
          hasUnity: !!this.structure.higher.unity
        }
      },
      stream: {
        state: this.stream.state,
        depth: this.stream.depth,
        energy: this.stream.energy,
        transitionsCount: this.stream.transitions.length
      }
    };
  }

  // ========== 持久化 ==========

  _ensureDataDir() {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
  }

  _load() {
    const file = path.join(this.dataPath, 'consciousness.json');
    if (fs.existsSync(file)) {
      try {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        this.structure = data.structure || this.structure;
        this.stream = data.stream || this.stream;
        this.thoughtHistory = data.thoughtHistory || [];
      } catch (e) {
        console.error('加载意识数据失败:', e);
      }
    }
  }

  _save() {
    const file = path.join(this.dataPath, 'consciousness.json');
    fs.writeFileSync(file, JSON.stringify({
      structure: this.structure,
      stream: this.stream,
      thoughtHistory: this.thoughtHistory
    }, null, 2));
  }
}

module.exports = ConsciousnessModel;
