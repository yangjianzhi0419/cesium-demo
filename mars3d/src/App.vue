<template>
  <div>
    <y-viewer @ready="ready"/>
  </div>
</template>

<script>

export default {
  name: 'App',
  methods: {
    ready(obj) {
      const { viewer } = obj;
      const Cesium = window.Cesium;


    }
  }
}
</script>

<style>

</style>
