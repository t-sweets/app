<template>
  <v-ons-popover
    class="calc-popover"
    cancelable
    :visible.sync="popover.visible"
    :target="popover.target"
    :direction="popover.direction"
    :cover-target="popover.coverTarget"
  >
    <div class="calc-pop">
      <div class="content">
        <div class="result-display">{{ `¥${totalPrice}` }}</div>
        <div class="calc-buttons">
          <div
            class="calc-button"
            v-for="num in [9, 8, 7, 6, 5, 4, 3, 2, 1, 'AC', 0, 'OK']"
            :key="num"
          >
            <el-button
              @click="calcButton(num)"
              size="medium"
              :plain="num == 'AC' ? true : false"
              :type="num == 'OK' ? 'primary' : 'default'"
            >{{ num }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </v-ons-popover>
</template>

<script>
export default {
  data() {
    return {
      totalPrice: 0
    };
  },
  props: ["popover", "total"],
  methods: {
    calcButton(obj) {
      if (typeof obj === "number") {
        this.totalPrice != 0
          ? (this.totalPrice = parseInt(this.totalPrice + obj.toString()))
          : (this.totalPrice = obj);
      } else if (obj == "AC") {
        this.totalPrice = 0;
      } else if (obj == "OK") {
        this.$emit("confirm", this.totalPrice);
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.calc-popover {
  .calc-pop {
    .content {
      margin-top: 35px;
      background-color: #eee;
      border-top: 1px solid #ddd;
      .result-display {
        font-size: 35px;
        color: #333;
        text-align: right;
        padding: 5px 10px;
      }
    }
  }
}
.calc-buttons {
  padding: 10px 20px;
  background-color: #fff;
  .calc-button {
    display: inline-block;
    width: 30%;
    margin: 5px;
    button {
      width: 100%;
      font-size: 23px;
    }
  }
}
</style>


<style lang="scss">
.calc-popover {
  .popover__content {
    width: 350px;
  }
}
</style>
