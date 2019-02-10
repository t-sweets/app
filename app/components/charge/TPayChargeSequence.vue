<template>
  <div class="tutorial">
    <div class="animation" v-show="method == 'felica'">
      <div class="handbox">
        <img class="hand" :class="{pause: isPause}" src="~/assets/images/felica_hand.svg" alt>
      </div>
      <img class="reader" src="~/assets/images/felica.png" alt>
    </div>
    <qriously :value="testURL" :size="200" v-show="method == 'qr'"/>
    <div class="warning">
      <p>{{ announceText }}</p>
      <el-button @click="changeMethod" type="text">{{ changeMethodText }}</el-button>
      <el-button @click="$emit('testNext')" type="text">テスト</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPause: false,
      method: "felica",
      testURL: "http://www.google.com"
    };
  },
  methods: {
    changeMethod() {
      if (this.method == "felica") this.method = "qr";
      else this.method = "felica";
    },
    recognization() {
      this.isPause = true;
      this.loading = this.$loading({
        text: "Loading",
        lock: false
      });
      setTimeout(() => {
        this.loading.close();
        this.$emit("pushSuccess");
      }, 3000);
    }
  },
  computed: {
    changeMethodText() {
      if (this.method == "felica") return "QRコード認証を使う";
      else return "Felica認証を使う";
    },
    announceText() {
      if (this.method == "felica") return "リーダーに Felicaをかざして下さい";
      else return "スマートフォンでQRを読み取って下さい";
    }
  }
};
</script>


<style lang="scss" scoped>
.tutorial {
  @include pc {
    width: 100%;
  }
  @include tab {
    height: 80%;
  }
  display: inline-block;
  text-align: center;
  canvas {
    display: table;
  }
}

.animation {
  text-align: center;
  .handbox {
    .hand {
      max-width: 50vh;
      margin-left: 25vh;
      animation-name: felicaHandAnimation;
      animation-duration: 1.5s;
      animation-direction: alternate;
      animation-iteration-count: infinite;
      &.pause {
        animation-play-state: paused;
      }
    }
  }
  .reader {
    max-width: 45vh;
    margin-right: 25vh;
    margin-top: -200px;
  }
}
.warning {
  text-align: center;
  margin: 2vh 50px;
  font-size: 30px;
}

@keyframes felicaHandAnimation {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(0deg);
  }
  90% {
    transform: rotate(-40deg);
  }
  100% {
    transform: rotate(-40deg);
  }
}
</style>

<style lang="scss">
.el-loading-mask.is-fullscreen {
  z-index: 30000 !important;
}
</style>

