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
        menuContainer.style.left = `${tower.x * Config.map.cellSize}px`;
        menuContainer.style.top = `${tower.y * Config.map.cellSize - 80}px`;
        
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
        
        // 添加各个属性
        const damageDiv = document.createElement('div');
        damageDiv.textContent = `伤害: ${tower.damage}`;
        towerStats.appendChild(damageDiv);
        
        const rangeDiv = document.createElement('div');
        rangeDiv.textContent = `范围: ${tower.range}`;
        towerStats.appendChild(rangeDiv);
        
        const speedDiv = document.createElement('div');
        speedDiv.textContent = `攻速: ${tower.attackSpeed.toFixed(1)}`;
        towerStats.appendChild(speedDiv);
        
        if (tower.splashRadius) {
            const splashDiv = document.createElement('div');
            splashDiv.textContent = `泼射: ${tower.splashRadius}`;
            towerStats.appendChild(splashDiv);
        }
        
        towerInfo.appendChild(towerStats);
        menuContainer.appendChild(towerInfo);
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'tower-buttons';
        
        // 创建升级按钮
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
            
            buttonContainer.appendChild(upgradeButton);
        }
        
        // 创建出售按钮
        const sellButton = document.createElement('button');
        sellButton.className = 'sell-button';
        sellButton.textContent = `出售 (${Math.floor(tower.cost * 0.5)}💰)`;
        
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
        
        buttonContainer.appendChild(sellButton);
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
    
    // 更新UI
    update() {
        this.updateResourceDisplay();
        this.updateWaveDisplay();
    },
    
    // 重置UI
    reset() {
        this.hideGameOverModal();
        this.hideLevelCompleteModal();
        this.hideTowerUpgradeMenu();
        this.hideMessage();
        
        this.updateResourceDisplay();
        this.updateWaveDisplay();
    }
};
