/**
 * 冰球子弹类
 * 造成范围减速效果
 */
class IceProjectile extends Projectile {
    constructor(source, target, options = {}) {
        super(source, target, options);
        console.log("创建冰球子弹");
        
        // 从配置文件获取默认属性
        const defaultConfig = BulletConfig['ice-projectile'];
        
        // 设置子弹特性（优先使用options中的值，其次使用配置文件中的值）
        this.damage = options.damage || defaultConfig.damage;
        this.freezeChance = options.freezeChance || defaultConfig.freezeChance;
        this.freezeFactor = options.freezeFactor || defaultConfig.freezeFactor;
        this.freezeDuration = options.freezeDuration || defaultConfig.freezeDuration;
        this.cooldown = options.cooldown || defaultConfig.cooldown;
        this.freezeRadius = options.freezeRadius || 50; // 冰冻范围半径
        
        // 设置外观
        this.element.className = 'projectile ice-projectile';
        this.element.textContent = '❄️';
    }
    
    /**
     * 击中目标
     */
    onHit() {
        // 移除子弹元素
        this.remove();
        
        // 处理范围冰冻效果
        this.dealFreezeEffect();
    }
    
    /**
     * 处理范围冰冻效果
     */
    dealFreezeEffect() {
        // 创建冰冻效果
        this.createFreezeEffect();
        
        // 获取所有敌人
        const enemies = EnemyManager.getEnemies();
        
        // 对主要目标造成全额伤害和冰冻效果
        if (this.target && !this.target.isDead && !this.target.reachedEnd) {
            console.log("冰球子弹命中目标，造成直接伤害");
            this.target.takeDamage(this.damage);
            
            // 添加冰冻效果（概率为100%）
            if (Math.random() < this.freezeChance) {
                console.log("添加冰冻效果到主要目标");
                this.target.addEffect({
                    type: 'freeze',
                    slowFactor: this.freezeFactor,
                    duration: this.freezeDuration,
                    source: this.source
                });
            }
        }
        
        // 对范围内的其他敌人造成冰冻效果（效果衰减）
        for (const enemy of enemies) {
            // 跳过主要目标和已死亡/已到达终点的敌人
            if (enemy === this.target || enemy.isDead || enemy.reachedEnd) {
                continue;
            }
            
            // 计算与冰冻中心的距离
            const enemyPos = {
                x: enemy.position.x * Config.map.cellSize + Config.map.cellSize / 2,
                y: enemy.position.y * Config.map.cellSize + Config.map.cellSize / 2
            };
            
            const dx = enemyPos.x - this.targetPosition.x;
            const dy = enemyPos.y - this.targetPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 如果在冰冻范围内，造成减速效果
            if (distance <= this.freezeRadius) {
                // 根据距离计算效果衰减（距离越远，减速效果越弱）
                const effectFactor = 1 - (distance / this.freezeRadius);
                const reducedFreezeFactor = this.freezeFactor * effectFactor;
                const reducedFreezeDuration = this.freezeDuration * effectFactor;
                
                // 添加减弱的冰冻效果
                if (Math.random() < this.freezeChance && reducedFreezeFactor > 0.1) {
                    console.log("添加范围冰冻效果到周围敌人");
                    enemy.addEffect({
                        type: 'freeze',
                        slowFactor: reducedFreezeFactor,
                        duration: reducedFreezeDuration,
                        source: this.source
                    });
                }
            }
        }
    }
    
    /**
     * 创建冰冻效果
     */
    createFreezeEffect() {
        const freezeEffect = document.createElement('div');
        freezeEffect.className = 'freeze-effect';
        freezeEffect.style.left = `${this.targetPosition.x - this.freezeRadius}px`;
        freezeEffect.style.top = `${this.targetPosition.y - this.freezeRadius}px`;
        freezeEffect.style.width = `${this.freezeRadius * 2}px`;
        freezeEffect.style.height = `${this.freezeRadius * 2}px`;
        freezeEffect.style.borderRadius = '50%';
        freezeEffect.style.backgroundColor = 'rgba(135, 206, 250, 0.3)';
        freezeEffect.style.border = '2px solid rgba(135, 206, 250, 0.7)';
        freezeEffect.style.boxShadow = '0 0 10px rgba(135, 206, 250, 0.5)';
        freezeEffect.style.animation = 'freeze-pulse 0.8s ease-out';
        
        document.getElementById('game-map').appendChild(freezeEffect);
        
        // 一段时间后移除冰冻效果
        setTimeout(() => {
            if (freezeEffect.parentNode) {
                freezeEffect.parentNode.removeChild(freezeEffect);
            }
        }, 800);
    }
}
