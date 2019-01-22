<template>
  <v-ons-page>
    <div class="startbody">
      <div class="top-image">
        <img src="~/assets/images/icon.svg" width="20%" alt>
        <p class="top-text">田胡研Sweets
          <br>電子決済システム
        </p>
      </div>

      <div class="progress" style="text-align: center">
        <!-- <el-button round type="primary" @click="start">Start</el-button> -->
        <el-progress :percentage="progress"></el-progress>
      </div>
    </div>
  </v-ons-page>
</template>

<script>
import pos from "~/pages/pos/index";

export default {
  data() {
    return {
      progress: 0
    };
  },
  methods: {
    start() {
      this.$emit("push-page", pos);
    }
  },
  mounted() {
    // some connection access
    let test = setInterval(() => {
      this.progress += 10;
      if (this.progress >= 100) {
        clearInterval(test);
        this.start();
      }
    }, 200);
  }
};
</script>

<style lang="scss" scoped>
.startbody {
  width: 100vw;
  height: 100vh;
  background-color: white;
  .top-image {
    padding-top: 20vh;
    padding-bottom: 50px;
    .top-text {
      margin-top: 20px;
      font-size: 25px;
      font-weight: 500;
      color: #4b9ad8;
    }
  }
}
</style>

<style lang="scss">
.startbody {
  .el-button.is-round {
    border-radius: 100px;
    padding: 15px 40px;
    color: white;
    span {
      font-size: 40px;
    }
  }

  .progress {
    width: 40vw;
    margin: 0 auto;
  }
}
</style>

