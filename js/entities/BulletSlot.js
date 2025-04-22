/**
 * 子弹槽类
 * 负责管理塔的子弹槽位
 */
class BulletSlot {
    constructor(tower, index) {
        // 基本属性
        this.id = Utils.generateId();
        this.tower = tower;      // 所属塔
        this.index = index;      // 槽位索引
        this.bulletType = null;  // 子弹类型
        this.bulletOptions = {}; // 子弹选项
        
        // 创建DOM元素
        this.element = document.createElement('div');
        this.element.className = 'bullet-slot';
        this.element.dataset.slotIndex = index;
        
        // 空槽位显示
        this.emptySlotElement = document.createElement('div');
        this.emptySlotElement.className = 'empty-slot';
        this.emptySlotElement.textContent = '+';
        this.element.appendChild(this.emptySlotElement);
        
        // 添加点击事件
        this.element.addEventListener('click', (event) => {
            event.stopPropagation();
            // 在塔菜单中显示子弹选择菜单
            if (UIManager.towerMenu) {
                UIManager.showBulletSelectionMenuIntegrated(this, UIManager.towerMenu);
            }
        });
    }
    
    /**
     * 设置子弹类型
     * @param {string} bulletType - 子弹类型ID
     * @param {Object} options - 子弹选项
     */
    setBulletType(bulletType, options = {}) {
        this.bulletType = bulletType;
        this.bulletOptions = options;
        
        // 更新槽位显示
        this.updateDisplay();
    }
    
    /**
     * 清空槽位
     */
    clear() {
        this.bulletType = null;
        this.bulletOptions = {};
        
        // 更新槽位显示
        this.updateDisplay();
    }
    
    /**
     * 更新槽位显示
     */
    updateDisplay() {
        // 清空现有内容
        this.element.innerHTML = '';
        
        if (this.bulletType) {
            // 显示子弹图标
            const bulletIcon = document.createElement('div');
            bulletIcon.className = `bullet-icon ${this.bulletType}`;
            
            // 根据子弹类型设置图标
            switch (this.bulletType) {
                case 'archer-projectile':
                    bulletIcon.textContent = '🏹';
                    break;
                case 'magic-projectile':
                    bulletIcon.textContent = '✨';
                    break;
                case 'cannon-projectile':
                    bulletIcon.textContent = '💣';
                    break;
                case 'fire-projectile':
                    bulletIcon.textContent = '🔥';
                    break;
                case 'ice-projectile':
                    bulletIcon.textContent = '❄️';
                    break;
                case 'poison-projectile':
                    bulletIcon.textContent = '☠️';
                    break;
                default:
                    bulletIcon.textContent = '•';
            }
            
            this.element.appendChild(bulletIcon);
            
            // 显示子弹属性
            if (this.bulletOptions.damage) {
                const damageLabel = document.createElement('div');
                damageLabel.className = 'bullet-stat damage';
                damageLabel.textContent = `${this.bulletOptions.damage}`;
                this.element.appendChild(damageLabel);
            }
            
            // 显示子弹冷却时间
            if (this.bulletOptions.cooldown) {
                const cooldownLabel = document.createElement('div');
                cooldownLabel.className = 'bullet-stat cooldown';
                cooldownLabel.textContent = `⭐${this.bulletOptions.cooldown.toFixed(1)}s`;
                this.element.appendChild(cooldownLabel);
            }
        } else {
            // 空槽位显示
            this.emptySlotElement = document.createElement('div');
            this.emptySlotElement.className = 'empty-slot';
            this.emptySlotElement.textContent = '+';
            this.element.appendChild(this.emptySlotElement);
        }
    }
    
    /**
     * 获取子弹创建选项
     * @returns {Object} 子弹创建选项
     */
    getBulletOptions() {
        return {
            ...this.bulletOptions,
            type: this.bulletType
        };
    }
    
    /**
     * 检查槽位是否为空
     * @returns {boolean} 是否为空
     */
    isEmpty() {
        return this.bulletType === null;
    }
}
