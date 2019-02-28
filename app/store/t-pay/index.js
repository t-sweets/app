export const state = () => ({
    token: null,
    uuid: null,
})

export const mutations = {
    setToken(state, token) {
        state.token = {
            Authorization: "Token " + token
        };
    },
    setUUID(state, uuid) {
        state.uuid = uuid;
    }
}

export const actions = {

    async getApiToken({commit, state}) {
        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",  
            },
            url: process.env.TPAY_HOST + "/accounts/login/",
            data: {
                username: process.env.TPAY_ACCOUNT_NAME,
                password: process.env.TPAY_ACCOUNT_PASSWORD
            },
            timeout : 5000,
        }).catch(err => {
            return false
        })

        if (response.status == 200) {
            await commit("setToken", response.data.token)
            return true
        } else return false 
    },

    async checkoutWithFelica({commit, state}, {amount, idm}) {
        if (!state.token) return false;

        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...state.token
            },
            url: process.env.TPAY_HOST + "/checkouts/",
            data: {
                merchant_id: process.env.MERCHANT_ID,
                payment_method: 1,
                amount: amount,
                idm: idm,
            },
            timeout : 5000
        }).catch(err => {
            if (err.response.status == 400) {
                return err.response
            } else return false
        })

        if (response.status == 201) {
            await commit("setUUID", response.data.id)
            return true
        } else if (response.status == 400) {
            return response.data.detail;
        } else return false;
    },

    async depositWithFelica({commit, state}, {amount, idm}) {
        if (!state.token) return false;

        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...state.token
            },
            url: process.env.TPAY_HOST + "/deposits/",
            data: {
                merchant_id: process.env.MERCHANT_ID,
                amount: amount,
                idm: idm,
            },
            timeout : 5000
        }).catch(err => {
            if (err.response.status == 400) {
                return err.response
            } else return false
        })

        if (response.status == 201) {
            await commit("setUUID", response.data.id)
            return true
        } else if (response.status == 400) {
            return response.data.detail;
        } else return false;
    }
}
