import {Events} from "@/utils/events";

/**
 * 将 Cesium 对象事件注册为 Vue 组件事件。
 * @param {Object} instance Cesium 对象。
 * @param {Array} eventList 该 Cesium 对象的事件数组。
 * @param {Boolean} flag true 注册事件，false 注销事件。
 */
export default function (instance, eventList, flag = true) {
    const ev = eventList || Events[this.$options.name];
    ev
    && ev.forEach(eventName => {
        if (instance && instance[eventName]) {
            const listener = this?.$listeners?.[eventName];
            const methodName = flag ? 'addEventListener' : 'removeEventListener'
            listener && instance[eventName][methodName](listener.fns);
        }
    })
}
