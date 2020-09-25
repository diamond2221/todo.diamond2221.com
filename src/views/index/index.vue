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
      todoListData.value = todoListData.value.filter(v => v.id !== id)
    }

    const state = reactive({
      todoListData,
      page,
      size,
      orderType,
      showModal,
      openCreateModal,
      onConfirmHandle,
      onEditHandle,
      onDeleteHandle
    });

    const fetchList = () => {
      fetch(
        `/TODO/todo?page=${page.value}&size=${size.value}&orderType=${orderType.value}`
      )
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          state.todoListData = [...state.todoListData, ...res.data.rows];
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
</style>
