
export type TodoList = TodoItem[];
export interface TodoItem {
  addTime: string;
  addUser: number;
  desc: string;
  expirTime: string;
  id: number;
  name: string;
  upTime: string;
  status: TodoStatus
}

export type TodoStatus = 1 | 2 | 3
