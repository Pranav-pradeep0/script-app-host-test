const { checkStatus, newPayment } = require("../payment gateway/paymentController");
const router = require("express").Router();

router.post('/payment', newPayment);
router.post('/status/:txnId', checkStatus);

module.exports = router;
