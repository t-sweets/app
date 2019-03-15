<template>
  <v-ons-page>
    <div class="aggregation-target">
      <span>集計対象</span>
      <el-select v-model="searchForm.target" placeholder="Select" size="small">
        <el-option
          v-for="item in target_list"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-date-picker
        v-if="this.searchForm.target == 'time'"
        v-model="searchForm.date"
        type="date"
        placeholder="Select"
        size="small"
        :clearable="false"
      ></el-date-picker>
      <el-date-picker
        v-else-if="this.searchForm.target == 'date'"
        v-model="searchForm.date"
        type="month"
        placeholder="Select"
        size="small"
        :clearable="false"
      ></el-date-picker>
      <el-date-picker
        v-else-if="this.searchForm.target == 'month'"
        v-model="searchForm.date"
        type="year"
        placeholder="Select"
        size="small"
        :clearable="false"
      ></el-date-picker>
      <el-button plain style="margin-left: 100px;" size="small" @click="searchExec">表示する</el-button>
    </div>
    <bar-chart ref="barChart" :data="graphData" :options="graphOptions"/>
    <el-table
      class="manage-list"
      :data="dateForTable"
      :default-sort="{prop: 'period', order: 'ascending'}"
      style="width: 100%"
    >
      <el-table-column prop="period" label="集計期間" sortable>
        <template slot-scope="scope">
          <p>{{toStrDate(scope.row.period)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="売上"></el-table-column>
      <el-table-column prop="counts" label="会計数"></el-table-column>
      <el-table-column prop="avarage" label="会計単価">
        <template slot-scope="scope">
          <p>¥{{Math.round(scope.row.avarage)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="販売商品数"></el-table-column>
      <el-table-column label="詳細">
        <template slot-scope="scope">
          <el-button type="text" size="mini">詳細</el-button>
        </template>
      </el-table-column>
    </el-table>
  </v-ons-page>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import BarChart from "~/components/admin/sales/DailySalesChart";

export default {
  data() {
    return {
      searchForm: {
        target: "date",
        date: new Date()
      },
      target_list: [
        {
          value: "time",
          label: "時間別"
        },
        {
          value: "date",
          label: "日別"
        },
        {
          value: "month",
          label: "月別"
        },
        {
          value: "year",
          label: "年別"
        }
      ],
      isShowGraph: false,
      graphData: {
        labels: [],
        datasets: [
          {
            label: "売上",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            data: []
          }
        ]
      },
      graphOptions: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: true
              },
              ticks: {
                min: 0
              }
            }
          ]
        }
      }
    };
  },
  methods: {
    async searchExec() {
      let labels = [];
      if (await this.getMonthlySales(this.searchForm)) {
        switch (this.searchForm.target) {
          case "date":
            for (
              let i = 0;
              i <
              new Date(
                this.searchForm.date.getFullYear(),
                this.searchForm.date.getMonth() + 1,
                0
              ).getDate();
              i++
            ) {
              labels.push(i + 1);
            }
            break;
        }
        this.graphData.datasets[0].data = this.dateForGraph;
        this.graphData.labels = labels;
        this.$refs.barChart.reload();
      }
    },
    toStrDate(date) {
      switch (this.searchForm.target) {
        case "date":
          return this.$nuxt.dateFormat(new Date(date), "MM/DD(E)");
          break;
      }
      return "";
    },

    ...mapActions("pos/admin/sales-manager", ["getMonthlySales"])
  },
  computed: {
    /*
     ** 売上がない場合でも
     */
    dateForGraph() {
      let data;
      switch (this.searchForm.target) {
        //データを入れる配列を宣言
        case "date":
          const created_time = new Date(this.searchForm.date);
          data = new Array(
            new Date(
              created_time.getFullYear(),
              created_time.getMonth() + 1,
              0
            ).getDate()
          );
          break;
      }
      // 初期値を0に
      for (let i = 0; i < data.length; i++) {
        data[i] = 0;
      }

      // 取得したデータを格納
      this.sales_data.forEach(item => {
        switch (this.searchForm.target) {
          case "date":
            data[new Date(item.created_at).getDate() - 1] += item.sales;
            break;
        }
      });
      return data;
    },
    dateForTable() {
      let data = [];

      this.sales_data.forEach(item => {
        switch (this.searchForm.target) {
          case "date":
            let added = false;
            // すでにlistに存在すれば
            data.some(column => {
              if (
                new Date(column.period).getDate() ==
                new Date(item.created_at).getDate()
              ) {
                column.sales += item.sales;
                column.counts++;
                column.avarage = column.sales / column.counts;
                item.purchase_items.forEach(purchase_items => {
                  column.quantity += purchase_items.quantity;
                });

                added = true;
              } else return false;
            });
            // listになければ新規登録
            if (!added) {
              let firstData = {
                period: item.created_at,
                sales: item.sales,
                counts: 1,
                avarage: item.sales / 1,
                quantity: 0,
                payment_method: new Array(this.payment_method.length)
              };
              item.purchase_items.forEach(purchase_items => {
                firstData.quantity += purchase_items.quantity;
              });
              for (let i = 0; i < firstData.payment_method.length; i++) {
                firstData.payment_method[i] =
                  i + 1 == item.payment_method_id ? 1 : 0;
              }
              data.push(firstData);
            }
            break;
        }
      });
      return data;
    },

    ...mapState("pos/payment-method", ["payment_method"]),
    ...mapState("pos/admin/sales-manager", ["sales_data"])
  },
  components: {
    BarChart
  },
  mounted() {
    this.searchExec();
    this.dateForTable;
  }
};
</script>

<style lang="scss" scoped>
.aggregation-target {
  background-color: #ddd;
  width: 95vw;
  margin: 10px auto;
  padding: 10px;
  border-radius: 2px;
  text-align: left;
  span {
    margin: 0px 20px;
  }
  .el-select {
    width: 100px;
  }
}
</style>

