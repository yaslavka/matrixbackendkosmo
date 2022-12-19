const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");

// const {

// } = require("../models/models");
const { Market } = require("../models/TablesExchange/tableMarket");

class MarketControllers {
  async list(req, res, next) {
    const markets = await Market.findAll();
    markets.map((i) => {
      let [market, coin] = i.pair.split('_')
      i.dataValues['market'] = market
      i.dataValues['coin']= coin
      i['lowestAsk'] = i['lowestAsk']
      i['highestBid'] = i['highestBid']
      i['baseVolume'] = i['baseVolume']
      i['high24hr'] = i['high24hr']
      i['low24hr'] = i['low24hr']
    });
    return res.json(markets);
  }
}

module.exports = new MarketControllers(); 
