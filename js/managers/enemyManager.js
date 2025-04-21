/**
 * 敌人管理器
 * 负责敌人的生成和管理
 */

const EnemyManager = {
    // 敌人列表
    enemies: [],
    
    // 初始化
    init() {
        this.enemies = [];
    },
    
    // 更新所有敌人
    update(deltaTime) {
        // 更新每个敌人
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // 更新敌人
            enemy.update(deltaTime);
            
            // 如果敌人已死亡或到达终点，从列表中移除
            if (enemy.isDead || enemy.reachedEnd) {
                this.enemies.splice(i, 1);
            }
        }
    },
    
    // 生成敌人
    spawnEnemy(enemyTypeId) {
        // 查找敌人类型
        const enemyType = Config.enemyTypes.find(type => type.id === enemyTypeId);
        
        if (!enemyType) {
            console.error(`未找到敌人类型: ${enemyTypeId}`);
            return null;
        }
        
        // 创建敌人
        const enemy = new Enemy(enemyType);
        
        // 添加到敌人列表
        this.enemies.push(enemy);
        
        return enemy;
    },
    
    // 获取所有敌人
    getEnemies() {
        return this.enemies;
    },
    
    // 获取存活敌人数量
    getLivingEnemyCount() {
        return this.enemies.length;
    },
    
    // 清除所有敌人
    clearEnemies() {
        // 移除所有敌人的DOM元素
        this.enemies.forEach(enemy => {
            enemy.remove();
        });
        
        // 清空敌人列表
        this.enemies = [];
    },
    
    // 重置
    reset() {
        this.clearEnemies();
    }
};
