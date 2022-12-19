const { fn, col } = require("sequelize");
const { Op } = require("sequelize");

const ChartControllers = require("../controllers/ChartControllers");
const {
  BalanceCrypto,
} = require("../models/TablesExchange/tableBalanceCrypto");
const { Chart } = require("../models/TablesExchange/tableChart");
const {
  HistoryBargain,
} = require("../models/TablesExchange/tableHistoryBargain");
const { Market } = require("../models/TablesExchange/tableMarket");
const { OrderSale } = require("../models/TablesExchange/tableOrderSale");
const { OrderSell } = require("../models/TablesExchange/tableOrdesSell");
const { Wallet } = require("../models/TablesExchange/tableWallet");

function subtractYears(numOfYears, date = new Date()) {
  date.setFullYear(date.getFullYear() - numOfYears);
  return date;
}
const transactionCryptoSale = async (
  firstUser,
  secondUser,
  amount,
  price,
  totald,
  orderType,
  pair
) => {

  const [firstCoin, secondCoin] = pair.split("_");
  let total = (+(amount * price));
  let com = (+(total * 0.002));
  const firstWalletId = (await Wallet.findOne({where:{name:firstCoin}})).id
  const secondWalletId = (await Wallet.findOne({where:{name:secondCoin}})).id

  let firstCoinWalletFirstUser = await BalanceCrypto.findOne({
    where: { userId: firstUser, walletId: firstWalletId },
  });
  let secondCoinWalletFirstUser = await BalanceCrypto.findOne({
    where: { userId: firstUser, walletId: secondWalletId },
  });
  let firstCoinWalletSecondUser = await BalanceCrypto.findOne({
    where: { userId: secondUser, walletId: firstWalletId },
  });
  let secondCoinWalletSecondUser = await BalanceCrypto.findOne({
    where: { userId: secondUser, walletId: secondWalletId },
  });
 
  // if (!firstCoinWalletFirstUser){
  //   if (firstCoin !== 'BTC'){
  //     firstCoinWalletFirstUser = await BalanceCrypto.create({
  //       userId:firstUser, walletId: firstWalletId
  //     })
  //   }
  // }
  // if (!secondCoinWalletFirstUser){
  //   if (secondCoin !== 'BTC'){
  //     secondCoinWalletFirstUser = await BalanceCrypto.create({
  //       userId: firstUser, walletId: secondWalletId
  //     })
  //   }
  // }
  // if (!firstCoinWalletSecondUser){
  //   if (firstCoin !== 'BTC'){
  //     firstCoinWalletSecondUser = await BalanceCrypto.create({
  //       userId: secondUser, walletId: firstWalletId
  //     })
  //   }
  // }
  // if (!secondCoinWalletSecondUser){
  //   if (secondCoin !== 'BTC'){
  //     secondCoinWalletSecondUser = await BalanceCrypto.create({
  //       userId: secondUser, walletId: secondWalletId
  //     })
  //   }

  // }

  if (orderType === 'buy'){
    let updateFirstCoinWalletFirstUser = {
        unconfirmed_balance:
          (+firstCoinWalletFirstUser.unconfirmed_balance) - (total + com),
      };
      await BalanceCrypto.update(updateFirstCoinWalletFirstUser, {
        where: { id: firstCoinWalletFirstUser.id },
      });
      let updateSecondCoinWalletFirstUser = {
        balance: (+secondCoinWalletFirstUser.balance) + (+amount),
      };
      await BalanceCrypto.update(updateSecondCoinWalletFirstUser, {
        where: { id: secondCoinWalletFirstUser.id },
      });
      let updatefirstCoinWalletSecondUser = {balance:(+firstCoinWalletSecondUser.balance) + (total - com)}
      await BalanceCrypto.update(updatefirstCoinWalletSecondUser, {
        where: { id: firstCoinWalletSecondUser.id },
      });
      let updateSecondCoinWalletSecondUser = {unconfirmed_balance:(+secondCoinWalletSecondUser.unconfirmed_balance) - (+amount)};
      await BalanceCrypto.update(updateSecondCoinWalletSecondUser, {
        where: { id: secondCoinWalletSecondUser.id },
      });
  } else {
    let updateFirstCoinWalletFirstUser = {
        balance:
          (+firstCoinWalletFirstUser.balance) + (total - com),
      };
      await BalanceCrypto.update(updateFirstCoinWalletFirstUser, {
        where: { id: firstCoinWalletFirstUser.id },
      });
      let updateSecondCoinWalletFirstUser = {
        unconfirmed_balance: (+secondCoinWalletFirstUser.unconfirmed_balance) - (+amount),
      };
      await BalanceCrypto.update(updateSecondCoinWalletFirstUser, {
        where: { id: secondCoinWalletFirstUser.id },
      });
      let updatefirstCoinWalletSecondUser = {unconfirmed_balance:(+firstCoinWalletSecondUser.unconfirmed_balance) - (total + com)}
      await BalanceCrypto.update(updatefirstCoinWalletSecondUser, {
        where: { id: firstCoinWalletSecondUser.id },
      });
      let updateSecondCoinWalletSecondUser = {balance:(+secondCoinWalletSecondUser.balance) + (+amount)};
      await BalanceCrypto.update(updateSecondCoinWalletSecondUser, {
        where: { id: secondCoinWalletSecondUser.id },
      });
  }

};

const sochetStartChart = async (socket, update, pair) => {

  if (!update) {
    try {
      socket.on("chart_date", async (data) => {
            const { command, currencyPair, start, end, period } = data;
            const allData = await ChartControllers.list(
              command,
              currencyPair,
              start,
              end,
              period
            );
            socket.join(currencyPair);
            socket.emit(`get_chart_data_${currencyPair}`, allData);
          });
    } catch (error) {
        console.log(error);
    }

  }
  // if (update) {
  //   try {
  //       const allData = await ChartControllers.list(
  //           "returnChartData",
  //           pair,
  //           +subtractYears(1),
  //           +new Date(),
  //           86400
  //         );
  //         console.log('work', allData);
  //         socket.join(pair);
  //         socket.emit(`get_chart_data_${pair}`, allData);
  //   } catch (error) {
  //       console.log(error);
  //   }

  // }
};

const OrderClose = async (
  orders,
  amount,
  orderType,
  userId,
  marketId,
  allCom,
  all,
  price
) => {
  if (orderType === "buy") {
    orders.sort((a, b) => {
      return b.price - a.price;
    });
  } else {
    orders.sort((a, b) => {
      return a.price - b.price;
    });
  }
  const io = require("./io.js").get();

  const pairName = await Market.findOne({ where: { id: marketId } });
  let amountTemp = amount;
  for (let i = 0; i < orders.length; i++) {
    const element = orders[i];
    if (+amountTemp >= +element.amount && +amountTemp > 0) {
      //History
      if (orderType !== "buy") {
        await transactionCryptoSale(element.userId, userId, element.amount, element.price, all, 'buy', pairName.pair)
        const historyItem = await HistoryBargain.create({
          tradeID: marketId,
          date: new Date(),
          type: "buy",
          rate: element.amount,
          amount: element.amount,
          total: all,
          totalWithCom: allCom,
          price: element.price,
          userId,
          orderSaleId: element.id,
        });
        try {
          const allData = await ChartControllers.list(
            "returnChartData",
            pairName.pair,
            +subtractYears(1),
            +new Date(),
            86400
          );
          io.emit(`get_chart_data_${pairName.pair}`, allData);
        } catch (error) {
          console.log(error);
        }
      } else {
        await transactionCryptoSale(element.userId, userId, element.amount, element.price, all, 'sell', pairName.pair)
        const historyItem = await HistoryBargain.create({
          tradeID: marketId,
          date: new Date(),
          type: "sell",
          rate: element.amount,
          amount: element.amount,
          total: all,
          totalWithCom: allCom,
          price: element.price,
          userId,
          orderSellId: element.id,
        });
        console.log('2');
        try {
          const allData = await ChartControllers.list(
            "returnChartData",
            pairName.pair,
            +subtractYears(1),
            +new Date(),
            86400
          );
          io.emit(`get_chart_data_${pairName.pair}`, allData);
        } catch (error) {
          console.log(error);
        }
      }
      const totalAmount = await HistoryBargain.findAll({
        attributes: ["tradeID", [fn("sum", col("total")), "total_amount"]],
        group: ["tradeID"],
        raw: true,
        where: {
          tradeID: marketId,
          date: { [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000) },
        },
      });
      //Chart
      // const chartItem = await Chart.create({
      //     date:(+new Date()),
      //     high: i.price,

      // })
      //Market
      const marketForUpdate = await Market.findOne({ where: { id: marketId } });
      const marketUpdate = {
        high24hr: element.price,
        last: element.price,
        baseVolume: totalAmount[0].total_amount,
        percentChange: (element.price * 100) / marketForUpdate.high24hr,
      };
      await Market.update(marketUpdate, { where: { id: marketId } });
      amountTemp = amountTemp - element.amount;
      await element.destroy();
      if (orders.length === i + 1 && +amountTemp > 0) {
        if (orderType === "buy") {
          const item = await OrderSale.create({
            amount: amountTemp,
            price: price,
            marketId,
            userId,
            summ: +amountTemp * +price * 1.02,
            sumWithOutCom: +amountTemp * +price,
          });
        } else {
          const item = await OrderSell.create({
            amount: amountTemp,
            price: price,
            marketId,
            userId,
            summ: +amountTemp * +price * 0.98,
            sumWithOutCom: +amountTemp * +price,
          });
        }
      }
    } else {
      await transactionCryptoSale(element.userId, userId, element.amount, element.price, all, 'buy', pairName.pair)
      if (orderType !== "buy") {
        const historyItem = await HistoryBargain.create({
          tradeID: marketId,
          date: new Date(),
          type: "buy",
          rate: element.amount,
          amount: element.amount,
          total: allCom,
          price: element.price,
          totalWithCom: allCom,
          userId,
          orderSaleId: element.id,
        });
        try {
          const allData = await ChartControllers.list(
            "returnChartData",
            pairName.pair,
            +subtractYears(1),
            +new Date(),
            86400
          );
          io.emit(`get_chart_data_${pairName.pair}`, allData);
        } catch (error) {
          console.log(error);
        }
        let update = {
          amount: ((+element.amount) - (+amountTemp)).toFixed(10),
          summ:
            ((+element.amount) - (+amountTemp)).toFixed(10) * (+element.price) * 0.98,
          sumWithOutCom:
            ((+element.amount) - (+amountTemp)).toFixed(10) * (+element.price),
        };
        await OrderSale.update(update, { where: { id: element.id } });
      } else {
        await transactionCryptoSale(element.userId, userId, element.amount, element.price, all, 'sell', pairName.pair)
        const historyItem = await HistoryBargain.create({
          tradeID: marketId,
          date: new Date(),
          type: "sell",
          rate: element.amount,
          amount: element.amount,
          total: allCom,
          price: element.price,
          totalWithCom: allCom,
          userId,
          orderSaleId: element.id,
        });
        try {
          const allData = await ChartControllers.list(
            "returnChartData",
            pairName.pair,
            +subtractYears(1),
            +new Date(),
            86400
          );
          io.emit(`get_chart_data_${pairName.pair}`, allData);
        } catch (error) {
          console.log(error);
        }
        let update = {
          amount: ((+element.amount) - (+amountTemp)).toFixed(10),
          summ:
            ((+element.amount) - (+amountTemp)).toFixed(10) * (+element.price) * 1.02,
          sumWithOutCom:
            ((+element.amount) - (+amountTemp)).toFixed(10) * (+element.price),
        };
        await OrderSell.update(update, { where: { id: element.id } });
      }
      const totalAmount = await HistoryBargain.findAll({
        attributes: ["tradeID", [fn("sum", col("total")), "total_amount"]],
        group: ["tradeID"],
        raw: true,
        where: {
          tradeID: marketId,
          date: { [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000) },
        },
      });
      const marketForUpdate = await Market.findOne({ where: { id: marketId } });
      const marketUpdate = {
        high24hr: element.price,
        baseVolume: totalAmount[0].total_amount,
        percentChange: (element.price * 100) / marketForUpdate.high24hr,
      };
      await Market.update(marketUpdate, { where: { id: marketId } });
      amountTemp = 0;
    }
  }

};

module.exports = { OrderClose, sochetStartChart };
