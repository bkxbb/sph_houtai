import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { anyRoutes,asyncRoutes, resetRouter,constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    //获取token
    token: getToken(),
    //存储用户名
    name: '',
    //存储用户头像
    avatar: '',
    //菜单标记
    routes:[],
    //角色
    rules:[],
    //按钮权限的信息
    buttons:[],
    //对比之后【项目中已有的异步路由，与服务器返回的标记的信息进行对比，最终需要展示的路由】
    resultAsyncRoutes:[],
    //用户最终需要展示的全部路由
    resultAllRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  //重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  //存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO:(state,userInfo)=>{
    //用户名
    state.name=userInfo.name
    //用户头像
    state.avatar=userInfo.avatar
    //菜单权限标记
    state.routes=userInfo.routes
    //按钮权限标记
    state.buttons=userInfo.buttons
    //角色
    state.roles=userInfo.roles
  },
  //最终计算出的异步路由
  SET_RESULTASYNCROUTES:(state,asyncRoutes)=>{
    //vuex保存当前用户的异步路由，注意：一个用户需要展示的完整的路由：常量、异步、任意路由
    state.resultAsyncRoutes=asyncRoutes
    //计算出当前用户需要展示的所有路由
    state.resultAllRoutes=constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    //给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

//定义一个函数：两个数组进行对比，对比出当前用户到底显示那些异步路由
const computedAsyncRoutes=(asyncRoutes,routes)=>{
  //过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item=>{
    if(routes.indexOf(item.name)!=-1){
      //递归:别忘记还有2、、3、4、5、6级路由
      if(item.children&&item.length){
        item.children=computedAsyncRoutes(item.children,routes)
      }
      return true
    }
  })
}


const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    //解构出用户名与密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    //注意：当前登录请求现在使用mock数据，mock数据code是20000
    if(result.code==20000){
      //Vuex存储token
      commit('SET_TOKEN', result.data.token)
      //本地持久化存储token
      setToken(result.data.token)
      return 'ok'
    }else{
      return Promise.reject(new Error('faile'))
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })

  },

  // 获取用户信息
  getInfo({ commit, state }) { 
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        //获取用户信息:返回数据包括：用户名name、用户头像avatar、routes[返回的标志:不同的用户应该展示那些菜单的标记]、roles(用户角色的信息)、buttons[按钮的信息：按钮权限用的标记]
        const { data } = response
        //vuex 存储用户的全部信息
        commit('SET_USERINFO',data)
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

