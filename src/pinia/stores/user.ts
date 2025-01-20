import { defineStore } from "pinia"
import { ref } from "vue"

const initState = { nickname: "", avatar: "" }

interface IUserInfo {
  nickname?: string
  avatar?: string
  /** 微信的 openid，非微信没有这个字段 */
  openid?: string
  token?: string
}

export const useUserStore = defineStore(
  "user",
  () => {
    const token = ref<string>("")
    const userInfo = ref<IUserInfo>({ ...initState })

    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val
    }

    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = { ...initState }
    }

    const setToken = async (value: string) => {
      token.value = value
    }
    const removeToken = () => {
      token.value = ""
    }

    const isLogined = computed(() => !!token.value)

    return {
      token,
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
      reset,
      setToken,
      removeToken
    }
  },
  {
    persist: true
  }
)
