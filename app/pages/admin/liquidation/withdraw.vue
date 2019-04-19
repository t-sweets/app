<template>
  <v-ons-page>
    <br>
    <v-ons-list modifier="inset">
      <v-ons-list-item modifier="longdivider" :tappable="true" @click="showPopover($event, 'down')">
        <div class="left">金額</div>
        <div class="right">{{ `¥${withdraw.price}` }}</div>
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
      v-model="withdraw.memo"
    ></el-input>
    <div class="footer">
      <el-button type="primary" :disabled="withdraw.price <= 0" @click="confirmWithdraw">出金する</el-button>
    </div>
    <calc-popover :popover="popover" :total="withdraw.price" @confirm="inputPrice"/>
  </v-ons-page>
</template>

<script>
import CalcPopover from "@/components/CalcPopover";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      popover: {
        visible: false,
        target: null,
        direction: "up",
        coverTarget: false
      },
      withdraw: {
        price: 0,
        memo: ""
      }
    };
  },
  methods: {
    confirmWithdraw() {
      this.$confirm(
        `レジ庫内の残高 ¥${this.withdraw.price} を出金しますか？`,
        "確認",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
          customClass: "over-modal-confirm"
        }
      ).then(() => {
        const response = this.execWithdraw({
          amount: ""
        });
      });
    },
    showPopover(event, direction, coverTarget = false) {
      this.popover.target = event;
      this.popover.direction = direction;
      this.popover.coverTarget = coverTarget;
      this.popover.visible = true;
    },
    inputPrice(num) {
      this.withdraw.price = num;
      this.popover.visible = false;
    },
    ...mapActions("pos/admin/liquidation-manager", { execWithdraw: "withdraw" })
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

<style lang="scss">
.over-modal-confirm {
  z-index: 40010 !important;
}
</style>
