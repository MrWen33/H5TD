/**
 * 游戏主入口文件
 * 负责初始化游戏并协调各个模块
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 初始化游戏
    Game.init();
});

// 游戏主对象
const Game = {
    // 游戏配置
    config: null,
    
    // 游戏状态
    state: null,
    
    // 游戏管理器
    mapManager: null,
    towerManager: null,
    enemyManager: null,
    waveManager: null,
    uiManager: null,
    
    // 游戏循环
    lastTime: 0,
    animationFrameId: null,
    
    // 初始化游戏
    init() {
        // 加载配置
        this.config = Config;
        
        // 加载最高分
        this.loadHighScore();
        
        // 初始化状态
        this.state = {
            money: this.config.game.initialMoney,
            lives: this.config.game.initialLives,
            wave: 0,
            waveInProgress: false,
            gameSpeed: 1,
            gameOver: false,
            gameWon: false,
            paused: false,
            score: 0,
            enemiesKilled: 0,
            towersBuilt: 0,
            gameStartTime: Date.now(),
            gameTime: 0
        };
        
        // 初始化管理器
        this.mapManager = MapManager;
        this.mapManager.init();
        
        this.towerManager = TowerManager;
        this.towerManager.init();
        
        this.enemyManager = EnemyManager;
        this.enemyManager.init();
        
        this.waveManager = WaveManager;
        this.waveManager.init();
        
        this.uiManager = UIManager;
        this.uiManager.init();
        
        // 开始游戏循环
        this.startGameLoop();
        
        console.log('游戏初始化完成');
    },
    
    // 开始游戏循环
    startGameLoop() {
        this.lastTime = performance.now();
        this.gameLoop();
    },
    
    // 游戏循环
    gameLoop(currentTime) {
        // 计算时间差
        const deltaTime = (currentTime - this.lastTime) / 1000 * this.state.gameSpeed;
        this.lastTime = currentTime;
        
        // 如果游戏结束或暂停，不更新
        if (!this.state.gameOver && !this.state.gameWon && !this.state.paused) {
            // 更新游戏时间
            this.updateGameTime();
            
            // 更新各个管理器
            this.towerManager.update(deltaTime);
            this.enemyManager.update(deltaTime);
            this.waveManager.update(deltaTime);
            this.uiManager.update();
        }
        
        // 继续游戏循环
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    },
    
    // 重置游戏
    reset() {
        // 取消动画帧
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // 重置状态
        this.state = {
            money: this.config.game.initialMoney,
            lives: this.config.game.initialLives,
            wave: 0,
            waveInProgress: false,
            gameSpeed: 1,
            gameOver: false,
            gameWon: false,
            paused: false,
            score: 0,
            enemiesKilled: 0,
            towersBuilt: 0,
            gameStartTime: Date.now(),
            gameTime: 0
        };
        
        // 重置各个管理器
        this.mapManager.reset();
        this.towerManager.reset();
        this.enemyManager.reset();
        this.waveManager.reset();
        this.uiManager.reset();
        
        // 重新开始游戏循环
        this.startGameLoop();
        
        console.log('游戏已重置');
    },
    
    // 暂停游戏
    pause() {
        this.state.paused = true;
    },
    
    // 继续游戏
    resume() {
        this.state.paused = false;
        this.lastTime = performance.now();
    },
    
    // 游戏结束
    gameOver() {
        this.state.gameOver = true;
        
        // 检查是否是新的最高分
        if (this.state.score > this.highScore) {
            this.highScore = this.state.score;
            this.saveHighScore();
        }
        
        this.uiManager.showGameOverModal();
    },
    
    // 游戏胜利
    gameWin() {
        this.state.gameWon = true;
        
        // 检查是否是新的最高分
        if (this.state.score > this.highScore) {
            this.highScore = this.state.score;
            this.saveHighScore();
        }
        
        this.uiManager.showLevelCompleteModal();
    },
    
    // 更新游戏时间
    updateGameTime() {
        if (!this.state.paused) {
            this.state.gameTime = Math.floor((Date.now() - this.state.gameStartTime) / 1000);
            
            // 格式化时间显示
            const minutes = Math.floor(this.state.gameTime / 60);
            const seconds = this.state.gameTime % 60;
            document.getElementById('game-time').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    },
    
    // 增加得分
    addScore(points) {
        this.state.score += points;
        document.getElementById('current-score').textContent = this.state.score;
    },
    
    // 增加击杀敌人数
    addEnemyKilled() {
        this.state.enemiesKilled++;
        document.getElementById('enemies-killed').textContent = this.state.enemiesKilled;
        
        // 每击杀一个敌人增加得分
        this.addScore(10);
    },
    
    // 增加建造塔数
    addTowerBuilt() {
        this.state.towersBuilt++;
        document.getElementById('towers-built').textContent = this.state.towersBuilt;
    },
    
    // 加载最高分
    loadHighScore() {
        const savedHighScore = localStorage.getItem('towerDefenseHighScore');
        this.highScore = savedHighScore ? parseInt(savedHighScore) : 0;
        document.getElementById('high-score').textContent = this.highScore;
    },
    
    // 保存最高分
    saveHighScore() {
        localStorage.setItem('towerDefenseHighScore', this.highScore.toString());
        document.getElementById('high-score').textContent = this.highScore;
    }
};
