export const state = () => ({
  sales_data: []
});

export const mutations = {
  setSales(state, data) {
    state.sales_data = data
  }
}

export const actions = {
  /**
   * 商品情報の一覧を取得
   */
  async getMonthlySales({ commit, rootState }, { date, target }) {
    let param;
    switch(target) {
      case "date":
        param = `year=${date.getFullYear()}&month=${date.getMonth()+1}`
        break
      case "month":
        param = `year=${date.getFullYear()}`
        break
      case "year":
        param = "";
        break
    }
    const response = await this.$axios({
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        ...rootState.pos.admin.auth
      },
      url: `${process.env.POS_HOST}/purchases/sales?` + param,
      timeout: 3000
    }).catch(err => {
        return err.response
    });

    if (response.status == 200) {
      commit("setSales", response.data)
      return true
    } else {
      return false
    }
  }
}

export const getters = {
}