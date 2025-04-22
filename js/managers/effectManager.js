/**
 * 效果管理器
 * 负责管理和创建各种效果
 */
class EffectManager {
    constructor() {
        // 注册所有效果类型
        this.effectTypes = {
            'burn': BurnEffect,
            'freeze': FreezeEffect,
            'poison': PoisonEffect
        };
        
        console.log('效果管理器初始化完成');
    }
    
    /**
     * 创建效果
     * @param {string} type - 效果类型
     * @param {Object} target - 效果目标
     * @param {Object} options - 效果选项
     * @returns {Effect|null} 创建的效果实例，如果类型不存在则返回null
     */
    createEffect(type, target, options = {}) {
        const EffectClass = this.effectTypes[type];
        
        if (!EffectClass) {
            console.error(`未知的效果类型: ${type}`);
            return null;
        }
        
        return new EffectClass(target, options);
    }
    
    /**
     * 注册新的效果类型
     * @param {string} type - 效果类型名称
     * @param {class} EffectClass - 效果类
     */
    registerEffectType(type, EffectClass) {
        if (this.effectTypes[type]) {
            console.warn(`效果类型 ${type} 已存在，将被覆盖`);
        }
        
        this.effectTypes[type] = EffectClass;
        console.log(`注册效果类型: ${type}`);
    }
    
    /**
     * 应用效果到目标
     * @param {string} type - 效果类型
     * @param {Object} target - 效果目标
     * @param {Object} options - 效果选项
     * @returns {Effect|null} 创建的效果实例
     */
    applyEffect(type, target, options = {}) {
        console.log(`尝试应用效果: ${type}`, options);
        
        // 检查效果类型是否有效
        if (!this.effectTypes[type]) {
            console.error(`未知的效果类型: ${type}`);
            return null;
        }
        
        // 创建效果实例
        const effect = this.createEffect(type, target, options);
        
        if (!effect) {
            console.error(`创建效果失败: ${type}`);
            return null;
        }
        
        console.log(`成功创建效果: ${type}`, effect);
        
        // 将效果添加到目标的效果列表中
        if (!target.effects) {
            target.effects = [];
        }
        
        // 检查是否已有相同类型的效果
        const existingEffectIndex = target.effects.findIndex(e => e.type === type);
        
        if (existingEffectIndex !== -1) {
            console.log(`替换现有效果: ${type}`);
            // 如果已有相同类型的效果，则移除旧效果
            const oldEffect = target.effects[existingEffectIndex];
            
            // 调用移除回调
            oldEffect.onRemove();
            
            // 替换为新效果
            target.effects[existingEffectIndex] = effect;
        } else {
            console.log(`添加新效果: ${type}`);
            // 添加新效果
            target.effects.push(effect);
        }
        
        // 显示效果图标
        try {
            effect.showIcon();
        } catch (error) {
            console.error(`显示效果图标出错: ${error.message}`);
        }
        
        // 更新目标的视觉效果
        try {
            this.updateTargetVisualEffects(target);
        } catch (error) {
            console.error(`更新视觉效果出错: ${error.message}`);
        }
        
        console.log(`效果应用完成: ${type}`, target.effects);
        return effect;
    }
    
    /**
     * 更新目标的视觉效果
     * @param {Object} target - 效果目标
     */
    updateTargetVisualEffects(target) {
        if (!target.effects || !target.element) {
            return;
        }
        
        // 默认样式
        let filter = target.isBoss ? 'drop-shadow(0 0 5px red)' : '';
        
        // 应用所有效果的视觉滤镜
        target.effects.forEach(effect => {
            const effectFilter = effect.getVisualFilter();
            if (effectFilter) {
                filter += ' ' + effectFilter;
            }
        });
        
        // 应用样式
        target.element.style.filter = filter;
    }
}

// 创建全局效果管理器实例
const effectManager = new EffectManager();
