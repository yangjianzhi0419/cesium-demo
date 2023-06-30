# vue-cesium

详细说明如何使用 Vue CLI 创建一个新的 Vue 项目

## 步骤

- 创建 vue 项目

```
vue create vue-cesium
```

- 安装 Cesium 库

```
npm install cesium
```

- 配置 webpack

```
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin(
          {
            patterns: [
              {from: 'node_modules/cesium/Build/Cesium', to: 'Cesium'}
            ]
          }
      ),
    ]
  }
})
```

## bug 处理

问题描述

```
BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.
```

处理方式

```
使用第三方库：另一种选择是使用第三方库，例如 node-polyfill-webpack-plugin，它提供了用于自动添加 Node.js 核心模块 polyfills 的功能。

您可以在 webpack 配置中引入该插件，并根据需要配置要包含的模块。

例如，使用 node-polyfill-webpack-plugin，您可以执行以下操作：

安装插件：
npm install node-polyfill-webpack-plugin --save-dev

在 webpack 配置中添加插件：
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  // 其他配置项...
  plugins: [
    new NodePolyfillPlugin(),
  ],
};

该插件会根据您的代码中对 Node.js 核心模块的引用自动添加相应的 polyfills。
```