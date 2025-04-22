/**
 * 子弹配置文件
 * 包含所有子弹类型的默认属性
 */
const BulletConfig = {
    // 弓箭手子弹
    'archer-projectile': {
        name: '弓箭',
        emoji: '🏹',
        damage: 12,
        cooldown: 0.7,
        cost: 10,
        description: '快速射击的基础子弹，冷却时间短'
    },
    
    // 魔法子弹
    'magic-projectile': {
        name: '魔法球',
        emoji: '✨',
        damage: 8,
        cooldown: 0.8,
        slowChance: 1.0,
        slowFactor: 0.5,
        slowDuration: 2,
        cost: 15,
        description: '具有减速效果的魔法子弹'
    },
    
    // 火球子弹
    'fire-projectile': {
        name: '火球',
        emoji: '🔥',
        damage: 10,
        cooldown: 1.2,
        burnDamage: 5,
        burnDuration: 3,
        cost: 20,
        description: '造成持续燃烧伤害的火球'
    },
    
    // 冰球子弹
    'ice-projectile': {
        name: '冰球',
        emoji: '❄️',
        damage: 15,
        cooldown: 1.5,
        freezeChance: 1.0,
        freezeFactor: 0.7,
        freezeDuration: 3,
        cost: 25,
        description: '冻结敌人，大幅降低移动速度'
    },
    
    // 毒液子弹
    'poison-projectile': {
        name: '毒液',
        emoji: '☠️',
        damage: 8,
        cooldown: 1.0,
        poisonDamage: 4,
        poisonDuration: 4,
        cost: 20,
        description: '造成持续中毒伤害的毒液'
    },
    
    // 炮弹
    'cannon-projectile': {
        name: '炮弹',
        emoji: '💣',
        damage: 20,
        cooldown: 2.0,
        splashRadius: 50,
        splashDamage: 10,
        cost: 30,
        description: '造成范围伤害的炮弹'
    }
};

// 导出配置
if (typeof module !== 'undefined') {
    module.exports = BulletConfig;
}
