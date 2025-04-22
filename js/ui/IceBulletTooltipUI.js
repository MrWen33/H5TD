/**
 * 冰球子弹提示框UI
 */
class IceBulletTooltipUI extends BulletTooltipUI {
    /**
     * 添加冰球子弹特殊属性
     */
    static addSpecialStats(container, bulletType, typeId) {
        // 添加冻结效果属性
        this.addStatItem(
            container, 
            '冷冻效果：', 
            `减速${Math.round(bulletType.freezeFactor * 100)}% (持续${bulletType.freezeDuration}秒)`, 
            'stat-effect'
        );
    }
}
