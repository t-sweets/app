export const state = () => ({
    reader_ip: process.env.IDM_READER_HOST,
    idm: "",
    displayText: {
        line_1: "",
        line_2: ""
    },
    status: 'pending',
});

export const mutations = {
    setIp(state, ip) {
        state.reader_ip = ip
    },

    setText(state, array) {
        state.displayText = array
    },

    setIDM(state, idm) {
        state.idm = idm
    },
    resetIDM(state) {
        state.idm = null;
    },

    setStatus(state, status) {
        state.status = status
    },
}

export const actions = {
    async readFelica({commit, dispatch, state}, REQUEST_COUNT) {
        if (REQUEST_COUNT < 0) return 408;
        const response = await this.$axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            url: state.reader_ip + "api/v1/card",
            timeout : 5000,
        }).catch(async err => {
            // 通信タイムアウトの場合、通信切断
            if (err.code == 'ECONNABORTED') return {
                status: 408
            }
            return err.response
        })

        if (response && state.status != 'busy') return 'cancel';

        if (response.status == 200) {
            await commit("setIDM", response.data.idm);
            await commit("setStatus", 'pending')
            return true
        } else if (response.status == 204) {
            new Promise(resolve => setTimeout(resolve, 1000))
            return await dispatch("readFelica", REQUEST_COUNT - 1);
        } else {
            await commit("setStatus", 'pending')
            return false
        }
    },


    /**
     * カードリーダをポーリング
     * @param {*} param0 
     */
    async execCardReader({commit, state, dispatch}) {
        const REQUEST_COUNT = 30;
        // LEDを点灯
        dispatch("emissionLED", "waiting")

        // REQUEST_COUNT回ポーリング
        await commit("setStatus", 'busy')
        const response = await dispatch("readFelica", REQUEST_COUNT)
        console.log(response);
        
        if (response === true) {
            await dispatch("emissionLED", "success")
            await dispatch("showMessage", ["Success!", " "])
            dispatch("autoHide", 5000)
            return response
        } else if (response === false || response === 408) {
            await dispatch("emissionLED", "error")
            await dispatch("showMessage", ["Error", " "])
            dispatch("autoHide", 5000)
            return response
        }
        dispatch("autoHide", 0)
    },


    /**
     * カードリーダのモニタへメッセージを表示
     */
    async showMessage({commit, state}, texts) {

        commit("setText", {line_1: texts && texts[0] ? texts[0] : " ", line_2: texts && texts[1] ? texts[1] : " " })
        
        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            url: state.reader_ip + "api/v1/message",
            data: state.displayText,
            timeout : 5000,
        }).catch(err => {
            return false
        })

        if (response.status == 201) {
            return true
        } else return false
    },

    /**
     * カードリーダのLEDを点灯
     */
    async emissionLED({state}, mode) {

        if (!mode) mode = "destroy";
        
        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            url: state.reader_ip + "api/v1/led",
            data: {
                mode: mode
            },
            timeout : 5000,
        }).catch(err => {
            return false
        })
    },

    autoHide({state, dispatch}, timeout) {
        setTimeout(() => {
            if (state.status == "pending") {
                dispatch("emissionLED")
                dispatch("showMessage")
            }
        }, timeout);
    }
}