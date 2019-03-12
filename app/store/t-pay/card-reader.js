export const state = () => ({
    reader_ip: process.env.IDM_READER_HOST,
    idm: "",
    displayText: {
        line_1: "",
        line_2: ""
    },
    isReading: false,
    exitTimeout: {
        callback: null,
        timeout: null
    }
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

    setReading(state, bool) {
        state.isReading = bool
    },

    setWaitExit(state, {callback, time}) {
        state.exitTimeout.callback = callback ? callback : () => {}
        state.exitTimeout.timeout = setTimeout(state.exitTimeout.callback, time ? time : 5000)
    },

    forceExit(state) {
        clearTimeout(state.exitTimeout.timeout);
    }
}

export const actions = {
    async startCardReader({commit, dispatch}) {
        await commit("setReading", true);
    },
    async stopCardReader({commit, dispatch}) {
        await commit("setReading", false);
    },
    /**
     * カードリーダを起動
     */
    async execCardReader({commit, state, dispatch}) {
        dispatch("emissionLED", "waiting")
        
        const response = await this.$axios({
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            url: state.reader_ip + "api/v1/card",
            timeout : 5000,
        }).catch(err => {
            commit("setReading", false)
            return err.response
        })
        
        if (!response) {
            await dispatch("emissionLED", "error")
            await commit("setReading", false)
            return false
        }
        if (response.status == 200) {
            await commit("setIDM", response.data.idm)
            await commit("setReading", false)
            // カードリーダに成功を知らせる
            dispatch("emissionLED", "success")
            dispatch("quitReader")
            return true
        } else if (response.status == 204) {
            return "continue"
        } else {
            await commit("setReading", false)
            await dispatch("emissionLED", "error")
            return false
        }
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

    async quitReader({commit, dispatch}) {
        commit("setWaitExit", {
            callback: () => {
                dispatch("emissionLED")
                dispatch("showMessage")
            },
            time: 5000
        })
    },

    async forceQuitReader({commit, state}) {
        commit("forceExit")
        commit("setReading", false);
        await state.exitTimeout.callback()
    }
}