/**
 * 毒液子弹类
 * 造成持续毒素伤害
 */
class PoisonProjectile extends Projectile {
    constructor(source, target, options = {}) {
        super(source, target, options);
        
        // 从配置文件获取默认属性
        const defaultConfig = BulletConfig['poison-projectile'];
        
        // 设置子弹特性（优先使用options中的值，其次使用配置文件中的值）
        this.damage = options.damage || defaultConfig.damage;
        this.poisonDamage = options.poisonDamage || defaultConfig.poisonDamage;
        this.poisonDuration = options.poisonDuration || defaultConfig.poisonDuration;
        this.cooldown = options.cooldown || defaultConfig.cooldown;
        
        // 设置外观
        this.element.className = 'projectile poison-projectile';
        this.element.textContent = '☠️';
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
        console.log('毒液子弹命中目标，造成直接伤害');
        this.target.takeDamage(this.damage);
        
        // 添加中毒效果
        console.log('添加中毒效果');
        this.target.addEffect({
            type: 'poison',
            damage: this.poisonDamage,
            duration: this.poisonDuration,
            interval: 0.5, // 每0.5秒触发一次
            source: this.source
        });
        
        // 移除子弹
        this.remove();
    }
}
