/**
 * 子弹管理器
 * 负责创建、更新和管理所有子弹
 */
class ProjectileManager {
    constructor() {
        this.projectiles = [];
        this.projectileTypes = {
            'archer-projectile': ArcherProjectile,
            'magic-projectile': MagicProjectile,
            'cannon-projectile': CannonProjectile,
            'fire-projectile': FireProjectile,
            'ice-projectile': IceProjectile,
            'poison-projectile': PoisonProjectile
        };
    }
    
    // 创建子弹
    createProjectile(type, source, target, options = {}) {
        // 获取子弹类
        const ProjectileClass = this.projectileTypes[type];
        
        if (!ProjectileClass) {
            console.error(`未知的子弹类型: ${type}`);
            return null;
        }
        
        // 创建子弹实例
        const projectile = new ProjectileClass(source, target, options);
        
        // 添加到子弹列表
        this.projectiles.push(projectile);
        
        return projectile;
    }
    
    // 更新所有子弹
    update(deltaTime) {
        // 复制数组，避免在遍历过程中修改数组
        const projectilesToUpdate = [...this.projectiles];
        
        for (const projectile of projectilesToUpdate) {
            // 检查子弹是否已经被移除
            if (!projectile.element || !projectile.element.parentNode) {
                // 从数组中移除
                const index = this.projectiles.indexOf(projectile);
                if (index !== -1) {
                    this.projectiles.splice(index, 1);
                }
                continue;
            }
            
            // 更新子弹
            projectile.update(deltaTime);
        }
    }
    
    // 清除所有子弹
    clearAll() {
        for (const projectile of this.projectiles) {
            projectile.remove();
        }
        this.projectiles = [];
    }
    
    // 注册新的子弹类型
    registerProjectileType(typeName, ProjectileClass) {
        this.projectileTypes[typeName] = ProjectileClass;
    }
    
    // 获取当前子弹数量
    getProjectileCount() {
        return this.projectiles.length;
    }
}

// 创建全局子弹管理器实例
const projectileManager = new ProjectileManager();
