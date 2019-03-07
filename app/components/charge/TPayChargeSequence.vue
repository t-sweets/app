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
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
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

    /*
     ** Start Card Reader
     */
    async prepareCharge() {
      this.reader_timeout = 10;
      await this.startCardReader(); // フラグを立てる
      await this.showMessage(["Touch Felica", "Card"]);

      while (this.isReading && this.reader_timeout > -1) {
        const response = await this.execCardReader();

        this.reader_timeout--;
        if (response === true) {
          // IDを取得後、登録QR発行
          this.connectApi();
          break;
        } else if (this.reader_timeout <= -1) {
          // exit timeout
          this.emissionLED("error");
          this.isPause = true;
          await this.showMessage(["Timeout Reader", ""]);
          await this.stopCardReader();

          this.$ons.notification.confirm({
            title: "エラー",
            message: "リーダーがタイムアウトしました",
            cancelable: true,
            buttonLabel: ["キャンセル", "再試行"],
            callback: async index => {
              if (index == 1) {
                this.isPause = false;
                this.prepareCharge();
              } else {
                await this.showMessage(["", ""]);
              }
            }
          });
        } else if (response == false) {
          this.$ons.notification.alert("不明なエラーが発生しました。");
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
        this.loading.close();
        this.$emit("amountsInput");
      } else {
        this.loading.close();
        this.$ons.notification.alert("t-payサーバーとの通信に失敗しました");
      }
    },

    async deposit() {
      let response;
      this.loading = this.$loading({
        text: "Loading",
        lock: false
      });
      if (this.idm) {
        response = await this.depositWithFelica({
          amount: this.amount,
          idm: this.idm
        });
      }
      if (response == true) {
        // POSに反映
        this.chargeCreate({
          payment_method_id: this.selectedMethod.id,
          amount: this.amount
        });

        this.loading.close();
        return true;
      } else {
        let message = "T-Payサーバーとの通信の際に不明なエラーが発生しました";
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
        return false;
      }
    },
    ...mapActions("pos/purchase", ["chargeCreate"]),
    ...mapActions("t-pay", [
      "getApiToken",
      "getMerchantID",
      "depositWithFelica"
    ]),
    ...mapActions("t-pay/card-reader", [
      "startCardReader",
      "stopCardReader",
      "execCardReader",
      "showMessage",
      "emissionLED"
    ])
  },
  computed: {
    changeMethodText() {
      if (this.method == "felica") return "QRコード認証を使う";
      else return "Felica認証を使う";
    },
    announceText() {
      if (this.method == "felica") return "リーダーに Felicaをかざして下さい";
      else return "スマートフォンでQRを読み取って下さい";
    },
    ...mapState("t-pay/card-reader", ["displayText", "idm", "isReading"])
  },
  props: ["amount", "selectedMethod"]
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

