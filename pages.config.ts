import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages"

export default defineUniPages({
  pages: [],
  globalStyle: {
    backgroundColor: "@bgColor",
    backgroundColorBottom: "@bgColorBottom",
    backgroundColorTop: "@bgColorTop",
    backgroundTextStyle: "@bgTxtStyle",
    navigationBarBackgroundColor: "#000000",
    navigationBarTextStyle: "@navTxtStyle",
    navigationBarTitleText: "Vitesse-Uni",
    navigationStyle: "custom"
  },
  tabBar: {
    backgroundColor: "@tabBgColor",
    borderStyle: "@tabBorderStyle",
    color: "@tabFontColor",
    selectedColor: "@tabSelectedColor",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "static/logo.svg",
        selectedIconPath: "static/logo.svg"
      },
      {
        pagePath: "pages/about/about",
        text: "关于",
        iconPath: "static/logo.svg",
        selectedIconPath: "static/logo.svg"
      }
    ]
  }
})
