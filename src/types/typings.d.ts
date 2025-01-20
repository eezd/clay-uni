// 全局要用的类型放到这里

declare global {
/**
 * 列表请求的基础参数
 */
  export interface ApiRequestTableBase {
  /** 当前页码 */
    pageNum?: number
    /** 每页大小 */
    pageSize?: number
  }

  /**
   * 返回普通响应数据
   */
  export interface ApiResponseData<T> {
  /** 返回的消息 */
    msg: string
    /** 返回的状态码 */
    code: number
    data: T
  }

  /**
   * 返回表格响应数据
   */
  export interface ApiResponseTableData<T> {
  /** 返回的消息 */
    msg: string
    /** 返回的状态码 */
    code: string

    // 数据
    data: T[]
    // 总数
    total: number
  }

  // uni.uploadFile文件上传参数
  interface IUniUploadFileOptions {
    file?: File
    files?: UniApp.UploadFileOptionFiles[]
    filePath?: string
    name?: string
    formData?: any
  }

  interface IUserInfo {
    nickname?: string
    avatar?: string
    /** 微信的 openid，非微信没有这个字段 */
    openid?: string
    token?: string
  }
}

export {} // 防止模块污染
