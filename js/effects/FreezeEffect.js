/**
 * 冰冻效果类
 * 减缓目标移动速度
 */
class FreezeEffect extends Effect {
    /**
     * 创建冰冻效果实例
     * @param {Object} target - 效果目标（通常是敌人）
     * @param {Object} options - 效果选项
     * @param {number} options.duration - 持续时间（秒）
     * @param {number} [options.slowFactor=0.5] - 减速因子（0-1之间，越小减速越强）
     * @param {Object} [options.source] - 效果来源（塔或子弹）
     */
    constructor(target, options = {}) {
        super(target, options);
        
        this.type = 'freeze';
        this.icon = '❄️';
        this.color = '#64B5F6';
        
        this.slowFactor = options.slowFactor || 0.5;
        
        // 保存目标原始状态
        this.originalSlowFactor = target.slowFactor || 1.0;
    }
    
    /**
     * 当效果被应用时调用
     */
    onApply() {
        // 应用减速效果
        this.target.isSlowed = true;
        this.target.slowFactor = Math.min(this.target.slowFactor, this.slowFactor);
    }
    
    /**
     * 应用冰冻效果
     * @param {number} deltaTime - 时间增量（秒）
     */
    applyEffect(deltaTime) {
        // 持续应用减速效果
        this.target.isSlowed = true;
        this.target.slowFactor = Math.min(this.target.slowFactor, this.slowFactor);
    }
    
    /**
     * 当效果被移除时调用
     */
    onRemove() {
        // 检查目标是否还有其他冰冻效果
        const hasOtherFreezeEffects = this.target.effects && 
            this.target.effects.some(effect => 
                effect.type === 'freeze' && effect.id !== this.id
            );
        
        // 如果没有其他冰冻效果，恢复原始状态
        if (!hasOtherFreezeEffects) {
            this.target.isSlowed = false;
            this.target.slowFactor = 1.0;
        }
    }
    
    /**
     * 获取视觉滤镜
     * @returns {string} CSS滤镜字符串
     */
    getVisualFilter() {
        return 'brightness(0.8) hue-rotate(180deg)';
    }
}
