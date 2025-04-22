/**
 * 法师子弹类
 * 特点：直线飞行，单体伤害，有几率减速敌人
 */
class MagicProjectile extends Projectile {
    constructor(source, target, options = {}) {
        super(source, target, options);
        
        // 从配置文件获取默认属性
        const defaultConfig = BulletConfig['magic-projectile'];
        
        // 设置子弹特性（优先使用options中的值，其次使用配置文件中的值）
        this.damage = options.damage || defaultConfig.damage;
        this.slowChance = options.slowChance || defaultConfig.slowChance;
        this.slowFactor = options.slowFactor || defaultConfig.slowFactor;
        this.slowDuration = options.slowDuration || defaultConfig.slowDuration;
        this.cooldown = options.cooldown || defaultConfig.cooldown;
    }
    
    // 创建法师子弹DOM元素
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'projectile magic-projectile';
        
        // 设置初始位置
        this.element.style.left = `${this.startPosition.x - 5}px`;
        this.element.style.top = `${this.startPosition.y - 5}px`;
        
        // 添加魔法效果
        this.element.style.filter = 'drop-shadow(0 0 5px blue)';
    }
    
    // 法师子弹的伤害处理
    dealDamage() {
        // 造成伤害
        this.target.takeDamage(this.damage);
        
        // 始终减速敌人（概率为100%）
        if (Math.random() < this.slowChance) {
            this.target.slow(this.slowFactor, this.slowDuration);
        }
    }
    
    // 法师子弹的命中效果
    onHit() {
        // 创建魔法命中效果
        const hitEffect = document.createElement('div');
        hitEffect.className = 'magic-hit-effect';
        hitEffect.style.left = `${this.targetPosition.x - 15}px`;
        hitEffect.style.top = `${this.targetPosition.y - 15}px`;
        document.getElementById('game-map').appendChild(hitEffect);
        
        // 一段时间后移除效果
        setTimeout(() => {
            if (hitEffect.parentNode) {
                hitEffect.parentNode.removeChild(hitEffect);
            }
        }, 300);
        
        // 调用父类方法处理伤害
        super.onHit();
    }
}
