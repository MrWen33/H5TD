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
        this.range = type.range;
        this.attackSpeed = type.attackSpeed;
        this.cost = type.cost;
        this.projectileSpeed = type.projectileSpeed || 300;
        
        // 记录总投资金额（初始建造成本）
        this.totalInvestment = type.cost;
        
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
        this.element.className = `tower tower-${this.type.id}`;
        this.element.textContent = this.emoji;
        this.element.style.left = `${x * Config.map.cellSize}px`;
        this.element.style.top = `${y * Config.map.cellSize}px`;
        
        // 添加点击事件
        this.element.addEventListener('click', (event) => {
            event.stopPropagation();
            this.showBulletSlotsMenu();
        });
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(this.element);
        
        // 创建子弹槽管理器
        this.bulletSlotManager = new BulletSlotManager(this);
        // 使用配置文件中的slotCount属性初始化槽位数量
        const slotCount = this.type.slotCount || 4; // 默认为4个槽位
        console.log(`初始化塔的子弹槽数量: ${slotCount}`);
        this.bulletSlotManager.initializeSlots(slotCount);
        this.bulletSlotManager.setVisible(false); // 初始时隐藏子弹槽显示
        
        // 初始化编译空的子弹槽
        this.compileBulletSlots();
        
        // 重新装填相关
        this.isReloading = false;    // 是否正在重新装填
        this.reloadTimeRemaining = 0; // 剩余装填时间
        this.reloadTime = this.type.reloadTime || 2.0; // 装填时间（秒）
        
        // 创建重新装填指示器
        this.reloadIndicator = new ReloadIndicator(this);
        
        // 显示范围指示器
        this.showRangeIndicator();
    }
    
    // 更新塔
    update(deltaTime) {
        // 更新洗牌状态
        this.updateReloading(deltaTime);
        
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
                // 攻击目标（即使在洗牌中也会尝试攻击，但如果正在洗牌，drawCard会返回null）
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
        // 记录攻击时间
        this.lastAttackTime = performance.now();
        
        // 创建投射物（冷却时间将在createProjectile方法中设置）
        this.createProjectile();
    }
    
    // 创建投射物
    createProjectile() {
        // 如果目标已死亡或到达终点，不创建投射物
        if (!this.target || this.target.isDead || this.target.reachedEnd) {
            return;
        }
        
        // 如果正在洗牌（重新装填），不能发射
        if (this.bulletSlotManager.isShuffling) {
            console.log(`塔 ${this.id} 正在洗牌，无法发射子弹`);
            return;
        }
        
        // 从抽卡堆中抽一张卡牌（子弹）
        const bulletOptions = this.bulletSlotManager.drawCard();
        
        // 如果没有可用的卡牌，不发射
        if (!bulletOptions) {
            console.log(`塔 ${this.id} 没有可用的卡牌`);
            return;
        }
        
        // 设置子弹速度
        bulletOptions.speed = this.projectileSpeed;
        
        // 使用子弹管理器创建子弹
        const projectile = projectileManager.createProjectile(
            bulletOptions.type,
            this,
            this.target,
            bulletOptions
        );

        // 在发射子弹后设置塔的冷却时间
        const cooldown = projectile.cooldown;
        this.attackCooldown = cooldown;
        console.log(`发射卡牌: ${bulletOptions.type}，设置塔的冷却时间为 ${cooldown} 秒`);
        
        // 将使用过的卡牌放入弃牌堆
        this.bulletSlotManager.discardCard(bulletOptions);
    }
    
    // 造成溅射伤害 - 这个方法现在已经被移到CannonProjectile类中，保留此方法仅为了兼容性
    dealSplashDamage() {
        console.warn('Tower.dealSplashDamage方法已被弃用，请使用CannonProjectile类');
        // 该功能已移至CannonProjectile类
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
    

    
    /**
     * 编译子弹槽
     * 将子弹槽编译成卡牌并放入抽卡堆
     */
    compileBulletSlots() {
        // 调用子弹槽管理器的编译方法
        const drawPile = this.bulletSlotManager.compileBulletSlots();
        console.log(`塔 ${this.id} 编译完成，卡牌数量: ${drawPile.length}`);
        return drawPile;
    }
    

    
    /**
     * 更新重新装填状态
     * 在卡牌系统中，这个方法用于更新洗牌状态
     * @param {number} deltaTime - 时间增量（秒）
     */
    updateReloading(deltaTime) {
        // 更新卡牌系统的洗牌状态
        this.bulletSlotManager.updateShuffling(deltaTime);
        
        // 如果正在洗牌，更新进度条
        if (this.bulletSlotManager.isShuffling) {
            const progress = 100 * (1 - this.bulletSlotManager.shuffleTime / this.reloadTime);
            this.reloadIndicator.updateProgress(progress);
            this.reloadIndicator.show();
        } else {
            this.reloadIndicator.hide();
        }
    }
    

    

    
    // 显示子弹槽菜单
    showBulletSlotsMenu() {
        // 隐藏其他塔的范围
        TowerManager.hideAllRanges();
        
        // 隐藏所有其他菜单
        UIManager.hideAllMenus();
        
        // 显示当前塔的范围
        this.showRange();
        
        // 通知UI管理器显示塔的菜单
        UIManager.showTowerMenu(this);
    }
    
    // 添加子弹到槽位
    addBulletToSlot(slotIndex, bulletType, bulletOptions) {
        // 获取槽位
        const slot = this.bulletSlotManager.getSlot(slotIndex);
        if (!slot) {
            console.log(`槽位 ${slotIndex} 不存在`);
            return false;
        }
        
        // 检查金钱是否足够
        const bulletCost = bulletOptions.cost || 0;
        if (Game.state.money < bulletCost) {
            console.log('金钱不足');
            return false;
        }
        
        // 扣除金钱
        Game.state.money -= bulletCost;
        
        // 更新总投资金额
        this.totalInvestment += bulletCost;
        
        // 设置子弹类型
        slot.setBulletType(bulletType, bulletOptions);
        
        // 编译子弹槽
        this.compileBulletSlots();
        
        // 更新UI
        UIManager.updateResourceDisplay();
        
        return true;
    }
    
    // 从槽位移除子弹
    removeBulletFromSlot(slotIndex) {
        // 获取槽位
        const slot = this.bulletSlotManager.getSlot(slotIndex);
        if (!slot) {
            console.log(`槽位 ${slotIndex} 不存在`);
            return false;
        }
        
        // 清空槽位
        slot.clear();
        
        // 重新编译子弹槽
        this.compileBulletSlots();
        
        return true;
    }
    
    // 出售塔
    sell() {
        // 计算出售价格（基于总投资金额，使用配置的出售价格系数）
        const sellPrice = Math.floor(this.totalInvestment * Config.sellPriceFactor);
        
        // 添加金钱
        Game.state.money += sellPrice;
        
        // 标记位置为空地
        MapManager.markTowerRemoved(this.x, this.y);
        
        // 移除范围指示器
        if (this.rangeIndicator && this.rangeIndicator.parentNode) {
            this.rangeIndicator.parentNode.removeChild(this.rangeIndicator);
        }
        
        // 移除子弹槽管理器
        
        return sellPrice;
    }
    
    // 移除塔
    remove() {
        // 移除DOM元素
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        // 移除范围指示器
        if (this.rangeIndicator && this.rangeIndicator.parentNode) {
            this.rangeIndicator.parentNode.removeChild(this.rangeIndicator);
        }
        
        // 移除子弹槽管理器
        this.bulletSlotManager.remove();
        
        // 移除重新装填指示器
        if (this.reloadIndicator) {
            this.reloadIndicator.destroy();
        }
        
        // 从塔管理器中移除
        TowerManager.removeTower(this);
    }
}
