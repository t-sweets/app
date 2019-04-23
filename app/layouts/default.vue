<template>
  <v-ons-navigator
    swipeable
    :page-stack="pageStack"
    @push-page="pageStack.push($event)"
    @pop-page="popPage($event)"
    @resetPosMain="resetPosMain()"
  ></v-ons-navigator>
</template>

<script>
import start from "~/pages/startup/";
import index from "~/pages/payment/";
export default {
  // middleware: ["authenticated"],
  data() {
    return {
      pageStack: [start]
    };
  },
  methods: {
    popPage(event) {
      if (event) this.pageStack.splice(this.pageStack.length - 1, 0, event);
      this.pageStack.splice(this.pageStack.length - 1, 1);
    },
    resetPosMain() {
      this.pageStack = [start, index];
    }
  }
};
</script>


<style lang="scss">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

ons-page {
  text-align: center;
}
.toolbar {
  .toolbar__title {
    color: #4b9ad8;
  }
}

.dialog-container {
  -webkit-mask-image: none !important;
}

.el-message-box__wrapper {
  z-index: 20010 !important;
}

.v-modal {
  z-index: 20005 !important;
}
</style>