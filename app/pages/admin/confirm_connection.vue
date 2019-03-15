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
  </v-ons-page>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      extraConfig: {
        reader_ip: ""
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

    ...mapMutations("t-pay/card-reader", ["setIp"]),
    ...mapActions("pos/payment-method", ["getPaymentMethod"]),
    ...mapActions("t-pay/card-reader", ["showMessage"])
  },
  computed: {
    ...mapState("pos", ["authority_index"]),
    ...mapState("pos/payment-method", ["payment_method"]),
    ...mapState("pos/admin", ["user"]),
    ...mapState("t-pay/card-reader", ["reader_ip"])
  },
  created() {
    this.extraConfig.reader_ip = this.reader_ip;
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
