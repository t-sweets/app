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
      v-model="withdraw.detail"
    ></el-input>
    <div class="footer">
      <el-button type="primary" :disabled="withdraw.price <= 0" @click="confirmWithdraw">出金する</el-button>
    </div>
    <calc-popover :popover="popover" :total="withdraw.price" prefix="¥" @confirm="inputPrice"/>
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
        detail: ""
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
          zIndex: 9999
        }
      ).then(async () => {
        const response = await this.setWithdraw({
          amount: this.withdraw.price,
          detail: this.withdraw.detail
        });
        if (response != false) {
          this.pop_page();
          this.$notify({
            title: "Withdraw Success",
            message: "出金が完了しました",
            type: "success",
            zIndex: 20020
          });
        }
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
    ...mapActions("pos/admin/liquidation-manager", ["setWithdraw"])
  },
  computed: {
    ...mapState("pos/admin", ["user"])
  },
  props: ["pop_page"],
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


