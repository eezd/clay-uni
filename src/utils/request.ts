import type { CustomRequestOptions } from "@/interceptors/request"

/**
 * uni.request 请求
 */
function http<T>(options: CustomRequestOptions) {
  return new Promise<ApiResponseData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: "json",
      // #ifndef MP-WEIXIN
      responseType: "json",
      // #endif
      success(res: any) {
        // 请求状态码判断
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 进行业务状态码判断
          const data = res.data as ApiResponseData<T>
          if (data.code === 200) {
            resolve(data)
          } else if (res.statusCode === 401) {
            // userStore.clearUserInfo()
            // uni.navigateTo({ url: '/pages/login/login' })
            reject(res)
          }
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          !options.hideErrorToast
          && uni.showToast({
            icon: "none",
            title: (res.data as T & { msg?: string })?.msg || "请求错误1"
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          icon: "none",
          title: "网络错误，换个网络试试"
        })
        reject(err)
      }
    })
  })
}

export default function request<T = unknown>(
  options: CustomRequestOptions & {
    url: string
    method?: "GET" | "POST"
    query?: Record<string, unknown>
    data?: Record<string, unknown>
    headers?: Record<string, string>
  }
) {
  const requestOptions = {
    ...options
  }
  if (options.headers) {
    requestOptions.header = options.headers
    delete requestOptions.headers
  }
  return http<T>(requestOptions)
}
