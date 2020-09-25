<template>
  <teleport to="body">
    <div
      class="modal-wrap"
      v-if="visible"
    >
      <div class="modal-container">
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
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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

    return {
      setVisible,
      cancel,
      confirm,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  z-index: 3;
  .modal-container {
    position: fixed;
    z-index: 2;
    left: 50%;
    width: 520px;
    margin: 0 0 120px 0;
    transform: translateX(-50%);
    top: 15vh;
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
    }
    .modal-footer {
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
</style>
