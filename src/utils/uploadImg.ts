import type { CustomRequestOptions } from "@/interceptors/request"

export function chooseImage() {
  return new Promise<string>((resolve, reject) => {
  // #ifdef MP-WEIXIN
  // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替。
  // 微信小程序在2023年10月17日之后，使用本API需要配置隐私协议
    uni.chooseMedia({
      count: 1,
      mediaType: ["image"],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        // uploadFile({ tempFilePath })
        resolve(tempFilePath)
      },
      fail: (err) => {
        console.error("uni.chooseMedia err->", err)
      }
    })
    // #endif
    // #ifndef MP-WEIXIN
    uni.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        // uploadFile({ tempFilePath })
        resolve(tempFilePath)
      },
      fail: (err) => {
        // console.error("uni.chooseImage err->", err)
        reject(err)
      }
    })
  // #endif
  })
}

export default function uploadImg<T = unknown>(
  options: CustomRequestOptions & {
    url: string
    name: string
    formData?: Record<string, unknown>
    headers?: Record<string, string>
  }
) {
  const uploadOptions = {
    ...options
  }
  if (options.headers) {
    uploadOptions.header = options.headers
    delete uploadOptions.headers
  }
  return new Promise<ApiResponseData<T>>((resolve, reject) => {
    chooseImage().then((tempFilePath) => {
      upload<T>({ filePath: tempFilePath, ...uploadOptions }).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    }).catch((err) => {
      reject(err)
    })
  })
}
