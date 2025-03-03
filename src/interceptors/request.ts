import { useUserStore } from "@/pinia/stores/user"
import { getEnvBaseUrl } from "@/utils"
import { platform } from "@/utils/platform"
import qs from "qs"

// uni.uploadFile文件上传参数
interface IUniUploadFileOptions {
  file?: File
  files?: UniApp.UploadFileOptionFiles[]
  filePath?: string
  name?: string
  formData?: any
}

export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

const baseUrl = getEnvBaseUrl()

/**
 * 拦截器
 */
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // query 参数转换
    if (options.query) {
      const queryStr = qs.stringify(options.query)
      if (options.url.includes("?")) {
        options.url += `&${queryStr}`
      } else {
        options.url += `?${queryStr}`
      }
    }
    // 非 http 开头需拼接地址
    if (!options.url.startsWith("http")) {
      // #ifdef H5
      // console.log(__VITE_APP_PROXY__)
      if (JSON.parse(__VITE_APP_PROXY__)) {
        // 啥都不需要做
      } else {
        options.url = baseUrl + options.url
      }
      // #endif
      // 非H5正常拼接
      // #ifndef H5
      options.url = baseUrl + options.url
      // #endif
      // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
    }
    options.timeout = 10000
    // 可选, 添加小程序端请求头标识
    options.header = {
      platform, // 可选, 与 uniapp 定义的平台一致，告诉后台来源
      ...options.header
    }
    // 添加 token 请求头标识
    const userStore = useUserStore()
    const token = userStore.token
    if (token && token !== "") {
      options.header.Authorization = `Bearer ${token}`
    }
  }
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor("request", httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor("uploadFile", httpInterceptor)
  }
}
