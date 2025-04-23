/**
 * 装填指示器类
 * 负责显示塔的装填/洗牌状态
 */
class ReloadIndicator {
    /**
     * 构造函数
     * @param {Tower} tower - 关联的塔
     */
    constructor(tower) {
        this.tower = tower;
        this.element = null;
        this.progressContainer = null;
        this.progress = null;
        
        // 创建指示器
        this.create();
    }
    
    /**
     * 创建重新装填指示器
     */
    create() {
        this.element = document.createElement('div');
        this.element.className = 'reload-indicator';
        this.element.textContent = '🔄';
        this.element.style.position = 'absolute';
        this.element.style.display = 'none';
        this.element.style.fontSize = '16px';
        this.element.style.color = '#fff';
        this.element.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        this.element.style.padding = '2px 5px';
        this.element.style.borderRadius = '10px';
        this.element.style.zIndex = '10';
        
        // 添加进度条容器
        this.progressContainer = document.createElement('div');
        this.progressContainer.className = 'reload-progress-container';
        this.progressContainer.style.width = '100%';
        this.progressContainer.style.height = '4px';
        this.progressContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        this.progressContainer.style.marginTop = '2px';
        this.progressContainer.style.borderRadius = '2px';
        this.progressContainer.style.overflow = 'hidden';
        
        // 添加进度条
        this.progress = document.createElement('div');
        this.progress.className = 'reload-progress';
        this.progress.style.width = '0%';
        this.progress.style.height = '100%';
        this.progress.style.backgroundColor = '#4CAF50';
        this.progressContainer.appendChild(this.progress);
        
        this.element.appendChild(this.progressContainer);
        
        // 添加到游戏地图
        document.getElementById('game-map').appendChild(this.element);
        
        // 更新指示器位置
        this.updatePosition();
    }
    
    /**
     * 更新进度条
     * @param {number} progress - 进度百分比 (0-100)
     */
    updateProgress(progress) {
        if (this.progress) {
            this.progress.style.width = `${progress}%`;
        }
    }
    
    /**
     * 显示重新装填指示器
     */
    show() {
        if (this.element) {
            this.element.style.display = 'block';
            this.updatePosition();
        }
    }
    
    /**
     * 隐藏重新装填指示器
     */
    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }
    
    /**
     * 更新重新装填指示器位置
     */
    updatePosition() {
        if (!this.element || !this.tower) return;
        
        // 将指示器放在塔的上方
        this.element.style.left = `${this.tower.position.x}px`;
        this.element.style.top = `${this.tower.position.y - 25}px`;
        this.element.style.transform = 'translate(-50%, -100%)';
    }
    
    /**
     * 销毁指示器
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        this.progressContainer = null;
        this.progress = null;
    }
}
