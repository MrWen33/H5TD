/**
 * 火球子弹提示框UI
 */
class FireBulletTooltipUI extends BulletTooltipUI {
    /**
     * 添加火球子弹特殊属性
     */
    static addSpecialStats(container, bulletType, typeId) {
        // 添加燃烧伤害属性
        this.addStatItem(
            container, 
            '燃烧伤害：', 
            `${bulletType.burnDamage}/秒 (持续${bulletType.burnDuration}秒)`, 
            'stat-effect'
        );
    }
}
