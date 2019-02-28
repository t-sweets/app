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
      testURL: "http://www.google.com",
      reader_timeout: 0
    };
  },
  methods: {
    changeMethod() {
      if (this.tpay_method == "felica") {
        this.tpay_method = "qr";
        this.stopCardReader();
      } else {
        this.tpay_method = "felica";
        this.preparePayment();
      }
    },
    reSelect() {
      this.$emit("reSelect");
    },
    /*
     ** Start Card Reader
     */
    async preparePayment() {
      this.reader_timeout = 30000;
      await this.startCardReader(); // フラグを立てる
      await this.showMessage(["Payment Price", this.totalPrice]);

      while (this.isReading && this.reader_timeout > -1) {
        const response = await this.execCardReader();
        this.reader_timeout--;
        if (response == true) {
          // IDを取得後、決済開始
          this.connectApi();
          break;
        } else if (response == null) {
          this.$ons.notification.alert("CardReader Error!");
        }
      }
    },

    /**
     * API Tokenなどの発行
     */
    async connectApi() {
      this.isPause = true;
      this.loading = this.$loading({
        text: "Loading",
        lock: false
      });
      if (await this.getApiToken()) {
        const response = await this.checkoutWithFelica({
          amount: this.totalPrice,
          idm: this.idm
        });
        if (response == true) {
          this.recognization();
        } else {
          let message = "T-Payサーバーとの通信の際に不明なエラーが発生しました";
          console.log(response);

          switch (response) {
            case "Insufficient funds":
              message = "残高不足です。チャージしてください";
              break;
            case "User auth failed":
              message = "このカードは登録されていません";
              break;
            case "Merchant not in auth user":
              message =
                "お使いのアカウントはこの店舗で決済を行うことができません";
              break;
          }
          this.loading.close();
          this.$ons.notification.alert(message);
        }
      }
    },

    async recognization() {
      if (
        await this.purchaseCreate({
          id: this.method.id,
          uuid: this.uuid // 決済番号
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
    ...mapActions("t-pay", [
      "getApiToken",
      "getMerchantID",
      "checkoutWithFelica"
    ]),
    ...mapActions("t-pay/card-reader", [
      "startCardReader",
      "stopCardReader",
      "execCardReader",
      "showMessage"
    ])
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
    ...mapState("pos/payment-method", ["payment_method"]),
    ...mapState("pos/purchase", ["cart"]),
    ...mapState("t-pay", ["uuid"]),
    ...mapState("t-pay/card-reader", ["displayText", "idm", "isReading"])
  },
  mounted() {
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