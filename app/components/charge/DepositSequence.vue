<template>
  <div class="base">
    <div class="calc">
      <v-ons-list modifier="inset">
        <v-ons-list-item tappable>
          <div class="center">入金額</div>
          <div class="right">
            <el-input size="large" v-model="total" @focus="showPopover($event)">
              <template slot="prepend">¥</template>
            </el-input>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">釣り銭</div>
          <div class="right">{{ `¥${total - amount}` }}</div>
        </v-ons-list-item>
      </v-ons-list>
      <el-button @click="$emit('back-amount')" type="text">チャージ額を変更する</el-button>
      <div class="payment-btns">
        <el-button
          type="primary"
          round
          :disabled="!paymentable"
          icon="el-icon-message"
          @click="$emit('exec-charge')"
        >チャージをする</el-button>
      </div>
    </div>
    <calc-popover :popover="popover" prefix="¥" :total="total" @confirm="inputPrice"/>
  </div>
</template>

<script>
import CalcPopover from "@/components/CalcPopover";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      total: 0,
      popover: {
        visible: false,
        target: null,
        direction: "down",
        coverTarget: false
      }
    };
  },
  methods: {
    reSelect() {
      this.$emit("reSelect");
    },
    showPopover(event, direction, coverTarget = false) {
      this.popover.target = event;
      this.popover.coverTarget = coverTarget;
      this.popover.visible = true;
    },
    inputPrice(num) {
      this.total = num;
      this.popover.visible = false;
    }
  },
  computed: {
    paymentable() {
      return this.total - this.amount >= 0 ? true : false;
    }
  },
  props: ["amount"],
  components: { CalcPopover },
  created() {
    this.total = this.amount;
  }
};
</script>


<style lang="scss" scoped>
.base {
  margin: 0 auto;
  text-align: center;
  .calc {
    @include pc {
      width: 100%;
    }
    @include tab {
      height: 100%;
    }
    padding: 20px 30px;
    margin-bottom: 20px;
    .el-input {
      font-size: 25px;
    }
    button {
      &.el-button--text {
        font-size: 16px;
      }
    }
    .payment-btns {
      width: 80%;
      margin: 10px auto;
      button {
        width: 100%;
        font-size: 20px;
        padding: 20px;
        border-radius: 100px;
      }
    }
  }
}
</style>

<style lang="scss">
.base {
  .calc {
    .el-input {
      text-align: right;
      margin: 10px auto;
      .el-input__inner {
        height: 55px;
      }
    }
  }
}
</style>

