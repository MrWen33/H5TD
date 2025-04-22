/**
 * 炮弹子弹提示框UI
 */
class CannonBulletTooltipUI extends BulletTooltipUI {
    /**
     * 添加炮弹特殊属性
     */
    static addSpecialStats(container, bulletType, typeId) {
        // 添加爆炸范围属性
        this.addStatItem(
            container, 
            '爆炸范围：', 
            `${bulletType.splashRadius}px (最多80%伤害)`, 
            'stat-effect'
        );
    }
}
