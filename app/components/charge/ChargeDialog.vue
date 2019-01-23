<template>
  <v-ons-dialog class="total-dialog" cancelable :visible="isShowTotal" @posthide="change(false)">
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
      <t-pay
        v-if="!addReady && uuid  == '4k4g96ld83'"
        @pushSuccess="pushSuccess"
        @testNext="testNext"
      ></t-pay>
    </transition>
    <transition name="sequence">
      <div v-show="addReady">
        <div class="charge-price">
          <el-input-number v-model="price" size="large" :min="500" :step="500" :max="10000"></el-input-number>
        </div>
        <div class="total">
          <el-row class="quantity">
            <el-col :span="20">チャージ先</el-col>
            <el-col class="right" :span="4">{{ methodName }}</el-col>
          </el-row>
          <el-row class="price">
            <el-col :span="20">合計金額</el-col>
            <el-col class="right" :span="4">¥{{ price }}</el-col>
          </el-row>
        </div>

        <div class="payment-btns">
          <el-button type="primary" round icon="el-icon-message">チャージをする</el-button>
        </div>
      </div>
    </transition>
  </v-ons-dialog>
</template>

<script>
import TPay from "~/components/charge/TPayChargeSequence";
import QRPay from "~/components/pos/QRPaySequence";

export default {
  data() {
    return {
      price: 500,
      addReady: false
    };
  },
  props: ["isShowTotal", "selectedMethod"],
  methods: {
    change(bool) {
      if (!bool) this.resetData();
      this.$emit("showTotal", bool);
    },
    resetData() {
      this.addReady = false;
      this.price = 500;
    },
    tpay() {
      this.change(false);
      this.$emit("pushTPay");
    },
    testNext() {
      this.addReady = true;
    },
    pushSuccess() {
      this.$emit("pushSuccess");
    }
  },
  components: {
    TPay,
    QRPay
  },
  computed: {
    methodName() {
      return this.selectedMethod ? this.selectedMethod.name : "";
    },
    title() {
      if (this.addReady || !this.selectedMethod) {
        return "チャージ金額を入力";
      } else {
        switch (this.selectedMethod.uuid) {
          case "4k4g96ld83":
            return "ユーザー認証";
        }
      }
    },
    uuid() {
      return this.selectedMethod ? this.selectedMethod.uuid : "";
    }
  }
};
</script>

<style lang="scss" scoped>
.total-dialog {
  .nav {
    border-bottom: solid 0.5px #999;
    .nav-title {
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      margin-top: 12px;
    }
  }
  .charge-price {
    border-bottom: solid 0.5px #999;
    height: 30vh;
    .el-input-number {
      width: 80%;
      line-height: calc(80px - 2px);
      margin: 75px 10%;
    }
  }
  .contents {
    width: 80%;
    height: 10vh;
    margin: 5px auto;
    &:not(:last-child) {
      border-bottom: solid 0.5px #999;
    }
    .image {
      height: 100%;
      padding-bottom: 5px;
      img {
        height: 100%;
        border-radius: 5px;
      }
    }
    .middle-center {
      height: 10vh;
      display: table-cell;
      vertical-align: middle;
      .product-name {
        font-size: 18px;
        font-weight: 400;
      }
      .product-quantity {
        font-size: 13px;
        color: #999;
      }
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
</style>


<style lang="scss">
.total-dialog {
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
      width: 60%;
    }
  }
}

.charge-price {
  .el-input-number {
    .el-input {
      font-size: 50px;
      .el-input__inner {
        height: 80px;
      }
    }
    .el-input-number__increase,
    .el-input-number__decrease {
      font-size: 20px;
    }
  }
}
</style>

