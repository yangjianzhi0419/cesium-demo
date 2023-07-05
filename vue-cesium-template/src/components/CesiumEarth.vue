<template>
  <div class="cesium-container">
    <div id="cesiumContainer" class="cesium-viewer"></div>
  </div>
</template>

<script>
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

let viewer;
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YzVlMWU5Zi1mODcwLTQzZDEtYTYwOS1hM2IyOTZkOWJkNDkiLCJpZCI6NTgxMjQsImlhdCI6MTYyMjg3OTkyM30.O7_u_MGY66QR8oJOmr1xgKHN_sd3cD2zL195HV7fRu8";

export default {
  name: "CesiumEarth",
  mounted() {
    viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })
    // Add Cesium OSM Buildings, a global 3D buildings layer.
    viewer.scene.primitives.add(Cesium.createOsmBuildings());
    // Fly the camera to San Francisco at the given longitude, latitude, and height.
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-15.0),
      }
    });
  }
}
</script>

<style scoped>
.cesium-container {
  width: 100%;
  height: 100%;
}

.cesium-viewer {
  width: 100%;
  height: 100%;
}
</style>