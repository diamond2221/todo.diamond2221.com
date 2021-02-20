<template>
  <teleport to="body">
    <div
      class="modal-layer"
      v-if="visible"
    >
      <div class="modal-wrap">
        <div
          class="modal-container"
          ref="modalContainer"
          :style="modalStyle"
          @mousedown.self="clickModalHandle"
        >
          <div class="modal-header">
            <div class="modal-title">{{title}}</div>
            <div
              class="modal-close"
              @click="setVisible(false)"
            >&times;</div>
          </div>

          <div class="modal-content">
            <slot name="content"></slot>
          </div>

          <div class="modal-footer">
            <div class="modal-footer-btn-wrap">
              <button @click="confirm">确定</button>
              <button @click="cancel">取消</button>
            </div>
          </div>
        </div>
        <div class="mask"></div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    visible: Boolean,
    title: String,
  },
  emits: ["on-close", "on-confirm"],
  setup(props, ctx) {
    const setVisible = (visible: boolean) => {
      !visible && ctx.emit("on-close", visible);
    };
    const cancel = () => {
      setVisible(false);
    };
    const confirm = () => {
      ctx.emit("on-confirm");
    };
    const dragging = ref(false);
    const modalContainer = ref(null as HTMLDivElement | null);
    let startX = 0;
    let startY = 0;
    let dragX = 0;
    let dragY = 0;
    let xMove = ref(dragX);
    let yMove = ref(dragY);
    let modalStyle = computed(() => {
      if (yMove.value && xMove.value) {
        return {
          top: `${yMove.value}px`,
          left: `${xMove.value}px`,
          cursor: dragging.value ? 'grabbing' : 'grab'
        };
      }
      return {};
    });
    const clickModalHandle = (e: MouseEvent) => {
      startX = e.pageX - modalContainer.value!.offsetLeft;
      startY = e.pageY - modalContainer.value!.offsetTop;
      window.addEventListener("mousemove", mouseMoving);
      window.addEventListener("mouseup", mouseMoveStop);
      window.addEventListener("contextmenu", mouseMoveStop);
    };

    const mouseMoving = (e: MouseEvent) => {
      dragging.value = true
      var dialogRight, dialogBottom, maxTop, maxLeft;
      var l = e.clientX - startX;
      var t = e.clientY - startY;
      if (l - modalContainer.value!.offsetWidth / 2 < 0) {
        l = 0 + modalContainer.value!.offsetWidth / 2; //因为transform偏移了50%
      }
      if (t - modalContainer.value!.offsetHeight / 2 < 0) {
        t = 0 + modalContainer.value!.offsetHeight / 2;
      }
      xMove.value = l;
      yMove.value = t;
      //判断是否超出窗体
      //计算出弹出层距离右边的位置(窗口的宽度-目标元素的left宽度-目标元素的宽度)
      dialogRight = window.innerWidth - l - modalContainer.value!.offsetWidth;
      dialogBottom =
        window.innerHeight - t - modalContainer.value!.offsetHeight;
      //console.log("dialogRight为："+dialogRight);
      //console.log("dialogBottom为："+dialogBottom);
      //计算出最大的left和最大的top：
      maxTop = window.innerHeight - modalContainer.value!.offsetHeight;
      maxLeft = window.innerWidth - modalContainer.value!.offsetWidth;
      //console.log("maxTop为："+maxTop);
      //console.log("maxLeft为："+maxLeft);
      if (dialogRight + modalContainer.value!.offsetWidth / 2 < 0) {
        xMove.value = maxLeft + modalContainer.value!.offsetWidth / 2; //因为样式有偏移50%
      }
      if (dialogBottom + modalContainer.value!.offsetHeight / 2 < 0) {
        yMove.value = maxTop + modalContainer.value!.offsetHeight / 2;
      }
    };
    const mouseMoveStop = () => {
      dragging.value = false;
      window.removeEventListener("mousemove", mouseMoving);
      window.removeEventListener("mouseup", mouseMoveStop);
      window.removeEventListener("contextmenu", mouseMoveStop);
    };

    return {
      setVisible,
      cancel,
      confirm,
      clickModalHandle,
      mouseMoving,
      mouseMoveStop,
      dragging,
      modalContainer,
      modalStyle,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-layer {
  position: fixed;
  z-index: 3;
  .modal-wrap {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    user-select: none;
    .modal-container {
      cursor: grab;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      width: 520px;
      background: #fff;
      box-sizing: border-box;
      padding: 12px 30px 30px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      .modal-header {
        display: flex;
        align-items: center;
        padding: 4px 0 28px;
        cursor: default;
        .modal-title {
          text-align: center;
          flex: 1;
        }
        .modal-close {
          font-size: 22px;
          cursor: pointer;
          user-select: none;
        }
      }

      .modal-content {
        cursor: default;
      }
      .modal-footer {
        cursor: default;
        display: flex;
        align-items: center;
        &-btn-wrap {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          button {
            margin-left: 20px;
            padding: 2px 12px;
          }
        }
      }
    }
    .mask {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
