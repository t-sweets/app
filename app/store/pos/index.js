export const state = () => ({
    auth: {
        "access-token": null,
        "client": null,
        "uid": null
    },

    config: {
        "shop_name": process.env.SHOP_NAME,  // 販売店の名前
        "terminal_id": process.env.TERMINAL_ID,  // POS端末のID（任意識別番号）
        "account_email": process.env.POS_AUTH_EMAIL, // POSAPIアクセス用アカウントID
        "account_password": process.env.POS_AUTH_PASSWORD, // POSAPIアクセス用アカウントPass
    },

    products: [],

    authority_index: {},
});

export const mutations = {
    setAuth(state, {access_token, client, uid}){
        state.auth = {
            "access-token": access_token,
            client: client,
            uid: uid
        }
    },
    setProducts(state, products) {
        state.products = products;
    },
    setAuthorities(state, datas) {
        datas.forEach(data => {
            state.authority_index[data.id] = {
                ...data
            }
        });
    },

    productToHead(state, product) {
        let products = state.products.filter(_product => {
            return _product.id != product.id
        })
        products.unshift(product);
        state.products = products;
    },

    setConfig(state, {shop_name, terminal_id, account_email, account_password}) {
        state.config.shop_name = shop_name;
        state.config.terminal_id = terminal_id;
        state.config.account_email = account_email;
        state.config.account_password = account_password;
    }
}

export const actions = {

    /**
     * POS起動時に実行. 
     */
    async initialize({state, commit }) {
        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            },
            data: {
                email: state.config.account_email,
                password: state.config.account_password
            },
            url: process.env.POS_HOST + "/auth/sign_in"
        })
        .catch(err => {
            return false
        });

        // 正常に通信が完了し、なおかつPOS権限を持っている場合
        if (response.status == 200 && response.data.data.authority_id == 2) {
            await commit("setAuth", {
                access_token: response.headers["access-token"],
                client: response.headers["client"],
                uid: response.headers["uid"]
            });
            return true
        } else {
            return false
        }

    },
    /**
     * 権限一覧の取得
     */
    async getAuthorities({commit, state}) {
        const response = await this.$axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...state.auth
            },
            url: process.env.POS_HOST +"/authorities",
            timeout: 3000
        })
        .catch(err => {
            return err.response
        });

        if (response.status == 200) {
            commit("setAuthorities", response.data)
            return true
        } else {
            return false
        }
    },
    async getProducts({ commit, state }) {
        const response = await this.$axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...state.auth
            },
            url: process.env.POS_HOST +"/products",
            timeout: 3000
        })
        .catch(err => {
            return err.response
        });

        if (response.status == 200) {
            commit("setProducts", response.data)
            return true
        } else {
            return false
        }
    },

    async getProductWithReader({commit, state}, jancode) {
        // return state.products[0];
        if (!jancode) return false;
        const response = await this.$axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...state.auth
            },
            url: process.env.POS_HOST +"/products/jan/"+ jancode,
            timeout: 3000
        })
        .catch(err => {
            return err.response
        });

        if (response.status == 200) {
            // await commit("productToBegining",response.data);
            return response.data
        } else {
            return false
        }
    }
}