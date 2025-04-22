/**
 * 燃烧效果类
 * 对目标造成持续伤害
 */
class BurnEffect extends Effect {
    /**
     * 创建燃烧效果实例
     * @param {Object} target - 效果目标（通常是敌人）
     * @param {Object} options - 效果选项
     * @param {number} options.duration - 持续时间（秒）
     * @param {number} options.damage - 每次伤害值
     * @param {number} [options.interval=1.0] - 伤害间隔（秒）
     * @param {Object} [options.source] - 效果来源（塔或子弹）
     */
    constructor(target, options = {}) {
        super(target, options);
        
        this.type = 'burn';
        this.icon = '🔥';
        this.color = '#FF5722';
        
        this.damage = options.damage || 5;
        this.interval = options.interval || 1.0;
        this.timeSinceLastTick = 0;
    }
    
    /**
     * 应用燃烧效果
     * @param {number} deltaTime - 时间增量（秒）
     */
    applyEffect(deltaTime) {
        // 增加计时器
        this.timeSinceLastTick += deltaTime;
        
        // 检查是否应该造成伤害
        if (this.timeSinceLastTick >= this.interval) {
            // 造成伤害
            this.target.takeDamage(this.damage, this.source);
            
            // 显示伤害文本
            this.showDamageText();
            
            // 重置计时器
            this.timeSinceLastTick = 0;
        }
    }
    
    /**
     * 显示伤害文本
     */
    showDamageText() {
        // 创建文本元素
        const textElement = document.createElement('div');
        textElement.className = 'damage-text';
        textElement.textContent = `${this.damage} ${this.icon}`;
        textElement.style.color = this.color;
        
        // 随机偏移，避免重叠
        const randomOffsetX = (Math.random() - 0.5) * 30;
        const randomOffsetY = (Math.random() - 0.5) * 30;
        
        // 使用中心定位
        const cellCenter = Config.map.cellSize / 2;
        textElement.style.position = 'absolute';
        textElement.style.left = `${this.target.position.x * Config.map.cellSize + cellCenter + randomOffsetX}px`;
        textElement.style.top = `${this.target.position.y * Config.map.cellSize + cellCenter + randomOffsetY}px`;
        textElement.style.transform = 'translate(-50%, -50%)';
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(textElement);
        
        // 添加动画类
        setTimeout(() => {
            textElement.classList.add('damage-text-animate');
        }, 10);
        
        // 动画结束后移除
        setTimeout(() => {
            if (textElement.parentNode) {
                textElement.parentNode.removeChild(textElement);
            }
        }, 1000);
    }
    
    /**
     * 获取视觉滤镜
     * @returns {string} CSS滤镜字符串
     */
    getVisualFilter() {
        return 'sepia(0.5) hue-rotate(-50deg) saturate(1.5)';
    }
}
