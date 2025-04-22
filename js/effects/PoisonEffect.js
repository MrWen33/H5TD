/**
 * 中毒效果类
 * 对目标造成持续伤害，伤害可随时间增加
 */
class PoisonEffect extends Effect {
    /**
     * 创建中毒效果实例
     * @param {Object} target - 效果目标（通常是敌人）
     * @param {Object} options - 效果选项
     * @param {number} options.duration - 持续时间（秒）
     * @param {number} options.damage - 初始每次伤害值
     * @param {number} [options.interval=1.0] - 伤害间隔（秒）
     * @param {number} [options.stackMultiplier=1.0] - 叠加伤害倍数（每次伤害后增加的倍数）
     * @param {Object} [options.source] - 效果来源（塔或子弹）
     */
    constructor(target, options = {}) {
        super(target, options);
        
        this.type = 'poison';
        this.icon = '☠️';
        this.color = '#8BC34A';
        
        this.damage = options.damage || 3;
        this.interval = options.interval || 1.0;
        this.stackMultiplier = options.stackMultiplier || 1.0;
        this.timeSinceLastTick = 0;
        this.stackCount = 1;
    }
    
    /**
     * 应用中毒效果
     * @param {number} deltaTime - 时间增量（秒）
     */
    applyEffect(deltaTime) {
        // 增加计时器
        this.timeSinceLastTick += deltaTime;
        
        // 检查是否应该造成伤害
        if (this.timeSinceLastTick >= this.interval) {
            // 计算当前伤害值
            const currentDamage = Math.round(this.damage * this.stackCount);
            
            // 造成伤害
            this.target.takeDamage(currentDamage, this.source);
            
            // 显示伤害文本
            this.showDamageText(currentDamage);
            
            // 增加叠加计数（如果有叠加倍数）
            if (this.stackMultiplier > 1.0) {
                this.stackCount *= this.stackMultiplier;
            }
            
            // 重置计时器
            this.timeSinceLastTick = 0;
        }
    }
    
    /**
     * 显示伤害文本
     * @param {number} damage - 显示的伤害值
     */
    showDamageText(damage) {
        // 创建文本元素
        const textElement = document.createElement('div');
        textElement.className = 'damage-text';
        textElement.textContent = `${damage} ${this.icon}`;
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
        return 'sepia(0.3) hue-rotate(70deg) saturate(1.2)';
    }
}
