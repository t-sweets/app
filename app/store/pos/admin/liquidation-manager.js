export const state = () => ({
  
});

export const mutations = {

}

export const actions = {
  /**
   * 出金
   */  
  async withdraw({commit, rootState}, {amount}) {
    const response = await this.$axios({
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            ...rootState.pos.admin.auth
        },
        data: {
          amount: amount
        },
        url: process.env.POS_HOST+"/withdraws",
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
},
}