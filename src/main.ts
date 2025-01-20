import { createSSRApp } from "vue"
import App from "./App.vue"
import { prototypeInterceptor, requestInterceptor, routeInterceptor } from "./interceptors"
import store from "./pinia"
import "uno.css"

export function createApp() {
  const app = createSSRApp(App)

  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(prototypeInterceptor)

  return {
    app
  }
}
