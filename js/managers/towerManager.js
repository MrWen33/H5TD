/**
 * 塔管理器
 * 负责塔的建造和管理
 */

const TowerManager = {
    // 塔列表
    towers: [],
    
    // 选中的塔类型
    selectedTowerType: null,
    
    // 建造占位符
    buildPlaceholder: null,
    
    // 初始化
    init() {
        this.towers = [];
        this.selectedTowerType = null;
        
        // 添加塔选择事件监听
        this.addTowerSelectionListeners();
    },
    
    // 添加塔选择事件监听
    addTowerSelectionListeners() {
        // 获取所有塔选项
        const towerOptions = document.querySelectorAll('.tower-option');
        
        // 为每个塔选项添加点击事件
        towerOptions.forEach(option => {
            option.addEventListener('click', () => {
                const towerType = option.getAttribute('data-tower');
                const towerCost = parseInt(option.getAttribute('data-cost'));
                
                // 如果已经选中了这个塔类型，取消选择
                if (this.selectedTowerType === towerType) {
                    this.cancelTowerSelection();
                } else {
                    // 选中塔类型
                    this.selectTowerType(towerType);
                }
            });
        });
    },
    
    // 选中塔类型
    selectTowerType(towerType) {
        // 获取塔配置
        const towerConfig = Config.towerTypes[towerType];
        
        // 如果金钱不足，不能选择
        if (Game.state.money < towerConfig.cost) {
            UIManager.showMessage('金钱不足！');
            return;
        }
        
        // 设置选中的塔类型
        this.selectedTowerType = towerType;
        
        // 创建建造占位符
        this.createBuildPlaceholder();
        
        // 高亮选中的塔选项
        const towerOptions = document.querySelectorAll('.tower-option');
        towerOptions.forEach(option => {
            if (option.getAttribute('data-tower') === towerType) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    },
    
    // 取消塔选择
    cancelTowerSelection() {
        this.selectedTowerType = null;
        
        // 移除建造占位符
        this.removeBuildPlaceholder();
        
        // 取消高亮所有塔选项
        const towerOptions = document.querySelectorAll('.tower-option');
        towerOptions.forEach(option => {
            option.classList.remove('selected');
        });
    },
    
    // 创建建造占位符
    createBuildPlaceholder() {
        // 如果已经有占位符，先移除
        this.removeBuildPlaceholder();
        
        // 创建占位符元素
        this.buildPlaceholder = document.createElement('div');
        this.buildPlaceholder.className = 'build-placeholder';
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(this.buildPlaceholder);
        
        // 隐藏占位符
        this.buildPlaceholder.style.display = 'none';
    },
    
    // 移除建造占位符
    removeBuildPlaceholder() {
        if (this.buildPlaceholder && this.buildPlaceholder.parentNode) {
            this.buildPlaceholder.parentNode.removeChild(this.buildPlaceholder);
            this.buildPlaceholder = null;
        }
    },
    
    // 处理格子点击事件
    handleCellClick(x, y) {
        // 如果没有选中塔类型，不处理
        if (!this.selectedTowerType) {
            return;
        }
        
        // 检查是否可以在该位置建塔
        if (MapManager.canBuildTower(x, y)) {
            // 获取塔配置
            const towerConfig = Config.towerTypes[this.selectedTowerType];
            
            // 检查金钱是否足够
            if (Game.state.money >= towerConfig.cost) {
                // 建造塔
                this.buildTower(this.selectedTowerType, x, y);
                
                // 扣除金钱
                Game.state.money -= towerConfig.cost;
                
                // 更新UI
                UIManager.updateResourceDisplay();
            } else {
                UIManager.showMessage('金钱不足！');
            }
        } else {
            UIManager.showMessage('无法在此处建造塔！');
        }
    },
    
    // 处理格子悬停事件
    handleCellHover(x, y) {
        // 如果没有选中塔类型或没有占位符，不处理
        if (!this.selectedTowerType || !this.buildPlaceholder) {
            return;
        }
        
        // 显示占位符
        this.buildPlaceholder.style.display = 'block';
        this.buildPlaceholder.style.left = `${x * Config.map.cellSize}px`;
        this.buildPlaceholder.style.top = `${y * Config.map.cellSize}px`;
        
        // 检查是否可以在该位置建塔
        if (MapManager.canBuildTower(x, y)) {
            this.buildPlaceholder.classList.remove('invalid');
        } else {
            this.buildPlaceholder.classList.add('invalid');
        }
    },
    
    // 处理格子离开事件
    handleCellLeave(x, y) {
        // 如果没有选中塔类型或没有占位符，不处理
        if (!this.selectedTowerType || !this.buildPlaceholder) {
            return;
        }
        
        // 隐藏占位符
        this.buildPlaceholder.style.display = 'none';
    },
    
    // 建造塔
    buildTower(towerType, x, y) {
        // 获取塔配置
        const towerConfig = { ...Config.towerTypes[towerType] };
        
        // 创建塔
        const tower = new Tower(towerConfig, x, y);
        
        // 添加到塔列表
        this.towers.push(tower);
        
        // 标记位置已建塔
        MapManager.markTowerBuilt(x, y);
        
        // 增加建造塔计数
        Game.addTowerBuilt();
        
        // 根据塔的成本增加得分
        Game.addScore(Math.floor(towerConfig.cost / 5));
        
        // 取消塔选择
        this.cancelTowerSelection();
        
        return tower;
    },
    
    // 移除塔
    removeTower(tower) {
        // 从塔列表中移除
        const index = this.towers.findIndex(t => t.id === tower.id);
        if (index !== -1) {
            this.towers.splice(index, 1);
        }
    },
    
    // 获取所有塔
    getTowers() {
        return this.towers;
    },
    
    // 隐藏所有塔的范围
    hideAllRanges() {
        this.towers.forEach(tower => {
            tower.hideRangeIndicator();
        });
    },
    
    // 更新所有塔
    update(deltaTime) {
        this.towers.forEach(tower => {
            tower.update(deltaTime);
        });
    },
    
    // 清除所有塔
    clearTowers() {
        // 移除所有塔的DOM元素
        this.towers.forEach(tower => {
            tower.remove();
        });
        
        // 清空塔列表
        this.towers = [];
    },
    
    // 重置
    reset() {
        this.clearTowers();
        this.selectedTowerType = null;
        this.removeBuildPlaceholder();
    }
};
