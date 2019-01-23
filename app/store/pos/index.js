export const state = () => ({
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
    products: []
});

export const mutations = {
    setProducts (state, products) {
        state.products = products;
    },
}

export const actions = {
    async getProducts({commit}) {
        await this.$axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                // ...this.$store.state.auth
            },
            url: "api/v1/products"
        })
        .then(response => {
            commit("setProducts", response.data)
            return true
        })
        .catch(err => {
            console.log("error");
        });
    }
}