const { HistoryBargain } = require("../models/TablesExchange/tableHistoryBargain");
const { Op } = require("sequelize");
const { Market } = require("../models/TablesExchange/tableMarket");
const chartPeriod = require("../service/chartPeriod");

class ChartControllers {
  async list(command, currencyPair, start, end, period) {
    let periodMs = 10 * 60 * 1000
    if (command === 'returnChartData'){ 
        if ((currencyPair.split('').length > 3) && start && end && periodMs){
            const tradeID = (await Market.findOne({where:{pair:currencyPair}}))?.id
            const historyItems = await HistoryBargain.findAll({where : {date : {[Op.between] : [new Date(+start), new Date(+end)]},tradeID }})
            let periods = [];
            let bool = true
            let counter = 0;
            if (historyItems.length > 0){
              let periodStart = (+new Date(historyItems[0].date)); 
              let periodEnd = periodStart + (+periodMs)
              do {
                  let periodArr = historyItems.filter((j)=>{
                      let dateToMs = new Date(j.date).getTime()
                      return ((dateToMs >= periodStart) && (dateToMs <= periodEnd))
                  })
                  if (periodArr.length > 0){
                      periods.push({periodArr, date: periodStart})
                      periodStart += (+periodMs)
                      periodEnd += (+periodMs)
                      counter++
                      if (counter === historyItems.length){
                        bool = false 
                      } 
                  } else {
                      periodStart += (+periodMs)
                      periodEnd += (+periodMs)    
                  }  
                } while ((periodStart < end) && (bool));
                return await chartPeriod(periods)
            }
        }
    }
  }
}

module.exports = new ChartControllers(); 
