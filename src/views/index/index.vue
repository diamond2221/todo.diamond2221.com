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
        @on-edit="onTodoEditHandle"
        @on-delete="onDeleteHandle"
      ></ToDoItem>
    </template>
  </div>

  <CreateModal
    :visible="showModal"
    @on-close="showModal = false"
    @on-confirm="onConfirmHandle"
  ></CreateModal>

  <EditModal
    v-if="editData"
    :visible="showEditModal"
    :id="editData.id"
    @on-close="showEditModal = false"
    @on-confirm="onEditConfirmHandle"
  ></EditModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
// eslint-disable-next-line no-unused-vars
import { TodoList, TodoItem } from "@/types/todo";
import ToDoItem from "@/components/TodoItem.vue";
import CreateModal from "@/components/CreateModal.vue";
import { fetchTodos } from "@/graphql/todo";
import { Loading } from "@/utils/loading";
import EditModal from "@/components/EditModal.vue";

export default defineComponent({
  components: {
    ToDoItem,
    CreateModal,
    EditModal
  },
  setup() {
    const page = ref(1);
    const size = ref(10);
    const orderType = ref(1 as 1 | 2 | 3);
    const showModal = ref(false);
    const todoListData = ref([] as TodoList);
    const showEditModal = ref(false);
    const editData = ref(null as null | TodoItem);

    const openCreateModal = () => {
      showModal.value = true;
    };

    const onConfirmHandle = (res: TodoItem) => {
      showModal.value = false;
      todoListData.value.unshift(res);
    };

    const onDeleteHandle = (id: number) => {
      todoListData.value = todoListData.value.filter((v) => v.id !== id);
    };

    const onTodoEditHandle = (data: TodoItem) => {
      editData.value = data
      showEditModal.value = true
    }

    const onEditConfirmHandle = (
      data: Pick<TodoItem, "name" | "desc" | "expirTime">
    ) => {
      const idx = todoListData.value.findIndex((v) => v.id === editData.value?.id);
      if (idx > -1) {
        todoListData.value[idx] = {
          ...todoListData.value[idx],
          ...data,
        };
      }
    };

    const state = reactive({
      todoListData,
      page,
      size,
      orderType,
      showModal,
      openCreateModal,
      onConfirmHandle,
      onDeleteHandle,
      onTodoEditHandle,
      showEditModal,
      editData,
      onEditConfirmHandle
    });

    const fetchList = (page: number) => {
      Loading.show();
      fetchTodos(page, size.value, orderType.value).then((res) => {
        const { data, errors } = res;
        if (!errors) {
          state.todoListData = [...state.todoListData, ...data.todos.rows];
        }
        Loading.hide();
      });
    };
    fetchList(1);

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
