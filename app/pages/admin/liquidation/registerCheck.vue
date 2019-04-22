<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">レジチェック</div>
    </v-ons-toolbar>
    <div class="contents">
      <div class="header">
        <div class="top">
          <span class="pos-name">{{ `店名：${config.shop_name}` }}</span>
          <span class="terminal-id">{{ `端末ID：${config.terminal_id}` }}</span>
          <span class="user-name">{{ `担当者：${user.name}` }}</span>
        </div>
        <el-row class="calc-header">
          <el-col :span="7">
            <div class="detail">レジ金額</div>
            <div class="amount">{{ `¥${amount}` }}</div>
          </el-col>
          <el-col :span="1">
            <div class="amount">-</div>
          </el-col>
          <el-col :span="7">
            <div class="detail">想定レジ内金額</div>
            <div class="amount">{{ `¥${safe.amount}` }}</div>
          </el-col>
          <el-col :span="1">
            <div class="amount">=</div>
          </el-col>
          <el-col :span="7">
            <div class="detail">過不足</div>
            <div class="amount" :class="{ under: deficiency < 0 }">{{ `¥${deficiency}` }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="bill-form">
        <el-row class="row" :gutter="20" v-for="(num, index) in actualForm" :key="num.id">
          <el-col :span="7">
            <div class="label">{{ `${num.amount}${num.amount > 500 ? "円札" : "円玉"}` }}</div>
          </el-col>
          <el-col :span="1">
            <div class="operator">×</div>
          </el-col>
          <el-col :span="7">
            <el-input class="calc-input" @focus="showPopover($event, index)" v-model="num.sheets">
              <template slot="append">枚</template>
            </el-input>
          </el-col>
          <el-col :span="1">
            <div class="operator">=</div>
          </el-col>
          <el-col :span="7">
            <div class="result">{{ `¥${num.amount * num.sheets}` }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="footer">
        <el-col :span="20">&nbsp;</el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            :disabled="!isEnableRegiCheck || amount <= 0"
            @click="execRegisterCheck"
          >レジチェック実行</el-button>
        </el-col>
      </div>
    </div>
    <calc-popover :popover="popover" :total="popoverTotal" @confirm="inputSheets"/>
    <sweet-modal
      ref="register-check-success-modal"
      hide-close-button
      blocking
      title="レジチェック完了"
      icon="success"
    >
      レジチェックを完了しました
      <sweet-button slot="button" @click="$refs['hide-close-button blocking'].hide()">完了</sweet-button>
    </sweet-modal>
  </v-ons-page>
</template>

<script>
import CalcPopover from "@/components/CalcPopover";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      actualForm: this.initActualForm(),
      popover: {
        visible: false,
        target: null,
        coverTarget: false,
        target_index: 0
      },
      isEnableRegiCheck: false
    };
  },
  methods: {
    showPopover(event, target_index, coverTarget = false) {
      this.popover.target = event;
      this.popover.coverTarget = coverTarget;
      this.popover.visible = true;
      this.popover.target_index = target_index;
    },
    inputSheets(num) {
      this.actualForm[this.popover.target_index].sheets = num;
      this.popover.visible = false;
    },

    /**
     * レジチェックを実行
     */
    async execRegisterCheck() {
      this.$confirm(`レジチェックを実行しますか？`, "確認", {
        confirmButtonText: "実行",
        cancelButtonText: "キャンセル",
        type: "warning",
        zIndex: 9999
      }).then(async () => {
        const response = await this.registerCheck(this.amount);
        if (response != false) {
          this.$refs["register-check-success-modal"].open();
        }
      });
    },
    /**
     * 札数を初期化する
     */
    initActualForm() {
      return [
        {
          amount: 10000,
          sheets: 0
        },
        {
          amount: 5000,
          sheets: 0
        },
        {
          amount: 2000,
          sheets: 0
        },
        {
          amount: 1000,
          sheets: 0
        },
        {
          amount: 500,
          sheets: 0
        },
        {
          amount: 100,
          sheets: 0
        },
        {
          amount: 50,
          sheets: 0
        },
        {
          amount: 10,
          sheets: 0
        },
        {
          amount: 5,
          sheets: 0
        },
        {
          amount: 1,
          sheets: 0
        }
      ];
    },
    reload() {
      this.actualForm = this.initActualForm();
    },

    ...mapActions("pos/admin/liquidation-manager", [
      "getBalance",
      "registerCheck"
    ])
  },
  computed: {
    /**
     * 入力した枚数から残高を算出
     */
    amount() {
      return this.actualForm.reduce((previous, current) => {
        return (
          (typeof previous === "number"
            ? previous
            : previous["amount"] * previous["sheets"]) +
          current["amount"] * current["sheets"]
        );
      });
    },
    /**
     * 過不足金額を算出
     */
    deficiency() {
      return this.amount - this.safe.amount;
    },
    popoverTotal() {
      return this.actualForm[this.popover.target_index].sheets;
    },
    ...mapState("pos", ["config"]),
    ...mapState("pos/admin", ["user"]),
    ...mapState("pos/admin/liquidation-manager", ["safe"])
  },
  components: { CalcPopover },
  async mounted() {
    if (!(await this.getBalance())) {
      this.$notify.error({
        title: "Error",
        message: "想定レジ内金額を取得できませんでした"
      });
    } else {
      this.isEnableRegiCheck = true;
    }
  }
};
</script>


<style lang="scss" scoped>
.contents {
  .header {
    width: 100%;
    background-color: white;
    border-bottom: 1px solid #666;
    .top {
      width: 100%;
      padding: 15px 30px;
      font-size: 16px;
      text-align: left;
      .pos-name {
        color: #666;
        margin-right: 10px;
      }
      .terminal-id {
        color: #666;
        margin-right: 5vw;
      }
      .user-name {
        color: #4b9ad8;
      }
    }
    .calc-header {
      margin-top: 20px;
      padding-bottom: 20px;
      background-color: white;
      .detail {
        color: #bbb;
      }
      .amount {
        color: #666;
        font-size: 30px;
        letter-spacing: 0.1em;
        &.under {
          color: red;
        }
      }
    }
  }
  .bill-form {
    padding-bottom: 20px;
    background-color: white;
    height: calc(100vh - (45px + 155px + 60px));
    overflow-y: scroll;
    .row {
      margin: 10px auto;
      .el-col {
        color: #666;
        .label {
          font-size: 20px;
          text-align: left;
          margin: 10px 20px;
        }
        .operator {
          font-size: 18px;
          color: #bbb;
          margin: 11px auto;
        }
        .calc-input {
          margin: 5px auto;
        }
        .result {
          font-size: 24px;
          text-align: right;
          padding-top: 8px;
        }
      }
    }
  }
  .footer {
    height: 60px;
    background-color: white;
    border-top: 1px solid #666;
    button {
      margin: 10px;
    }
  }
}
</style>
