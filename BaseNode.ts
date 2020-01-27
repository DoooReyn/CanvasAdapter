/**
 * 一个简单的监听Canvas尺寸变化示例代码
 */

import { GlobalEvent as globalEvent, newEvent } from "./Event";

const { ccclass } = cc._decorator;
const CANVAS_RESIZE_EVENT = "canvas-resize";

@ccclass
export default class BaseNode extends cc.Component {
  onLoad() {
    this.addEventListener();
  }

  /**
   * 添加事件监听
   */
  addEventListener() {
    //监听Canvas尺寸变化
    cc.view.on(CANVAS_RESIZE_EVENT, () => {
      let event = newEvent(CANVAS_RESIZE_EVENT);
      globalEvent.dispatchEvent(event);
    });
  }
}

export { BaseNode };
