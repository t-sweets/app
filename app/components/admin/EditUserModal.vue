<template>
  <div id="editUserModal">
    <sweet-modal ref="editUser" blocking :title="title">
      <div class="main">
        <el-form ref="userRegisterForm" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="ID" v-if="isAdmin && !isNew">
            <p class="form-text">{{ form.id }}</p>
          </el-form-item>
          <el-form-item label="name" prop="name">
            <el-input v-model="form.name" v-if="!isConfirm"></el-input>
            <p class="form-text" v-if="isConfirm">{{ form.name }}</p>
          </el-form-item>
          <el-form-item label="email" prop="email">
            <el-input v-model="form.email" v-if="!isConfirm"></el-input>
            <p class="form-text" v-if="isConfirm">{{ form.email }}</p>
          </el-form-item>
          <div v-if="isSelf || isNew">
            <el-form-item :label="passwordLabel" prop="password">
              <el-input
                type="password"
                v-model="form.password"
                v-if="!isConfirm"
                autocomplete="off"
              ></el-input>
              <p class="form-text" v-if="isConfirm">{{ hidePassword }}</p>
            </el-form-item>
          </div>
          <div v-if="(isSelf || isNew) && !isConfirm">
            <el-form-item label="confirm" prop="checkpass">
              <el-input
                type="password"
                v-model="form.checkpass"
                v-if="!isConfirm"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item v-if="isAdmin" label="authority">
            <el-select v-model="form.authority_id" placeholder="権限を選択" v-if="!isConfirm">
              <el-option
                v-for="authority in authority_index"
                :key="authority.id"
                :label="authority.name"
                :value="authority.id"
              ></el-option>
            </el-select>
            <p class="form-text" v-if="isConfirm">{{ authorityName }}</p>
          </el-form-item>
          <el-form-item>
            <p
              class="form-text"
              v-if="isConfirm && isSelf"
              style="color:red;"
            >パスワードを変更すると、一度ログアウトされます</p>
          </el-form-item>
        </el-form>
      </div>
      <sweet-button slot="button">
        <el-button type="info" @click="close()" v-if="!isConfirm">キャンセル</el-button>
        <el-button type="primary" @click="confirmEdit()" v-if="!isConfirm && !isNew">更新内容を確認</el-button>
        <el-button type="primary" @click="confirmEdit()" v-if="!isConfirm && isNew">登録情報を確認</el-button>
        <el-button type="primary" @click="update()" v-if="isConfirm && !isNew">更新</el-button>
        <el-button type="success" @click="create()" v-if="isConfirm && isNew">登録</el-button>
        <el-button type="info" @click="backEdit()" v-if="isConfirm">戻る</el-button>
      </sweet-button>
    </sweet-modal>
    <sweet-modal ref="successModal" icon="success">
      <div style="margin: 20px;">ユーザ情報を更新しました</div>
      <div class="buttons">
        <el-button type="primary" @click="postUpdate">完了</el-button>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import menu from "~/pages/menu/";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        if (this.form.checkpass !== "") {
          this.$refs.userRegisterForm.validateField("checkpass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== this.form.password) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
    return {
      editUser: null,
      isNew: false,
      isConfirm: false,
      form: {
        id: "",
        name: "",
        email: "",
        password: "",
        checkpass: "",
        authority_id: 4
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please input user name",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "Length should be 3 to 10",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "Please input email address",
            trigger: "blur"
          },
          {
            type: "email",
            message: "Please input correct email address",
            trigger: ["blur", "change"]
          }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
          {
            min: 1,
            message: "Length should be 1 more over.",
            trigger: "blur"
          }
        ],
        checkpass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    open(id) {
      if (id == undefined) {
        this.isNew = true;
        this.form = {
          id: "",
          name: "",
          email: "",
          password: "",
          checkpass: "",
          authority_id: 4
        };
      } else if (this.isSelf) {
        this.editUser = this.user;
        this.form.id = this.editUser.id;
        this.form.name = this.editUser.name;
        this.form.email = this.editUser.email;
        this.form.authority_id = this.editUser.authority;
      } else {
        this.isNew = false;
        this.users.some(user => {
          return user.id == id ? (this.editUser = user) : false;
        });
        this.form.id = this.editUser.id;
        this.form.name = this.editUser.name;
        this.form.email = this.editUser.email;
        this.form.authority_id = this.editUser.authority;
      }
      this.isConfirm = false;
      this.$refs.editUser.open();
    },
    close() {
      this.$refs.editUser.close();
    },
    confirmEdit() {
      this.$refs.userRegisterForm.validate(valid => {
        if (valid) {
          this.isConfirm = true;
        } else {
          return false;
        }
      });
    },
    backEdit() {
      this.isConfirm = false;
    },
    async create() {
      this.close();
      const data = {
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
        authority_id: this.form.authority_id
      };
      if (await this.createUser(data)) {
        this.$refs.successModal.open();
      } else {
        this.$ons.notification.alert("登録に失敗しました");
      }
    },
    async update() {
      this.close();
      const n = this.form,
        o = this.editUser;
      let data = {};
      if (o.name != n.name) data.name = n.name;
      if (o.email != n.email) data.email = n.email;
      if (o.password != n.password && (this.isSelf || this.isNew))
        data.password = n.password;
      if (o.authority_id != n.authority_id) data.authority_id = n.authority_id;

      if (await this.updateUser({ id: o.id, data: data })) {
        this.$refs.successModal.open();
      } else {
        this.$ons.notification.alert("更新に失敗しました");
      }
    },
    postUpdate() {
      this.$refs.successModal.close();
      if (this.isSelf) {
        this.$emit("logout");
      }
    },
    ...mapActions("pos/admin/users-manager", [
      "createUser",
      "getUsers",
      "updateUser"
    ])
  },
  computed: {
    authorityName() {
      return this.authority_index[this.form.authority_id].name;
    },
    title() {
      return this.isNew ? "ユーザー情報登録" : "ユーザー情報更新";
    },
    passwordLabel() {
      return this.isNew ? "password" : "new password";
    },
    hidePassword() {
      return "*".repeat(this.form.password.length);
    },
    ...mapState("pos", ["authority_index"]),
    ...mapState("pos/admin", ["user"]),
    ...mapState("pos/admin/users-manager", ["users"])
  },
  props: ["isSelf", "isAdmin"]
};
</script>

<style lang="scss">
.el-form-item__content {
  text-align: left;
}

p.form-text {
  padding-left: 20px;
  text-align: left;
}
</style>
