<template>
  <div ref="viewer" style="width: 100%; height: 100%;">
    <slot></slot>
  </div>
</template>

<script>
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { removeNullItem, isArray } from "@/utils/utils";
import bindEvent from "@/utils/bindEvent";
import {Events} from "@/utils/events";

export default {
  name: "vc-viewer",
  props: {
    // cesium viewer options
    animation: {
      type: Boolean,
      default: false
    },
    baseLayerPicker: {
      type: Boolean,
      default: false
    },
    fullscreenButton: {
      type: Boolean,
      default: false
    },
    geocoder: {
      type: [Boolean, Array],
      default: false
    },
    homeButton: {
      type: Boolean,
      default: false
    },
    infoBox: {
      type: Boolean,
      default: false
    },
    sceneModePicker: {
      type: Boolean,
      default: false
    },
    timeline: {
      type: Boolean,
      default: false
    },
    navigationHelpButton: {
      type: Boolean,
      default: false
    },
    navigationInstructionsInitiallyVisible: {
      type: Boolean,
      default: false
    },

    // custom option
    logo: {
      type: Boolean,
      default: false
    },
    accessToken: {
      type: String,
      default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YzVlMWU5Zi1mODcwLTQzZDEtYTYwOS1hM2IyOTZkOWJkNDkiLCJpZCI6NTgxMjQsImlhdCI6MTYyMjg3OTkyM30.O7_u_MGY66QR8oJOmr1xgKHN_sd3cD2zL195HV7fRu8"
    },
    camera: {
      type: Object,
      default: function () {
        return {
          position: {
            lng: 105,
            lat: 29.999999999999993,
            height: 19059568.497290563
          },
          heading: 360,
          pitch: -90,
          roll: 0
        }
      }
    },
    viewerCreator: Function,
    autoSortImageryLayers: {
      type: Boolean,
      default: true
    }
  },
  created() {
    Object.defineProperties(this, {
      dataSources: {
        enumerable: true,
        get: () => this.viewer && this.viewer.dataSources
      },
      entities: {
        enumerable: true,
        get: () => this.viewer && this.viewer.entities
      },
      imageryLayers: {
        enumerable: true,
        get: () => this.viewer && this.viewer.imageryLayers
      },
      primitives: {
        enumerable: true,
        get: () => this.viewer && this.viewer.scene.primitives
      },
      groundPrimitives: {
        enumerable: true,
        get: () => this.viewer && this.viewer.scene.groundPrimitives
      },
      postProcessStages: {
        enumerable: true,
        get: () => this.viewer && this.viewer.scene.postProcessStages
      }
    })
  },
  mounted() {
    this.load();
  },
  destroyed() {
    this.unload();
  },
  methods: {
    init() {
      const $el = this.$refs.viewer;
      const options = this.viewerOptions();
      Cesium.Ion.defaultAccessToken = this.accessToken;

      let viewer = this.viewerCreator
          ? this.viewerCreator(this, $el, options)
          : new Cesium.Viewer($el, options);
      this.viewer = viewer;

      if (this.camera) {
        this.setCamera(this.camera);
      }
      if (!this.logo) {
        viewer.cesiumWidget.creditContainer.style.display = 'none'
      }

      if (Cesium.defined(viewer.animation)) {
        viewer.animation.viewModel.dateFormatter = this.localeDateTimeFormatter
        viewer.animation.viewModel.timeFormatter = this.localeTimeFormatter
      }
      if (Cesium.defined(viewer.timeline)) {
        viewer.timeline.makeLabel = (time) => {
          return this.localeDateTimeFormatter(time)
        }
        viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime)
      }

      viewer.widgetResizeed = new Cesium.Event();
      this.registerCameraChangedEvent();
      this.registerEvents(true);

      const readyObj = {Cesium, viewer, vm: this};
      this.$emit('ready', readyObj);
      this._mounted = true

      return readyObj;
    },
    viewerOptions() {
      let {
        animation,
        baseLayerPicker,
        fullscreenButton,
        geocoder,
        homeButton,
        infoBox,
        sceneModePicker,
        timeline,
        navigationHelpButton,
        navigationInstructionsInitiallyVisible
      } = this;
      let options = {
        animation,
        baseLayerPicker,
        fullscreenButton,
        geocoder,
        homeButton,
        infoBox,
        sceneModePicker,
        timeline,
        navigationHelpButton,
        navigationInstructionsInitiallyVisible
      };
      removeNullItem(options);
      return options;
    },
    setCamera(val) {
      const {viewer} = this;
      console.log(viewer);
      const position = val.position;
      if (position.lng && position.lat) {
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
              position.lng,
              position.lat,
              position.height || 0,
              viewer.scene.globe.ellipsoid
          ),
          orientation: {
            heading: Cesium.Math.toRadians(val.heading || 360),
            pitch: Cesium.Math.toRadians(val.pitch || -90),
            roll: Cesium.Math.toRadians(val.roll || 0)
          }
        })
      } else if (position.x && position.y && position.z) {
        viewer.camera.setView({
          destination: new Cesium.Cartesian3(position.x, position.y, position.z),
          orientation: {
            heading: val.heading || 2 * Math.PI,
            pitch: val.pitch || -Math.PI / 2,
            roll: val.roll || 0
          }
        })
      }
    },
    registerEvents(flag) {
      const {viewer} = this
      const methodName = flag ? 'addEventListener' : 'removeEventListener'

      viewer.imageryLayers.layerAdded[methodName](this.layerAdded);

      bindEvent.call(this, viewer, undefined, flag);
      Events['viewer-property-events'].forEach((eventName) => {
        const instance =
            isArray(eventName.name) && viewer[eventName.name[0]]
                ? viewer?.[eventName.name[0]]?.[eventName.name[1]]
                : viewer[eventName.name];
        instance && bindEvent.call(this, instance, eventName.events, flag);
      })
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      Events['viewer-mouse-events'].forEach((eventName) => {
        const listener = this.$listeners[eventName]
        if (flag) {
          listener && handler.setInputAction(listener.fns, Cesium.ScreenSpaceEventType[eventName])
        } else {
          listener && handler.removeInputAction(Cesium.ScreenSpaceEventType[eventName])
        }
      })
    },
    registerCameraChangedEvent() {
      const {viewer} = this;
      const listener = this.$listeners['update:camera'];
      listener &&
      viewer.camera.changed.addEventListener(() => {
        const cartographic = viewer.camera.positionCartographic
        let camera
        if (this.camera.position.lng) {
          camera = {
            position: {
              lng: Cesium.Math.toDegrees(cartographic.longitude),
              lat: Cesium.Math.toDegrees(cartographic.latitude),
              height: cartographic.height
            },
            heading: Cesium.Math.toDegrees(viewer.camera.heading || 360),
            pitch: Cesium.Math.toDegrees(viewer.camera.pitch || -90),
            roll: Cesium.Math.toDegrees(viewer.camera.roll || 0)
          }
        } else {
          camera = {
            position: {
              x: viewer.camera.position.x,
              y: viewer.camera.position.y,
              z: viewer.camera.position.z
            },
            heading: viewer.camera.heading || 2 * Math.PI,
            pitch: viewer.camera.pitch || -Math.PI / 2,
            roll: viewer.camera.roll || 0
          }
        }

        if (listener) {
          this.$emit('update:camera', camera)
        }
      });
    },
    layerAdded(layer) {
      const {viewer, autoSortImageryLayers} = this;
      if (viewer.baseLayerPicker) {
        viewer.imageryLayers.raiseToTop(layer);
      }

      // 维护影像图层顺序
      if (autoSortImageryLayers) {
        layer.sortOrder = Cesium.defined(layer.sortOrder) ? layer.sortOrder : 9999;
        viewer.imageryLayers._layers.sort((a, b) => a.sortOrder - b.sortOrder);
        viewer.imageryLayers._update();
      }
    },
    localeDateTimeFormatter(date, viewModel, ignoredate) {
      const {JulianDate} = Cesium
      let TZCode = new Date().getTimezoneOffset() === 0 ? 'UTC' : 'UTC' + '+' + -(new Date().getTimezoneOffset() / 60)
      const jsDate = JulianDate.toDate(date)
      const timeString = jsDate
          .toLocaleString("zh-hans", {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
          })
          .replace(/,/g, '')
      const dateString = jsDate
          .toLocaleString("zh-hans", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
          .replace(/,/g, '')

      if (!ignoredate && (viewModel || jsDate.getHours() + jsDate.getMinutes() === 0)) {
        return dateString
      }

      return ignoredate ? `${timeString} ${TZCode}` : `${dateString} ${timeString} ${TZCode}`
    },
    localeTimeFormatter(time, viewModel) {
      return this.localeDateTimeFormatter(time, viewModel, true)
    },

    load() {
      if (this._mounted) {
        return false
      }
      this.beforeLoad();
      this.init();
    },
    unload() {
      if (!this._mounted) {
        return false
      }

      this.registerEvents(false);
      const {viewer} = this
      viewer && viewer.destroy()

      this.viewer = undefined
      this._mounted = false

      this.$listeners['destroyed'] && this.$emit('destroyed', this)
    },
    reload() {
      this.unload();
      this.load();
    },
    beforeLoad() {
      this.$listeners['beforeLoad'] && this.$emit("beforeLoad");
    },
  }
}
</script>

<style scoped>

</style>
