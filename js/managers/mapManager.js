/**
 * 地图管理器
 * 负责生成和管理游戏地图
 */

const MapManager = {
    // 地图元素
    mapElement: null,
    
    // 地图数据
    grid: [],         // 二维数组，表示地图格子的状态
    path: [],         // 敌人行走路径
    pathElements: [], // 路径DOM元素
    
    // 初始化
    init() {
        this.mapElement = document.getElementById('game-map');
        
        // 设置地图大小
        this.mapElement.style.width = `${Config.map.width * Config.map.cellSize}px`;
        this.mapElement.style.height = `${Config.map.height * Config.map.cellSize}px`;
        
        // 初始化地图格子
        this.initGrid();
        
        // 生成路径
        this.generatePath();
        
        // 渲染路径
        this.renderPath();
    },
    
    // 初始化地图格子
    initGrid() {
        // 清空地图
        this.mapElement.innerHTML = '';
        this.grid = [];
        
        // 创建二维数组表示地图
        for (let y = 0; y < Config.map.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < Config.map.width; x++) {
                // 0表示空地，可以建塔
                this.grid[y][x] = 0;
                
                // 创建格子DOM元素
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.left = `${x * Config.map.cellSize}px`;
                cell.style.top = `${y * Config.map.cellSize}px`;
                cell.style.width = `${Config.map.cellSize}px`;
                cell.style.height = `${Config.map.cellSize}px`;
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // 添加点击事件
                cell.addEventListener('click', () => {
                    // 通知塔管理器处理点击事件
                    TowerManager.handleCellClick(x, y);
                });
                
                // 添加鼠标移入事件
                cell.addEventListener('mouseenter', () => {
                    // 通知塔管理器处理鼠标移入事件
                    TowerManager.handleCellHover(x, y);
                });
                
                // 添加鼠标移出事件
                cell.addEventListener('mouseleave', () => {
                    // 通知塔管理器处理鼠标移出事件
                    TowerManager.handleCellLeave(x, y);
                });
                
                this.mapElement.appendChild(cell);
            }
        }
    },
    
    // 生成路径
    generatePath() {
        // 清空路径
        this.path = [];
        
        // 起点在左侧中间位置
        const startX = 0;
        const startY = Math.floor(Config.map.height / 2);
        
        // 终点在右侧中间位置
        const endX = Config.map.width - 1;
        let endY = Math.floor(Config.map.height / 2);
        
        // 添加起点
        this.path.push({ x: startX, y: startY });
        
        // 生成随机路径
        let currentX = startX;
        let currentY = startY;
        
        // 确保路径至少有一些转弯
        const minTurns = 3;
        let turns = 0;
        
        while (currentX < endX - 1) {
            // 决定是向右还是向上/向下
            let direction;
            
            if (turns < minTurns && Math.random() < 0.7) {
                // 强制转弯
                direction = Math.random() < 0.5 ? 'up' : 'down';
            } else {
                // 随机选择方向
                const possibleDirections = ['right'];
                
                if (currentY > 1) possibleDirections.push('up');
                if (currentY < Config.map.height - 2) possibleDirections.push('down');
                
                direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
            }
            
            // 根据方向移动
            switch (direction) {
                case 'right':
                    this.path.push({ x: currentX, y: currentY });
                    currentX++;
                    this.path.push({ x: currentX, y: currentY });
                    break;
                case 'up':
                    turns++;
                    
                    // 向上走一段
                    const upSteps = Math.min(
                        Math.floor(Math.random() * 3) + 1,
                        currentY
                    );
                    
                    // 先添加当前点
                    this.path.push({ x: currentX, y: currentY });
                    
                    // 向上走
                    for (let i = 0; i < upSteps && currentY > 0; i++) {
                        currentY--;
                        this.path.push({ x: currentX, y: currentY });
                    }
                    
                    // 向右走一步
                    currentX++;
                    this.path.push({ x: currentX, y: currentY });
                    break;
                case 'down':
                    turns++;
                    
                    // 向下走一段
                    const downSteps = Math.min(
                        Math.floor(Math.random() * 3) + 1,
                        Config.map.height - 1 - currentY
                    );
                    
                    // 先添加当前点
                    this.path.push({ x: currentX, y: currentY });
                    
                    // 向下走
                    for (let i = 0; i < downSteps && currentY < Config.map.height - 1; i++) {
                        currentY++;
                        this.path.push({ x: currentX, y: currentY });
                    }
                    
                    // 向右走一步
                    currentX++;
                    this.path.push({ x: currentX, y: currentY });
                    break;
            }
            
            // 如果不是向右移动，才添加当前位置到路径
            // 向右移动的情况已在switch中处理
        }
        
        // 确保路径最后是直线到达终点
        while (currentX < endX) {
            currentX++;
            this.path.push({ x: currentX, y: currentY });
        }
        
        // 调整终点Y坐标到当前Y
        endY = currentY;
        
        // 标记路径格子为不可建塔
        for (const point of this.path) {
            this.grid[point.y][point.x] = 1; // 1表示路径，不可建塔
        }
    },
    
    // 渲染路径
    renderPath() {
        // 清空之前的路径元素
        this.pathElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.pathElements = [];
        
        // 创建路径元素
        for (let i = 0; i < this.path.length; i++) {
            const point = this.path[i];
            const pathElement = document.createElement('div');
            
            // 设置路径元素的类型
            if (i === 0) {
                // 起点
                pathElement.className = 'path-start';
            } else if (i === this.path.length - 1) {
                // 终点
                pathElement.className = 'path-end';
            } else {
                // 普通路径
                pathElement.className = 'path';
                
                // 添加箭头指示方向（除了起点和终点外）
                if (i < this.path.length - 1) {
                    const nextPoint = this.path[i + 1];
                    const arrow = document.createElement('div');
                    arrow.className = 'path-arrow';
                    
                    // 计算方向
                    let direction = '';
                    let rotation = 0;
                    
                    if (nextPoint.x > point.x) {
                        direction = '→'; // 右箭头
                        rotation = 0;
                    } else if (nextPoint.x < point.x) {
                        direction = '→'; // 左箭头（旋转右箭头）
                        rotation = 180;
                    } else if (nextPoint.y > point.y) {
                        direction = '→'; // 下箭头（旋转右箭头）
                        rotation = 90;
                    } else if (nextPoint.y < point.y) {
                        direction = '→'; // 上箭头（旋转右箭头）
                        rotation = 270;
                    }
                    
                    arrow.textContent = direction;
                    arrow.style.transform = `rotate(${rotation}deg)`;
                    pathElement.appendChild(arrow);
                }
            }
            
            pathElement.style.left = `${point.x * Config.map.cellSize}px`;
            pathElement.style.top = `${point.y * Config.map.cellSize}px`;
            pathElement.style.width = `${Config.map.cellSize}px`;
            pathElement.style.height = `${Config.map.cellSize}px`;
            this.mapElement.appendChild(pathElement);
            this.pathElements.push(pathElement);
        }
    },
    
    // 检查坐标是否可以建塔
    canBuildTower(x, y) {
        // 检查坐标是否在地图范围内
        if (x < 0 || x >= Config.map.width || y < 0 || y >= Config.map.height) {
            return false;
        }
        
        // 检查该位置是否为空地
        return this.grid[y][x] === 0;
    },
    
    // 标记位置已建塔
    markTowerBuilt(x, y) {
        if (this.canBuildTower(x, y)) {
            this.grid[y][x] = 2; // 2表示已建塔
            return true;
        }
        return false;
    },
    
    // 标记位置为空地
    markTowerRemoved(x, y) {
        if (x >= 0 && x < Config.map.width && y >= 0 && y < Config.map.height) {
            if (this.grid[y][x] === 2) { // 只有已建塔的位置才能标记为空地
                this.grid[y][x] = 0;
                return true;
            }
        }
        return false;
    },
    
    // 获取路径起点
    getPathStart() {
        return this.path[0];
    },
    
    // 获取路径终点
    getPathEnd() {
        return this.path[this.path.length - 1];
    },
    
    // 获取路径点
    getPathPoint(index) {
        if (index >= 0 && index < this.path.length) {
            return this.path[index];
        }
        return null;
    },
    
    // 获取路径长度
    getPathLength() {
        return this.path.length;
    },
    
    // 重置地图
    reset() {
        // 重新初始化地图
        this.initGrid();
        
        // 重新生成路径
        this.generatePath();
        
        // 重新渲染路径
        this.renderPath();
    }
};
