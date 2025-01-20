import path, { resolve } from "node:path"
import Uni from "@dcloudio/vite-plugin-uni"
import UniHelperComponents from "@uni-helper/vite-plugin-uni-components"
import UniHelperLayouts from "@uni-helper/vite-plugin-uni-layouts"
import UniHelperManifest from "@uni-helper/vite-plugin-uni-manifest"
import UniHelperPages from "@uni-helper/vite-plugin-uni-pages"
import dayjs from "dayjs"
import { visualizer } from "rollup-plugin-visualizer"
import AutoImport from "unplugin-auto-import/vite"
import { defineConfig, loadEnv } from "vite"
import UniPolyfill from "vite-plugin-uni-polyfill"
import { copyNativeRes } from "./vite-plugins/copyNativeRes"

// https://vitejs.dev/config/
export default async ({ command, mode }) => {
  const UnoCSS = (await import("unocss/vite")).default

  // mode: 区分生产环境还是开发环境
  console.log("command, mode -> ", command, mode)
  // pnpm dev:h5 时得到 => serve development
  // pnpm build:h5 时得到 => build production
  // pnpm dev:mp-weixin 时得到 => build development (注意区别，command为build)
  // pnpm build:mp-weixin 时得到 => build production
  // pnpm dev:app 时得到 => build development (注意区别，command为build)
  // pnpm build:app 时得到 => build production
  // dev 和 build 命令可以分别使用 .env.development 和 .env.production 的环境变量

  const { UNI_PLATFORM } = process.env
  console.log("UNI_PLATFORM -> ", UNI_PLATFORM) // 得到 mp-weixin, h5, app 等

  const env = loadEnv(mode, path.resolve(process.cwd()))
  const {
    VITE_APP_PORT,
    VITE_SERVER_BASEURL,
    VITE_DELETE_CONSOLE,
    VITE_SHOW_SOURCEMAP,
    VITE_APP_PROXY,
    VITE_APP_PROXY_PREFIX
  } = env
  console.log("环境变量 env -> ", env)

  return defineConfig({
    plugins: [
      // https://github.com/uni-helper/vite-plugin-uni-manifest
      UniHelperManifest(),
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniHelperPages({
        exclude: ["**/components/**/**.*"],
        routeBlockLang: "json5",
        dts: "src/types/uni-pages.d.ts"
      }),
      // https://github.com/uni-helper/vite-plugin-uni-layouts
      UniHelperLayouts(),
      // https://github.com/uni-helper/vite-plugin-uni-components
      UniHelperComponents({
        dts: "src/types/auto/components.d.ts",
        directoryAsNamespace: true
      }),
      Uni(),
      UniPolyfill(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: ["vue", "@vueuse/core", "uni-app"],
        dts: "src/types/auto/auto-imports.d.ts",
        dirs: ["src/composables", "src/pinia", "src/utils"],
        vueTemplate: true
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      UnoCSS(),
      // h5环境增加 BUILD_TIME 和 BUILD_BRANCH
      UNI_PLATFORM === "h5" && {
        name: "html-transform",
        transformIndexHtml(html) {
          return html.replace("%BUILD_TIME%", dayjs().format("YYYY-MM-DD HH:mm:ss"))
        }
      },
      // 打包分析插件，h5 + 生产环境才弹出
      UNI_PLATFORM === "h5"
      && mode === "production"
      && visualizer({
        filename: "./node_modules/.cache/visualizer/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true
      }),
      // 只有在 app 平台时才启用 copyNativeRes 插件
      UNI_PLATFORM === "app" && copyNativeRes()
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src")
      }
    },
    define: {
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
      __VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY)
    },
    server: {
      host: "0.0.0.0",
      hmr: true,
      port: Number.parseInt(VITE_APP_PORT, 10),
      // 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
      proxy: JSON.parse(VITE_APP_PROXY || "{}")
        ? {
            [VITE_APP_PROXY_PREFIX]: {
              target: VITE_SERVER_BASEURL,
              changeOrigin: true,
              rewrite: path => path.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), "")
            }
          }
        : undefined
    },
    build: {
      // 方便非h5端调试
      sourcemap: VITE_SHOW_SOURCEMAP === "true", // 默认是false
      target: "es6",
      // 开发环境不用压缩
      minify: mode === "development" ? false : "terser",
      terserOptions: {
        compress: {
          drop_console: VITE_DELETE_CONSOLE === "true",
          drop_debugger: true
        }
      }
    }
  })
}
