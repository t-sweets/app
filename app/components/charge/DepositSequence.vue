<template>
  <div class="calc">
    <div class="title">
      <div class="title">入金額</div>
      <div class="total">{{ total }}</div>
    </div>
    <div class="change">
      <div class="title">おつり</div>
      <div class="change">¥{{ total - amount }}</div>
    </div>
    <div class="calc-buttons">
      <div class="calc-button" v-for="num in calcButtons" :key="num">
        <el-button @click="calcButton(num)" :plain="num == 'AC' ? true : false">{{ num }}</el-button>
      </div>
      <div class="calc-button">
        <el-button type="primary" @click="calcButton('OK')" :disabled="!paymentable">完了</el-button>
      </div>
    </div>
    <el-button @click="$emit('back-amount')" type="text">チャージ額を変更する</el-button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      total: "0",
      calcButtons: [1, 2, 3, 4, 5, 6, 7, 8, 9, "AC", 0]
    };
  },
  methods: {
    reSelect() {
      this.$emit("reSelect");
    },
    calcButton(obj) {
      if (typeof obj === "number") {
        this.total != "0" ? (this.total += obj) : (this.total = obj.toString());
      } else if (obj == "AC") {
        this.total = "0";
      } else if (obj == "OK") {
        this.$emit("exec-charge");
      }
    }
  },
  computed: {
    paymentable() {
      return this.total - this.amount >= 0 ? true : false;
    }
  },
  props: ["amount"]
};
</script>


<style lang="scss" scoped>
.calc {
  @include pc {
    width: 100%;
  }
  @include tab {
    height: 80%;
  }
  display: inline-block;
  text-align: center;
  margin-bottom: 20px;
  .title,
  .change {
    margin: auto 0;
    padding: 5px 30px;
    .title {
      display: inline-block;
    }
    .total {
      display: inline-block;
      width: 400px;
      padding: 0px 10px;
      background-color: rgb(206, 255, 239);
      border: 1px solid rgb(38, 167, 253);
      font-size: 35px;
      text-align: right;
    }
    .change {
      display: inline-block;
      text-align: right;
      width: 400px;
    }
  }
  .calc-buttons {
    margin: 30px;
    margin-bottom: 10px;
    .calc-button {
      display: inline-block;
      width: 30%;
      margin: 5px;
      button {
        width: 100%;
      }
    }
  }
}
</style>

