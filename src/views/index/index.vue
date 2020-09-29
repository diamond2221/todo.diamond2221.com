<template>
  <div class="title-wrap">
    <h3>Todo List</h3>
    <button @click="openCreateModal">创建一条TODO</button>
  </div>
  <div class="todo-list-wrap">
    <template
      v-for="todoItem in todoListData"
      :key="todoItem.id"
    >
      <ToDoItem
        :data="todoItem"
        @on-edit="onEditHandle"
        @on-delete="onDeleteHandle"
      ></ToDoItem>
    </template>

    <div
      class="loading"
      id="loading"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="24px"
        height="30px"
        viewBox="0 0 30 30"
        style="enable-background:new 0 0 50 50;"
        xml:space="preserve"
      >
        <rect
          x="0"
          y="0"
          width="4"
          height="20"
        >
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="1; .2; 1"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
        </rect>
        <rect
          x="7"
          y="0"
          width="4"
          height="20"
        >
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="1; .2; 1"
            begin="0.2s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
        </rect>
        <rect
          x="14"
          y="0"
          width="4"
          height="20"
        >
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="1; .2; 1"
            begin="0.4s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
        </rect>
      </svg>
      <div class="loading-txt">努力加载中……</div>
    </div>
  </div>

  <CreateModal
    :visible="showModal"
    @on-close="showModal = false"
    @on-confirm="onConfirmHandle"
  ></CreateModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
// eslint-disable-next-line no-unused-vars
import { TodoList, TodoItem } from "@/types/todo";
import ToDoItem from "@/components/TodoItem.vue";
import CreateModal from "@/components/CreateModal.vue";
import request from "@/utils/request";
import requestUrls from "@/utils/requestUrls";

export default defineComponent({
  components: {
    ToDoItem,
    CreateModal,
  },
  setup() {
    const page = ref(1);
    const size = ref(10);
    const orderType = ref(1 as 1 | 2 | 3);
    const showModal = ref(false);
    const todoListData = ref([] as TodoList);

    const openCreateModal = () => {
      showModal.value = true;
    };

    const onConfirmHandle = (res: TodoItem) => {
      showModal.value = false;
      todoListData.value.unshift(res);
    };

    const onEditHandle = (
      res: Pick<TodoItem, "id" | "name" | "desc" | "expirTime">
    ) => {
      const idx = todoListData.value.findIndex((v) => v.id === res.id);
      if (idx > -1) {
        todoListData.value[idx] = {
          ...todoListData.value[idx],
          ...res,
        };
      }
    };

    const onDeleteHandle = (id: number) => {
      todoListData.value = todoListData.value.filter((v) => v.id !== id);
    };

    const state = reactive({
      todoListData,
      page,
      size,
      orderType,
      showModal,
      openCreateModal,
      onConfirmHandle,
      onEditHandle,
      onDeleteHandle,
    });

    const fetchList = () => {
      request({
        url: requestUrls.fetchList,
        method: "get",
        data: {
          page: page.value,
          size: size.value,
          orderType: orderType.value,
        },
      }).then(({ data }: { data: any }) => {
        state.todoListData = [...state.todoListData, ...data.data.rows];
      });
    };
    fetchList();

    return state;
  },
});
</script>

<style lang='scss' scoped>
.title-wrap {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 12px;
  h3 {
    flex: 1;
  }
}
.loading{
  position: fixed;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  display: none;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  svg {
    width: 50px;
    height: 50px;
  }
}
</style>
