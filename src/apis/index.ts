import request from "@/utils/request"

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<any>({
    url: "captchaImage",
    method: "GET"
  }).then((res) => {
    return res.data
  })
}
