/**
 * 魔法子弹提示框UI
 */
class MagicBulletTooltipUI extends BulletTooltipUI {
    /**
     * 添加魔法子弹特殊属性
     */
    static addSpecialStats(container, bulletType, typeId) {
        // 添加减速效果属性
        this.addStatItem(
            container, 
            '减速效果：', 
            `减速${Math.round(bulletType.slowFactor * 100)}% (持续${bulletType.slowDuration}秒)`, 
            'stat-effect'
        );
    }
}
