<template>
  <v-ons-dialog
    class="register-dialog"
    cancelable
    :visible="isShowTotal"
    @posthide="$emit('backMenu')"
  >
    <el-row class="nav">
      <el-col :span="4">
        <v-ons-button
          class="cancel-button"
          @click="change(false)"
          modifier="quiet"
          style="margin: 6px 0"
        >Cancel</v-ons-button>
      </el-col>
      <el-col class="nav-title" :span="16">
        <span>{{ title }}</span>
      </el-col>
      <el-col :span="4"></el-col>
    </el-row>
    <transition name="buttons">
      <div class="tutorial" v-show="reading">
        <div class="animation">
          <div class="handbox">
            <img class="hand" :class="{pause: isPause}" src="~/assets/images/felica_hand.svg" alt>
          </div>
          <img class="reader" src="~/assets/images/felica.png" alt>
        </div>
        <div class="warning">
          <p>{{ announceText }}</p>
        </div>
      </div>
    </transition>
    <transition name="sequence">
      <div class="tutorial" v-show="!reading">
        <div class="qr-box">
          <qriously :value="qrURL" lebel="H" :size="200"/>
          <div class="warning">
            <p>{{ announceText }}</p>
            <p class="subtext">T-Payサイトでログインする事で、アカウントと紐付ける事ができます。</p>

            <el-button type="primary" @click="$emit('registerDone')">完了</el-button>
            <br>
            <el-button type="text" @click="reSelect">別のカードを登録する</el-button>
          </div>
        </div>
      </div>
    </transition>
  </v-ons-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      isPause: false,
      qrURL: null,
      reading: true,

      reader_timeout: 0
    };
  },
  methods: {
    /*
     ** Start Card Reader
     */
    async prepareCharge() {
      this.reader_timeout = 30000;
      await this.startCardReader(); // フラグを立てる
      await this.showMessage(["Touch Felica Card", ""]);

      while (this.isReading && this.reader_timeout > -1) {
        const response = await this.execCardReader();
        this.reader_timeout--;
        if (response == true) {
          // IDを取得後、登録QR発行
          this.registerQR();
          break;
        } else if (response == null) {
          this.$ons.notification.alert("CardReader Error!");
        }
      }
    },
    registerQR() {
      if (this.idm) {
        this.isPause = true; // stop animation
        this.reading = false;
        this.qrURL = `${process.env.TPAY_WEBHOST}?method=register&${this.idm}`;
      } else return false;
    },
    change(bool) {
      if (!bool) this.resetData();
      this.$emit("openModal", bool);
    },
    resetData() {
      this.reading = true;
    },
    reSelect() {
      this.resetData();
      this.reading = true;
      this.qrURL = null;
      this.prepareCharge();
    },
    ...mapActions("t-pay/card-reader", [
      "startCardReader",
      "stopCardReader",
      "execCardReader",
      "showMessage"
    ])
  },
  computed: {
    title() {
      if (this.reading) {
        return "カード情報読取";
      } else {
        return "登録用QRの発行";
      }
    },
    announceText() {
      if (this.reading) return "リーダーに Felicaをかざして下さい";
      else return "スマートフォンでQRを読み取って下さい";
    },
    ...mapState("t-pay/card-reader", ["idm", "isReading"])
  },
  props: ["isShowTotal"],
  async mounted() {
    this.prepareCharge();
  }
};
</script>

<style lang="scss" scoped>
.register-dialog {
  .nav {
    border-bottom: solid 0.5px #999;
    .nav-title {
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      margin-top: 12px;
    }
  }
  .total {
    margin: 20px auto;
    width: 90%;
    .el-row {
      margin: 8px auto;
      font-size: 20px;
      &.quantity {
        color: #777;
      }
      .right {
        text-align: right;
      }
    }
  }
  .payment-btns {
    width: 80%;
    margin: 20px auto;
    button {
      width: 100%;
      font-size: 20px;
      padding: 20px;
      border-radius: 100px;
    }
  }
}
.buttons-leave-active {
  animation-name: fadeOutButtons;
  animation-duration: 0.7s;
}
.buttons-leave {
  opacity: 0;
}
.sequence-enter-active {
  animation-name: fadeInSequence;
  animation-duration: 1.4s;
}
@keyframes fadeOutButtons {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes fadeInSequence {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
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

.tutorial {
  @include pc {
    width: 100%;
  }
  @include tab {
    height: 80%;
  }
  display: inline-block;
  text-align: center;

  .qr-box {
    margin: 30px auto;
    canvas {
      display: table;
    }
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
  .subtext {
    margin: 10px auto;
    font-size: 15px;
    color: #666;
  }
  button {
    width: 250px;
  }
}
</style>


<style lang="scss">
.register-dialog {
  .dialog {
    width: 90%;
    // bottom: 0;
    // top: auto;
    // transform: translate(-50%, 0);
    ons-button.cancel-button {
      color: #555;
      cursor: pointer;
    }
  }
  @media screen and (min-width: 1024px) {
    .dialog {
      width: 80%;
    }
  }
}
</style>

