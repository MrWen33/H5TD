/**
 * 子弹提示框工厂类
 * 负责根据子弹类型创建对应的提示框UI
 */
class BulletTooltipFactory {
    /**
     * 根据子弹类型生成提示框内容
     * @param {HTMLElement} container - 提示框容器元素
     * @param {Object} bulletType - 子弹类型配置
     * @param {string} typeId - 子弹类型ID
     */
    static generateTooltip(container, bulletType, typeId) {
        switch (typeId) {
            case 'archer-projectile':
                ArcherBulletTooltipUI.generateTooltip(container, bulletType, typeId);
                break;
            case 'fire-projectile':
                FireBulletTooltipUI.generateTooltip(container, bulletType, typeId);
                break;
            case 'ice-projectile':
                IceBulletTooltipUI.generateTooltip(container, bulletType, typeId);
                break;
            case 'poison-projectile':
                PoisonBulletTooltipUI.generateTooltip(container, bulletType, typeId);
                break;
            case 'magic-projectile':
                MagicBulletTooltipUI.generateTooltip(container, bulletType, typeId);
                break;
            case 'cannon-projectile':
                CannonBulletTooltipUI.generateTooltip(container, bulletType, typeId);
                break;
            default:
                // 默认使用基础提示框UI
                BulletTooltipUI.generateTooltip(container, bulletType, typeId);
                break;
        }
    }
}
