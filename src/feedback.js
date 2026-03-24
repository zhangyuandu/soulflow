/**
 * SoulFlow 反馈系统
 * 
 * 功能：
 * - 轻量反馈（任务评分）
 * - 反馈统计
 * - 问题上报
 * - 激励体系
 */

const path = require('path');
const fs = require('fs');

const RATING_PROMPTS = [
  '这个回答让您满意吗？',
  '需要改进吗？',
  '有帮助吗？'
];

class FeedbackSystem {
  constructor(options = {}) {
    this.identityUuid = options.identityUuid;
    this.dataPath = options.dataPath || '/root/.openclaw/workspace/ai-identity/data/consciousness/feedback';
    this.feedbackFile = path.join(this.dataPath, `${this.identityUuid}.json`);
    
    this.stats = {
      total: 0,
      positive: 0,
      negative: 0,
      neutral: 0,
      ratings: []
    };
    
    this._load();
  }

  /**
   * 记录轻量反馈
   */
  recordRating(rating, context = {}) {
    // rating: 1-5 星，或 'positive'/'negative'/'neutral'
    let score = 0;
    
    if (typeof rating === 'number') {
      score = rating;
      if (rating >= 4) rating = 'positive';
      else if (rating <= 2) rating = 'negative';
      else rating = 'neutral';
    } else {
      score = rating === 'positive' ? 5 : 
              rating === 'negative' ? 1 : 3;
    }
    
    const feedback = {
      id: `fb_${Date.now()}`,
      type: 'rating',
      rating,
      score,
      context,
      timestamp: Date.now()
    };
    
    this.stats.total++;
    this.stats[rating]++;
    this.stats.ratings.push(feedback);
    
    this._save();
    return feedback;
  }

  /**
   * 获取评分提示
   */
  getRatingPrompt() {
    return RATING_PROMPTS[Math.floor(Math.random() * RATING_PROMPTS.length)];
  }

  /**
   * 批量反馈（任务完成后自动）
   */
  autoFeedback(task, success = true) {
    const feedback = {
      id: `fb_${Date.now()}`,
      type: 'auto',
      task,
      success,
      rating: success ? 'positive' : 'negative',
      score: success ? 4 : 2,
      timestamp: Date.now()
    };
    
    this.stats.total++;
    this.stats[success ? 'positive' : 'negative']++;
    this.stats.ratings.push(feedback);
    
    this._save();
    return feedback;
  }

  /**
   * 记录问题/建议
   */
  reportIssue(issue, type = 'bug') {
    const feedback = {
      id: `fb_${Date.now()}`,
      type,
      content: issue,
      status: 'open',
      timestamp: Date.now()
    };
    
    this.stats.ratings.push(feedback);
    this._save();
    return feedback;
  }

  /**
   * 获取统计
   */
  getStats() {
    const recent = this.stats.ratings
      .filter(f => Date.now() - f.timestamp < 7 * 24 * 60 * 60 * 1000);
    
    const avgScore = this.stats.ratings.length > 0
      ? this.stats.ratings.reduce((sum, f) => sum + (f.score || 0), 0) / this.stats.ratings.length
      : 0;
    
    return {
      total: this.stats.total,
      positive: this.stats.positive,
      negative: this.stats.negative,
      neutral: this.stats.neutral,
      avgScore: avgScore.toFixed(1),
      recentCount: recent.length,
      positiveRate: this.stats.total > 0 
        ? (this.stats.positive / this.stats.total * 100).toFixed(0) + '%'
        : 'N/A'
    };
  }

  /**
   * 获取反馈提示
   */
  getEncouragement() {
    const stats = this.getStats();
    
    if (stats.positiveRate === 'N/A') {
      return '首次使用，欢迎反馈！';
    }
    
    const rate = parseInt(stats.positiveRate);
    if (rate >= 80) return '感谢支持！继续保持高质量服务 🎯';
    if (rate >= 60) return '感谢反馈！我们在持续改进 📈';
    if (rate >= 40) return '感谢您的耐心，会继续优化 🔧';
    return '感谢报告！优先级处理中 🛠️';
  }

  /**
   * 检查是否需要弹窗
   */
  shouldPrompt() {
    // 每10次交互提示一次
    return this.stats.total > 0 && this.stats.total % 10 === 0;
  }

  // ========== 内部方法 ==========

  _load() {
    if (fs.existsSync(this.feedbackFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(this.feedbackFile, 'utf-8'));
        this.stats = data.stats || this.stats;
      } catch (e) {}
    }
  }

  _save() {
    const dir = path.dirname(this.feedbackFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.feedbackFile, JSON.stringify({
      stats: this.stats,
      savedAt: new Date().toISOString()
    }, null, 2));
  }
}

module.exports = FeedbackSystem;
