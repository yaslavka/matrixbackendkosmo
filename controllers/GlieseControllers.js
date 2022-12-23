const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const {BalanceCrypto} = require("../models/TablesExchange/tableBalanceCrypto");
const {Wallet} = require("../models/TablesExchange/tableWallet");
const { findParentIdGliese } = require("../service/findParentIdGliese");
const {
    checkCountParentIdGliese,
} = require("../service/checkCountParentIdGliese");
const {
    CloneStatFour,
    User,
    Matrix_TableFour,
    TypeMatrixFour,
    MatrixFour, Matrix_TableSix, MatrixSix
} = require("../models/models");
const {findParentIdAida} = require("../service/findParentIdAida");
const {checkCountParentIdAida} = require("../service/checkCoountParentIdAida");
const marketingAidaGift = require('./AidaControllers')
const marketingAidaCheck = async (parent_id) => {
    if (!parent_id) {
        return false;
    }
    const countNode = await MatrixSix.count({ where: { parent_id } });
    return countNode
};
const findRealUser = async (id, userId) => {
    const matrixThirdItem = await MatrixFour.findOne({ where: { id } });
    const matrixTableData = await Matrix_TableFour.findOne({
        where: { matrixFourId: id },
    });
    if (matrixTableData) {
        const result = await Matrix_TableFour.findOne({
            where: {
                typeMatrixFourId: matrixTableData.typeMatrixFourId,
                userId: userId,
            },
        });
        return result;
    } else {
        return findRealUser(matrixThirdItem.parent_id, userId);
    }
};
const marketingGlieseCheck = async (parent_id) => {
    if (!parent_id) {
        return false;
    }
    const countNode = await MatrixFour.count({ where: { parent_id } });
    return countNode
};

const placetwo = async (matrix_id, parent_id, user, side_matrix, res)=>{
    let matrix = matrix_id + 1
    let checkMatrixTable = await Matrix_TableFour.findOne({
        where: {userId: user.id, typeMatrixFourId: matrix},
    });
    if (!checkMatrixTable) {
        const referalId = user.referal_id;
        let parentId, side_matrix;
        const parentIdForCheck = await findParentIdGliese(
            matrix,
            referalId,
            user.id
        );
        if (parentIdForCheck) {
            const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                parentIdForCheck,
                user.id,
                matrix
            );
            parentId = resultFuncCheckCountParentId.parentId;
            side_matrix = resultFuncCheckCountParentId.side_matrix;
        } else {
            parentId = null;
            side_matrix = null;
        }

        const matrixItem = await MatrixFour.create({
            date: new Date(),
            parent_id: parentId,
            userId: user.id,
            side_matrix,
        });

        const matrixTableItem = await Matrix_TableFour.create({
            matrixFourId: matrixItem.id,
            typeMatrixFourId: matrix,
            userId: user.id,
            count: 0,
        });
        const marketingCheck = await marketingGlieseCheck(parentId);
        if (marketingCheck > 0) {
            await placetwo(parentId, matrix_id, marketingCheck);
        }
        return res.json(true);
    } else {
        let updateTable = {count: checkMatrixTable.count + 1};
        await Matrix_TableFour.update(updateTable, {
            where: {userId: user.id, typeMatrixFourId: matrix},
        });
        return res.json(updateTable);
    }
}
const transitionToHighLevelGliese = async (matrixId, level, user) => {
    let nextLevel = level + 1;
    const referalId = user.referal_id;
    let parentId, side_matrix;
    const parentIdForCheck = await findParentIdGliese(nextLevel, referalId, user.id);
    if (parentIdForCheck) {
        const resultFuncCheckCountParentId = await checkCountParentIdGliese(
            parentIdForCheck,
            user.id,
            nextLevel
        );
        parentId = resultFuncCheckCountParentId.parentId;
        side_matrix = resultFuncCheckCountParentId.side_matrix;
    } else {
        parentId = null;
        side_matrix = null;
    }

    const matrixItem = await MatrixFour.create({
        date: new Date(),
        parent_id: parentId,
        userId: user.id,
        side_matrix,
    });

    const matrixTableItem = await Matrix_TableFour.create({
        matrixFourId: matrixItem.id,
        typeMatrixFourId: nextLevel,
        userId: user.id,
        count: 0,
    });
    const marketingCheck = await marketingGlieseCheck(parentId);
    if (marketingCheck) {
        const gift = await marketingGlieseGift(parentId, nextLevel);
    }
};
const marketingGlieseGift = async (parentId, type_matrix_id, count) => {
    const matrixItemThree = await MatrixFour.findOne({
        where: { id: parentId },
    });
    const user = await User.findOne({ where: { id: matrixItemThree.userId } });
    let updateBalance;
    const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
    const walletRUBBalance = await BalanceCrypto.findOne({
        where: {
            userId: user.id,
            walletId: walletRUBId.id
        }
    })
    switch (type_matrix_id) {
        case 1:
            if (count === 3){
                await transitionToHighLevelGliese(parentId, type_matrix_id, user);
            }
            break;
        case 2:
            if (count === 2){
                await transitionToHighLevelGliese(parentId, type_matrix_id, user);
            }
            break;
        case 3:
            if (count === 2){
                await transitionToHighLevelGliese(parentId, type_matrix_id, user);
            }
            break;
        case 4:
            if (count === 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 20000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count === 2){
                const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                if (matrixKeplerCheckReferal){
                    const referalUser = await User.findOne({where:{id:user.referal_id}})
                    const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                        where: {
                            userId: referalUser.id,
                            walletId: walletRUBId.id
                        }
                    })
                    let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 20000 };
                    await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                }
                await transitionToHighLevelGliese(parentId, type_matrix_id, user);
            }
            break;
        case 5:
            if (count === 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 50000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count === 2){
                const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                let checkMatrixTable = await Matrix_TableFour.findOne({
                    where: { userId: user.id, typeMatrixFourId: 1 },
                });
                if (!checkMatrixTable) {
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdGliese(
                        1,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                            parentIdForCheck,
                            user.id,
                            1
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixFour.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableFour.create({
                        matrixFourId: matrixItem.id,
                        typeMatrixFourId: 1,
                        userId: user.id,
                        count: 1,
                    });
                    const marketingCheck = await marketingGlieseCheck(parentId);
                    if (marketingCheck > 0) {
                        await marketingGlieseGift(parentId, 1, marketingCheck);
                    }
                } else {
                    let updateTable = { count: checkMatrixTable.count + 2 };
                    await Matrix_TableFour.update(updateTable, {
                        where: { userId: user.id, typeMatrixFourId: 1 },
                    });
                }
                if (matrixKeplerCheckReferal){
                    const referalUser = await User.findOne({where:{id:user.referal_id}})
                    const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                        where: {
                            userId: referalUser.id,
                            walletId: walletRUBId.id
                        }
                    })
                    let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 30000 };
                    await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                }
                await transitionToHighLevelGliese(parentId, type_matrix_id, user);
            }
            break;
        case 6:
            if (count === 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 50000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count === 2){
                const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                let checkMatrixTable = await Matrix_TableFour.findOne({
                    where: { userId: user.id, typeMatrixFourId: 1 },
                });
                if (!checkMatrixTable) {
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdGliese(
                        1,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                            parentIdForCheck,
                            user.id,
                            1
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixFour.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableFour.create({
                        matrixFourId: matrixItem.id,
                        typeMatrixFourId: 1,
                        userId: user.id,
                        count: 1,
                    });
                    const marketingCheck = await marketingGlieseCheck(parentId);
                    if (marketingCheck > 0) {
                        await marketingGlieseGift(parentId, 1, marketingCheck);
                    }
                } else {
                    let updateTable = { count: checkMatrixTable.count + 2 };
                    await Matrix_TableFour.update(updateTable, {
                        where: { userId: user.id, typeMatrixFourId: 1 },
                    });
                }
                if (matrixKeplerCheckReferal){
                    const referalUser = await User.findOne({where:{id:user.referal_id}})
                    const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                        where: {
                            userId: referalUser.id,
                            walletId: walletRUBId.id
                        }
                    })
                    let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 30000 };
                    await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                }
                await transitionToHighLevelGliese(parentId, type_matrix_id, user);
            }
            break;
        case 7:
            if (count === 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 150000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count === 2){
                const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                let checkMatrixTable = await Matrix_TableFour.findOne({
                    where: { userId: user.id, typeMatrixFourId: 1 },
                });
                if (!checkMatrixTable) {
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdGliese(
                        1,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                            parentIdForCheck,
                            user.id,
                            1
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixFour.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableFour.create({
                        matrixFourId: matrixItem.id,
                        typeMatrixFourId: 1,
                        userId: user.id,
                        count: 1,
                    });
                    const marketingCheck = await marketingGlieseCheck(parentId);
                    if (marketingCheck > 0) {
                        await marketingGlieseGift(parentId, 1, marketingCheck);
                    }
                } else {
                    let updateTable = { count: checkMatrixTable.count + 2 };
                    await Matrix_TableFour.update(updateTable, {
                        where: { userId: user.id, typeMatrixFourId: 1 },
                    });
                }
                if (matrixKeplerCheckReferal){
                    const referalUser = await User.findOne({where:{id:user.referal_id}})
                    const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                        where: {
                            userId: referalUser.id,
                            walletId: walletRUBId.id
                        }
                    })
                    let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 30000 };
                    await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                }
                await transitionToHighLevelGliese(parentId, type_matrix_id, user);
            }
            break;
        case 8:
            if (count === 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 350000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count === 2){
                const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                let checkMatrixTable = await Matrix_TableFour.findOne({
                    where: { userId: user.id, typeMatrixFourId: 1 },
                });
                if (!checkMatrixTable) {
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdGliese(
                        1,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                            parentIdForCheck,
                            user.id,
                            1
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixFour.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableFour.create({
                        matrixFourId: matrixItem.id,
                        typeMatrixFourId: 1,
                        userId: user.id,
                        count: 4,
                    });
                    const marketingCheck = await marketingGlieseCheck(parentId);
                    if (marketingCheck > 0) {
                        await marketingGlieseGift(parentId, 1, marketingCheck);
                    }
                } else {
                    let updateTable = { count: checkMatrixTable.count + 5 };
                    await Matrix_TableFour.update(updateTable, {
                        where: { userId: user.id, typeMatrixFourId: 1 },
                    });
                }
                if (matrixKeplerCheckReferal){
                    const referalUser = await User.findOne({where:{id:user.referal_id}})
                    const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                        where: {
                            userId: referalUser.id,
                            walletId: walletRUBId.id
                        }
                    })
                    let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 50000 };
                    await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                }
                await transitionToHighLevelGliese(parentId, type_matrix_id, user);
            }
            break;
        case 9:
            if (count === 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 1000000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count === 2){
                const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                let checkMatrixTable = await Matrix_TableFour.findOne({
                    where: { userId: user.id, typeMatrixFourId: 1 },
                });
                if (!checkMatrixTable) {
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdGliese(
                        1,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                            parentIdForCheck,
                            user.id,
                            1
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixFour.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableFour.create({
                        matrixFourId: matrixItem.id,
                        typeMatrixFourId: 1,
                        userId: user.id,
                        count: 2,
                    });
                    const marketingCheck = await marketingGlieseCheck(parentId);
                    if (marketingCheck > 0) {
                        await marketingGlieseGift(parentId, 1, marketingCheck);
                    }
                } else {
                    let updateTable = { count: checkMatrixTable.count + 3 };
                    await Matrix_TableFour.update(updateTable, {
                        where: { userId: user.id, typeMatrixFourId: 1 },
                    });
                }
                if (matrixKeplerCheckReferal){
                    const referalUser = await User.findOne({where:{id:user.referal_id}})
                    const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                        where: {
                            userId: referalUser.id,
                            walletId: walletRUBId.id
                        }
                    })
                    let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 70000 };
                    await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                }
                await transitionToHighLevelGliese(parentId, type_matrix_id, user);
            }
            break;
        case 10:
            if (count === 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 2000000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count === 2){
                const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                let checkMatrixTable = await Matrix_TableSix.findOne({
                    where: { userId: user.id, typeMatrixSixId: 1 },
                });
                let checkMatrixTabl = await Matrix_TableFour.findOne({
                    where: { userId: user.id, typeMatrixFourId: 1 },
                });
                if (!checkMatrixTabl) {
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdGliese(
                        1,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                            parentIdForCheck,
                            user.id,
                            1
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixFour.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableFour.create({
                        matrixFourId: matrixItem.id,
                        typeMatrixFourId: 1,
                        userId: user.id,
                        count: 2,
                    });
                    const marketingCheck = await marketingGlieseCheck(parentId);
                    if (marketingCheck > 0) {
                        await marketingGlieseGift(parentId, 1, marketingCheck);
                    }
                } else {
                    let updateTable = { count: checkMatrixTabl.count + 3 };
                    await Matrix_TableFour.update(updateTable, {
                        where: { userId: user.id, typeMatrixFourId: 1 },
                    });
                }
                if (!checkMatrixTable) {
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdAida(
                        1,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdAida(
                            parentIdForCheck,
                            user.id,
                            1
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixSix.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableSix.create({
                        matrixFourId: matrixItem.id,
                        typeMatrixSixId: 1,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingAidaCheck(parentId);
                    if (marketingCheck > 0) {
                         await marketingAidaGift(parentId, 1, marketingCheck);
                    }
                } else {
                    let updateTable = { count: checkMatrixTable.count + 1 };
                    await Matrix_TableSix.update(updateTable, {
                        where: { userId: user.id, typeMatrixSixId: 1 },
                    });
                }
                if (matrixKeplerCheckReferal){
                    const referalUser = await User.findOne({where:{id:user.referal_id}})
                    const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                        where: {
                            userId: referalUser.id,
                            walletId: walletRUBId.id
                        }
                    })
                    let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 200000 };
                    await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                }
            }
            break;
        default:
            break;
    }
};

const childNode = async (node, type_matrix_id) => {
    if (!node) {
        return null;
    }
    let matrix = await MatrixFour.findAll({
        where: { parent_id: node },
        include: {
            model: User,
            as: "user",
        },
    });
    return matrix;
};

class GlieseControllers {
    async getType(req, res, next) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const user = await User.findOne({ where: { username } });
        const type = await Matrix_TableFour.findAll({
            where: { userId: user.id },
        });
        const typeMatrix = await TypeMatrixFour.findAll();
        let result = [];
        for (let i = 1; i < 11; i++) {
            const countItem = type.filter((j)=>{
                return j.typeMatrixFourId === i
            })
            result.push({
                id: i,
                count: countItem[0]?.dataValues?.count || 0,
                name: typeMatrix[i - 1].name,
                level: i,
                canBuy: true,
                isActive: true,
                summ: typeMatrix[i - 1].summ,
            });
        }
        return res.json({ items: result });
    }
    async getCloneStat(req, res, next) {
        const count = await CloneStatFour.findAll();
        return res.json({ items: count });
    }
    async buy(req, res, next) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const { matrix_id } = req.body;
        const price = (await TypeMatrixFour.findOne({ where: { id: matrix_id } }))
            .summ;
        const user = await User.findOne({ where: { username } });
        const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
        const walletRUBBalance = await BalanceCrypto.findOne({
            where: {
                userId: user.id,
                walletId: walletRUBId.id
            }
        })
        if ((+walletRUBBalance.balance < price) && (user.locale < price)) {
            return next(ApiError.badRequest("Недостатосно средств"));
        } else if (+walletRUBBalance.balance >= price){
            let update = { balance: (+walletRUBBalance.balance) - (+price) };
            await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
        } else {
            let update = { locale: (+user.locale) - (+price)} ;
            await User.update(update, { where: { id: user.id } });
        }
        let checkMatrixTable = await Matrix_TableFour.findOne({
            where: { userId: user.id, typeMatrixFourId: matrix_id },
        });
        if (!checkMatrixTable) {
            const referalId = user.referal_id;
            let parentId, side_matrix;
            const parentIdForCheck = await findParentIdGliese(
                matrix_id,
                referalId,
                user.id
            );
            if (parentIdForCheck) {
                const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                    parentIdForCheck,
                    user.id,
                    matrix_id
                );
                parentId = resultFuncCheckCountParentId.parentId;
                side_matrix = resultFuncCheckCountParentId.side_matrix;
            } else {
                parentId = null;
                side_matrix = null;
            }

            const matrixItem = await MatrixFour.create({
                date: new Date(),
                parent_id: parentId,
                userId: user.id,
                side_matrix,
            });

            const matrixTableItem = await Matrix_TableFour.create({
                matrixFourId: matrixItem.id,
                typeMatrixFourId: matrix_id,
                userId: user.id,
                count: 0,
            });
            const marketingCheck = await marketingGlieseCheck(parentId);
            if (marketingCheck) {
                await marketingGlieseGift(parentId, matrix_id);
            }
            return res.json(true);
        } else {
            return next(ApiError.badRequest("овторная покупка не возможна"));
        }
    }
    async structure(req, res, next) {
        const { matrix_type, matrix_id } = req.query;

        if (matrix_id) {
            const rootUserId = await MatrixFour.findOne({
                where: { id: matrix_id },
            });
            const rootUser = await User.findOne({ where: { id: rootUserId.userId } });

            const firstChildes = await childNode(matrix_id);

            let result = {
                0: {
                    id: matrix_id,
                    userName: rootUser.username,
                    photo: rootUser.avatar,
                    typeId: null,
                    place: 0,
                    date: rootUser.createdAt,
                },
            };

            if (firstChildes?.length > 0) {
                firstChildes.map((i, index) => {
                    result[i.side_matrix + 1] = {
                        id: firstChildes[index]?.id,
                        userName: firstChildes[index]?.user.username,
                        photo: firstChildes[index]?.user.avatar,
                        typeId: null,
                        place: 0,
                        createdAt: firstChildes[index]?.user.createdAt,
                    };
                });
            }
            if (firstChildes?.length > 1) {
                firstChildes.map((i, index) => {
                    result[i.side_matrix + 1] = {
                        id: firstChildes[index]?.id,
                        userName: firstChildes[index]?.user.username,
                        photo: firstChildes[index]?.user.avatar,
                        typeId: null,
                        place: 0,
                        createdAt: firstChildes[index]?.user.createdAt,
                    };
                });
            }
            for (let i = 0; i < 4; i++) {
                if (!result[i]) {
                    result[i] = null;
                }
            }

            return res.json({ items: result });
        }

        if (matrix_type) {
            const { authorization } = req.headers;
            const token = authorization.slice(7);
            const { username } = jwt_decode(token);

            const user = await User.findOne({ where: { username } });
            const dataMatrixTable = await Matrix_TableFour.findOne({
                where: { userId: user?.id, typeMatrixFourId: matrix_type },
            });
            if (!dataMatrixTable) {
                let result = {};
                for (let i = 0; i < 7; i++) {
                    if (!result[i]) {
                        result[i] = null;
                    }
                }
                return res.json({ items: result });
            }
            const root_matrix_tables = await MatrixFour.findOne({
                where: { id: dataMatrixTable?.matrixFourId },
                include: { model: User, as: "user" },
            });

            let result = {
                0: {
                    id: root_matrix_tables.id,
                    userName: root_matrix_tables.user.username,
                    photo: root_matrix_tables.user.avatar,
                    typeId: null,
                    place: 0,
                    createdAt: root_matrix_tables.createdAt,
                },
            };
            let firstChildes = await childNode(root_matrix_tables.id);
            if (firstChildes?.length > 0) {
                firstChildes.map((i, index) => {
                    result[i.side_matrix + 1] = {
                        id: firstChildes[index]?.id,
                        userName: firstChildes[index]?.user.username,
                        photo: firstChildes[index]?.user.avatar,
                        typeId: null,
                        place: 0,
                        createdAt: firstChildes[index]?.user.createdAt,
                    };
                });
            }
            if (firstChildes?.length > 1) {
                firstChildes.map((i, index) => {
                    result[i.side_matrix + 1] = {
                        id: firstChildes[index]?.id,
                        userName: firstChildes[index]?.user.username,
                        photo: firstChildes[index]?.user.avatar,
                        typeId: null,
                        place: 0,
                        createdAt: firstChildes[index]?.user.createdAt,
                    };
                });
            }

            for (let i = 0; i < 4; i++) {
                if (!result[i]) {
                    result[i] = null;
                }
            }
            return res.json({ items: result });
        }
    }
    async structureUpper(req, res, next) {
        const { matrix_id } = req.query;

        if (matrix_id) {
            const temp = await MatrixFour.findOne({ where: { id: matrix_id } });
            const rootUserId = await MatrixFour.findOne({
                where: { id: temp.parent_id },
            });
            const rootUser = await User.findOne({ where: { id: rootUserId.userId } });
            const firstChildes = await childNode(rootUserId.id);

            let result = {
                0: {
                    id: rootUserId.id,
                    userName: rootUser.username,
                    avatar: rootUser.avatar,
                    typeId: null,
                    place: 0,
                    createdAt: rootUser.createdAt,
                },
            };
            if (firstChildes?.length > 0) {
                firstChildes.map((i, index) => {
                    result[i.side_matrix + 1] = {
                        id: firstChildes[index]?.id,
                        userName: firstChildes[index]?.user.username,
                        photo: firstChildes[index]?.user.avatar,
                        typeId: null,
                        place: 0,
                        createdAt: firstChildes[index]?.user.createdAt,
                    };
                });
            }
            if (firstChildes?.length > 1) {
                firstChildes.map((i, index) => {
                    result[i.side_matrix + 1] = {
                        id: firstChildes[index]?.id,
                        userName: firstChildes[index]?.user.username,
                        photo: firstChildes[index]?.user.avatar,
                        typeId: null,
                        place: 0,
                        createdAt: firstChildes[index]?.user.createdAt,
                    };
                });
            }

            for (let i = 0; i < 4; i++) {
                if (!result[i]) {
                    result[i] = null;
                }
            }

            return res.json({ items: result });
        }
    }
    async clone(req, res, next) {
        const { matrix_type } = req.query;
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const user = await User.findOne({ where: { username } });
        const count = await Matrix_TableFour.findOne({
            where: { userId: user.id, typeMatrixFourId: matrix_type },
        });
        if (count?.count) {
            return res.json({ count: count.count });
        } else {
            return res.json(null);
        }
    }
    async targetClone(req, res, next) {
        let { place, ancestor_id, matrix_id } = req.body;
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const user = await User.findOne({ where: { username } });
        const matrixTableData = await findRealUser(ancestor_id, user.id);
        if (matrixTableData.count < 1) {
            return next(ApiError.badRequest("У Вас нет клонов"));
        }
        let updateBalance;
        const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
        const walletRUBBalance = await BalanceCrypto.findOne({
            where: {
                userId: user.id,
                walletId: walletRUBId.id
            }
        })
        let update = { count: matrixTableData.count - 1 };
        await Matrix_TableFour.update(update, {
            where: { id: matrixTableData.id },
        });
        const typeMatrix = (
            await Matrix_TableFour.findOne({ where: { id: matrixTableData.id } })
        ).typeMatrixFourId;
        place = +place
        let side_matrix;
        let parent_id;
        switch (place) {
            case 1:
                side_matrix = 0;
                parent_id = ancestor_id;
                break;
            case 2:
                side_matrix = 1;
                parent_id = ancestor_id;
                break;
            case 3:
                side_matrix = 2;
                parent_id = ancestor_id
                break;
        }
        if (place === 1){
            switch (matrix_id){
                case 1:
                    if (matrix_id){
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true);
                    }
                    break;
                case 2:
                    if (matrix_id){
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true);
                    }
                    break;
                case 3:
                    if (matrix_id){
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true);
                    }
                    break;
                case 4:
                    if (matrix_id){
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        updateBalance = { balance: (+walletRUBBalance.balance) + 20000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        return res.json(true);
                    }
                    break;
                default:
                    break;
            }
        }
        if (place === 2){
            switch (matrix_id){
                case 1:
                    if (matrix_id){
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true);
                    }
                    break;
                case 2:
                    if (matrix_id){
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 3:
                    if (matrix_id){
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 4:
                    if (matrix_id){
                        const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        if (matrixKeplerCheckReferal){
                            const referalUser = await User.findOne({where:{id:user.referal_id}})
                            const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                                where: {
                                    userId: referalUser.id,
                                    walletId: walletRUBId.id
                                }
                            })
                            let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 20000 };
                            await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                        }
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 5:
                    if (matrix_id){
                        const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                        let checkMatrixTable = await Matrix_TableFour.findOne({
                            where: { userId: user.id, typeMatrixFourId: 1 },
                        });
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        if (!checkMatrixTable) {
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdGliese(
                                1,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                                    parentIdForCheck,
                                    user.id,
                                    1
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixFour.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableFour.create({
                                matrixFourId: matrixItem.id,
                                typeMatrixFourId: 1,
                                userId: user.id,
                                count: 1,
                            });
                            const marketingCheck = await marketingGlieseCheck(parentId);
                            if (marketingCheck > 0) {
                                await marketingGlieseGift(parentId, 1, marketingCheck);
                            }
                        } else {
                            let updateTable = { count: checkMatrixTable.count + 2 };
                            await Matrix_TableFour.update(updateTable, {
                                where: { userId: user.id, typeMatrixFourId: 1 },
                            });
                        }
                        if (matrixKeplerCheckReferal){
                            const referalUser = await User.findOne({where:{id:user.referal_id}})
                            const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                                where: {
                                    userId: referalUser.id,
                                    walletId: walletRUBId.id
                                }
                            })
                            let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 30000 };
                            await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                        }
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 6:
                    if (matrix_id){
                        const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                        let checkMatrixTable = await Matrix_TableFour.findOne({
                            where: { userId: user.id, typeMatrixFourId: 1 },
                        });
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        if (!checkMatrixTable) {
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdGliese(
                                1,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                                    parentIdForCheck,
                                    user.id,
                                    1
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixFour.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableFour.create({
                                matrixFourId: matrixItem.id,
                                typeMatrixFourId: 1,
                                userId: user.id,
                                count: 1,
                            });
                            const marketingCheck = await marketingGlieseCheck(parentId);
                            if (marketingCheck > 0) {
                                await marketingGlieseGift(parentId, 1, marketingCheck);
                            }
                        } else {
                            let updateTable = { count: checkMatrixTable.count + 2 };
                            await Matrix_TableFour.update(updateTable, {
                                where: { userId: user.id, typeMatrixFourId: 1 },
                            });
                        }
                        if (matrixKeplerCheckReferal){
                            const referalUser = await User.findOne({where:{id:user.referal_id}})
                            const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                                where: {
                                    userId: referalUser.id,
                                    walletId: walletRUBId.id
                                }
                            })
                            let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 30000 };
                            await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                        }
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 7:
                    if (matrix_id){
                        const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                        let checkMatrixTable = await Matrix_TableFour.findOne({
                            where: { userId: user.id, typeMatrixFourId: 1 },
                        });
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        if (!checkMatrixTable) {
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdGliese(
                                1,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                                    parentIdForCheck,
                                    user.id,
                                    1
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixFour.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableFour.create({
                                matrixFourId: matrixItem.id,
                                typeMatrixFourId: 1,
                                userId: user.id,
                                count: 1,
                            });
                            const marketingCheck = await marketingGlieseCheck(parentId);
                            if (marketingCheck > 0) {
                                await marketingGlieseGift(parentId, 1, marketingCheck);
                            }
                        } else {
                            let updateTable = { count: checkMatrixTable.count + 2 };
                            await Matrix_TableFour.update(updateTable, {
                                where: { userId: user.id, typeMatrixFourId: 1 },
                            });
                        }
                        if (matrixKeplerCheckReferal){
                            const referalUser = await User.findOne({where:{id:user.referal_id}})
                            const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                                where: {
                                    userId: referalUser.id,
                                    walletId: walletRUBId.id
                                }
                            })
                            let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 30000 };
                            await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                        }
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 8:
                    if (matrix_id){
                        const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                        let checkMatrixTable = await Matrix_TableFour.findOne({
                            where: { userId: user.id, typeMatrixFourId: 1 },
                        });
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        if (!checkMatrixTable) {
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdGliese(
                                1,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                                    parentIdForCheck,
                                    user.id,
                                    1
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixFour.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableFour.create({
                                matrixFourId: matrixItem.id,
                                typeMatrixFourId: 1,
                                userId: user.id,
                                count: 4,
                            });
                            const marketingCheck = await marketingGlieseCheck(parentId);
                            if (marketingCheck > 0) {
                                await marketingGlieseGift(parentId, 1, marketingCheck);
                            }
                        } else {
                            let updateTable = { count: checkMatrixTable.count + 5 };
                            await Matrix_TableFour.update(updateTable, {
                                where: { userId: user.id, typeMatrixFourId: 1 },
                            });
                        }
                        if (matrixKeplerCheckReferal){
                            const referalUser = await User.findOne({where:{id:user.referal_id}})
                            const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                                where: {
                                    userId: referalUser.id,
                                    walletId: walletRUBId.id
                                }
                            })
                            let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 50000 };
                            await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                        }
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 9:
                    if (matrix_id){
                        const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                        let checkMatrixTable = await Matrix_TableFour.findOne({
                            where: { userId: user.id, typeMatrixFourId: 1 },
                        });
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        if (!checkMatrixTable) {
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdGliese(
                                1,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                                    parentIdForCheck,
                                    user.id,
                                    1
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixFour.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableFour.create({
                                matrixFourId: matrixItem.id,
                                typeMatrixFourId: 1,
                                userId: user.id,
                                count: 2,
                            });
                            const marketingCheck = await marketingGlieseCheck(parentId);
                            if (marketingCheck > 0) {
                                await marketingGlieseGift(parentId, 1, marketingCheck);
                            }
                        } else {
                            let updateTable = { count: checkMatrixTable.count + 3 };
                            await Matrix_TableFour.update(updateTable, {
                                where: { userId: user.id, typeMatrixFourId: 1 },
                            });
                        }
                        if (matrixKeplerCheckReferal){
                            const referalUser = await User.findOne({where:{id:user.referal_id}})
                            const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                                where: {
                                    userId: referalUser.id,
                                    walletId: walletRUBId.id
                                }
                            })
                            let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 70000 };
                            await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                        }
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 10:
                    if (matrix_id){
                        let checkMatrixTabl = await Matrix_TableSix.findOne({
                            where: { userId: user.id, typeMatrixSixId: 1 },
                        });
                        const matrixKeplerCheckReferal = await Matrix_TableFour.findOne({where:{userId:user.referal_id}})
                        let checkMatrixTable = await Matrix_TableFour.findOne({
                            where: { userId: user.id, typeMatrixFourId: 1 },
                        });
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        if (!checkMatrixTable) {
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdGliese(
                                1,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdGliese(
                                    parentIdForCheck,
                                    user.id,
                                    1
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixFour.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableFour.create({
                                matrixFourId: matrixItem.id,
                                typeMatrixFourId: 1,
                                userId: user.id,
                                count: 2,
                            });
                            const marketingCheck = await marketingGlieseCheck(parentId);
                            if (marketingCheck > 0) {
                                await marketingGlieseGift(parentId, 1, marketingCheck);
                            }
                        } else {
                            let updateTable = { count: checkMatrixTable.count + 3 };
                            await Matrix_TableFour.update(updateTable, {
                                where: { userId: user.id, typeMatrixFourId: 1 },
                            });
                        }
                        if (matrixKeplerCheckReferal){
                            const referalUser = await User.findOne({where:{id:user.referal_id}})
                            const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                                where: {
                                    userId: referalUser.id,
                                    walletId: walletRUBId.id
                                }
                            })
                            let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 200000 };
                            await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                        }

                        if (!checkMatrixTabl) {
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdAida(
                                1,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdAida(
                                    parentIdForCheck,
                                    user.id,
                                    1
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixSix.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableSix.create({
                                matrixSixId: matrixItem.id,
                                typeMatrixSixId: 1,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingAidaCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingAidaGift(parentId, 1, marketingCheck);
                            }
                        } else {
                            let updateTable = { count: checkMatrixTabl.count + 1 };
                            await Matrix_TableSix.update(updateTable, {
                                where: { userId: user.id, typeMatrixSixId: 1 },
                            });
                            return res.json(true)
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        if (place === 3){
            switch (matrix_id){
                case 1:
                    if (matrix_id){
                        const matrixItem = MatrixFour.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
module.exports = new GlieseControllers();