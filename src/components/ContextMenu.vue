<template>
  <div
    class="contentmenu-wrap"
    v-if="visible"
    ref="contextMenu"
    :style="style"
  >
    <div class="item" @click="editHandle">
      编辑</div>
    <div
      class="item"
      style="color: rgb(237, 64, 20)"
      @click="deleteHandle"
    >删除</div>
    <div
      class="item"
      @click="close"
    >关闭</div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
export default defineComponent({
  props: {
    modelValue: {
      required: true,
      default: false,
      type: Boolean,
    },
    left: Number,
    top: Number,
  },
  emits: ["on-close", "update:modelValue", "on-edit", 'on-delete'],
  setup(props, ctx) {
    const contextMenu = ref(null as HTMLDivElement | null);
    const visible = computed(() => {
      return props.modelValue;
    });
    const close = () => {
      ctx.emit("update:modelValue", false);
      ctx.emit("on-close");
    };
    const style = computed(() => {
      return {
        zIndex: 1001,
        left: props.left + "px",
        top: props.top + "px",
      };
    });

    const editHandle = () => {
      ctx.emit('on-edit')
      close()
    }
    const deleteHandle = () => {
      ctx.emit('on-delete')
    }

    const state = reactive({
      visible,
      close,
      contextMenu,
      style,
      editHandle,
      deleteHandle
    });

    const bodyClickHandle = (e: MouseEvent) => {
      if (
        !e.target ||
        !contextMenu.value ||
        (e.target &&
          contextMenu.value &&
          !contextMenu.value.contains(e.target as HTMLDivElement))
      ) {
        close();
      }
    };
    onMounted(() => {
      window.addEventListener("click", bodyClickHandle);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("click", bodyClickHandle);
    });

    return state;
  },
});
</script>

<style lang="scss" scoped>
.contentmenu-wrap {
  position: fixed;
  background-color: #fff;
  max-height: 200px;
  overflow: auto;
  margin: 5px 0;
  padding: 5px 0;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  .item {
    margin: 0;
    line-height: normal;
    padding: 7px 16px;
    clear: both;
    color: #515a6e;
    font-size: 14px !important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
    &:hover {
      background: #f3f3f3;
    }
  }
}
</style>
