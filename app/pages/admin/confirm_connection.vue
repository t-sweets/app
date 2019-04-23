<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">端末設定</div>
      <div class="right">
        <span class="user-name">{{ user.name }}</span>
      </div>
    </v-ons-toolbar>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <p style="float: left">T-Pay Server</p>
        <el-button style="float: right" type="primary" @click="connect_tpay_server">Connect</el-button>
      </div>
      <el-form ref="form" :model="extraConfig.tpay" label-width="150px">
        <el-form-item label="Account Name">
          <el-input v-model="extraConfig.tpay.name"></el-input>
        </el-form-item>
        <el-form-item label="Account Password">
          <el-input v-model="extraConfig.tpay.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="Merchant ID">
          <el-input v-model="extraConfig.tpay.merchant_id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setTPayAccount">Save</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <p style="float: left">T-Pay Card Reader</p>
        <el-button style="float: right" type="primary" @click="connect_reader">Connect</el-button>
      </div>
      <el-form ref="form" :model="extraConfig" label-width="120px">
        <el-form-item label="IP Address">
          <el-input v-model="extraConfig.reader_ip"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setReaderIp">Change</el-button>
          <el-button @click="resetReaderIp">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <p style="float: left">Receipt Printer</p>
        <el-button style="float: right" type="primary" @click="connect_printer">Connect</el-button>
      </div>
      <el-form ref="form" :model="extraConfig" label-width="120px">
        <el-form-item label="IP Address">
          <el-input v-model="extraConfig.printer_ip"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setPrinterIp">Change</el-button>
          <el-button @click="resetPrinterIp">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </v-ons-page>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      extraConfig: {
        tpay: {
          name: "",
          password: "",
          merchant_Id: ""
        },
        reader_ip: "",
        printer_ip: ""
      }
    };
  },
  methods: {
    async setReaderIp() {
      await this.setIp(this.extraConfig.reader_ip);
      this.$notify({
        title: "IP Changed",
        message: "Reader's IP address changed.",
        type: "success"
      });
    },
    async resetReaderIp() {
      this.extraConfig.reader_ip = process.env.IDM_READER_HOST;
      this.setReaderIp();
    },
    async setTPayAccount() {
      await this.setAccount(this.extraConfig.tpay);
      this.$notify({
        title: "TPay Account Saved",
        message: "T-Pay account has been saved",
        type: "success"
      });
    },

    async connect_tpay_server() {
      if (await this.getApiToken()) {
        this.$notify({
          title: "Success",
          message: "T-Pay Server is Connection Success",
          type: "success"
        });
      } else {
        this.$notify({
          title: "Error",
          message: "Connection refused",
          type: "error"
        });
      }
    },

    async connect_reader() {
      if (await this.showMessage()) {
        this.$notify({
          title: "Success",
          message: "T-Pay reader is Connection Success",
          type: "success"
        });
      } else {
        this.$notify({
          title: "Error",
          message: "Connection refused",
          type: "error"
        });
      }
    },

    async setPrinterIp() {
      await this.set_printer_ip(this.extraConfig.printer_ip);
      this.$notify({
        title: "IP Changed",
        message: "Printer's IP address changed.",
        type: "success"
      });
    },
    async resetPrinterIp() {
      this.extraConfig.printer_ip = process.env.PRINTER_HOST;
      this.setPrinterIp();
    },
    async connect_printer() {
      if (await this.testPrint()) {
        this.$notify({
          title: "Success",
          message: "Receipt Printer is Connection Success",
          type: "success"
        });
      } else {
        this.$notify({
          title: "Error",
          message: "Connection refused",
          type: "error"
        });
      }
    },

    ...mapMutations("t-pay", ["setAccount"]),
    ...mapMutations("t-pay/card-reader", ["setIp"]),
    ...mapMutations("pos/receipt-printer", ["set_printer_ip"]),
    ...mapActions("t-pay", ["getApiToken"]),
    ...mapActions("pos/payment-method", ["getPaymentMethod"]),
    ...mapActions("t-pay/card-reader", ["showMessage"]),
    ...mapActions("pos/receipt-printer", ["testPrint"])
  },
  computed: {
    ...mapState("pos", ["authority_index"]),
    ...mapState("pos/payment-method", ["payment_method"]),
    ...mapState("pos/admin", ["user"]),
    ...mapState("t-pay", ["account"]),
    ...mapState("t-pay/card-reader", ["reader_ip"]),
    ...mapState("pos/receipt-printer", ["printer_ip"])
  },
  created() {
    this.extraConfig.reader_ip = this.reader_ip;
    this.extraConfig.printer_ip = this.printer_ip;
    this.extraConfig.tpay = {
      ...this.account
    };
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  margin: 10px;
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
}
</style>


<style lang="scss">
.toolbar {
  .right {
    > span.user-name {
      margin-right: 10px;
    }
  }
}
</style>
