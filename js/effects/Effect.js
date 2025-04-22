/**
 * 效果基类
 * 所有特定效果都继承自这个基类
 */
class Effect {
    /**
     * 创建效果实例
     * @param {Object} target - 效果目标（通常是敌人）
     * @param {Object} options - 效果选项
     * @param {number} options.duration - 持续时间（秒）
     * @param {Object} [options.source] - 效果来源（塔或子弹）
     */
    constructor(target, options = {}) {
        this.id = Utils.generateId();
        this.target = target;
        this.duration = options.duration || 3.0;
        this.timeLeft = this.duration;
        this.source = options.source || null;
        this.type = 'base'; // 基础类型，子类需要覆盖
        this.icon = ''; // 效果图标，子类需要覆盖
        this.color = '#FFFFFF'; // 效果颜色，子类需要覆盖
        
        // 应用效果时调用
        this.onApply();
    }
    
    /**
     * 当效果被应用时调用
     */
    onApply() {
        // 基类不做任何事，子类可以覆盖
    }
    
    /**
     * 更新效果
     * @param {number} deltaTime - 时间增量（秒）
     * @returns {boolean} 效果是否仍然有效
     */
    update(deltaTime) {
        // 减少剩余时间
        this.timeLeft -= deltaTime;
        
        // 检查效果是否已过期
        if (this.timeLeft <= 0) {
            this.onRemove();
            return false;
        }
        
        // 执行效果逻辑
        this.applyEffect(deltaTime);
        return true;
    }
    
    /**
     * 应用效果逻辑
     * @param {number} deltaTime - 时间增量（秒）
     */
    applyEffect(deltaTime) {
        // 基类不做任何事，子类需要覆盖
    }
    
    /**
     * 当效果被移除时调用
     */
    onRemove() {
        // 基类不做任何事，子类可以覆盖
    }
    
    /**
     * 获取效果的视觉滤镜
     * @returns {string} CSS滤镜字符串
     */
    getVisualFilter() {
        return ''; // 基类不提供滤镜，子类需要覆盖
    }
    
    /**
     * 显示效果图标
     */
    showIcon() {
        if (!this.icon || !this.target.element) return;
        
        // 创建效果图标元素
        const effectIcon = document.createElement('div');
        effectIcon.className = 'effect-icon';
        effectIcon.textContent = this.icon;
        effectIcon.style.color = this.color;
        
        // 随机偏移，避免重叠
        const randomOffsetX = (Math.random() - 0.5) * 30;
        const randomOffsetY = (Math.random() - 0.5) * 30;
        
        effectIcon.style.position = 'absolute';
        effectIcon.style.left = `calc(50% + ${randomOffsetX}px)`;
        effectIcon.style.top = `calc(50% + ${randomOffsetY}px)`;
        effectIcon.style.fontSize = '16px';
        effectIcon.style.zIndex = '10';
        effectIcon.style.textShadow = '0 0 3px black';
        effectIcon.style.animation = 'float-up 1s ease-out';
        
        // 添加到目标元素
        this.target.element.appendChild(effectIcon);
        
        // 动画结束后移除
        setTimeout(() => {
            if (effectIcon.parentNode) {
                effectIcon.parentNode.removeChild(effectIcon);
            }
        }, 1000);
    }
}
