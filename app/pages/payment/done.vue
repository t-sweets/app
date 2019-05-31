<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left"></div>
      <div class="center">完了</div>
    </v-ons-toolbar>
    <sweet-modal
      ref="modal"
      width="80%"
      overlay-theme="dark"
      :blocking="true"
      :hide-close-button="true"
      icon="success"
    >
      <div class="main">
        <p>購入が完了しました。</p>
        <el-button type="primary" @click="forceReload" round>決済を終了する</el-button>
        <br>
        <el-button
          type="primary"
          @click="receiptPrint"
          :disabled="receiptBtnDisable"
          plain
          round
        >レシートを印刷する</el-button>
      </div>
    </sweet-modal>
  </v-ons-page>
</template>

<script>
import successSound from "~/assets/sounds/success.mp3";
import { mapMutations, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      loading: undefined,
      receiptBtnDisable: false,
      timeout: null
    };
  },
  methods: {
    recognization() {
      this.loading = this.$loading({
        text: "Loading",
        lock: false
      });
    },
    /**
     * 自動で戻るためのメソッド
     */
    reloadTimeout() {
      this.timeout = setTimeout(() => {
        this.$emit("resetPosMain");
      }, 10000);
    },
    /**
     * ボタンを押した時に
     */
    forceReload() {
      clearTimeout(this.timeout);
      this.$emit("resetPosMain");
    },
    receiptPrint() {
      this.receiptBtnDisable = true;
      this.printReceipt(this.receipt_data);
    },
    ...mapActions("pos/receipt-printer", ["printReceipt"])
  },
  computed: {
    ...mapState("pos/receipt-printer", ["receipt_data"])
  },
  mounted() {
    this.$refs.modal.open();
    const audioElem = new Audio(successSound);
    audioElem.play();
    this.reloadTimeout();
  }
};
</script>

<style lang="scss">
.loading {
  width: 100%;
  height: 90vh;
}
.el-loading-spinner .circular {
  width: 100px;
  height: 100px;
}
.el-loading-spinner .el-loading-text {
  font-size: 30px;
}
</style>

<style lang="scss" scoped>
.main {
  width: 100%;
  font-size: 30px;
  p {
    margin: 20px auto;
  }
  button {
    font-size: 20px;
  }
}
</style>
