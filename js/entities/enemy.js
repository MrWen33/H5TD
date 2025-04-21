/**
 * 敌人类
 * 负责敌人的创建和行为
 */

class Enemy {
    constructor(type, pathIndex = 0) {
        // 敌人类型
        this.type = type;
        
        // 敌人属性
        this.id = Utils.generateId();
        this.emoji = type.emoji;
        this.name = type.name;
        this.maxHealth = type.health;
        this.health = type.health;
        this.speed = type.speed;
        this.damage = type.damage;
        this.reward = type.reward;
        this.scale = type.scale || 1.0;
        this.isBoss = type.boss || false;
        
        // 路径相关 - 总是从起点开始
        this.pathIndex = 0;
        this.progress = 0; // 当前路径点到下一个路径点的进度 (0-1)
        
        // 获取起点位置
        const startPoint = MapManager.getPathPoint(0);
        if (!startPoint) {
            console.error('无法获取敌人起点位置');
            return;
        }
        
        // 设置初始位置
        this.position = { 
            x: startPoint.x, 
            y: startPoint.y 
        };
        
        // 状态
        this.isDead = false;
        this.reachedEnd = false;
        this.isSlowed = false;
        this.slowFactor = 1.0;
        this.slowDuration = 0;
        
        // 创建DOM元素
        this.element = document.createElement('div');
        this.element.className = 'enemy';
        this.element.style.fontSize = `${1.5 * this.scale}rem`;
        this.element.textContent = this.emoji;
        
        // 预先设置位置，避免闪烁
        const cellCenter = Config.map.cellSize / 2;
        this.element.style.position = 'absolute';
        this.element.style.left = `${this.position.x * Config.map.cellSize + cellCenter}px`;
        this.element.style.top = `${this.position.y * Config.map.cellSize + cellCenter}px`;
        this.element.style.transform = 'translate(-50%, -50%)';
        
        // 创建生命条
        this.healthBar = document.createElement('div');
        this.healthBar.className = 'health-bar';
        
        this.healthBarFill = document.createElement('div');
        this.healthBarFill.className = 'health-bar-fill';
        
        this.healthBar.appendChild(this.healthBarFill);
        this.element.appendChild(this.healthBar);
        
        // 如果是Boss，添加特殊样式
        if (this.isBoss) {
            this.element.classList.add('boss');
            this.element.style.filter = 'drop-shadow(0 0 5px red)';
        }
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(this.element);
        
        console.log(`创建敌人 ${this.name} 在位置 (${this.position.x}, ${this.position.y})`);
    }
    
    // 更新元素位置
    updateElementPosition() {
        // 使用中心定位方式更新DOM元素位置
        const cellCenter = Config.map.cellSize / 2;
        
        this.element.style.left = `${this.position.x * Config.map.cellSize + cellCenter}px`;
        this.element.style.top = `${this.position.y * Config.map.cellSize + cellCenter}px`;
    }
    
    // 更新敌人
    update(deltaTime) {
        // 如果敌人已死亡或到达终点，不更新
        if (this.isDead || this.reachedEnd) {
            return;
        }
        
        // 处理减速效果
        if (this.isSlowed) {
            this.slowDuration -= deltaTime;
            if (this.slowDuration <= 0) {
                this.isSlowed = false;
                this.slowFactor = 1.0;
                this.element.style.filter = this.isBoss ? 'drop-shadow(0 0 5px red)' : '';
            }
        }
        
        // 计算实际速度
        const actualSpeed = this.speed * this.slowFactor;
        
        // 获取当前路径点和下一个路径点
        const currentPoint = MapManager.getPathPoint(this.pathIndex);
        const nextPoint = MapManager.getPathPoint(this.pathIndex + 1);
        
        if (!currentPoint || !nextPoint) {
            console.error(`无法获取路径点: 当前=${this.pathIndex}, 下一个=${this.pathIndex + 1}`);
            this.reachEnd();
            return;
        }
        
        // 计算当前路径段的长度
        const dx = nextPoint.x - currentPoint.x;
        const dy = nextPoint.y - currentPoint.y;
        const segmentLength = Math.sqrt(dx * dx + dy * dy);
        
        if (segmentLength === 0) {
            // 如果路径段长度为0，直接移动到下一个路径点
            this.pathIndex++;
            
            // 如果到达终点
            if (this.pathIndex >= MapManager.getPathLength() - 1) {
                this.reachEnd();
            }
            return;
        }
        
        // 计算在当前路径段上移动的距离
        const moveDistance = actualSpeed * deltaTime;
        
        // 更新进度
        this.progress += moveDistance / segmentLength;
        
        // 如果到达或超过下一个路径点
        if (this.progress >= 1) {
            // 计算超出部分
            const overflow = (this.progress - 1) * segmentLength;
            
            // 移动到下一个路径点
            this.pathIndex++;
            this.progress = 0;
            
            // 如果到达终点
            if (this.pathIndex >= MapManager.getPathLength() - 1) {
                this.reachEnd();
                return;
            }
            
            // 获取新的当前点和下一个点
            const newCurrentPoint = MapManager.getPathPoint(this.pathIndex);
            const newNextPoint = MapManager.getPathPoint(this.pathIndex + 1);
            
            if (newCurrentPoint && newNextPoint) {
                // 计算新路径段的长度
                const newDx = newNextPoint.x - newCurrentPoint.x;
                const newDy = newNextPoint.y - newCurrentPoint.y;
                const newSegmentLength = Math.sqrt(newDx * newDx + newDy * newDy);
                
                // 将超出部分应用到新的路径段
                if (newSegmentLength > 0) {
                    this.progress = overflow / newSegmentLength;
                }
            }
        }
        
        // 在当前路径点和下一个路径点之间插值
        const currentPathPoint = MapManager.getPathPoint(this.pathIndex);
        const nextPathPoint = MapManager.getPathPoint(this.pathIndex + 1);
        
        if (currentPathPoint && nextPathPoint) {
            // 线性插值计算当前位置
            this.position.x = currentPathPoint.x + (nextPathPoint.x - currentPathPoint.x) * this.progress;
            this.position.y = currentPathPoint.y + (nextPathPoint.y - currentPathPoint.y) * this.progress;
            
            // 更新DOM元素位置
            this.updateElementPosition();
        }
    }
    
    // 更新位置
    updatePosition() {
        const point = MapManager.getPathPoint(this.pathIndex);
        if (point) {
            this.position.x = point.x;
            this.position.y = point.y;
            
            // 使用统一的元素位置更新方法
            this.updateElementPosition();
        }
    }
    
    // 受到伤害
    takeDamage(damage) {
        // 如果敌人已死亡，不处理
        if (this.isDead) {
            return;
        }
        
        // 减少生命值
        this.health -= damage;
        
        // 更新生命条
        this.updateHealthBar();
        
        // 显示伤害数字
        this.showDamageText(damage);
        
        // 添加受击动画
        this.element.classList.add('hit');
        setTimeout(() => {
            this.element.classList.remove('hit');
        }, 300);
        
        // 检查是否死亡
        if (this.health <= 0) {
            this.die();
        }
    }
    
    // 更新生命条
    updateHealthBar() {
        const healthPercent = Math.max(0, this.health / this.maxHealth * 100);
        this.healthBarFill.style.width = `${healthPercent}%`;
        
        // 根据生命值百分比改变颜色
        if (healthPercent > 60) {
            this.healthBarFill.style.backgroundColor = '#4CAF50'; // 绿色
        } else if (healthPercent > 30) {
            this.healthBarFill.style.backgroundColor = '#FFC107'; // 黄色
        } else {
            this.healthBarFill.style.backgroundColor = '#F44336'; // 红色
        }
    }
    
    // 显示伤害数字
    showDamageText(damage) {
        const damageText = document.createElement('div');
        damageText.className = 'damage-text';
        damageText.textContent = `-${damage}`;
        
        // 使用中心定位
        const cellCenter = Config.map.cellSize / 2;
        damageText.style.position = 'absolute';
        damageText.style.left = `${this.position.x * Config.map.cellSize + cellCenter + (Math.random() * 20 - 10)}px`;
        damageText.style.top = `${this.position.y * Config.map.cellSize + cellCenter - 20}px`;
        damageText.style.transform = 'translate(-50%, -50%)';
        
        document.getElementById('game-map').appendChild(damageText);
        
        // 一秒后移除
        setTimeout(() => {
            if (damageText.parentNode) {
                damageText.parentNode.removeChild(damageText);
            }
        }, 1000);
    }
    
    // 减速敌人
    slow(factor, duration) {
        this.isSlowed = true;
        this.slowFactor = factor;
        this.slowDuration = duration;
        
        // 添加视觉效果
        this.element.style.filter = 'brightness(0.7) sepia(1) hue-rotate(180deg)';
    }
    
    // 死亡
    die() {
        this.isDead = true;
        
        // 添加死亡动画
        this.element.style.transform = 'translate(-50%, -50%) scale(0)';
        this.element.style.opacity = '0';
        this.element.style.transition = 'all 0.5s ease-in-out';
        
        // 显示金币奖励
        this.showRewardText();
        
        // 增加金钱
        Game.state.money += this.reward;
        
        // 增加击杀敌人计数和得分
        Game.addEnemyKilled();
        
        // 一秒后移除
        setTimeout(() => {
            this.remove();
        }, 1000);
    }
    
    // 显示奖励文本
    showRewardText() {
        const rewardText = document.createElement('div');
        rewardText.className = 'coin';
        rewardText.textContent = `+${this.reward}💰`;
        rewardText.style.left = `${this.position.x * Config.map.cellSize + Math.random() * 20}px`;
        rewardText.style.top = `${this.position.y * Config.map.cellSize}px`;
        
        document.getElementById('game-map').appendChild(rewardText);
        
        // 一秒后移除
        setTimeout(() => {
            if (rewardText.parentNode) {
                rewardText.parentNode.removeChild(rewardText);
            }
        }, 1000);
    }
    
    // 到达终点
    reachEnd() {
        this.reachedEnd = true;
        
        // 减少生命值
        Game.state.lives -= this.damage;
        
        // 检查游戏是否结束
        if (Game.state.lives <= 0) {
            Game.gameOver();
        }
        
        // 移除DOM元素
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
    
    // 移除敌人
    remove() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
