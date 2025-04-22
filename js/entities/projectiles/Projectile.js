/**
 * 子弹基类
 * 所有子弹类型都继承自这个基类
 */
class Projectile {
    constructor(source, target, options = {}) {
        // 基本属性
        this.id = Utils.generateId();
        this.source = source; // 发射源（塔）
        this.target = target; // 目标（敌人）
        
        // 子弹属性（从选项中获取或使用默认值）
        this.damage = options.damage || 0;
        this.speed = options.speed || 300;
        this.cooldown = options.cooldown || 1.0; // 子弹发射后的冷却时间（秒）
        this.element = null;
        this.flightTime = 0;
        this.startTime = performance.now();
        
        // 位置信息
        this.startPosition = {
            x: source.position.x,
            y: source.position.y
        };
        
        this.targetPosition = {
            x: target.position.x * Config.map.cellSize + Config.map.cellSize / 2,
            y: target.position.y * Config.map.cellSize + Config.map.cellSize / 2
        };
        
        // 计算方向和距离
        this.calculateTrajectory();
        
        // 创建DOM元素
        this.createElement();
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(this.element);
        
        // 开始飞行动画
        this.startFlight();
    }
    
    // 计算轨迹、方向和距离
    calculateTrajectory() {
        const dx = this.targetPosition.x - this.startPosition.x;
        const dy = this.targetPosition.y - this.startPosition.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        this.direction = {
            x: dx / this.distance,
            y: dy / this.distance
        };
        
        // 计算飞行时间
        this.flightTime = this.distance / this.speed;
    }
    
    // 创建子弹DOM元素（子类可以覆盖此方法自定义外观）
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'projectile';
        
        // 设置初始位置
        this.element.style.left = `${this.startPosition.x - 5}px`;
        this.element.style.top = `${this.startPosition.y - 5}px`;
    }
    
    // 开始飞行动画
    startFlight() {
        // 设置CSS过渡效果
        this.element.style.transition = `left ${this.flightTime}s linear, top ${this.flightTime}s linear`;
        
        // 延迟一帧，确保transition生效
        setTimeout(() => {
            this.element.style.left = `${this.targetPosition.x - 5}px`;
            this.element.style.top = `${this.targetPosition.y - 5}px`;
        }, 16);
        
        // 设置到达目标后的处理
        setTimeout(() => {
            this.onHit();
        }, this.flightTime * 1000);
    }
    
    // 子弹命中目标时的处理（子类应该覆盖此方法）
    onHit() {
        // 移除子弹元素
        this.remove();
        
        // 如果目标还存在且未死亡，造成伤害
        if (this.target && !this.target.isDead && !this.target.reachedEnd) {
            this.dealDamage();
        }
    }
    
    // 造成伤害（子类可以覆盖此方法自定义伤害逻辑）
    dealDamage() {
        this.target.takeDamage(this.damage);
    }
    
    // 移除子弹
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
    
    // 更新子弹（可用于特殊效果或追踪目标）
    update(deltaTime) {
        // 基类中不做任何更新，子类可以覆盖此方法
    }
}
