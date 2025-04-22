/**
 * 子弹管理器
 * 负责管理子弹类型和配置
 */
const BulletManager = {
    // 子弹类型配置
    bulletTypes: {
        'archer-projectile': {
            id: 'archer-projectile',
            name: '箭矢',
            icon: '🏹',
            damage: 20,
            cost: 10,
            description: '基础箭矢，单体伤害'
        },
        'magic-projectile': {
            id: 'magic-projectile',
            name: '魔法',
            icon: '✨',
            damage: 15,
            cost: 15,
            slowChance: 1.0, // 将减速概率改为100%
            slowFactor: 0.5,
            slowDuration: 2,
            description: '魔法弹，始终减速敌人'
        },
        'cannon-projectile': {
            id: 'cannon-projectile',
            name: '炮弹',
            icon: '💣',
            damage: 30,
            cost: 25,
            splashRadius: 40,
            description: '炮弹，造成范围伤害'
        },
        'fire-projectile': {
            id: 'fire-projectile',
            name: '火球',
            icon: '🔥',
            damage: 10,
            cost: 20,
            burnDamage: 5,
            burnDuration: 3,
            description: '火球，造成持续燃烧伤害'
        },
        'ice-projectile': {
            id: 'ice-projectile',
            name: '冰球',
            icon: '❄️',
            damage: 15,
            cost: 20,
            freezeChance: 1.0, // 将冰冻概率改为100%
            freezeDuration: 1,
            description: '冰球，始终冻结敌人'
        },
        'poison-projectile': {
            id: 'poison-projectile',
            name: '毒液',
            icon: '☠️',
            damage: 8,
            cost: 18,
            poisonDamage: 3,
            poisonDuration: 4,
            description: '毒液，造成持续中毒伤害'
        }
    },
    
    /**
     * 获取所有子弹类型
     * @returns {Object} 所有子弹类型
     */
    getAllBulletTypes() {
        return this.bulletTypes;
    },
    
    /**
     * 获取指定子弹类型
     * @param {string} typeId - 子弹类型ID
     * @returns {Object|null} 子弹类型对象或null
     */
    getBulletType(typeId) {
        return this.bulletTypes[typeId] || null;
    },
    
    /**
     * 创建子弹选项
     * @param {string} typeId - 子弹类型ID
     * @returns {Object} 子弹选项
     */
    createBulletOptions(typeId) {
        const bulletType = this.getBulletType(typeId);
        if (!bulletType) {
            return null;
        }
        
        // 创建选项对象，复制所有属性
        const options = {...bulletType};
        
        return options;
    }
};
