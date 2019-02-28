<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">チャージ選択</div>
    </v-ons-toolbar>

    <el-row>
      <el-col :span="8" v-for="method in methods" :key="method.id" :offset="0">
        <div @click="selectMethod(method)">
          <payment-button ref="prod" :method="method"/>
        </div>
      </el-col>
    </el-row>

    <charge-dialog
      v-if="isShowTotal"
      :isShowTotal="isShowTotal"
      :selectedMethod="selectedMethod"
      @showTotal="showTotal"
      @pushSuccess="pushSuccess"
    />
  </v-ons-page>
</template>

<script>
import pos from "~/pages/payment/";
import DonePage from "~/pages/charge/done";
import ChargeDialog from "~/components/charge/ChargeDialog";
import PaymentButton from "~/components/charge/PaymentButton";

import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      isShowTotal: false,
      selectedMethod: null
    };
  },
  components: {
    PaymentButton,
    ChargeDialog
  },
  methods: {
    /*
     ** 関数から決済パネルの表示非表示を定める
     */
    showTotal(bool) {
      this.isShowTotal = bool;
    },
    selectMethod(method) {
      this.selectedMethod = method;
      this.showTotal(true);
    },
    pushSuccess() {
      this.showTotal(false);
      this.$emit("push-page", DonePage);
    },
    ...mapActions("pos/payment-method", ["getPaymentMethod"])
  },
  computed: {
    methods() {
      let methods = [];
      this.payment_method.forEach(method => {
        if (method.addable == "1") methods.push(method);
      });
      return methods;
    },
    ...mapState("pos/payment-method", ["payment_method"])
  },
  async created() {}
};
</script>

