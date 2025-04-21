/**
 * 塔类
 * 负责塔的创建和行为
 */

class Tower {
    constructor(type, x, y) {
        // 塔类型
        this.type = type;
        
        // 塔属性
        this.id = Utils.generateId();
        this.emoji = type.emoji;
        this.name = type.name;
        this.damage = type.damage;
        this.range = type.range;
        this.attackSpeed = type.attackSpeed;
        this.cost = type.cost;
        this.projectileType = type.projectile;
        this.projectileSpeed = type.projectileSpeed;
        this.splashRadius = type.splashRadius || 0;
        this.upgradeLevel = type.upgradeLevel || 0;
        this.upgrades = type.upgrades || [];
        
        // 位置
        this.x = x;
        this.y = y;
        this.position = {
            x: x * Config.map.cellSize + Config.map.cellSize / 2,
            y: y * Config.map.cellSize + Config.map.cellSize / 2
        };
        
        // 攻击相关
        this.target = null;
        this.attackCooldown = 0;
        this.lastAttackTime = 0;
        
        // 创建DOM元素
        this.element = document.createElement('div');
        this.element.className = `tower tower-${this.type.id} tower-level-${this.upgradeLevel}`;
        this.element.textContent = this.emoji;
        this.element.style.left = `${x * Config.map.cellSize}px`;
        this.element.style.top = `${y * Config.map.cellSize}px`;
        
        // 添加点击事件
        this.element.addEventListener('click', (event) => {
            event.stopPropagation();
            this.showUpgradeMenu();
        });
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(this.element);
        
        // 显示范围指示器
        this.showRangeIndicator();
    }
    
    // 更新塔
    update(deltaTime) {
        // 如果冷却中，减少冷却时间
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        // 如果没有目标或目标已死亡或目标已到达终点，寻找新目标
        if (!this.target || this.target.isDead || this.target.reachedEnd) {
            this.findTarget();
        }
        
        // 如果有目标，检查是否在范围内
        if (this.target) {
            const distance = this.getDistanceToTarget(this.target);
            
            // 如果目标不在范围内，寻找新目标
            if (distance > this.range) {
                this.target = null;
                this.findTarget();
            } else if (this.attackCooldown <= 0) {
                // 攻击目标
                this.attack();
            }
        }
    }
    
    // 寻找目标
    findTarget() {
        // 获取所有敌人
        const enemies = EnemyManager.getEnemies();
        
        // 按照路径进度排序，优先攻击走得最远的敌人
        enemies.sort((a, b) => b.pathIndex + b.progress - (a.pathIndex + a.progress));
        
        // 寻找范围内的敌人
        for (const enemy of enemies) {
            if (!enemy.isDead && !enemy.reachedEnd) {
                const distance = this.getDistanceToTarget(enemy);
                if (distance <= this.range) {
                    this.target = enemy;
                    break;
                }
            }
        }
    }
    
    // 获取到目标的距离
    getDistanceToTarget(target) {
        const dx = this.position.x - (target.position.x * Config.map.cellSize + Config.map.cellSize / 2);
        const dy = this.position.y - (target.position.y * Config.map.cellSize + Config.map.cellSize / 2);
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // 攻击目标
    attack() {
        // 重置冷却时间
        this.attackCooldown = 1 / this.attackSpeed;
        this.lastAttackTime = performance.now();
        
        // 创建投射物
        this.createProjectile();
    }
    
    // 创建投射物
    createProjectile() {
        // 如果目标已死亡或到达终点，不创建投射物
        if (!this.target || this.target.isDead || this.target.reachedEnd) {
            return;
        }
        
        // 创建投射物
        const projectile = document.createElement('div');
        projectile.className = `projectile ${this.projectileType}`;
        
        // 设置投射物初始位置
        projectile.style.left = `${this.position.x - 5}px`;
        projectile.style.top = `${this.position.y - 5}px`;
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(projectile);
        
        // 计算目标位置
        const targetX = this.target.position.x * Config.map.cellSize + Config.map.cellSize / 2;
        const targetY = this.target.position.y * Config.map.cellSize + Config.map.cellSize / 2;
        
        // 计算方向
        const dx = targetX - this.position.x;
        const dy = targetY - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 计算飞行时间
        const flightTime = distance / this.projectileSpeed;
        
        // 设置投射物动画
        projectile.style.transition = `left ${flightTime}s linear, top ${flightTime}s linear`;
        
        // 延迟一帧，确保transition生效
        setTimeout(() => {
            projectile.style.left = `${targetX - 5}px`;
            projectile.style.top = `${targetY - 5}px`;
        }, 16);
        
        // 投射物到达目标
        setTimeout(() => {
            // 移除投射物
            if (projectile.parentNode) {
                projectile.parentNode.removeChild(projectile);
            }
            
            // 如果目标还活着，造成伤害
            if (this.target && !this.target.isDead && !this.target.reachedEnd) {
                // 如果是溅射伤害
                if (this.splashRadius > 0) {
                    this.dealSplashDamage();
                } else {
                    // 单体伤害
                    this.target.takeDamage(this.damage);
                    
                    // 如果是法师塔，有几率减速敌人
                    if (this.type.id === 'magic' && Math.random() < 0.3) {
                        this.target.slow(0.5, 2); // 减速50%，持续2秒
                    }
                }
            }
        }, flightTime * 1000);
    }
    
    // 造成溅射伤害
    dealSplashDamage() {
        // 如果目标已死亡或到达终点，不造成伤害
        if (!this.target || this.target.isDead || this.target.reachedEnd) {
            return;
        }
        
        // 创建爆炸效果
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.left = `${this.target.position.x * Config.map.cellSize + Config.map.cellSize / 2 - 20}px`;
        explosion.style.top = `${this.target.position.y * Config.map.cellSize + Config.map.cellSize / 2 - 20}px`;
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(explosion);
        
        // 一秒后移除爆炸效果
        setTimeout(() => {
            if (explosion.parentNode) {
                explosion.parentNode.removeChild(explosion);
            }
        }, 500);
        
        // 对目标造成全额伤害
        this.target.takeDamage(this.damage);
        
        // 获取所有敌人
        const enemies = EnemyManager.getEnemies();
        
        // 对范围内的其他敌人造成伤害
        for (const enemy of enemies) {
            if (enemy !== this.target && !enemy.isDead && !enemy.reachedEnd) {
                const dx = (enemy.position.x - this.target.position.x) * Config.map.cellSize;
                const dy = (enemy.position.y - this.target.position.y) * Config.map.cellSize;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // 如果在溅射范围内
                if (distance <= this.splashRadius) {
                    // 根据距离计算伤害衰减
                    const damageFactor = 1 - distance / this.splashRadius;
                    const splashDamage = Math.floor(this.damage * damageFactor);
                    
                    // 造成伤害
                    enemy.takeDamage(splashDamage);
                }
            }
        }
    }
    
    // 显示范围指示器
    showRangeIndicator() {
        // 创建范围指示器
        const rangeIndicator = document.createElement('div');
        rangeIndicator.className = 'tower-range';
        rangeIndicator.style.left = `${this.position.x - this.range}px`;
        rangeIndicator.style.top = `${this.position.y - this.range}px`;
        rangeIndicator.style.width = `${this.range * 2}px`;
        rangeIndicator.style.height = `${this.range * 2}px`;
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(rangeIndicator);
        
        // 保存引用
        this.rangeIndicator = rangeIndicator;
        
        // 默认隐藏
        this.hideRangeIndicator();
    }
    
    // 显示范围
    showRange() {
        if (this.rangeIndicator) {
            this.rangeIndicator.style.display = 'block';
        }
    }
    
    // 隐藏范围
    hideRangeIndicator() {
        if (this.rangeIndicator) {
            this.rangeIndicator.style.display = 'none';
        }
    }
    
    // 显示升级菜单
    showUpgradeMenu() {
        // 隐藏其他塔的范围
        TowerManager.hideAllRanges();
        
        // 显示当前塔的范围
        this.showRange();
        
        // 通知UI管理器显示升级菜单
        UIManager.showTowerUpgradeMenu(this);
    }
    
    // 升级塔
    upgrade() {
        // 检查是否有可用升级
        if (this.upgradeLevel >= this.upgrades.length) {
            console.log('已达到最高等级');
            return false;
        }
        
        // 获取升级信息
        const upgrade = this.upgrades[this.upgradeLevel];
        
        // 检查金钱是否足够
        if (Game.state.money < upgrade.cost) {
            console.log('金钱不足');
            return false;
        }
        
        // 扣除金钱
        Game.state.money -= upgrade.cost;
        
        // 应用升级
        this.damage = upgrade.damage;
        this.range = upgrade.range;
        this.attackSpeed = upgrade.attackSpeed;
        
        // 如果有泼射半径，也升级
        if (upgrade.splashRadius) {
            this.splashRadius = upgrade.splashRadius;
        }
        
        // 增加等级
        this.upgradeLevel++;
        
        // 更新塔的视觉效果
        this.element.classList.remove(`tower-level-${this.upgradeLevel - 1}`);
        this.element.classList.add(`tower-level-${this.upgradeLevel}`);
        
        // 更新范围指示器
        if (this.rangeIndicator) {
            this.rangeIndicator.style.left = `${this.position.x - this.range}px`;
            this.rangeIndicator.style.top = `${this.position.y - this.range}px`;
            this.rangeIndicator.style.width = `${this.range * 2}px`;
            this.rangeIndicator.style.height = `${this.range * 2}px`;
        }
        
        // 添加升级效果
        this.element.classList.add('upgraded');
        setTimeout(() => {
            this.element.classList.remove('upgraded');
        }, 500);
        
        return true;
    }
    
    // 出售塔
    sell() {
        // 计算出售价格（50%的建造成本）
        const sellPrice = Math.floor(this.cost * 0.5);
        
        // 添加金钱
        Game.state.money += sellPrice;
        
        // 标记位置为空地
        MapManager.markTowerRemoved(this.x, this.y);
        
        // 移除范围指示器
        if (this.rangeIndicator && this.rangeIndicator.parentNode) {
            this.rangeIndicator.parentNode.removeChild(this.rangeIndicator);
        }
        
        // 移除DOM元素
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        // 从塔管理器中移除
        TowerManager.removeTower(this);
        
        return sellPrice;
    }
    
    // 移除塔
    remove() {
        // 移除范围指示器
        if (this.rangeIndicator && this.rangeIndicator.parentNode) {
            this.rangeIndicator.parentNode.removeChild(this.rangeIndicator);
        }
        
        // 移除DOM元素
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
