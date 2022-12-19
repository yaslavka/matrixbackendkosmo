const cheerio = require('cheerio');
const axios = require('axios');

const { Market } = require('../models/TablesExchange/tableMarket');
const { OrderSale } = require('../models/TablesExchange/tableOrderSale');
const { OrderSell } = require('../models/TablesExchange/tableOrdesSell');
const { Op } = require('sequelize');
const { OrderClose } = require('./orderClose');

module.exports = async (param) => {
  const getHTML = async (url) => {
    const { data } = await axios.get(url);
    return cheerio.load(data); 
  };
  const topPairs = [{pair:'RUR_LTC', id:957}, {pair: 'RUR_USD', id:958}, {pair: 'RUR_ETH', id:959}, {pair: 'RUR_DASH', id:960}, {pair:  'RUR_DOGE', id:961}, {pair:  'RUR_EURO', id:962}, {pair:  'RUR_BTC', id:963},
  {pair:  'USD_LTC', id:1933},{pair:  'USD_RUR', id:1934},{pair:  'USD_ETH', id:1935},{pair:  'USD_DASH', id:1936},{pair:  'USD_DOGE', id:1937}, {pair:  'USD_EURO', id:1938},{pair:  'USD_BTC', id:1939},
  {pair:  'BTC_LTC', id:1},{pair:  'BTC_ETH', id:5},{pair:  'BTC_DOGE', id:5},{pair:  'BTC_DASH', id:6},{pair:  'BTC_USDT', id:7}, {pair:  'BTC_XRP', id:9},{pair:  'BTC_TRX', id:10},
]
  const markets = (param === 'all') ? await Market.findAll() : topPairs  
  for (let i = 0; i < markets.length; i++) {
    let pair = markets[i].pair.split('_').reverse().join('/');
    const $ = await getHTML(`https://yobit.net/ru/trade/${pair}`);
    const bestSell = $('#label_bestsell').text()
    const bestBuy = $('#label_bestbuy').text()
    let marketId = markets[i].id; 
    let amount = 0.001
    const orderCheckBuyNull = await OrderSale.findAll({where: {marketId, price: { [Op.gt]: (+bestSell) }}})
    orderCheckBuyNull.map(async(i)=>{
      await OrderClose([i], amount, 'sell', 1, marketId, ((bestSell * amount) * 0.98), (bestSell * amount), bestSell)
    })
    const orderCheckBuyFirst = await OrderSale.findOne({ where: { marketId: marketId, price: bestSell } })
    if (!orderCheckBuyFirst) {
      const orderCheckBuy = await OrderSell.findAll({ where: { marketId: marketId, price: { [Op.lte]: bestSell } } })
      if (orderCheckBuy.length > 0) {
        await OrderClose(orderCheckBuy, amount, 'buy', 1, marketId, ((bestSell * amount) * 1.02), (bestSell * amount), bestSell)
      }
      const itemBuy = await OrderSale.create({
        amount, price: bestSell, marketId, userId: 1, summ: ((bestSell * amount) * 1.02), sumWithOutCom:(bestSell * amount)
      })
    }
    const orderCheckSellNull = await OrderSell.findAll({where: {marketId, price: { [Op.lt]: bestBuy }}})

    orderCheckSellNull.map(async(i)=>{
      await OrderClose([i], amount, 'sell', 1, marketId, ((bestBuy * amount) * 1.02), (bestBuy * amount), bestBuy)
    })

    const orderCheckSellFirst = await OrderSell.findOne({ where: { marketId, price: bestBuy } })
    if (!orderCheckSellFirst) {
      const orderCheckSell = await OrderSale.findAll({ where: { marketId, price: { [Op.gte]: bestBuy } } })
      if (orderCheckSell.length > 0) {
        await OrderClose(orderCheckSell, amount, 'sell', 1, marketId, ((bestBuy * amount) * 0.98), (bestBuy * amount), bestBuy)
      }
      const itemBuy = await OrderSell.create({
        amount, price: bestBuy, marketId, userId: 1, summ: ((bestBuy * amount) * 0.98), sumWithOutCom:(bestBuy * amount)
      })
    }
  
  }

}; 
