export const state = () => ({
    payment_method: []
});

export const mutations = {
    setPaymethod(state, method) {
        state.payment_method.push(method);
    },
    resetPaymentMethod(state) {
        state.payment_method = []
    }
}

export const actions = {
    async getPaymentMethod({commit}) {
        commit("resetPaymentMethod");

        let payMethod = [];

        await this.$axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                // ...this.$store.state.auth
            },
            url: "api/v1/payment_methods",
        })
        .then(response => {
            response.data.forEach(method => {
                payMethod.push(method)
            });
        })
        .catch(err => {
            return false;
        });

        payMethod.some((method) => {
            let plusData = {};
                switch(method.uuid) {
                    case "1a0l2s9k3d":
                        plusData = {
                            charge_title: "",
                            icon: ["fas", "cash-register"],
                        }
                        break;
                    case "4k4g96ld83":
                        plusData = {
                            charge_title: "T-Pay チャージ",
                            icon: ["fas", "cash-register"],
                        }
                        break;
                }
                commit("setPaymethod", {
                    ...method,
                    ...plusData
                })
            }
        )

    }
}