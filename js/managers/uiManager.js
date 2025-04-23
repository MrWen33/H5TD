/**
 * UI管理器
 * 负责游戏界面的更新和交互
 */

const UIManager = {
    // DOM元素引用
    elements: {
        moneyDisplay: null,
        livesDisplay: null,
        waveDisplay: null,
        startWaveButton: null,
        speedToggleButton: null,
        gameOverModal: null,
        levelCompleteModal: null,
        finalWaveDisplay: null,
        restartGameButton: null,
        restartGameWinButton: null
    },
    
    // 消息计时器
    messageTimer: null,
    
    // 初始化
    init() {
        // 获取DOM元素引用
        this.elements = {
            moneyDisplay: document.getElementById('money'),
            livesDisplay: document.getElementById('lives'),
            waveDisplay: document.getElementById('wave'),
            startWaveButton: document.getElementById('start-wave'),
            speedToggleButton: document.getElementById('speed-toggle'),
            gameOverModal: document.getElementById('game-over-modal'),
            levelCompleteModal: document.getElementById('level-complete-modal'),
            finalWaveDisplay: document.getElementById('final-wave'),
            restartGameButton: document.getElementById('restart-game'),
            restartGameWinButton: document.getElementById('restart-game-win')
        };
        
        // 添加事件监听器
        this.addEventListeners();
        
        // 初始化塔选项价格
        this.initTowerOptions();
        
        // 初始化UI
        this.updateResourceDisplay();
        this.updateWaveDisplay();
    },
    
    // 添加事件监听器
    addEventListeners() {
        // 游戏速度切换按钮
        this.elements.speedToggleButton.addEventListener('click', () => {
            this.toggleGameSpeed();
        });
        
        // 重新开始游戏按钮（游戏结束）
        this.elements.restartGameButton.addEventListener('click', () => {
            this.hideGameOverModal();
            Game.reset();
        });
        
        // 重新开始游戏按钮（游戏胜利）
        this.elements.restartGameWinButton.addEventListener('click', () => {
            this.hideLevelCompleteModal();
            Game.reset();
        });
    },
    
    // 更新资源显示
    updateResourceDisplay() {
        this.elements.moneyDisplay.textContent = Game.state.money;
        this.elements.livesDisplay.textContent = Game.state.lives;
    },
    
    // 更新波次显示
    updateWaveDisplay() {
        this.elements.waveDisplay.textContent = Game.state.wave;
        
        // 如果波次进行中，禁用开始波次按钮
        this.elements.startWaveButton.disabled = Game.state.waveInProgress;
    },
    
    // 切换游戏速度
    toggleGameSpeed() {
        // 获取游戏速度级别数组
        const speedLevels = Config.game.speedLevels;
        
        // 获取当前速度在数组中的索引
        const currentIndex = speedLevels.indexOf(Game.state.gameSpeed);
        
        // 计算下一个速度级别
        const nextIndex = (currentIndex + 1) % speedLevels.length;
        const nextSpeed = speedLevels[nextIndex];
        
        // 设置新的游戏速度
        Game.state.gameSpeed = nextSpeed;
        
        // 更新按钮文本
        if (nextSpeed === 1) {
            this.elements.speedToggleButton.textContent = '加速';
        } else {
            this.elements.speedToggleButton.textContent = `${nextSpeed}x 速度`;
        }
        
        // 显示速度变化消息
        this.showMessage(`游戏速度: ${nextSpeed}x`, 1000);
    },
    
    // 显示游戏结束模态框
    showGameOverModal() {
        // 设置最终波次
        this.elements.finalWaveDisplay.textContent = Game.state.wave;
        
        // 显示模态框
        this.elements.gameOverModal.classList.add('show');
    },
    
    // 隐藏游戏结束模态框
    hideGameOverModal() {
        this.elements.gameOverModal.classList.remove('show');
    },
    
    // 显示关卡完成模态框
    showLevelCompleteModal() {
        this.elements.levelCompleteModal.classList.add('show');
    },
    
    // 隐藏关卡完成模态框
    hideLevelCompleteModal() {
        this.elements.levelCompleteModal.classList.remove('show');
    },
    
    // 显示消息
    showMessage(message, duration = 2000) {
        // 如果已有消息，先清除
        if (this.messageTimer) {
            clearTimeout(this.messageTimer);
            this.hideMessage();
        }
        
        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        
        // 添加到游戏容器
        document.querySelector('.game-container').appendChild(messageElement);
        
        // 设置定时器，自动隐藏消息
        this.messageTimer = setTimeout(() => {
            this.hideMessage();
        }, duration);
    },
    
    // 隐藏消息
    hideMessage() {
        const messageElement = document.querySelector('.game-message');
        if (messageElement) {
            messageElement.parentNode.removeChild(messageElement);
        }
        this.messageTimer = null;
    },
    
    // 显示塔升级菜单
    showTowerUpgradeMenu(tower) {
        // 移除旧的升级菜单
        this.hideTowerUpgradeMenu();
        
        // 创建升级菜单容器
        const menuContainer = document.createElement('div');
        menuContainer.className = 'tower-upgrade-menu';
        
        // 计算菜单的水平位置
        const menuLeft = tower.x * Config.map.cellSize;
        menuContainer.style.left = `${menuLeft}px`;
        
        // 智能计算菜单的垂直位置
        // 如果塔在画面上方，将菜单显示在塔的下方
        const towerY = tower.y * Config.map.cellSize;
        const mapHeight = Config.map.height * Config.map.cellSize;
        
        // 判断塔是否在地图的上半部分
        if (towerY < mapHeight / 3) {
            // 塔在上方，菜单显示在塔的下方
            menuContainer.style.top = `${towerY + Config.map.cellSize + 10}px`;
            menuContainer.classList.add('menu-below');
        } else {
            // 塔在中间或下方，菜单显示在塔的上方
            menuContainer.style.top = `${towerY - 80}px`;
            menuContainer.classList.remove('menu-below');
        }
        
        // 创建塔信息
        const towerInfo = document.createElement('div');
        towerInfo.className = 'tower-info';
        
        // 创建塔名称
        const towerName = document.createElement('div');
        towerName.className = 'tower-name';
        towerName.textContent = `${tower.name} Lv.${tower.upgradeLevel}`;
        towerInfo.appendChild(towerName);
        
        // 创建塔属性容器
        const towerStats = document.createElement('div');
        towerStats.className = 'tower-stats';
        
        // 检查是否有可用的升级
        const hasUpgrade = tower.upgradeLevel < tower.upgrades.length;
        const nextUpgrade = hasUpgrade ? tower.upgrades[tower.upgradeLevel] : null;
        
        // 添加各个属性，并显示升级后的变化
        const damageDiv = document.createElement('div');
        damageDiv.className = 'stat-item';
        if (hasUpgrade && nextUpgrade.damage !== tower.damage) {
            damageDiv.innerHTML = `伤害: <span class="current-stat">${tower.damage}</span> <span class="stat-arrow">→</span> <span class="upgraded-stat">${nextUpgrade.damage}</span>`;
        } else {
            damageDiv.textContent = `伤害: ${tower.damage}`;
        }
        towerStats.appendChild(damageDiv);
        
        const rangeDiv = document.createElement('div');
        rangeDiv.className = 'stat-item';
        if (hasUpgrade && nextUpgrade.range !== tower.range) {
            rangeDiv.innerHTML = `范围: <span class="current-stat">${tower.range}</span> <span class="stat-arrow">→</span> <span class="upgraded-stat">${nextUpgrade.range}</span>`;
        } else {
            rangeDiv.textContent = `范围: ${tower.range}`;
        }
        towerStats.appendChild(rangeDiv);
        
        const speedDiv = document.createElement('div');
        speedDiv.className = 'stat-item';
        if (hasUpgrade && nextUpgrade.attackSpeed !== tower.attackSpeed) {
            speedDiv.innerHTML = `攻速: <span class="current-stat">${tower.attackSpeed.toFixed(1)}</span> <span class="stat-arrow">→</span> <span class="upgraded-stat">${nextUpgrade.attackSpeed.toFixed(1)}</span>`;
        } else {
            speedDiv.textContent = `攻速: ${tower.attackSpeed.toFixed(1)}`;
        }
        towerStats.appendChild(speedDiv);
        
        if (tower.splashRadius || (hasUpgrade && nextUpgrade.splashRadius)) {
            const splashDiv = document.createElement('div');
            splashDiv.className = 'stat-item';
            if (hasUpgrade && nextUpgrade.splashRadius && nextUpgrade.splashRadius !== tower.splashRadius) {
                splashDiv.innerHTML = `泼射: <span class="current-stat">${tower.splashRadius || 0}</span> <span class="stat-arrow">→</span> <span class="upgraded-stat">${nextUpgrade.splashRadius}</span>`;
            } else {
                splashDiv.textContent = `泼射: ${tower.splashRadius || 0}`;
            }
            towerStats.appendChild(splashDiv);
        }
        
        towerInfo.appendChild(towerStats);
        menuContainer.appendChild(towerInfo);
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'tower-buttons';
        
        // 创建左右两个按钮区域，确保出售按钮始终在右侧
        const leftButtonArea = document.createElement('div');
        leftButtonArea.className = 'button-area left-area';
        
        const rightButtonArea = document.createElement('div');
        rightButtonArea.className = 'button-area right-area';
        
        buttonContainer.appendChild(leftButtonArea);
        buttonContainer.appendChild(rightButtonArea);
        
        // 创建升级按钮，始终放在左侧区域
        if (tower.upgradeLevel < tower.upgrades.length) {
            const upgrade = tower.upgrades[tower.upgradeLevel];
            const upgradeButton = document.createElement('button');
            upgradeButton.className = 'upgrade-button';
            upgradeButton.textContent = `升级 (${upgrade.cost}💰)`;
            
            // 如果金钱不足，禁用按钮
            if (Game.state.money < upgrade.cost) {
                upgradeButton.disabled = true;
            }
            
            // 添加点击事件
            upgradeButton.addEventListener('click', () => {
                if (tower.upgrade()) {
                    // 更新资源显示
                    this.updateResourceDisplay();
                    
                    // 更新升级菜单
                    this.showTowerUpgradeMenu(tower);
                }
            });
            
            leftButtonArea.appendChild(upgradeButton);
        } else {
            // 即使没有升级按钮，也添加一个占位元素，保持布局一致
            const placeholderDiv = document.createElement('div');
            placeholderDiv.className = 'button-placeholder';
            placeholderDiv.textContent = `最高级`;
            leftButtonArea.appendChild(placeholderDiv);
        }
        
        // 创建出售按钮，始终放在右侧区域
        const sellButton = document.createElement('button');
        sellButton.className = 'sell-button';
        sellButton.textContent = `出售 (${Math.floor(tower.totalInvestment * Config.sellPriceFactor)}💰)`;
        
        // 添加点击事件
        sellButton.addEventListener('click', () => {
            const sellPrice = tower.sell();
            
            // 更新资源显示
            this.updateResourceDisplay();
            
            // 隐藏升级菜单
            this.hideTowerUpgradeMenu();
            
            // 显示出售消息
            this.showMessage(`塔已出售，获得 ${sellPrice}💰`);
        });
        
        rightButtonArea.appendChild(sellButton);
        menuContainer.appendChild(buttonContainer);
        
        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            this.hideTowerUpgradeMenu();
            TowerManager.hideAllRanges();
        });
        menuContainer.appendChild(closeButton);
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(menuContainer);
        
        // 保存引用
        this.towerUpgradeMenu = menuContainer;
    },
    
    // 隐藏塔升级菜单
    hideTowerUpgradeMenu() {
        if (this.towerUpgradeMenu && this.towerUpgradeMenu.parentNode) {
            this.towerUpgradeMenu.parentNode.removeChild(this.towerUpgradeMenu);
            this.towerUpgradeMenu = null;
        }
    },
    
    // 显示塔菜单
    showTowerMenu(tower) {
        // 隐藏所有已有的菜单
        this.hideAllMenus();
        
        // 创建塔菜单容器
        const menuContainer = document.createElement('div');
        menuContainer.className = 'tower-menu integrated';
        
        // 获取游戏地图尺寸
        const gameMap = document.getElementById('game-map');
        const mapRect = gameMap.getBoundingClientRect();
        
        // 先创建一个临时容器来计算菜单尺寸
        const tempContainer = document.createElement('div');
        tempContainer.className = 'tower-menu integrated';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '0';
        tempContainer.style.top = '0';
        
        // 复制菜单内容到临时容器
        tempContainer.innerHTML = menuContainer.innerHTML;
        
        // 添加到DOM以计算尺寸
        document.body.appendChild(tempContainer);
        const menuWidth = tempContainer.offsetWidth;
        const menuHeight = tempContainer.offsetHeight;
        document.body.removeChild(tempContainer);
        
        // 计算初始位置
        let menuLeft = tower.position.x;
        let menuTop = tower.position.y - 150; // 默认显示在塔的上方
        let menuPosition = 'above';
        
        // 计算菜单在地图中的绝对位置
        // 考虑transform: translate(-50%, 0)的影响
        const halfMenuWidth = menuWidth / 2;
        
        // 检查并调整水平位置
        if (menuLeft - halfMenuWidth < 0) {
            // 如果超出左边界
            menuLeft = halfMenuWidth + 10;
        } else if (menuLeft + halfMenuWidth > mapRect.width) {
            // 如果超出右边界
            menuLeft = mapRect.width - halfMenuWidth - 10;
        }
        
        // 检查并调整垂直位置
        if (menuTop < 0) {
            // 如果超出上边界，将菜单放在塔的下方
            menuTop = tower.position.y + 50;
            menuPosition = 'below';
            
            // 再次检查是否超出下边界
            if (menuTop + menuHeight > mapRect.height) {
                // 如果上下都不够空间，将菜单尽可能靠近塔但不超出地图
                menuTop = mapRect.height - menuHeight - 10;
            }
        } else if (menuTop + menuHeight > mapRect.height) {
            // 如果超出下边界
            menuTop = mapRect.height - menuHeight - 10;
        }
        
        menuContainer.style.left = `${menuLeft}px`;
        menuContainer.style.top = `${menuTop}px`;
        menuContainer.style.transform = 'translate(-50%, 0)';
        menuContainer.dataset.position = menuPosition;
        
        // 创建菜单标题
        const menuTitle = document.createElement('div');
        menuTitle.className = 'tower-menu-title';
        menuTitle.textContent = tower.name;
        menuContainer.appendChild(menuTitle);
        
        // 创建塔属性区域
        const statsContainer = document.createElement('div');
        statsContainer.className = 'tower-menu-stats';
        
        // 添加属性
        const rangeDiv = document.createElement('div');
        rangeDiv.className = 'tower-menu-stat';
        rangeDiv.innerHTML = `<span>范围:</span> <span>${tower.range}</span>`;
        statsContainer.appendChild(rangeDiv);
        
        const speedDiv = document.createElement('div');
        speedDiv.className = 'tower-menu-stat';
        speedDiv.innerHTML = `<span>攻速:</span> <span>${tower.attackSpeed.toFixed(1)}</span>`;
        statsContainer.appendChild(speedDiv);
        
        menuContainer.appendChild(statsContainer);
        
        // 创建子弹编辑区域
        const bulletEditSection = document.createElement('div');
        bulletEditSection.className = 'bullet-edit-section';
        
        // 创建子弹编辑标题
        const bulletEditTitle = document.createElement('div');
        bulletEditTitle.className = 'bullet-edit-title';
        bulletEditTitle.textContent = '子弹槽位';
        bulletEditSection.appendChild(bulletEditTitle);
        
        // 创建子弹槽容器
        const bulletSlotsContainer = document.createElement('div');
        bulletSlotsContainer.className = 'bullet-slots-container-ui';
        
        // 获取塔的子弹槽
        const slots = tower.bulletSlotManager.getAllSlots();
        
        // 添加每个子弹槽
        for (const slot of slots) {
            // 创建新的槽位元素（而不是使用原始的）
            const slotElement = document.createElement('div');
            slotElement.className = 'bullet-slot-ui';
            slotElement.dataset.slotIndex = slot.index;
            
            // 如果槽位有子弹，显示子弹信息
            if (!slot.isEmpty()) {
                const bulletType = BulletManager.getBulletType(slot.bulletType);
                if (bulletType) {
                    // 子弹图标
                    const bulletIcon = document.createElement('div');
                    bulletIcon.className = 'bullet-icon';
                    bulletIcon.textContent = bulletType.icon;
                    slotElement.appendChild(bulletIcon);
                    
                    // 子弹伤害
                    if (bulletType.damage) {
                        const damageLabel = document.createElement('div');
                        damageLabel.className = 'bullet-stat damage';
                        damageLabel.textContent = bulletType.damage;
                        slotElement.appendChild(damageLabel);
                    }
                }
            } else {
                // 空槽位显示
                const emptySlot = document.createElement('div');
                emptySlot.className = 'empty-slot';
                emptySlot.textContent = '+';
                slotElement.appendChild(emptySlot);
            }
            
            // 添加点击事件
            slotElement.addEventListener('click', () => {
                // 显示整合界面中的子弹选择菜单
                this.showBulletSelectionMenuIntegrated(slot, menuContainer);
            });
            
            bulletSlotsContainer.appendChild(slotElement);
        }
        
        bulletEditSection.appendChild(bulletSlotsContainer);
        menuContainer.appendChild(bulletEditSection);
        
        // 创建按钮区域
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'tower-menu-buttons';
        
        // 出售按钮
        const sellButton = document.createElement('button');
        sellButton.className = 'tower-menu-button sell';
        sellButton.textContent = `出售 (${Math.floor(tower.totalInvestment * Config.sellPriceFactor)}💰)`;
        sellButton.addEventListener('click', () => {
            const sellPrice = tower.sell();
            this.updateResourceDisplay();
            this.hideTowerMenu();
            this.showMessage(`塔已出售，获得 ${sellPrice}💰`);
        });
        buttonsContainer.appendChild(sellButton);
        
        menuContainer.appendChild(buttonsContainer);
        
        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.className = 'tower-menu-close';
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            this.hideTowerMenu();
            TowerManager.hideAllRanges();
        });
        menuContainer.appendChild(closeButton);
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(menuContainer);
        
        // 保存引用
        this.towerMenu = menuContainer;
    },
    
    // 隐藏塔菜单
    hideTowerMenu() {
        if (this.towerMenu && this.towerMenu.parentNode) {
            this.towerMenu.parentNode.removeChild(this.towerMenu);
            this.towerMenu = null;
        }
    },
    

    
    // 隐藏所有菜单
    hideAllMenus() {
        this.hideTowerUpgradeMenu();
        this.hideTowerMenu();
        this.hideBulletSelectionMenuIntegrated();
    },
    
    // 在整合界面中显示子弹选择菜单
    showBulletSelectionMenuIntegrated(bulletSlot, parentMenu) {
        // 隐藏已有的子弹选择菜单
        this.hideBulletSelectionMenuIntegrated();
        
        // 获取塔实例
        const tower = bulletSlot.tower;
        
        // 获取游戏地图尺寸
        const gameMap = document.getElementById('game-map');
        const mapRect = gameMap.getBoundingClientRect();
        const mapWidth = mapRect.width;
        const mapHeight = mapRect.height;
        
        // 创建子弹选择菜单容器
        const menuContainer = document.createElement('div');
        menuContainer.className = 'bullet-selection-menu-integrated';
        
        // 创建菜单标题
        const menuTitle = document.createElement('div');
        menuTitle.className = 'bullet-selection-title';
        menuTitle.textContent = `选择子弹 (槽位 ${bulletSlot.index + 1})`;
        menuContainer.appendChild(menuTitle);
        
        // 创建子弹选项容器
        const bulletOptionsContainer = document.createElement('div');
        bulletOptionsContainer.className = 'bullet-options';
        
        // 创建子弹详细信息提示框
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'bullet-tooltip';
        document.body.appendChild(tooltipElement);
        
        // 获取所有子弹类型
        const bulletTypes = BulletManager.getAllBulletTypes();
        
        // 添加每种子弹选项
        for (const typeId in bulletTypes) {
            const bulletType = bulletTypes[typeId];
            
            const bulletOption = document.createElement('div');
            bulletOption.className = 'bullet-option';
            bulletOption.dataset.bulletType = typeId;
            
            // 子弹图标
            const bulletIcon = document.createElement('div');
            bulletIcon.className = 'bullet-option-icon';
            bulletIcon.textContent = bulletType.icon;
            bulletOption.appendChild(bulletIcon);
            
            // 子弹名称
            const bulletName = document.createElement('div');
            bulletName.className = 'bullet-option-name';
            bulletName.textContent = bulletType.name;
            bulletOption.appendChild(bulletName);
            
            // 子弹成本
            const bulletCost = document.createElement('div');
            bulletCost.className = 'bullet-option-cost';
            bulletCost.textContent = `${bulletType.cost}💰`;
            bulletOption.appendChild(bulletCost);
            
            // 添加鼠标悬停事件，显示子弹详细信息
            bulletOption.addEventListener('mouseenter', (event) => {
                // 使用子弹提示框工厂生成提示框内容
                BulletTooltipFactory.generateTooltip(tooltipElement, bulletType, typeId);
                
                // 计算提示框位置
                const rect = bulletOption.getBoundingClientRect();
                const tooltipWidth = 200; // 提示框宽度
                
                // 判断提示框应该显示在左边还是右边
                let left = rect.right + 10;
                if (left + tooltipWidth > window.innerWidth) {
                    left = rect.left - tooltipWidth - 10;
                }
                
                tooltipElement.style.left = `${left}px`;
                tooltipElement.style.top = `${rect.top}px`;
                
                // 显示提示框
                tooltipElement.classList.add('visible');
            });
            
            // 添加鼠标移出事件，隐藏子弹详细信息
            bulletOption.addEventListener('mouseleave', () => {
                tooltipElement.classList.remove('visible');
            });
            
            // 如果金钱不足，禁用选项
            if (Game.state.money < bulletType.cost) {
                bulletOption.style.opacity = '0.5';
                bulletOption.style.cursor = 'not-allowed';
            } else {
                // 添加点击事件
                bulletOption.addEventListener('click', () => {
                    // 创建子弹选项
                    const bulletOptions = BulletManager.createBulletOptions(typeId);
                    
                    // 添加子弹到槽位
                    if (tower.addBulletToSlot(bulletSlot.index, typeId, bulletOptions)) {
                        // 更新资源显示
                        this.updateResourceDisplay();
                        
                        // 隐藏子弹选择菜单
                        this.hideBulletSelectionMenuIntegrated();
                        
                        // 刷新塔菜单显示
                        this.refreshTowerMenu(tower);
                    }
                });
            }
            
            bulletOptionsContainer.appendChild(bulletOption);
        }
        
        menuContainer.appendChild(bulletOptionsContainer);
        
        // 添加清除按钮
        if (!bulletSlot.isEmpty()) {
            const clearButton = document.createElement('button');
            clearButton.className = 'tower-menu-button';
            clearButton.textContent = '清除槽位';
            clearButton.style.marginTop = '10px';
            clearButton.addEventListener('click', () => {
                tower.removeBulletFromSlot(bulletSlot.index);
                this.hideBulletSelectionMenuIntegrated();
                
                // 刷新塔菜单显示
                this.refreshTowerMenu(tower);
            });
            menuContainer.appendChild(clearButton);
        }
        
        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.className = 'bullet-selection-close';
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            this.hideBulletSelectionMenuIntegrated();
        });
        menuContainer.appendChild(closeButton);
        
        // 创建临时容器来计算菜单尺寸
        const tempContainer = document.createElement('div');
        tempContainer.className = 'bullet-selection-menu-integrated';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '0';
        tempContainer.style.top = '0';
        
        // 复制菜单内容到临时容器
        tempContainer.innerHTML = menuContainer.innerHTML;
        
        // 添加到DOM以计算尺寸
        document.body.appendChild(tempContainer);
        const menuWidth = tempContainer.offsetWidth;
        const menuHeight = tempContainer.offsetHeight;
        document.body.removeChild(tempContainer);
        
        // 获取父菜单位置和尺寸
        const parentRect = parentMenu.getBoundingClientRect();
        
        // 计算最佳位置
        let menuLeft, menuTop;
        
        // 首先尝试将菜单放在父菜单右侧
        if (parentRect.right + menuWidth <= mapRect.right) {
            // 右侧有足够空间
            menuLeft = parentRect.width;
        } else if (parentRect.left - menuWidth >= 0) {
            // 左侧有足够空间
            menuLeft = -menuWidth;
        } else {
            // 左右都没有足够空间，将菜单居中放置
            menuLeft = (parentRect.width - menuWidth) / 2;
        }
        
        // 计算垂直位置
        if (parentRect.top + menuHeight <= mapRect.height) {
            // 下方有足够空间
            menuTop = 0;
        } else if (parentRect.bottom - menuHeight >= 0) {
            // 上方有足够空间
            menuTop = parentRect.height - menuHeight;
        } else {
            // 上下都没有足够空间，将菜单居中放置
            menuTop = (parentRect.height - menuHeight) / 2;
        }
        
        // 添加到父菜单
        parentMenu.appendChild(menuContainer);
        
        // 设置菜单位置
        menuContainer.style.left = `${menuLeft}px`;
        menuContainer.style.top = `${menuTop}px`;
        
        // 获取菜单相对于游戏地图的绝对位置
        const menuAbsoluteRect = menuContainer.getBoundingClientRect();
        const parentAbsoluteRect = parentMenu.getBoundingClientRect();
        
        // 计算相对于游戏地图的绝对位置
        const absoluteLeft = menuAbsoluteRect.left;
        const absoluteRight = menuAbsoluteRect.right;
        const absoluteTop = menuAbsoluteRect.top;
        const absoluteBottom = menuAbsoluteRect.bottom;
        
        // 检查是否超出右边界
        if (absoluteRight > mapRect.right) {
            const adjustment = absoluteRight - mapRect.right + 10;
            menuLeft -= adjustment;
        }
        
        // 检查是否超出左边界
        if (absoluteLeft < mapRect.left) {
            const adjustment = mapRect.left - absoluteLeft + 10;
            menuLeft += adjustment;
        }
        
        // 检查是否超出上边界
        if (absoluteTop < mapRect.top) {
            const adjustment = mapRect.top - absoluteTop + 10;
            menuTop += adjustment;
        }
        
        // 检查是否超出下边界
        if (absoluteBottom > mapRect.bottom) {
            const adjustment = absoluteBottom - mapRect.bottom + 10;
            menuTop -= adjustment;
        }
        
        // 重新设置菜单位置
        menuContainer.style.left = `${menuLeft}px`;
        menuContainer.style.top = `${menuTop}px`;
        
        // 保存引用
        this.bulletSelectionMenuIntegrated = menuContainer;
    },
    
    // 隐藏子弹选择菜单
    hideBulletSelectionMenuIntegrated() {
        // 移除菜单
        const existingMenu = document.querySelector('.bullet-selection-menu-integrated');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // 移除子弹详细信息提示框
        const tooltipElement = document.querySelector('.bullet-tooltip');
        if (tooltipElement) {
            tooltipElement.remove();
        }
        
        // 如果当前有塔菜单显示，则重新显示
        if (this.towerMenu && this.towerMenu.parentNode && this.currentTower) {
            const position = this.towerMenu.style.top;
            this.hideTowerMenu();
            this.showTowerMenu(this.currentTower);
        }
    },
    
    // 更新UI
    update() {
        this.updateResourceDisplay();
        this.updateWaveDisplay();
    },
    
    // 刷新塔菜单显示
    refreshTowerMenu(tower) {
        // 如果当前有塔菜单显示，则重新显示
        if (this.towerMenu && this.towerMenu.parentNode) {
            this.hideTowerMenu();
            this.showTowerMenu(tower);
        }
    },
    
    // 重置UI
    reset() {
        this.hideGameOverModal();
        this.hideLevelCompleteModal();
        this.hideTowerUpgradeMenu();
        this.hideMessage();
        
        this.updateResourceDisplay();
        this.updateWaveDisplay();
    },
    
    // 初始化塔选项价格
    initTowerOptions() {
        // 获取所有塔选项
        const towerOptions = document.querySelectorAll('.tower-option');
        
        // 为每个塔选项设置价格
        towerOptions.forEach(option => {
            const towerType = option.getAttribute('data-tower');
            const towerConfig = Config.towerTypes[towerType];
            
            if (towerConfig) {
                // 设置真实价格
                const costElement = option.querySelector('.tower-cost');
                costElement.textContent = `${towerConfig.cost}💰`;
                
                // 设置 data-cost 属性
                option.setAttribute('data-cost', towerConfig.cost);
            }
        });
    }
};
