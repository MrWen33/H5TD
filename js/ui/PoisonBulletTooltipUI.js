/**
 * 毒液子弹提示框UI
 */
class PoisonBulletTooltipUI extends BulletTooltipUI {
    /**
     * 添加毒液子弹特殊属性
     */
    static addSpecialStats(container, bulletType, typeId) {
        // 添加毒素伤害属性
        this.addStatItem(
            container, 
            '毒素伤害：', 
            `${bulletType.poisonDamage}/秒 (持续${bulletType.poisonDuration}秒)`, 
            'stat-effect'
        );
    }
}
