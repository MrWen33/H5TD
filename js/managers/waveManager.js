/**
 * 波次管理器
 * 负责游戏波次的生成和管理
 */

const WaveManager = {
    // 当前波次
    currentWave: 0,
    
    // 波次进行中
    waveInProgress: false,
    
    // 波次敌人队列
    enemyQueue: [],
    
    // 敌人生成计时器
    spawnTimer: 0,
    
    // 敌人生成间隔
    spawnInterval: 0,
    
    // 初始化
    init() {
        this.currentWave = 0;
        this.waveInProgress = false;
        this.enemyQueue = [];
        this.spawnTimer = 0;
        
        // 添加开始波次按钮事件监听
        document.getElementById('start-wave').addEventListener('click', () => {
            this.startNextWave();
        });
    },
    
    // 更新
    update(deltaTime) {
        // 如果波次进行中且敌人队列不为空
        if (this.waveInProgress && this.enemyQueue.length > 0) {
            // 更新生成计时器
            this.spawnTimer -= deltaTime;
            
            // 如果计时器到时间，生成敌人
            if (this.spawnTimer <= 0) {
                // 生成敌人
                const enemyTypeId = this.enemyQueue.shift();
                EnemyManager.spawnEnemy(enemyTypeId);
                
                // 重置计时器
                this.spawnTimer = this.spawnInterval;
            }
        }
        
        // 如果波次进行中但敌人队列为空且没有存活敌人，波次结束
        if (this.waveInProgress && this.enemyQueue.length === 0 && EnemyManager.getLivingEnemyCount() === 0) {
            this.endWave();
        }
    },
    
    // 开始下一波
    startNextWave() {
        // 如果波次进行中，不能开始新波次
        if (this.waveInProgress) {
            return;
        }
        
        // 如果已经是最后一波，游戏胜利
        if (this.currentWave >= Config.waves.length) {
            Game.gameWin();
            return;
        }
        
        // 增加波次计数
        this.currentWave++;
        
        // 获取波次配置
        const waveConfig = Config.waves[this.currentWave - 1];
        
        // 设置敌人队列
        this.enemyQueue = [...waveConfig.enemies];
        
        // 设置生成间隔
        this.spawnInterval = waveConfig.interval;
        
        // 重置生成计时器
        this.spawnTimer = 0;
        
        // 设置波次进行中
        this.waveInProgress = true;
        
        // 更新UI
        Game.state.wave = this.currentWave;
        Game.state.waveInProgress = true;
        UIManager.updateWaveDisplay();
        
        // 禁用开始波次按钮
        document.getElementById('start-wave').disabled = true;
        
        // 显示波次公告
        this.showWaveAnnouncement();
        
        console.log(`开始第 ${this.currentWave} 波`);
    },
    
    // 结束当前波次
    endWave() {
        // 设置波次结束
        this.waveInProgress = false;
        
        // 更新UI
        Game.state.waveInProgress = false;
        UIManager.updateWaveDisplay();
        
        // 启用开始波次按钮
        document.getElementById('start-wave').disabled = false;
        
        // 给予波次奖励
        Game.state.money += Config.game.waveClearBonus;
        UIManager.updateResourceDisplay();
        
        // 显示波次奖励消息
        UIManager.showMessage(`波次奖励: +${Config.game.waveClearBonus}💰`);
        
        console.log(`第 ${this.currentWave} 波结束`);
        
        // 如果是最后一波，游戏胜利
        if (this.currentWave >= Config.waves.length) {
            Game.gameWin();
        }
    },
    
    // 显示波次公告
    showWaveAnnouncement() {
        // 创建公告元素
        const announcement = document.createElement('div');
        announcement.className = 'wave-announcement';
        announcement.textContent = `第 ${this.currentWave} 波`;
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(announcement);
        
        // 2秒后移除
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 2000);
    },
    
    // 获取当前波次
    getCurrentWave() {
        return this.currentWave;
    },
    
    // 获取总波次数
    getTotalWaves() {
        return Config.waves.length;
    },
    
    // 重置
    reset() {
        this.currentWave = 0;
        this.waveInProgress = false;
        this.enemyQueue = [];
        this.spawnTimer = 0;
        
        // 启用开始波次按钮
        document.getElementById('start-wave').disabled = false;
    }
};
