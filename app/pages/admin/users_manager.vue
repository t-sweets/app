<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">ユーザ管理</div>
      <div class="right">
        <span>{{ user.name }}</span>
      </div>
    </v-ons-toolbar>

    <el-table :data="users" :default-sort="{prop: 'id', order: 'ascending'}" style="width: 100%">
      <el-table-column prop="name" sortable label="Name"></el-table-column>
      <el-table-column prop="email" label="Email"></el-table-column>
      <el-table-column prop="authority_id" label="authority" sortable>
        <template slot-scope="scope">{{toAuthStr(scope.row.authority_id)}}</template>
      </el-table-column>
      <el-table-column label="Edit" width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="preEdit(scope.row.id)" plain>編集</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Del" width="80">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.id != user.id"
            type="danger"
            size="mini"
            @click="preDelete(scope.row.id)"
            plain
          >削除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="tabber">
      <div class="contents tabber-contents">
        <el-row class="middle-center">
          <el-col :span="4">
            <el-button @click="$refs.userEdit.open()" class="tab-button">新規登録</el-button>
          </el-col>
          <el-col :span="20">
            <div style="width:100%;height:10px;"></div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="height:80px;"></div>

    <edit-user-modal :isAdmin="true" :isSelf="false" ref="userEdit"/>
    <sweet-modal ref="confirmDel" blocking overlay-theme="dark" icon="warning">
      <div class="main">登録されているユーザを消去します。よろしいですか？</div>
      <div class="buttons">
        <el-button type="info" @click="$refs.confirmDel.close()">キャンセル</el-button>
        <el-button type="danger" @click="userDelete">消去</el-button>
      </div>
    </sweet-modal>
    <sweet-modal ref="deleteComplete" icon="success">
      <div class="main">ユーザを消去しました</div>
      <div class="buttons">
        <el-button type="primary" @click="$refs.deleteComplete.close()">OK</el-button>
      </div>
    </sweet-modal>
  </v-ons-page>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import EditUserModal from "~/components/admin/EditUserModal";

export default {
  data() {
    return {
      delID: null
    };
  },
  components: {
    EditUserModal
  },
  computed: {
    ...mapState("pos", ["authority_index"]),
    ...mapState("pos/admin", ["user"]),
    ...mapState("pos/admin/users-manager", ["users"])
  },
  methods: {
    toAuthStr(id) {
      return this.authority_index[id].name;
    },
    preEdit(id) {
      this.$refs.userEdit.open(id);
    },
    preDelete(id) {
      this.delID = id;
      this.$refs.confirmDel.open();
    },
    async userDelete() {
      this.$refs.confirmDel.close();
      if (await this.deleteUser(this.delID)) {
        this.delID = null;
        this.$refs.deleteComplete.open();
      } else {
        this.$ons.notification.alert("ユーザの削除に失敗しました");
      }
    },
    ...mapActions("pos/admin/users-manager", ["getUsers", "deleteUser"])
  },
  async mounted() {
    if (await this.getUsers()) {
    } else {
      this.$ons.notification.alert({
        title: "通信エラー",
        message: "ユーザ情報を取得できませんでした"
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.contents {
  width: 95%;
  &.tabber-contents {
    margin: 0 auto;
    .el-row {
      margin-top: 8px;
      .quantity {
        color: #777;
      }
      .tab-button {
        margin-top: 12px;
        width: 95%;
      }
    }
  }
}
.el-col-offset-0 {
  margin: 2%;
}
ons-search-input {
  min-width: 95%;
}
.tabber {
  font-family: -apple-system, "Helvetica Neue", "Helvetica", "Arial",
    "Lucida Grande", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  display: flex;
  bottom: 0;
  left: 0;
  right: 0;
  white-space: nowrap;
  position: fixed;
  margin: 0;
  padding: 0;
  background-color: #fafafa;
  border-top: 1px solid #ccc;
  width: 100%;
  height: 80px;
}

.sweet-content {
  .main {
    margin: 20px;
  }
}
</style>

<style lang="scss" scoped>
.toolbar {
  .right {
    > * {
      margin-right: 10px;
    }
  }
}
</style>