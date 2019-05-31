export const state = () => ({
    printer_ip: process.env.PRINTER_HOST,
    receipt_data: {}
})

export const mutations = {
    set_printer_ip: (state, ip) => {
        state.printer_ip = ip
    },
    set_receipt_data: (state, data) => {
        state.receipt_data = data
    }
}

export const actions = {
    async printReceipt({state}, {total_price, payment_data, products}) {
        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            data: {
                icon: "images/icon.png",
                date: $nuxt.dateFormat(new Date(), 'YYYY/MM/DD(E) hh:mm'),
                total_price: total_price,
                ...payment_data,
                items: products 
            },  
            url: state.printer_ip + "receipt",
            timeout : 5000,
        }).catch(err => {
            return err.response
        })
        if (!response) {
            return false
        }
        if (response.status == 200) return true
        else return false
    },

    async testPrint({state}) {
        const response = await this.$axios({
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            data: {
                icon: "images/icon.png",
                date: "2019年3月23日（日） 19:19",
                total_price: 0,
                payment_method: "cash",
                items: [{
                    "name": "正常に接続しています",
                    "pcs": 1,
                    "unit": 0,
                    "price": 0
                }]
            },  
            url: state.printer_ip + "receipt",
            timeout : 5000,
        }).catch(err => {
            return err.response
        })
        if (!response) {
            return false
        }
        if (response.status == 200) return true
        else return false
    }    
}