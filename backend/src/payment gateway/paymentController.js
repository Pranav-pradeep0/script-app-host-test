const crypto = require('crypto');
const axios = require('axios');
const { merchant_id, salt_key } = require('../../secret');

const newPayment = async (req, res) => {
    try {
        const { name, merchantTransactionId, merchantUserId, amount } = req.body

        const data = {
            merchantId: merchant_id,
            merchantTransactionId,
            merchantUserId,
            name,
            amount: amount * 100,
            // redirectUrl: `http://localhost:8080/scriptview/payment/gateway/status/${merchantTransactionId}`,
            redirectMode: 'POST',
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data)
            return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
        })
            .catch(function (error) {
                console.error(error);
            });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
}

const checkStatus = async (req, res) => {

    const {merchantTransactionId, merchantId} = res.req.body

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
        method: 'GET',
        url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchantId}`
        }
    };

    axios.request(options).then(async (response) => {
        if (response.data.success === true) {
            const url = `http://localhost:3000/success`
            return res.redirect(url)
        } else {
            const url = `http://localhost:3000/failure`
            return res.redirect(url)
        }
    })
        .catch((error) => {
            console.error(error);
        });
};


module.exports = { newPayment, checkStatus }
