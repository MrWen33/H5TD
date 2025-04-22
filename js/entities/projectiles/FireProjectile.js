/**
 * 火球子弹类
 * 造成持续燃烧伤害
 */
class FireProjectile extends Projectile {
    constructor(source, target, options = {}) {
        super(source, target, options);
        
        // 从配置文件获取默认属性
        const defaultConfig = BulletConfig['fire-projectile'];
        
        // 设置子弹特性（优先使用options中的值，其次使用配置文件中的值）
        this.damage = options.damage || defaultConfig.damage;
        this.burnDamage = options.burnDamage || defaultConfig.burnDamage;
        this.burnDuration = options.burnDuration || defaultConfig.burnDuration;
        this.cooldown = options.cooldown || defaultConfig.cooldown;
        
        // 设置外观
        this.element.className = 'projectile fire-projectile';
        this.element.textContent = '🔥';
    }
    
    /**
     * 击中目标
     */
    onHit() {
        if (!this.target || this.target.isDead || this.target.reachedEnd) {
            this.remove();
            return;
        }
        
        // 造成直接伤害
        console.log('火球子弹命中目标，造成直接伤害');
        this.target.takeDamage(this.damage);
        
        // 添加燃烧效果
        console.log('尝试添加燃烧效果，伤害：', this.burnDamage, '持续时间：', this.burnDuration);
        this.target.addEffect({
            type: 'burn',
            damage: this.burnDamage,
            duration: this.burnDuration,
            interval: 1, // 每秒触发一次
            source: this.source
        });
        console.log('效果已添加，目标效果列表：', this.target.effects);
        
        // 移除子弹
        this.remove();
    }
}
