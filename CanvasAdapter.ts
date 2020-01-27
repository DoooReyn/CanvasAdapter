/**
 * 使用说明：
 * 1. 在外部监听Canvas尺寸变化，当Canvas尺寸发生变化时，通过全局事件对象分发事件；
 * 2. 在具体节点上挂载该组件，通过全局事件对象监听；
 */

import { GlobalEvent as globalEvent } from "./Event";

const { ccclass, property } = cc._decorator;
const CANVAS_RESIZE_EVENT = "canvas-resize";
const WARNING_MSG = `使用此组件需要将Canvas的适配模式改为SHOW_ALL；使用“适配位置”需要添加Widget组件。`;
const ADAPT_POS_MSG = `适合对齐节点；此外，需要添加Widget组件。`;

/**
 * 获得新的Canvas尺寸
 */
function getVisibleRealSize(): cc.Size {
  let fs = cc.view.getFrameSize();
  let sc = cc.view.getDevicePixelRatio();
  let scx = cc.view.getScaleX();
  let scy = cc.view.getScaleY();
  return cc.size((fs.width / scx) * sc, (fs.height / scy) * sc);
}

/**
 * 根据 `Canvas` 尺寸自动适配节点的尺寸和位置，在屏幕尺寸动态发生变化时也同样适用。
 * @class
 * @summary 注意：
 * - 使用此组件需要将 `Canvas` 的适配模式改为`SHOW_ALL`，也就是说要把 `Canvas`
 * 组件的 `Fit Width` 和 `Fit Height` 都勾选上。
 * - **适配尺寸**：适合背景节点，`CanvasAdapter` 会把背景节点撑到 `Canvas` 大小。
 * - **适配位置**：适合悬浮节点，比如导航栏、菜单栏、数值栏等。此外，**适配位置**需要
 * 添加 `Widget` 组件，并配置好对齐信息。
 */
@ccclass
export default class CanvasAdapter extends cc.Component {
  /**********************************************
   * 组件属性
   *********************************************/
  @property({ displayName: "提示", readonly: true })
  property_warning: string = WARNING_MSG;

  @property({ displayName: "适配尺寸", tooltip: "适合背景节点" })
  property_adapt_canvas_size: boolean = false;

  @property({ displayName: "适配位置", tooltip: ADAPT_POS_MSG })
  property_adapt_canvas_pos: boolean = false;

  /**********************************************
   * 生命周期
   *********************************************/

  onEnable() {
    globalEvent.on(CANVAS_RESIZE_EVENT, this.adaptToCanvas, this);
    this.adaptToCanvas();
  }

  onDisable() {
    globalEvent.off(CANVAS_RESIZE_EVENT, this.adaptToCanvas, this);
  }

  /**********************************************
   * 组件方法
   *********************************************/

  /**
   * Canvas尺寸变化时自动适配
   */
  private adaptToCanvas() {
    this.adaptToCanvasSize();
    this.adaptToCanvasPos();
  }

  /**
   * 根据Canvas实际尺寸进行尺寸适配
   */
  private adaptToCanvasSize() {
    if (this.property_adapt_canvas_size) {
      this.node.setContentSize(getVisibleRealSize());
    }
  }

  /**
   * 根据Canvas实际尺寸进行位置适配
   */
  private adaptToCanvasPos() {
    if (!this.property_adapt_canvas_pos) {
      return;
    }

    //使用Widget先对齐到设计尺寸
    let widget = this.node.getComponent(cc.Widget);
    if (!widget) {
      return cc.warn(`节点${this.node.name}适配位置，但未添加Widget组件！`);
    }
    widget.alignMode = cc.Widget.AlignMode.ONCE;
    widget.updateAlignment();

    //在下一帧使用偏移对齐到Canvas尺寸
    this.scheduleOnce(() => {
      let real_size = getVisibleRealSize();
      let x = real_size.width - cc.winSize.width;
      let y = real_size.height - cc.winSize.height;
      let offset = cc.v2(x, y).mul(0.5);
      if (widget.isAlignLeft) {
        this.node.x -= offset.x;
      }
      if (widget.isAlignRight) {
        this.node.x += offset.x;
      }
      if (widget.isAlignBottom) {
        this.node.y -= offset.y;
      }
      if (widget.isAlignTop) {
        this.node.y += offset.y;
      }
    }, 0);
  }
}