import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
// import VueApollo from 'vue-apollo'
import { ApolloLink } from 'apollo-link'

export const baseURL = process.env.NODE_ENV === 'production' ? 'https://api.diamond2221.com/TODO' : '/TODO'
export const apiLink = new HttpLink({
  uri: baseURL + '/graphql/query', // 请求路径
})

export const middlewareLink = new ApolloLink((operation, forward) => {
  const headers: any = { }
  operation.setContext({
    headers
  })
  return forward(operation)
})
export const apiClient = new ApolloClient({
  link: middlewareLink.concat(apiLink), // 如果不添加请求头直接放路径
  cache: new InMemoryCache()
})

// export const apolloProvider = new VueApollo({
//   clients: {
//     api: apiClient // 需要添加请求头
//   },
//   defaultClient: apiClient // 默认请求路径，如果只有一个请求就使用这个就行
// })
