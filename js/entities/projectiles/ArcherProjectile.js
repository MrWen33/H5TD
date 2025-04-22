/**
 * 弓箭手子弹类
 * 特点：直线飞行，单体伤害
 */
class ArcherProjectile extends Projectile {
    constructor(source, target, options = {}) {
        super(source, target, options);
        
        // 从配置文件获取默认属性
        const defaultConfig = BulletConfig['archer-projectile'];
        
        // 设置子弹特性（优先使用options中的值，其次使用配置文件中的值）
        this.damage = options.damage || defaultConfig.damage;
        this.cooldown = options.cooldown || defaultConfig.cooldown;
    }
    
    // 创建弓箭手子弹DOM元素
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'projectile archer-projectile';
        
        // 设置初始位置
        this.element.style.left = `${this.startPosition.x - 5}px`;
        this.element.style.top = `${this.startPosition.y - 5}px`;
        
        // 计算旋转角度，使箭头指向目标
        const angle = Math.atan2(
            this.targetPosition.y - this.startPosition.y,
            this.targetPosition.x - this.startPosition.x
        ) * (180 / Math.PI);
        
        this.element.style.transform = `rotate(${angle}deg)`;
    }
    
    // 弓箭手子弹的伤害处理
    dealDamage() {
        // 单体伤害
        this.target.takeDamage(this.damage);
    }
}
