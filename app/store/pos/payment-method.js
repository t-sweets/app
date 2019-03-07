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
    async getPaymentMethod({commit, rootState}) {
        commit("resetPaymentMethod");

        let payMethod = [];

        const response = await this.$axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                ...rootState.pos.auth
            },
            url: process.env.POS_HOST + "/payment_methods",
            timeout: 1000,
        })
        .catch(err => {
            return false;
        });

        if (response.status == 200) {
            
            response.data.forEach(method => {
                payMethod.push(method)
            });

            // pay-method に関する情報を追記
            payMethod.some((method) => {
                let plusData = {};
                    switch(method.uuid) {
                        case "F5EF99BC-0FF0-4CA4-805D-5045E12B90CF":
                            plusData = {
                                charge_title: "",
                                icon: ["fas", "cash-register"],
                            }
                            break;
                        case "2ADEA824-0027-41B5-B243-10F2D24FDD4B":  // t-pay
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

            return true
        } else {
            return false
        }

    }
}