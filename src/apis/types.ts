/** 登录验证码的响应数据（非 data 包装） */
export type LoginCodeResponseData = ApiResponseData<{
  /* uuid */
  uuid: string | null

  /* 图片base64 */
  img: string | null

  /* 验证码状态 */
  captchaEnabled: boolean
}>
