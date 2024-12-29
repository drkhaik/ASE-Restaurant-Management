export const payment = async (req, res) => {
    try {
        const {id} = req.body
        if(!id) {
            return res.status(200).json({
                status: 'error',
                message: 'Không có hóa đơn này'
            })
        }
    } catch (e) {
        console.log("check e", e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        })
    }
}

const zaloPayment = async (req, res) => {
    try {
      const { amount, bankCode, items, user } = req.body
      const orderInfo = { amount, bankCode, items, user }
      // Gọi service để tạo order
      const zaloPayResponse = await zaloService.createOrder(orderInfo)
      res.status(200).json({
        message: 'Tạo đơn hàng thành công',
        data: zaloPayResponse
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  
  const zaloPaymentCallback = async (req, res) => {
    try {
      let dataStr = req.body.data
      let reqMac = req.body.mac
      const zaloPaycallBack = await zaloService.zaloPaymentCallback(dataStr, reqMac)
      res.status(200).json({
        message: 'Đã thanh toán đơn hàng',
        data: zaloPaycallBack
      })
    } catch (e) {
      console.log(e)
    }
  }