<template>
  <Modal
    :visible="visible"
    title="修改这个Todo"
    @on-close="setVisible(false)"
    @on-confirm="confirm"
  >
    <template v-slot:content>
      <div class="todo-item">
        <div class="title">名称</div>
        <div class="input-wrap">
          <input
            type="text"
            placeholder="这个Todo 叫什么"
            v-model="name"
          >
        </div>
      </div>
      <div class="todo-item">
        <div class="title">描述</div>
        <div class="input-wrap">
          <textarea
            cols="30"
            rows="5"
            maxlength="350"
            placeholder="这个Todo 是用来干什么的， 要记录什么事情！"
            v-model="desc"
          >
          </textarea>
        </div>
      </div>
      <div class="todo-item">
        <div class="title">截止时间</div>
        <div class="input-wrap">
          <input
            type="datetime-local"
            placeholder="这个Todo 何时到期"
            v-model="expirTime"
            pattern="yyyy-MM-dd'T'hh:mm:ss"
          >
        </div>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import Modal from "./Modal.vue";
import { formatNumber } from "@/utils/date";
import request from "@/utils/request";

export default defineComponent({
  components: {
    Modal,
  },
  props: {
    visible: Boolean,
    id: Number,
  },
  emits: ["on-close", "on-confirm"],
  setup(props, ctx) {
    const name = ref("");
    const desc = ref("");
    const expirTime = ref("");
    const setVisible = (visible: boolean) => {
      !visible && ctx.emit("on-close", visible);
    };
    const confirm = () => {
      if (!name.value) {
        return alert("请输入Todo的名称！");
      }
      if (!desc.value) {
        return alert("请输入Todo的详细内容！");
      }
      if (!expirTime.value) {
        return alert("请输入Todo的到期时间！");
      }
      const data = {
        name: name.value,
        desc: desc.value,
        expirTime: new Date(expirTime.value).getTime(),
      };
      request({
        url: `/TODO/todo/${props.id!}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        data: data,
      }).then((res) => {
        if (res.data.code === 200) {
          setVisible(false);
          alert("Todo 修改成功");
          ctx.emit("on-confirm", data);
        } else {
          alert(res.data.message);
        }
      });
    };

    const getDetail = () => {
      if (props.visible && props.id) {
        request(`/TODO/todo/${props.id!}`).then(
          ({ data: { code, data, message } }) => {
            if (code === 200) {
              name.value = data.name;
              desc.value = data.desc;
              //创建一个当前日期对象
              let now = new Date(parseInt(data.expirTime));
              const arr: string[] = now
                .toLocaleString()
                .replaceAll("/", "-")
                .split(" ");
              const dateArr = arr[0].split("-");
              const date = `${dateArr[0]}-${formatNumber(
                dateArr[1]
              )}-${formatNumber(dateArr[2])}`;
              const hz = arr[1][0];
              const timeArr = arr[1].slice(2).split(":").slice(0, 2);
              const isPm = hz === "下";
              const time = `${+timeArr[0] + (isPm ? 12 : 0)}:${formatNumber(
                timeArr[1]
              )}`;
              expirTime.value = `${date}T${time}`;
            } else {
              alert(message);
            }
          }
        );
      }
    };
    const visible = computed(() => props.visible);
    watch(visible, (nv, ov) => {
      if (nv !== ov && nv && props.id) {
        getDetail();
      }
    });

    const state = {
      name,
      desc,
      expirTime,
      setVisible,
      confirm,
      visible,
    };
    return state;
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
      .todo-item {
        display: flex;
        line-height: 32px;
        font-size: 14px;
        margin-bottom: 20px;
        .title {
          width: 60px;
          white-space: nowrap;
        }
        .input-wrap {
          margin-left: 20px;
          flex: 1;
          input {
            padding: 8px 12px;
            box-sizing: border-box;
            width: 100%;
          }
          textarea {
            padding: 12px;
            box-sizing: border-box;
            resize: vertical;
            width: 100%;
            max-height: 500px;
          }
        }
      }
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
