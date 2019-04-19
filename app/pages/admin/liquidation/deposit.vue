<template>
  <v-ons-page>
    <br>
    <v-ons-list modifier="inset">
      <v-ons-list-item modifier="longdivider" :tappable="true" @click="showPopover($event, 'down')">
        <div class="left">金額</div>
        <div class="right">{{ `¥${deposit.price}` }}</div>
      </v-ons-list-item>
      <v-ons-list-item modifier="longdivider">
        <div class="left">担当</div>
        <div class="right" style="color:#666;">{{ user.name }}</div>
      </v-ons-list-item>
    </v-ons-list>
    <br>
    <el-input
      style="padding: 0px 20px;"
      type="textarea"
      :rows="10"
      placeholder="メモ"
      v-model="deposit.memo"
    ></el-input>
    <div class="footer">
      <el-button type="primary" :disabled="deposit.price <= 0">入金する</el-button>
    </div>
    <calc-popover :popover="popover" :total="deposit.price" @confirm="inputPrice"/>
  </v-ons-page>
</template>

<script>
import CalcPopover from "@/components/CalcPopover";
import { mapState } from "vuex";
export default {
  data() {
    return {
      popover: {
        visible: false,
        target: null,
        direction: "up",
        coverTarget: false
      },
      deposit: {
        price: 0,
        memo: ""
      }
    };
  },
  methods: {
    showPopover(event, direction, coverTarget = false) {
      this.popover.target = event;
      this.popover.direction = direction;
      this.popover.coverTarget = coverTarget;
      this.popover.visible = true;
    },
    inputPrice(num) {
      this.deposit.price = num;
      this.popover.visible = false;
    }
  },
  computed: {
    ...mapState("pos/admin", ["user"])
  },
  components: { CalcPopover }
};
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  width: 100%;
  height: 60px;
  background-color: white;
  text-align: right;
  bottom: 0;
  button {
    margin: 10px 20px;
    min-width: 180px;
  }
}
</style>
