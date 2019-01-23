<template>
  <el-card :body-style="{ padding: '0px' }">
    <div class="product-card">
      <div class="title">
        <font-awesome-icon class="card-icon" :icon="method.icon"/>
        <span>{{ method.charge_title }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: ["method"]
};
</script>

<style lang="scss" scoped>
.el-card {
  margin: 10px;
}
.product-card {
  height: 200px;
  display: block;

  .title {
    padding-top: 60px;
    font-size: 35px;
    color: #60aefc;
    span {
      margin-left: 15px;
    }
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  &:active {
    background: #ddd;
  }
}

.button {
  padding: 0;
  float: right;
}
</style>
