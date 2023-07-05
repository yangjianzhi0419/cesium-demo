<template>
  <div>
    <y-viewer :camera="camera" @ready="ready"/>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      camera: {
        "position": {
          "lng": 116.3274808593013,
          "lat": 30.74625073352302,
          "height": 27635.237112452098
        },
        "heading": 357.0001006455388,
        "pitch": -58.998846042722924,
        "roll": 359.9998825828364
      }
    }
  },
  methods: {
    ready(obj) {
      const {viewer} = obj;
      const Cesium = window.Cesium;

      this.addDemoGraphic(viewer, Cesium);
    },

    addDemoGraphic(viewer, Cesium) {
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.3, 30.9, 1000),
        ellipsoid: {
          radii: new Cesium.Cartesian3(1500.0, 1500.0, 1500.0),
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        },
        properties: {
          remark: '示例8'
        }
      })
    }
  }
}
</script>

<style>

</style>
