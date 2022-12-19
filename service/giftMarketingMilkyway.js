const {
    User,
    Matrix,
    Matrix_Table,
    Statistic,
    InvestBox,
    Matrix_TableSecond,
    MatrixSecond
} = require("../models/models");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");
const { Wallet } = require("../models/TablesExchange/tableWallet");
const { checkCountParentIdSweeps } = require("./checkCoountParentIdSweeps");
const { findParentIdSweeps } = require("./findParentIdSweeps");
const { findParentIdForMilkyWay } = require("./findParentIdForMilkyWay");
const  marketingSweepsCheck  = require("../controllers/SweepsControllers");
const marketingSweepsGift = require("../controllers/SweepsControllers");
const { updateOrCreate, updateStatistic, summColumnStatistic } = require("./milkyWayFunc");


const checkForLevel = async (parentId, level) => {

    if (!parentId) {
        return false
    }
    let countRows = await Matrix.count({
        where: { parent_id: parentId }
    })
    const matrixTableEmpty = await Matrix_Table.count({
        matrixId: parentId
    })
    if (matrixTableEmpty < 1) {
        return false
    }
    if (countRows < 3) {
        return false
    } else {
        const matrixTemp = await Matrix.findAll({ include: { model: Matrix_Table, as: "matrix_table" } })
        const matrix = matrixTemp.filter((i, index) => {
            return ((i.matrix_table[0]?.typeMatrixId === level + 1) && (i.matrix_table[0]?.count > 6))
        })
        let parentIdForLevel
        if (matrix.length === 0) {
            parentIdForLevel = null
        } else {
            parentIdForLevel = matrix[0].id
        }

        const user = await Matrix.findOne({ where: { id: parentId } })

        const matrixItem = await Matrix.create({
            date: new Date,
            parent_id: parentIdForLevel,
            userId: user.userId
        })

        const matrixTableCount = await Matrix_Table.findOne({
            where: { typeMatrixId: level, matrixId: parentId }
        })
        if (matrixTableCount) {
            matrixTableCount.matrixId = matrixItem.id;
            matrixTableCount.typeMatrixId = level + 1
            await matrixTableCount.save()

            if (level > 5) {
                const gift = await giftMarketingMilkyway(level, matrixTableCount)
            }
            if (parentIdForLevel && (level < 15)) {
                return checkForLevel(parentIdForLevel, level + 1)
            }
        }

    }

}
const remunerationUser = async(user, summ)=>{
    const walletRUBId = await Wallet.findOne({ where: { name: 'RUR' } })
    const walletRUBBalance = await BalanceCrypto.findOne({
        where: {
            userId: user.id,
            walletId: walletRUBId.id
        }
    })
    let updateBalance = { balance: (+walletRUBBalance.balance) + summ};
    await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
    const statisticData = await Statistic.findOne({where:{userId:user.id}})
    let updateStatisticInventory = {myInviterIncome:statisticData.myInviterIncome + summ}
    await Statistic.update(updateStatisticInventory, {where:{id:statisticData.id}})
}
const remunerationReferal = async(user, summ)=>{
    const referalMatrix = await Matrix_Table.findOne({where:{userId:user.referal_id}})
    if (referalMatrix){
        const referalUser = await User.findOne({where:{id:user.referal_id}})
        const walletRUBId = await Wallet.findOne({ where: { name: 'RUR' } })
        const walletRUBBalance = await BalanceCrypto.findOne({
            where: {
                userId: referalUser.id,
                walletId: walletRUBId.id
            }
        })
        let updateBalance = { balance: (+walletRUBBalance.balance) + summ};
        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
    }
}

const giftMatrixMilkyWay = async(user, count)=>{
    for (let i = 0; i < count; i++) {
        // const matrixTemp = await Matrix.findAll({ include: { model: Matrix_Table, as: "matrix_table" } })
        // const matrix = matrixTemp.filter((i, index) => {
        //     return (((i.matrix_table[0]?.typeMatrixId === 1)))
        // })
        
        const {parentId, typeMatrixId} = await findParentIdForMilkyWay(1, user.id)
        const matrixItem = await Matrix.create({
            date: new Date,
            parent_id: parentId,
            userId: user.id
        })
        const matrixTableItem = await Matrix_Table.create({
            matrixId: matrixItem.id,
            typeMatrixId,
            userId: user.id,
            count: 2160
        })
        const userItemsInMAtrixTable = await Matrix_Table.findAll({
            where: { userId: user.id } 
        })
        const myComet = userItemsInMAtrixTable.reduce((a, b) => a + b.count, 0);
        const allPlanet = await Matrix_Table.count()
        const allComet = (await summColumnStatistic())[0].dataValues.all_count
        const my_planet = await Matrix_Table.count({ where: { userId: user.id } })
        let newItem = { all_comet: allComet, all_planet: allPlanet, first_planet: 0, my_comet: myComet, my_planet, structure_planet: 0, userId: user.id }
        await updateOrCreate(Statistic, { userId: user.id }, newItem)
        await checkForLevel(parentId, 1)
        await updateStatistic(allComet, allPlanet)  
    }
}

const giftInvest = async(user, summ)=>{
    const investBoxItem = await InvestBox.create({
        status:'активный',
        userId:user.id,
        summ:summ
    })
}

const giftPegas = async(user, count)=>{
    const mOneMatrix = await Matrix_TableSecond.findOne({where:{userId:user.id, typeMatrixSecondId:1}})
    if (mOneMatrix){
        let updateCount = { count: mOneMatrix.count + count }
        await Matrix_TableSecond.update(updateCount, { where: { id: mOneMatrix.id } })
    } else {
        const referalId = user.referal_id;
        let parentIdPegas, side_matrix;
        const parentIdForCheck = await findParentIdSweeps(
          1,
          referalId,
          user.id
        );
        if (parentIdForCheck) {
          const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
            parentIdForCheck,
            user.id,
            1
          );
          parentIdPegas = resultFuncCheckCountParentId.parentId;
          side_matrix = resultFuncCheckCountParentId.side_matrix;
        } else {
          parentIdPegas = null;
          side_matrix = null;
        }
  
        const matrixItem = await MatrixSecond.create({
          date: new Date(),
          parent_id: parentIdPegas,
          userId: user.id,
          side_matrix,
        });
  
        const matrixTableItem = await Matrix_TableSecond.create({
          matrixSecondId: matrixItem.id,
          typeMatrixSecondId: 1,
          userId: user.id,
          count: (count - 1), 
        });
        const marketingCheck = await marketingSweepsCheck(parentIdPegas);
        let marketingGiftResult = [];
        if (marketingCheck.length > 0) {
          marketingCheck.map(async (i) => {
            if (i.count) {
              marketingGiftResult.push(await marketingSweepsGift(
                i.count,
                i.parentId,
                1
              ));
            }
          })
        }
    }
}
module.exports = async function (level, matrixTableData){
    const user = await User.findOne({where:{id:matrixTableData.userId}})
    switch (level) {
        case 6:
            //woznograzdeniya
            await remunerationUser(user, 2160)
            //referal woznograzdeniya
            await remunerationReferal(user, 1080)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 1)
            //investbox
            await giftInvest(user, 1000)
            //klon m1
            await giftPegas(user, 2)
            break;
        case 7:
            //woznograzdeniya
            await remunerationUser(user, 6480)
            //referal woznograzdeniya
            await remunerationReferal(user, 3240)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 2)
            //investbox
            await giftInvest(user, 1500)
            //klon m1
            await giftPegas(user, 5)
            break;
        case 8:
            //woznograzdeniya
            await remunerationUser(user, 12960)
            //referal woznograzdeniya
            await remunerationReferal(user, 6480)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 5)
            //investbox
            await giftInvest(user, 2000)
            //klon m1
            await giftPegas(user, 7)
            break;
        case 9:
            //woznograzdeniya
            await remunerationUser(user, 25920)
            //referal woznograzdeniya
            await remunerationReferal(user, 12960)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 10)
            //investbox
            await giftInvest(user, 2500)
            //klon m1
            await giftPegas(user, 10)
            break;
        case 10:
            //woznograzdeniya
            await remunerationUser(user, 30000)
            //referal woznograzdeniya
            await remunerationReferal(user, 15000)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 15)
            //investbox
            await giftInvest(user, 3000)
            //klon m1
            await giftPegas(user, 13)
            break;
        case 11:
            //woznograzdeniya
            await remunerationUser(user, 55000)
            //referal woznograzdeniya
            await remunerationReferal(user, 27500)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 20)
            //investbox
            await giftInvest(user, 3500)
            //klon m1
            await giftPegas(user, 16)
            break;
        case 12:
            //woznograzdeniya
            await remunerationUser(user, 75000)
            //referal woznograzdeniya
            await remunerationReferal(user, 37500)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 25)
            //investbox
            await giftInvest(user, 4000)
            //klon m1
            await giftPegas(user, 19)
            break;
        case 13:
            //woznograzdeniya
            await remunerationUser(user, 95000)
            //referal woznograzdeniya
            await remunerationReferal(user, 47500)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 40)
            //investbox
            await giftInvest(user, 4500)
            //klon m1
            await giftPegas(user, 22)
            break;
        case 14:
            //woznograzdeniya
            await remunerationUser(user, 120000)
            //referal woznograzdeniya
            await remunerationReferal(user, 60000)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 45)
            //investbox
            await giftInvest(user, 5000)
            //klon m1
            await giftPegas(user, 25)
            break;
        case 15:
            //woznograzdeniya
            await remunerationUser(user, 300000)
            //referal woznograzdeniya
            await remunerationReferal(user, 150000)
            // podarocnyye mesta
            await giftMatrixMilkyWay(user, 50)
            //investbox
            await giftInvest(user, 5500)
            //klon m1
            await giftPegas(user, 28)
            break;
    
        default:
            break;
    }
}