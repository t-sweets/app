<template>
  <div class="tutorial">
    <div class="animation" v-show="tpay_method == 'felica'">
      <div class="handbox">
        <img class="hand" :class="{pause: isPause}" src="~/assets/images/felica_hand.svg" alt>
      </div>
      <img class="reader" src="~/assets/images/felica.png" alt>
    </div>
    <qriously :value="testURL" :size="200" v-show="tpay_method == 'qr'"/>
    <div class="warning">
      <p>{{ announceText }}</p>
      <el-button @click="reSelect" type="text">別の支払方法を選択する</el-button>
      <el-button @click="changeMethod" type="text">{{ changeMethodText }}</el-button>
      <el-button @click="recognization" type="text">決済テスト</el-button>
    </div>

    <sweet-modal
      ref="modal"
      width="80%"
      overlay-theme="dark"
      :blocking="true"
      :hide-close-button="true"
      icon="success"
    >
      <div class="main">
        <p>決済がタイムアウトしました</p>
        <el-button type="primary" @click="preparePayment();" round>もう一度</el-button>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      isPause: false,
      tpay_method: "felica",
      testURL: "http://www.google.com"
    };
  },
  methods: {
    changeMethod() {
      if (this.tpay_method == "felica") {
        this.tpay_method = "qr";
      } else {
        this.tpay_method = "felica";
        this.preparePayment();
      }
    },
    reSelect() {
      this.$emit("reSelect");
    },
    /*
     ** カードリーダーを起動する
     */
    preparePayment() {
      if (!this.isReading) {
        //決済端末を起動
        this.execCardReader(["Payment Price", this.totalPrice]);
      } else {
        // 起動済みなら、メッセージの書き換えのみ
        this.showMessage(["Payment Price", this.totalPrice]);
      }
    },
    /*
     ** 決済テスト用
     */
    async recognization() {
      this.isPause = true;
      this.loading = this.$loading({
        text: "Loading",
        lock: false
      });

      if (
        await this.purchaseCreate({
          id: this.method.id,
          uuid: "aaaaaaa" // 決済番号
        })
      ) {
        this.loading.close();
        this.$emit("pushSuccess");
      } else {
        this.loading.close();
        this.$ons.notification.alert("決済エラーが発生しました");
      }
    },
    ...mapActions("pos/purchase", ["purchaseCreate"]),
    ...mapActions("t-pay/card-reader", ["execCardReader", "showMessage"])
  },
  computed: {
    changeMethodText() {
      if (this.tpay_method == "felica") return "QRコード認証を使う";
      else return "Felica認証を使う";
    },
    announceText() {
      if (this.tpay_method == "felica")
        return "リーダーに、Felicaをかざしてください";
      else return "スマートフォンでQRを読み取って下さい";
    },

    method() {
      return this.payment_method.filter((_method, index) => {
        if (_method.uuid == "4k4g96ld83") return _method;
      })[0];
    },

    totalPrice() {
      let total = 0;
      this.cart.forEach(product => {
        total += product.price * product.quantity;
      });
      return total;
    },

    ...mapState("payment-method", ["payment_method"]),
    ...mapState("pos/purchase", ["cart"]),
    ...mapState("t-pay/card-reader", [
      "displayText",
      "idm",
      "isPayment",
      "readingTimeout"
    ])
  },
  created() {
    this.preparePayment();
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