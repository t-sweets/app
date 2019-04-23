export const state = () => ({
  safe: {
    amount: 0,
    card_added: 0,
    sales: 0
  }
});

export const mutations = {
  setSafe(state, datas) {
    state.safe = {
      ...datas
    }
  }
}

export const actions = {
  /**
   * 出金
   */
  async setWithdraw({ rootState }, { amount, detail }) {
    const response = await this.$axios({
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        ...rootState.pos.admin.auth
      },
      data: {
        amount: amount,
        detail: detail
      },
      url: process.env.POS_HOST + "/withdraws",
      timeout: 3000
    })
      .catch(err => {
        return err.response
      });

    if (response && response.status == 200) {
      return response.data.change
    } else {
      return false
    }
  },
  /**
   * 入金
   */
  async setDeposit({ rootState }, { amount, detail }) {
    const response = await this.$axios({
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        ...rootState.pos.admin.auth
      },
      data: {
        amount: amount,
        detail: detail
      },
      url: process.env.POS_HOST + "/deposits",
      timeout: 3000
    })
      .catch(err => {
        return err.response
      });

    if (response && response.status == 200) {
      return response.data.change
    } else {
      return false
    }
  },
  /**
   * レジ内残高照会
   */
  async getBalance({commit, rootState}) {
    const response = await this.$axios({
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        ...rootState.pos.admin.auth
      },
      url: process.env.POS_HOST + "/registers/balances",
      timeout: 3000
    })
      .catch(err => {
        return err.response
      });

    if (response && response.status == 200) {
      await commit("setSafe", response.data)
      return true
    } else {
      return false
    }
  },

  /**
   * レジチェックを実行
   */
  async registerCheck({commit, rootState}, amount) {
    const response = await this.$axios({
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        ...rootState.pos.admin.auth
      },
      data: {
        cash_amount: amount
      },
      url: process.env.POS_HOST + "/registers/check",
      timeout: 3000
    })
      .catch(err => {
        return err.response
      });

    if (response && response.status == 200) {
      return response.data.register_check
    } else {
      return false
    }
  }
}