/**
 * 游戏配置文件
 * 包含游戏的所有常量和配置参数
 */

const Config = {
    // 地图配置
    map: {
        width: 15,         // 地图宽度（格子数）
        height: 10,        // 地图高度（格子数）
        cellSize: 40,      // 每个格子的大小（像素）
        pathColor: '#795548', // 路径颜色
        pathWidth: 40      // 路径宽度
    },
    
    // 游戏配置
    game: {
        initialMoney: 80, // 初始金钱
        initialLives: 10,  // 初始生命值
        maxWaves: 10,      // 最大波数
        waveClearBonus: 50, // 清除波次奖励
        speedLevels: [1, 2, 4, 8] // 游戏速度级别
    },
    
    // 敌人类型配置
    enemyTypes: [
        { 
            id: 'snail',
            emoji: '🐌', 
            name: '蜗牛', 
            speed: 0.6,     // 移动速度（格子/秒）
            health: 100,    // 生命值
            damage: 1,      // 对基地造成的伤害
            reward: 7,     // 击杀奖励
            scale: 1.0      // 大小缩放
        },
        { 
            id: 'turtle',
            emoji: '🐢', 
            name: '乌龟', 
            speed: 0.5, 
            health: 220, 
            damage: 1,
            reward: 10,
            scale: 1.1
        },
        { 
            id: 'hedgehog',
            emoji: '🦔', 
            name: '刺猬', 
            speed: 0.7, 
            health: 150, 
            damage: 1,
            reward: 8,
            scale: 0.9
        },
        { 
            id: 'rat',
            emoji: '🐀', 
            name: '老鼠', 
            speed: 0.95, 
            health: 120, 
            damage: 1,
            reward: 10,
            scale: 0.8
        },
        { 
            id: 'fox',
            emoji: '🦊', 
            name: '狐狸', 
            speed: 0.85, 
            health: 250, 
            damage: 2,
            reward: 15,
            scale: 1.0
        },
        { 
            id: 'boar',
            emoji: '🐗', 
            name: '野猪', 
            speed: 0.7, 
            health: 400, 
            damage: 3,
            reward: 15,
            scale: 1.2
        },
        { 
            id: 'lion',
            emoji: '🦁', 
            name: '狮子', 
            speed: 0.9, 
            health: 350, 
            damage: 4,
            reward: 20,
            scale: 1.1
        },
        { 
            id: 'dragon',
            emoji: '🐉', 
            name: '龙', 
            speed: 0.6, 
            health: 800, 
            damage: 6,
            reward: 25,
            scale: 1.3,
            boss: true
        }
    ],
    
    // 塔类型配置
    towerTypes: {
        archer: { 
            id: 'archer',
            emoji: '🏹', 
            name: '弓箭手', 
            damage: 20,           // 伤害
            range: 120,           // 攻击范围（像素）
            attackSpeed: 1.0,     // 攻击速度（次/秒）
            cost: 50,             // 建造成本
            projectile: 'archer-projectile', // 投射物类型
            projectileSpeed: 300, // 投射物速度（像素/秒）
            upgradeLevel: 0,      // 初始升级等级
            upgrades: [
                { damage: 20, range: 130, attackSpeed: 1.5, cost: 30 },
                { damage: 40, range: 140, attackSpeed: 1.5, cost: 50 }
            ]
        },
        magic: { 
            id: 'magic',
            emoji: '🧙', 
            name: '法师', 
            damage: 40, 
            range: 100, 
            attackSpeed: 0.5, 
            cost: 150, 
            projectile: 'magic-projectile',
            projectileSpeed: 250,
            upgradeLevel: 0,
            upgrades: [
                { damage: 60, range: 110, attackSpeed: 0.5, cost: 60 },
                { damage: 60, range: 120, attackSpeed: 1.0, cost: 100 }
            ]
        },
        cannon: { 
            id: 'cannon',
            emoji: '💣', 
            name: '炮手', 
            damage: 60, 
            range: 80, 
            attackSpeed: 0.3, 
            cost: 250, 
            projectile: 'cannon-projectile',
            projectileSpeed: 200,
            splashRadius: 40,     // 溅射范围（像素）
            upgradeLevel: 0,
            upgrades: [
                { damage: 90, range: 90, attackSpeed: 0.3, splashRadius: 60, cost: 90 },
                { damage: 135, range: 100, attackSpeed: 0.5, splashRadius: 60, cost: 150 }
            ]
        }
    },
    
    // 塔出售价格系数（出售价格 = 建造成本 * 系数）
    sellPriceFactor: 0.5,
    
    // 波次配置
    waves: [
        // 第1波 - 简单入门
        { enemies: ['snail', 'snail', 'snail', 'snail', 'snail'], interval: 1.5 },
        
        // 第2波 - 引入新敌人
        { enemies: ['snail', 'snail', 'turtle', 'snail', 'snail', 'turtle', 'snail'], interval: 1.3 },
        
        // 第3波 - 增加难度
        { enemies: ['turtle', 'turtle', 'hedgehog', 'hedgehog', 'turtle', 'hedgehog', 'turtle', 'hedgehog'], interval: 1.2 },
        
        // 第4波 - 更多敌人
        { enemies: ['hedgehog', 'rat', 'rat', 'hedgehog', 'rat', 'rat', 'hedgehog', 'rat', 'hedgehog', 'rat'], interval: 1.0 },
        
        // 第5波 - 更强的敌人
        { enemies: ['rat', 'fox', 'rat', 'fox', 'rat', 'fox', 'rat', 'fox', 'fox', 'rat', 'fox'], interval: 0.9 },
        
        // 第6波 - 更快的生成速度
        { enemies: ['fox', 'fox', 'boar', 'fox', 'boar', 'fox', 'boar', 'fox', 'boar', 'fox', 'boar'], interval: 0.8 },
        
        // 第7波 - 引入狮子
        { enemies: ['boar', 'boar', 'lion', 'boar', 'lion', 'boar', 'lion', 'boar', 'lion', 'boar', 'lion', 'boar'], interval: 0.7 },
        
        // 第8波 - 混合敌人类型
        { enemies: ['lion', 'lion', 'lion', 'fox', 'fox', 'boar', 'boar', 'lion', 'fox', 'lion', 'boar', 'lion', 'fox', 'boar'], interval: 0.6 },
        
        // 第9波 - 大规模进攻
        { enemies: ['lion', 'boar', 'fox', 'lion', 'boar', 'fox', 'lion', 'boar', 'fox', 'lion', 'boar', 'fox', 'lion', 'boar', 'fox', 'lion'], interval: 0.5 },
        
        // 第10波 - 最终波次，包含多个龙
        { enemies: ['lion', 'lion', 'dragon', 'boar', 'boar', 'fox', 'fox', 'dragon', 'lion', 'dragon', 'boar', 'fox', 'dragon', 'lion', 'dragon'], interval: 0.4 }
    ]
};
