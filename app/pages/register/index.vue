<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button @click.prevent="backMenu"></v-ons-back-button>
      </div>
      <div class="center">T-Payカード登録</div>
    </v-ons-toolbar>
    <register-modal
      ref="registerModal"
      :isShowTotal="isShowTotal"
      @openModal="openModal"
      @backMenu="backMenu"
      @registerDone="registerDone"
    />
  </v-ons-page>
</template>

<script>
import registerModal from "~/components/register/TPayCardRegister";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isShowTotal: false
    };
  },
  methods: {
    openModal(bool) {
      if (bool) this.isShowTotal = true;
      else this.isShowTotal = false;
    },
    backMenu() {
      this.openModal(false);
      this.$emit("pop-page");
    },
    registerDone() {
      this.openModal(false);
      this.$emit("resetPosMain");
    }
  },
  components: { registerModal },
  computed: {
    ...mapGetters("t-pay", ["isServiceable"])
  },
  mounted() {
    if (this.isServiceable) {
      this.openModal(true);
    } else {
      this.$alert("管理者へ問い合わせください。", "エラー(401)", {
        confirmButtonText: "OK",
        callback: action => {
          this.$emit("pop-page");
        }
      });
    }
  }
};
</script>
