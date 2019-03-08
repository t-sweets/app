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
          <el-button type="primary" @click="saveReaderIp(extraConfig.reader_ip)">Change</el-button>
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
    async resetReaderIp() {
      await this.saveReaderIp("");
      await this.setIp(
        this.getReaderIp != "" ? this.getReaderIp : process.env.IDM_READER_HOST
      );
      this.extraConfig.reader_ip = this.getReaderIp;
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
    ...mapMutations("localStorage", ["saveReaderIp"]),
    ...mapActions("pos/payment-method", ["getPaymentMethod"]),
    ...mapActions("t-pay/card-reader", ["showMessage"])
  },
  computed: {
    ...mapState("pos", ["authority_index"]),
    ...mapState("pos/payment-method", ["payment_method"]),
    ...mapState("pos/admin", ["user"]),
    ...mapGetters("localStorage", ["getReaderIp"])
  },
  created() {
    this.extraConfig.reader_ip = this.getReaderIp;
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
