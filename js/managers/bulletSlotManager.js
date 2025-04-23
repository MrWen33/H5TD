/**
 * 子弹卡牌管理器
 * 负责管理塔的子弹卡牌系统，包括抽卡堆、弃牌堆和洗牌机制
 */
class BulletSlotManager {
    constructor(tower) {
        this.tower = tower;          // 所属塔
        this.slots = [];             // 子弹槽数组（用于设置卡牌）
        this.container = null;       // 槽位容器元素
        
        // 卡牌系统相关
        this.drawPile = [];          // 抽卡堆
        this.discardPile = [];       // 弃牌堆
        this.isShuffling = false;    // 是否正在洗牌
        this.shuffleTime = 0;        // 洗牌剩余时间
        
        // 创建槽位容器
        this.createContainer();
        
        // 创建卡牌指示器
        this.createCardIndicator();
    }
    
    /**
     * 创建槽位容器
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'bullet-slots-container';
        this.container.style.position = 'absolute';
        
        // 计算容器位置
        this.updateContainerPosition();
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(this.container);
    }
    
    /**
     * 初始化子弹槽
     * @param {number} slotCount - 槽位数量
     */
    initializeSlots(slotCount = 3) {
        // 清空现有槽位
        this.slots = [];
        this.container.innerHTML = '';
        
        // 创建新槽位
        for (let i = 0; i < slotCount; i++) {
            const slot = new BulletSlot(this.tower, i);
            this.slots.push(slot);
            this.container.appendChild(slot.element);
        }
        
        // 重置当前槽位索引
        this.currentSlotIndex = 0;
    }
    
    /**
     * 获取下一个要发射的子弹槽
     * @returns {BulletSlot|null} 子弹槽或null（如果没有可用槽位）
     */
    getNextSlot() {
        // 检查是否有任何槽位设置了子弹
        const hasAnyBullet = this.slots.some(slot => !slot.isEmpty());
        if (!hasAnyBullet) {
            return null;
        }
        
        // 查找下一个非空槽位
        let startIndex = this.currentSlotIndex;
        let slot = null;
        
        // 从当前索引开始循环查找
        for (let i = 0; i < this.slots.length; i++) {
            const index = (startIndex + i) % this.slots.length;
            if (!this.slots[index].isEmpty()) {
                slot = this.slots[index];
                this.currentSlotIndex = (index + 1) % this.slots.length;
                break;
            }
        }
        
        return slot;
    }
    


    /**
     * 获取最后一个非空的子弹槽
     * @returns {BulletSlot|null} 最后一个非空的子弹槽，如果没有非空槽位则返回null
     */
    getLastNonEmptySlot() {
        // 如果没有槽位，返回null
        if (this.slots.length === 0) {
            return null;
        }
        
        // 从后向前遍历槽位，找到第一个非空的槽位
        for (let i = this.slots.length - 1; i >= 0; i--) {
            if (!this.slots[i].isEmpty()) {
                return this.slots[i];
            }
        }
        
        // 如果所有槽位都是空的，返回null
        return null;
    }
    

    
    /**
     * 获取指定索引的槽位
     * @param {number} index - 槽位索引
     * @returns {BulletSlot|null} 子弹槽或null
     */
    getSlot(index) {
        if (index >= 0 && index < this.slots.length) {
            return this.slots[index];
        }
        return null;
    }
    
    /**
     * 获取所有槽位
     * @returns {Array<BulletSlot>} 槽位数组
     */
    getAllSlots() {
        return this.slots;
    }
    
    /**
     * 显示/隐藏槽位容器和卡牌指示器
     * @param {boolean} visible - 是否可见
     */
    setVisible(visible) {
        this.container.style.display = visible ? 'flex' : 'none';
        if (visible) {
            this.showCardIndicator();
        } else {
            this.hideCardIndicator();
        }
    }
    
    /**
     * 更新槽位容器和卡牌指示器位置
     */
    updatePosition() {
        this.updateContainerPosition();
        this.updateCardIndicatorPosition();
    }
    
    /**
     * 计算并更新容器位置
     */
    updateContainerPosition() {
        const mapHeight = Config.map.height * Config.map.cellSize;
        const towerY = this.tower.y * Config.map.cellSize;
        
        // 判断塔是否在地图的下半部分
        if (towerY > mapHeight * 0.7) {
            // 塔在地图下方，槽位显示在塔的上方
            this.container.style.left = `${this.tower.position.x}px`;
            this.container.style.top = `${this.tower.position.y - 40}px`;
            this.container.dataset.position = 'above';
        } else {
            // 塔在地图上方或中间，槽位显示在塔的下方
            this.container.style.left = `${this.tower.position.x}px`;
            this.container.style.top = `${this.tower.position.y + 30}px`;
            this.container.dataset.position = 'below';
        }
        
        this.container.style.transform = 'translate(-50%, 0)';
    }
    
    /**
     * 移除槽位容器和卡牌指示器
     */
    remove() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        if (this.cardIndicator && this.cardIndicator.parentNode) {
            this.cardIndicator.parentNode.removeChild(this.cardIndicator);
        }
    }
    
    /**
     * 编译子弹槽为卡牌系统
     * 将所有非空子弹槽编译成卡牌，并放入抽卡堆
     * @returns {Array} 抽卡堆
     */
    compileBulletSlots() {
        // 清空抽卡堆和弃牌堆
        this.drawPile = [];
        this.discardPile = [];
        
        // 检查是否有任何槽位设置了子弹
        const hasAnyBullet = this.slots.some(slot => !slot.isEmpty());
        if (!hasAnyBullet) {
            return this.drawPile;
        }
        
        // 遍历所有非空槽位，将其添加到抽卡堆
        for (let i = 0; i < this.slots.length; i++) {
            if (!this.slots[i].isEmpty()) {
                this.drawPile.push({
                    ...this.slots[i].getBulletOptions(),
                    slotIndex: i // 记录原始槽位索引，用于显示效果
                });
            }
        }
        
        console.log(`编译完成，抽卡堆大小: ${this.drawPile.length}`);
        this.updateCardIndicator();
        return this.drawPile;
    }
    
    /**
     * 获取抽卡堆大小
     * @returns {number} 抽卡堆大小
     */
    getDrawPileSize() {
        return this.drawPile.length;
    }
    
    /**
     * 获取弃牌堆大小
     * @returns {number} 弃牌堆大小
     */
    getDiscardPileSize() {
        return this.discardPile.length;
    }
    
    /**
     * 从抽卡堆中抽一张卡
     * 如果抽卡堆为空，则触发洗牌
     * @returns {Object|null} 抽到的卡牌或null（如果正在洗牌）
     */
    drawCard() {
        // 如果正在洗牌，返回null
        if (this.isShuffling) {
            console.log('正在洗牌，无法抽卡');
            return null;
        }
        
        // 如果抽卡堆为空，检查弃牌堆
        if (this.drawPile.length === 0) {
            // 如果弃牌堆也为空，返回null
            if (this.discardPile.length === 0) {
                console.log('抽卡堆和弃牌堆都为空，无法抽卡');
                return null;
            }
            
            // 开始洗牌（即使开始洗牌，塔的攻击冷却仍会继续计算）
            this.startShuffling();
            console.log('开始洗牌，但塔的攻击冷却仍会继续计算');
            return null;
        }
        
        // 从抽卡堆顶部抽一张卡
        const card = this.drawPile.shift();
        console.log(`抽到卡牌: ${card.type}，剩余抽卡堆大小: ${this.drawPile.length}`);
        
        // 检查是否抽取了最后一张卡牌，如果是且弃牌堆不为空，则预先开始洗牌
        // 这样可以让洗牌冷却和射击冷却同时计算
        if (this.drawPile.length === 0 && this.discardPile.length > 0) {
            console.log('抽取了最后一张卡牌，预先开始洗牌');
            this.startShuffling();
        }
        
        // 更新卡牌指示器
        this.updateCardIndicator();
        
        return card;
    }
    
    /**
     * 将卡牌放入弃牌堆
     * @param {Object} card - 使用过的卡牌
     */
    discardCard(card) {
        if (!card) return;
        
        this.discardPile.push(card);
        console.log(`卡牌放入弃牌堆: ${card.type}，弃牌堆大小: ${this.discardPile.length}`);
        
        // 更新卡牌指示器
        this.updateCardIndicator();
    }
    
    /**
     * 开始洗牌
     * 将弃牌堆中的卡牌按照原始顺序放回抽卡堆
     */
    startShuffling() {
        if (this.discardPile.length === 0) return;
        
        console.log('开始洗牌...');
        this.isShuffling = true;
        this.shuffleTime = this.tower.reloadTime; // 使用塔的装填时间作为洗牌时间
        
        // 显示洗牌动画
        // 使用新的 ReloadIndicator 类的方法
        if (this.tower.reloadIndicator) {
            this.tower.reloadIndicator.show();
        }
    }
    
    /**
     * 更新洗牌状态
     * @param {number} deltaTime - 时间增量（秒）
     */
    updateShuffling(deltaTime) {
        if (!this.isShuffling) return;
        
        this.shuffleTime -= deltaTime;
        
        // 如果洗牌完成
        if (this.shuffleTime <= 0) {
            this.finishShuffling();
        }
    }
    
    /**
     * 完成洗牌
     * 将弃牌堆中的卡牌按照原始顺序放回抽卡堆
     */
    finishShuffling() {
        console.log('完成洗牌');
        this.isShuffling = false;
        this.shuffleTime = 0;
        
        // 按照原始槽位索引排序，保持原始顺序
        this.discardPile.sort((a, b) => a.slotIndex - b.slotIndex);
        
        // 将弃牌堆中的卡牌放回抽卡堆
        this.drawPile = [...this.discardPile];
        this.discardPile = [];
        
        console.log(`洗牌完成，抽卡堆大小: ${this.drawPile.length}`);
        
        // 隐藏洗牌动画
        // 使用新的 ReloadIndicator 类的方法
        if (this.tower.reloadIndicator) {
            this.tower.reloadIndicator.hide();
        }
        
        // 更新卡牌指示器
        this.updateCardIndicator();
    }
    
    /**
     * 创建卡牌指示器
     * 显示抽卡堆和弃牌堆的状态
     */
    createCardIndicator() {
        // 创建卡牌指示器容器
        this.cardIndicator = document.createElement('div');
        this.cardIndicator.className = 'card-indicator';
        this.cardIndicator.style.position = 'absolute';
        this.cardIndicator.style.display = 'flex';
        this.cardIndicator.style.justifyContent = 'center';
        this.cardIndicator.style.alignItems = 'center';
        this.cardIndicator.style.fontSize = '12px';
        this.cardIndicator.style.color = '#fff';
        this.cardIndicator.style.zIndex = '5';
        
        // 抽卡堆指示器
        this.drawPileIndicator = document.createElement('div');
        this.drawPileIndicator.className = 'draw-pile-indicator';
        this.drawPileIndicator.style.backgroundColor = 'rgba(0, 100, 0, 0.7)';
        this.drawPileIndicator.style.padding = '2px 5px';
        this.drawPileIndicator.style.borderRadius = '3px';
        this.drawPileIndicator.style.marginRight = '5px';
        this.drawPileIndicator.textContent = '抽卡堆: 0';
        
        // 弃牌堆指示器
        this.discardPileIndicator = document.createElement('div');
        this.discardPileIndicator.className = 'discard-pile-indicator';
        this.discardPileIndicator.style.backgroundColor = 'rgba(100, 0, 0, 0.7)';
        this.discardPileIndicator.style.padding = '2px 5px';
        this.discardPileIndicator.style.borderRadius = '3px';
        this.discardPileIndicator.textContent = '弃牌堆: 0';
        
        // 添加到卡牌指示器容器
        this.cardIndicator.appendChild(this.drawPileIndicator);
        this.cardIndicator.appendChild(this.discardPileIndicator);
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(this.cardIndicator);
        
        // 更新指示器位置
        this.updateCardIndicatorPosition();
        
        // 默认隐藏
        this.hideCardIndicator();
    }
    
    /**
     * 更新卡牌指示器
     */
    updateCardIndicator() {
        if (!this.drawPileIndicator || !this.discardPileIndicator) return;
        
        this.drawPileIndicator.textContent = `抽卡堆: ${this.drawPile.length}`;
        this.discardPileIndicator.textContent = `弃牌堆: ${this.discardPile.length}`;
    }
    
    /**
     * 更新卡牌指示器位置
     */
    updateCardIndicatorPosition() {
        if (!this.cardIndicator) return;
        
        // 将指示器放在塔的下方
        this.cardIndicator.style.left = `${this.tower.position.x}px`;
        this.cardIndicator.style.top = `${this.tower.position.y + 40}px`;
        this.cardIndicator.style.transform = 'translate(-50%, 0)';
    }
    
    /**
     * 显示卡牌指示器
     */
    showCardIndicator() {
        if (this.cardIndicator) {
            this.cardIndicator.style.display = 'flex';
        }
    }
    
    /**
     * 隐藏卡牌指示器
     */
    hideCardIndicator() {
        if (this.cardIndicator) {
            this.cardIndicator.style.display = 'none';
        }
    }
}
