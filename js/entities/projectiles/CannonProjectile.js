/**
 * 炮手子弹类
 * 特点：直线飞行，溅射伤害
 */
class CannonProjectile extends Projectile {
    constructor(source, target, options = {}) {
        super(source, target, options);
        
        // 炮手子弹特有属性
        this.splashRadius = options.splashRadius || 40; // 溅射半径
    }
    
    // 创建炮手子弹DOM元素
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'projectile cannon-projectile';
        
        // 设置初始位置
        this.element.style.left = `${this.startPosition.x - 7}px`;
        this.element.style.top = `${this.startPosition.y - 7}px`;
        
        // 炮弹样式
        this.element.style.width = '14px';
        this.element.style.height = '14px';
        this.element.style.borderRadius = '50%';
        this.element.style.backgroundColor = '#333';
    }
    
    // 炮手子弹的伤害处理 - 溅射伤害
    dealDamage() {
        // 创建爆炸效果
        this.createExplosionEffect();
        
        // 获取所有敌人
        const enemies = EnemyManager.getEnemies();
        
        // 对主要目标造成全额伤害
        if (this.target && !this.target.isDead && !this.target.reachedEnd) {
            this.target.takeDamage(this.damage);
        }
        
        // 对范围内的其他敌人造成溅射伤害（伤害衰减）
        for (const enemy of enemies) {
            // 跳过主要目标和已死亡/已到达终点的敌人
            if (enemy === this.target || enemy.isDead || enemy.reachedEnd) {
                continue;
            }
            
            // 计算与爆炸中心的距离
            const enemyPos = {
                x: enemy.position.x * Config.map.cellSize + Config.map.cellSize / 2,
                y: enemy.position.y * Config.map.cellSize + Config.map.cellSize / 2
            };
            
            const dx = enemyPos.x - this.targetPosition.x;
            const dy = enemyPos.y - this.targetPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 如果在溅射范围内，造成伤害
            if (distance <= this.splashRadius) {
                // 根据距离计算伤害衰减（距离越远，伤害越低）
                const damageFactor = 1 - (distance / this.splashRadius);
                const splashDamage = Math.floor(this.damage * damageFactor * 0.8); 
                
                // 造成溅射伤害
                if (splashDamage > 0) {
                    enemy.takeDamage(splashDamage);
                }
            }
        }
    }
    
    // 创建爆炸效果
    createExplosionEffect() {
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.left = `${this.targetPosition.x - 20}px`;
        explosion.style.top = `${this.targetPosition.y - 20}px`;
        explosion.style.width = `${this.splashRadius * 2}px`;
        explosion.style.height = `${this.splashRadius * 2}px`;
        
        document.getElementById('game-map').appendChild(explosion);
        
        // 一段时间后移除爆炸效果
        setTimeout(() => {
            if (explosion.parentNode) {
                explosion.parentNode.removeChild(explosion);
            }
        }, 500);
    }
    
    // 炮手子弹的命中效果
    onHit() {
        // 移除子弹元素
        this.remove();
        
        // 处理溅射伤害
        this.dealDamage();
    }
}
