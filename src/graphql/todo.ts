import { apiClient } from "@/utils/apollo";
import gql from 'graphql-tag'
import { TodoStatus } from '@/types/todo'

export const fetchTodos = (page: number, size: number, orderType: TodoStatus) => {
  return apiClient.query({
    query: gql`query ($orderType: Float!, $page: Float!, $size: Float!) {
      todos(orderType: $orderType, page: $page, size: $size){
        count,
        rows {
          addTime,
          addUser,
          desc,
          expirTime,
          id,
          name,
          upTime,
          status
        }
      }
    }`,
    variables: {
      page,
      size,
      orderType
    }
  })
}
