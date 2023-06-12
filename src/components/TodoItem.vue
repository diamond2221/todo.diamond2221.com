<template>
  <div
    class="todo-item"
    @contextmenu.prevent="onCtxMenuHandle"
  >
    <div class="name">{{data.name}}</div>
    <div class="desc">{{data.desc}}</div>
    <div class="expir-time">{{dealDate(data.expirTime)}}</div>
    <div class="action-wrap"></div>
  </div>
  <ContextMenu
    @on-edit="onEditHandle"
    @on-delete="onDeleteHandle"
    v-model="contenxtMenuVisible"
    :left="left"
    :top="top"
  ></ContextMenu>
</template>

<script lang="ts">
import request from "@/utils/request";
import { defineComponent, reactive, ref } from "vue";
import ContextMenu from "./ContextMenu.vue";

export default defineComponent({
  components: {
    ContextMenu,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  emits: ["on-edit", "on-delete"],
  setup(props, ctx) {
    const contenxtMenuVisible = ref(false);
    const top = ref(0);
    const left = ref(0);
    const showModal = ref(false);
    const onCtxMenuHandle = (e: MouseEvent) => {
      contenxtMenuVisible.value = true;
      top.value = e.clientY;
      left.value = e.clientX;
    };

    const onEditHandle = () => {
      ctx.emit('on-edit', props.data)
    };

    const onDeleteHandle = () => {
      // const res = window.confirm("确定要删除这个Todo吗？");
      const res = true;
      if (res) {
        request({
          url: `/todo/${props.data.id}`,
          method: "DELETE",
        }).then((res) => {
          if (res.data.code === 200) {
            res.data.data
            // alert("Todo 删除成功");
            contenxtMenuVisible.value = false;
            ctx.emit("on-delete", props.data.id);
          } else {
            alert(res.data.message);
          }
        });
      }
    };

    const state = reactive({
      contenxtMenuVisible,
      todoData: props.data,
      onCtxMenuHandle,
      top,
      left,
      onEditHandle,
      showModal,
      onDeleteHandle,
    });
    return state;
  },
  methods: {
    dealDate(timestamp: string) {
      return new Date(parseInt(timestamp)).toLocaleString();
    },
  },
});
</script>


<style lang="scss" scoped>
.todo-item {
  display: flex;
  // align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #6663;
  text-align: left;
  padding: 12px 8px;
  &:hover {
    background: #f3f3f3;
    cursor: pointer;
  }
  .name {
    white-space: nowrap;
    margin-right: 20px;
    min-width: 15%;
  }
  .desc {
    flex: 3;
    white-space: pre-wrap;
  }
  .expirt-time {
    margin-left: 20px;
    text-align: right;
  }
}
</style>
