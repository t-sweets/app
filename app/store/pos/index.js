export const state = () => ({
    auth: {
        "access-token": null,
        "client": null,
        "uid": null
    },
    products: [],

    authority_index: {},


    products1: [
        {
            id: 1,
            name: "カップ麺",
            image_path: require("~/assets/images/Product001.png"),
            price: 130
        },
        {
            id: 2,
            name: "ペットボトル飲料",
            image_path: require("~/assets/images/Product002.png"),
            price: 100
        },
        {
            id: 3,
            name: "缶ジュース",
            image_path: require("~/assets/images/Product003.png"),
            price: 50
        },
        {
            id: 4,
            name: "アイス",
            image_path: require("~/assets/images/Product004.png"),
            price: 100
        },
        {
            id: 5,
            name: "焼きおにぎり",
            image_path: require("~/assets/images/Product005.png"),
            price: 30
        },
        {
            id: 6,
            name: "チャーハン1/2",
            image_path: require("~/assets/images/Product006.png"),
            price: 200
        },

        {
            id: 7,
            name: "ゼリー",
            image_path: require("~/assets/images/Product007.png"),
            price: 30
        },
        {
            id: 8,
            name: "今川焼き",
            image_path: require("~/assets/images/Product008.png"),
            price: 60
        },
        {
            id: 9,
            name: "ポッキー・プリッツ小袋",
            image_path: require("~/assets/images/Product009.png"),
            price: 30
        },
        {
            id: 10,
            name: "スナック・チョコレート",
            image_path: require("~/assets/images/Product010.png"),
            price: 100
        },
        {
            id: 11,
            name: "柿の種・おかき",
            image_path: require("~/assets/images/Product011.png"),
            price: 50
        },
        {
            id: 12,
            name: "ラムネ菓子",
            image_path: require("~/assets/images/Product012.png"),
            price: 70
        }
    ],

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

    productToBegining(state, product) {
        let products = state.products.filter(_product => {
            return _product.id != product.id
        })
        products.unshift(product);
        state.products = products;
    }
}

export const actions = {
    /**
     * POS起動時に実行. 
     */
    async initialize({ commit }) {
        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            },
            data: {
                email: process.env.POS_AUTH_EMAIL,
                password: process.env.POS_AUTH_PASSWORD
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
            await commit("productToBegining",response.data);
            return response.data
        } else {
            return false
        }
    }
}