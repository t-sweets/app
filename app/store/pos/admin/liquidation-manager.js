export const state = () => ({

});

export const mutations = {

}

export const actions = {
  /**
   * 出金
   */
  async withdraw({ rootState }, { amount, detail }) {
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
  async deposit({ rootState }, { amount, detail }) {
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
  async balance({rootState}) {
    const response = await this.$axios({
      method: "POST",
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
      return response.data
    } else {
      return false
    }
  }
}