const { HistoryBargain } = require("../models/TablesExchange/tableHistoryBargain");
const { Market } = require("../models/TablesExchange/tableMarket");
const moment = require('moment')



class ExchangeHistoryControllers {
  async list(req, res, next) {
    const {command, currencyPair, start, end} = req.query
    if (command === 'returnTradeHistory'){
      if ((currencyPair.split('').length > 3) && start && end){
        const tradeID = (await Market.findOne({where:{pair:currencyPair}})).id
        const historyItems = await HistoryBargain.findAll({where : {tradeID }})
        let result = []
        historyItems.map((i)=>{
          result.push({globalTradeID:tradeID, tradeID, date:moment.utc(i.date).format('DD/MM/YYYY'), type:i.type, rate:i.rate, amount:i.amount, total:i.total, orderNumber:null})
        })
        result.sort(function (a,b){
          return new Date(b.date) - new Date(a.date);
        })
        return res.json(result)
      }
    }
  }
}

module.exports = new ExchangeHistoryControllers(); 
  