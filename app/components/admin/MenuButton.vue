<template>
  <el-card :body-style="{ padding: '0px' }">
    <div class="product-card" :class="menu.size">
      <div class="title">
        <font-awesome-icon v-if="menu.icon" class="card-icon" :icon="menu.icon"/>
        <span>{{ menu.title }}</span>
      </div>
      <div class="description">
        <span>{{ menu.description }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: ["menu"]
};
</script>

<style lang="scss" scoped>
.el-card {
  margin: 10px;
}
.product-card {
  min-height: 200px;
  display: block;

  .title {
    padding: 0 auto;
    font-size: 35px;
    color: #409eff;
    line-height: 140px;
    span {
      margin-left: 15px;
    }
  }

  .description {
    color: #999;
  }

  &.big {
    min-height: 40vh;
    .title {
      padding-top: 100px;
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
