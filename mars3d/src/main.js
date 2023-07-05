import Vue from 'vue'
import App from './App.vue'

import VueCesiumViewer from 'vue-cesium-viewer'
Vue.use(VueCesiumViewer)

import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
window.Cesium = Cesium;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
