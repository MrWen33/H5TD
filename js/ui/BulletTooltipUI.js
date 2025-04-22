/**
 * 子弹提示框UI接口
 * 为所有子弹类型提供统一的UI生成接口
 */
class BulletTooltipUI {
    /**
     * 根据子弹类型生成提示框内容
     * @param {HTMLElement} container - 提示框容器元素
     * @param {Object} bulletType - 子弹类型配置
     * @param {string} typeId - 子弹类型ID
     */
    static generateTooltip(container, bulletType, typeId) {
        // 清空容器
        container.innerHTML = '';
        
        // 创建标题
        this.createTitle(container, bulletType);
        
        // 创建基础属性
        const statsContainer = this.createStatsContainer(container);
        
        // 添加基础属性
        this.addBasicStats(statsContainer, bulletType, typeId);
        
        // 添加特殊属性 - 由子类实现
        this.addSpecialStats(statsContainer, bulletType, typeId);
        
        // 添加描述
        this.addDescription(container, bulletType);
    }
    
    /**
     * 创建提示框标题
     */
    static createTitle(container, bulletType) {
        const tooltipTitle = document.createElement('div');
        tooltipTitle.className = 'bullet-tooltip-title';
        
        const tooltipIcon = document.createElement('div');
        tooltipIcon.className = 'bullet-tooltip-icon';
        tooltipIcon.textContent = bulletType.icon || bulletType.emoji;
        tooltipTitle.appendChild(tooltipIcon);
        
        const tooltipName = document.createElement('div');
        tooltipName.className = 'bullet-tooltip-name';
        tooltipName.textContent = bulletType.name;
        tooltipTitle.appendChild(tooltipName);
        
        container.appendChild(tooltipTitle);
        return tooltipTitle;
    }
    
    /**
     * 创建属性容器
     */
    static createStatsContainer(container) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'bullet-tooltip-stats';
        container.appendChild(statsContainer);
        return statsContainer;
    }
    
    /**
     * 添加基础属性（伤害、冷却时间、成本）
     * @param {HTMLElement} container - 属性容器
     * @param {Object} bulletType - 子弹类型配置
     * @param {string} typeId - 子弹类型ID
     */
    static addBasicStats(container, bulletType, typeId) {
        // 添加伤害属性
        this.addStatItem(container, '伤害：', bulletType.damage, 'stat-damage');
        
        // 添加冷却时间属性
        const cooldown = bulletType.cooldown || (BulletConfig[typeId] ? BulletConfig[typeId].cooldown : '未知');
        this.addStatItem(container, '冷却时间：', `${cooldown}s`, 'stat-cooldown');
        
        // 添加成本属性
        this.addStatItem(container, '成本：', `${bulletType.cost}💰`, 'stat-cost');
    }
    
    /**
     * 添加特殊属性 - 由子类实现
     */
    static addSpecialStats(container, bulletType, typeId) {
        // 基类不实现特殊属性，由子类覆盖
    }
    
    /**
     * 添加描述
     */
    static addDescription(container, bulletType) {
        if (bulletType.description) {
            const descriptionElement = document.createElement('div');
            descriptionElement.className = 'bullet-tooltip-description';
            descriptionElement.textContent = bulletType.description;
            container.appendChild(descriptionElement);
        }
    }
    
    /**
     * 添加单个属性项
     */
    static addStatItem(container, label, value, valueClass = '') {
        const statElement = document.createElement('div');
        statElement.className = 'bullet-tooltip-stat';
        
        const statLabel = document.createElement('div');
        statLabel.className = 'bullet-tooltip-stat-label';
        statLabel.textContent = label;
        statElement.appendChild(statLabel);
        
        const statValue = document.createElement('div');
        statValue.className = `bullet-tooltip-stat-value ${valueClass}`;
        statValue.textContent = value;
        statElement.appendChild(statValue);
        
        container.appendChild(statElement);
        return statElement;
    }
}
