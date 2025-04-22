/**
 * 子弹槽管理器
 * 负责管理塔的子弹槽系统
 */
class BulletSlotManager {
    constructor(tower) {
        this.tower = tower;          // 所属塔
        this.slots = [];             // 子弹槽数组
        this.currentSlotIndex = 0;   // 当前发射的槽位索引
        this.container = null;       // 槽位容器元素
        
        // 创建槽位容器
        this.createContainer();
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
     * 显示/隐藏槽位容器
     * @param {boolean} visible - 是否可见
     */
    setVisible(visible) {
        this.container.style.display = visible ? 'flex' : 'none';
    }
    
    /**
     * 更新槽位容器位置
     */
    updatePosition() {
        this.updateContainerPosition();
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
     * 移除槽位容器
     */
    remove() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}
