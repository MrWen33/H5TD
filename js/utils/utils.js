/**
 * 工具类
 * 提供通用的功能函数
 */

const Utils = {
    // 生成唯一ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },
    
    // 计算两点之间的距离
    getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    // 随机整数
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // 随机浮点数
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    // 角度转弧度
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    },
    
    // 弧度转角度
    radToDeg(radians) {
        return radians * 180 / Math.PI;
    },
    
    // 计算角度
    getAngle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    // 限制值在范围内
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    // 线性插值
    lerp(a, b, t) {
        return a + (b - a) * t;
    },
    
    // 检查碰撞
    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    },
    
    // 格式化数字（添加千位分隔符）
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // 深拷贝对象
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};
