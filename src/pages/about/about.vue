<route lang="json5">
  {
    layout: 'default',
    style: {
      navigationBarTitleText: '关于',
  },
  }
</route>

<script lang="ts" setup>
import uploadImg from "@/utils/uploadImg"

const initialData = undefined
const loading = ref(false)
const data = ref<any>()

function run() {
  // request({ url: '/test1', method: 'POST', query: { name: '我的名字' } })
  //   .then((res) => {
  //     console.log('yes', res)
  //   })
  //   .catch((err) => {
  //     console.log('no', err)
  //   })
  request({ url: "/test1", method: "POST", query: { name: "我的名字" } })
    .then((res) => {
      console.log("yes", res)
    })
    .catch((err) => {
      console.log("no", err)
    })
}

function run2() {
  uploadImg({ url: "/common/upload", method: "POST", name: "file", query: { name: "我的名字" } }).then((res) => {
    console.log("yes", res)
  })
}
function reset() {
  data.value = initialData
}
</script>

<template>
  <button @click="run" class="my-6">
    发送请求
  </button>
  <view class="h-16">
    <view v-if="loading">
      loading...
    </view>
    <block v-else>
      <view class="text-xl">
        请求数据如下
      </view>
      <view class="text-green leading-8">
        {{ JSON.stringify(data) }}
      </view>
    </block>
  </view>
  <button @click="reset" class="my-6" :disabled="!data">
    重置数据
  </button>

  <view class="p-4 text-center">
    <button @click="run2">
      选择图片并上传
    </button>
    <view v-if="loading" class="h-10 text-blue">
      上传...
    </view>
    <template v-else>
      <view class="m-2">
        上传后返回的接口数据：
      </view>
      <view class="m-2">
        {{ data }}
      </view>
      <view class="h-80 w-full">
        <image v-if="data" :src="data || data" mode="scaleToFill" />
      </view>
    </template>
  </view>

  <HiCounter />
</template>

<route lang="json">
{
  "layout": "home"
}
</route>
