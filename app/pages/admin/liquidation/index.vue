<template>
  <v-ons-dialog :visible.sync="dialogVisible" class="inspect-dialog">
    <v-ons-navigator
      swipeable
      :page-stack="pageStack"
      @dialog-push-page="pageStack.push($event)"
      @dialog-pop-page="popPage($event)"
      @dialog-hide="dialogVisible = false"
    ></v-ons-navigator>
  </v-ons-dialog>
</template>

<script>
import menu from "@/components/admin/liquidation/menu";

export default {
  data() {
    return {
      pageStack: [menu],
      dialogVisible: false
    };
  },
  methods: {
    openModal() {
      this.dialogVisible = true;
    },
    popPage(event) {
      if (event) this.pageStack.unshift(event);
      this.pageStack.splice(1, this.pageStack.length - 1);
    }
  }
};
</script>


<style lang="scss" scoped>
.inspect-dialog {
}
</style>


<style lang="scss">
.inspect-dialog {
  .dialog {
    width: 60%;
    height: 60vh;
    border-radius: 10px;
    z-index: 1000;
    ons-button.cancel-button {
      color: #555;
      cursor: pointer;
    }

    .list--inset {
      margin: 0 20px;
    }
  }
  .inspect-menu-button {
    width: 100%;
    margin: 10px 0px;
  }
}
</style>
