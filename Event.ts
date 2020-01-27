/*****************************************************
 * 事件分发
 * @file
 * @example
 * [[[文件1 创建事件目标、监听事件]]]
 * let target = newTarget();
 * target.on("global", event => {
 *   let data = event.getUserData();
 *   [[[事件数据处理]]]
 * });
 *
 * [[[文件2 获取事件目标、分发事件]]]
 * let event = newEvent("event name", "event data")
 * target.dispatchEvent(event);
 */

/**
 * 创建新的事件目标
 */
export function newTarget(): cc.EventTarget {
  return new cc.EventTarget();
}

/**
 * 创建新的事件
 * @param type 事件类型
 * @param data 事件携带数据
 */
export function newEvent(type: string, data?: any): cc.Event.EventCustom {
  let event = new cc.Event.EventCustom(type, true);
  data !== null && event.setUserData(data);
  return event;
}

export var GlobalEvent = newTarget();
