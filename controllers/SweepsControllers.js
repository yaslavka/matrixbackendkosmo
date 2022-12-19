const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const {findParentIdSweeps} = require("../service/findParentIdSweeps");
const {
    checkCountParentIdSweeps,
} = require("../service/checkCoountParentIdSweeps");
const {
    CloneStatThird,
    User,
    Matrix_TableThird,
    TypeMatrixThird, MatrixThird
} = require("../models/models");
const {Wallet} = require("../models/TablesExchange/tableWallet");
const {BalanceCrypto} = require("../models/TablesExchange/tableBalanceCrypto");

const marketingSweepsCheck = async (parent_id) => {
    if (!parent_id) {
        return false;
    }
    const countNode = await MatrixThird.count({where: {parent_id}});
    return countNode
};
const transitionToHighLevelSweeps = async (matrixId, level, user) => {
    let nextLevel = level + 1;
    const referalId = user.referal_id;
    let parentId, side_matrix;
    const parentIdForCheck = await findParentIdSweeps(nextLevel, referalId, user.id);
    if (parentIdForCheck) {
        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
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

    const matrixItem = await MatrixThird.create({
        date: new Date(),
        parent_id: parentId,
        userId: user.id,
        side_matrix,
    });

    const matrixTableItem = await Matrix_TableThird.create({
        matrixThirdId: matrixItem.id,
        typeMatrixThirdId: nextLevel,
        userId: user.id,
        count: 0,
    });
    const marketingCheck = await marketingSweepsCheck(parentId);
    if (marketingCheck) {
        const gift = await marketingSweepsGift(parentId, nextLevel);
    }
};
const placetwo = async (matrix_id, parent_id, user, side_matrix, res)=>{
    let matrix = matrix_id + 1
  let checkMatrixTable = await Matrix_TableThird.findOne({
        where: {userId: user.id, typeMatrixThirdId: matrix},
    });
    if (!checkMatrixTable) {
        const referalId = user.referal_id;
        let parentId, side_matrix;
        const parentIdForCheck = await findParentIdSweeps(
            matrix,
            referalId,
            user.id
        );
        if (parentIdForCheck) {
            const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
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

        const matrixItem = await MatrixThird.create({
            date: new Date(),
            parent_id: parentId,
            userId: user.id,
            side_matrix,
        });

        const matrixTableItem = await Matrix_TableThird.create({
            matrixThirdId: matrixItem.id,
            typeMatrixThirdId: matrix,
            userId: user.id,
            count: 0,
        });
        const marketingCheck = await marketingSweepsCheck(parentId);
        if (marketingCheck > 0) {
            const gift = await placetwo(parentId, matrix_id, marketingCheck);
        }
        return res.json(true);
    } else {
        let updateTable = {count: checkMatrixTable.count + 1};
        await Matrix_TableThird.update(updateTable, {
            where: {userId: user.id, typeMatrixThirdId: matrix},
        });
        return res.json(updateTable);
    }
}
const findRealUser = async (id, userId) => {
    const matrixThirdItem = await MatrixThird.findOne({where: {id}});
    const matrixTableData = await Matrix_TableThird.findOne({
        where: {matrixThirdId: id},
    });
    if (matrixTableData) {
        const result = await Matrix_TableThird.findOne({
            where: {
                typeMatrixThirdId: matrixTableData.typeMatrixThirdId,
                userId: userId,
            },
        });
        return result;
    } else {
        return findRealUser(matrixThirdItem.parent_id, userId);
    }
};
const marketingSweepsGift = async (parentId, type_matrix_id, count, res) => {
    const matrixItemThree = await MatrixThird.findOne({
        where: {id: parentId},
    });
    const user = await User.findOne({where: {id: matrixItemThree.userId}});
    let updateBalance;
    const walletRUBId = await Wallet.findOne({where: {name: 'RUR'}})
    const walletRUBBalance = await BalanceCrypto.findOne({
        where: {
            userId: user.id,
            walletId: walletRUBId.id
        }
    })
    switch (type_matrix_id) {
        case 1:
            if (count == 2) {
                let checkMatrixTa = await Matrix_TableThird.findOne({
                    where: { userId: user.id, typeMatrixThirdId: 2 },
                });
                if (!checkMatrixTa){
                    await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
                }else {
                    let updateTable = { count: checkMatrixTa.count + 1 };
                    await Matrix_TableThird.update(updateTable, {
                        where: { userId: user.id, typeMatrixThirdId: 2 },
                    });
                    return res.json(updateTable);
                }
            }
            break;
        case 2:
            if (count == 2) {
                let checkMatrixTa = await Matrix_TableThird.findOne({
                    where: { userId: user.id, typeMatrixThirdId: 2 },
                });
                if (!checkMatrixTa){
                    await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
                }else {
                    let updateTable = { count: checkMatrixTa.count + 1 };
                    await Matrix_TableThird.update(updateTable, {
                        where: { userId: user.id, typeMatrixThirdId: 2 },
                    });
                    return res.json(updateTable);
                }
            }
            break;
        case 3:
            if (count == 2) {
                let checkMatrixTa = await Matrix_TableThird.findOne({
                    where: { userId: user.id, typeMatrixThirdId: 2 },
                });
                if (!checkMatrixTa){
                    await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
                }else {
                    let updateTable = { count: checkMatrixTa.count + 1 };
                    await Matrix_TableThird.update(updateTable, {
                        where: { userId: user.id, typeMatrixThirdId: 2 },
                    });
                    return res.json(updateTable);
                }
            }
            break;
        case 4:
            if (count == 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 300 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count == 2) {
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 1 } })
                let updateCount = { count: matrixTable.count + 1 }
                await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                let checkMatrixTable = await Matrix_TableThird.findOne({
                    where: { userId: user.id, typeMatrixThirdId: 5 },
                });
                if (!checkMatrixTable){
                    await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
                }else {
                    let updateTable = { count: checkMatrixTable.count + 1 };
                    await Matrix_TableThird.update(updateTable, {
                        where: { userId: user.id, typeMatrixThirdId: 5 },
                    });
                    return res.json(updateTable);
                }
            }
            break;
        case 5:
            let checkMatrixTable = await Matrix_TableThird.findOne({
                where: { userId: user.id, typeMatrixThirdId: 6 },
            });
            if (!checkMatrixTable){
                await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
            }else {
                let updateTable = { count: checkMatrixTable.count + 1 };
                await Matrix_TableThird.update(updateTable, {
                    where: { userId: user.id, typeMatrixThirdId: 6 },
                });
                return res.json(updateTable);
            }
            break;
        case 6:
            if (count == 1){
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 1 } })
                if (!matrixTable){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
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
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 1,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 1, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTable.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                }
                let updateBalance = { balance: (+walletRUBBalance.balance) + 600 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                return res.json(true);
            }
            if (count == 2) {
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 1 } })
                if (!matrixTable){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
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
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 1,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 1, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTable.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                }
                let updateBalance = { balance: (+walletRUBBalance.balance) + 600 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                return res.json(true);
                let checkMatrixTable = await Matrix_TableThird.findOne({
                    where: { userId: user.id, typeMatrixThirdId: 7 },
                });
                if (!checkMatrixTable){
                    await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
                }else {
                    let updateTable = { count: checkMatrixTable.count + 1 };
                    await Matrix_TableThird.update(updateTable, {
                        where: { userId: user.id, typeMatrixThirdId: 7 },
                    });
                    return res.json(updateTable);
                }
            }
            break;
        case 7:
            if (count == 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 1000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count == 2){
                let updateBalance = { balance: (+walletRUBBalance.balance) + 1000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                let checkMatrixTable = await Matrix_TableThird.findOne({
                    where: { userId: user.id, typeMatrixThirdId: 8 },
                });
                if (!checkMatrixTable){
                    await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
                }else {
                    let updateTable = { count: checkMatrixTable.count + 1 };
                    await Matrix_TableThird.update(updateTable, {
                        where: { userId: user.id, typeMatrixThirdId: 8 },
                    });
                    return res.json(updateTable);
                }
            }
            break;
        case 8:
            if (count == 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 2000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 2 } })
                if (!matrixTable){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        2,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            2
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 2,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 2, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTable.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                }
            }
            if (count == 2){
                let updateBalance = { balance: (+walletRUBBalance.balance) + 2000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 2 } })
                if (!matrixTable){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        2,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            2
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 2,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 2, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTable.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                }
                let checkMatrixTable = await Matrix_TableThird.findOne({
                    where: { userId: user.id, typeMatrixThirdId: 9 },
                });
                if (!checkMatrixTable){
                    await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
                }else {
                    let updateTable = { count: checkMatrixTable.count + 1 };
                    await Matrix_TableThird.update(updateTable, {
                        where: { userId: user.id, typeMatrixThirdId: 9 },
                    });
                    return res.json(updateTable);
                }
            }
            break;
        case 9:
            if (count == 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count == 2){
                let updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                let checkMatrixTable = await Matrix_TableThird.findOne({
                    where: { userId: user.id, typeMatrixThirdId: 10 },
                });
                if (!checkMatrixTable){
                    await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
                }else {
                    let updateTable = { count: checkMatrixTable.count + 1 };
                    await Matrix_TableThird.update(updateTable, {
                        where: { userId: user.id, typeMatrixThirdId: 10 },
                    });
                    return res.json(updateTable);
                }
            }
            break;
        case 10:
            if (count == 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 3 } })
                if (!matrixTable){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        3,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            3
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 3,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 3, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTable.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                }
            }
            if (count == 2){
                let updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 3 } })
                if (!matrixTable){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        3,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            3
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 3,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 3, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTable.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                }
                let checkMatrixTable = await Matrix_TableThird.findOne({
                    where: { userId: user.id, typeMatrixThirdId: 11 },
                });
                if (!checkMatrixTable){
                    await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
                }else {
                    let updateTable = { count: checkMatrixTable.count + 1 };
                    await Matrix_TableThird.update(updateTable, {
                        where: { userId: user.id, typeMatrixThirdId: 11 },
                    });
                    return res.json(updateTable);
                }
            }
            break;
        case 11:
            if (count == 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                const matrixTab = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 1 } })
                const matrixTabl = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 2 } })
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 3 } })
                if (!matrixTab){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
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
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 1,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 1, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTab.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTab.id } })
                }
                if (!matrixTabl){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        2,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            2
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 2,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 2, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTabl.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTabl.id } })
                }
                if (!matrixTable){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        3,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            3
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 3,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 3, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTable.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                }
            }
            if (count == 2){
                let updateBalance = { balance: (+walletRUBBalance.balance) + 10000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                let checkMatrixTable = await Matrix_TableThird.findOne({
                    where: { userId: user.id, typeMatrixThirdId: 12 },
                });
                if (!checkMatrixTable){
                    await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
                }else {
                    let updateTable = { count: checkMatrixTable.count + 1 };
                    await Matrix_TableThird.update(updateTable, {
                        where: { userId: user.id, typeMatrixThirdId: 12 },
                    });
                    return res.json(updateTable);
                }
            }
            break;
        case 12:
            if (count == 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 20000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 4 } })
                const matrixTabl = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 5 } })
                if (!matrixTabl){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        5,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            5
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 5,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 5, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTabl.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTabl.id } })
                }
                if (!matrixTable){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        4,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            4
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 4,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 4, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTable.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                }
            }
            if (count == 2){
                let updateBalance = { balance: (+walletRUBBalance.balance) + 20000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 4 } })
                if (!matrixTable){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        4,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            4
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 4,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 4, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTable.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                }
                let checkMatrixTable = await Matrix_TableThird.findOne({
                    where: { userId: user.id, typeMatrixThirdId: 13 },
                });
                if (!checkMatrixTable){
                    await transitionToHighLevelSweeps(parentId, type_matrix_id, user);
                }else {
                    let updateTable = { count: checkMatrixTable.count + 1 };
                    await Matrix_TableThird.update(updateTable, {
                        where: { userId: user.id, typeMatrixThirdId: 13 },
                    });
                    return res.json(updateTable);
                }
            }
            break;
        case 13:
            if (count == 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 498400 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 10 } })
                if (!matrixTable){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        10,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            10
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 10,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 10, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTable.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                }
            }
            if (count == 2){
                const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 1 } })
                const matrixTabletwo = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 2 } })
                const matrixTableth = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 3 } })
                const matrixTablefor = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 4 } })
                const matrixTablesix = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 6 } })
                const matrixTables = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 7 } })
                const matrixTablesi = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 8 } })
                if (!matrixTable){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
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
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 1,
                        userId: user.id,
                        count: 9,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 1, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTable.count + 10 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                }
                if (!matrixTabletwo){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        2,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            2
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 2,
                        userId: user.id,
                        count: 5,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 2, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTabletwo.count + 6 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTabletwo.id } })
                }
                if (!matrixTableth){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        3,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            3
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 3,
                        userId: user.id,
                        count: 5,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 3, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTableth.count + 6 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTableth.id } })
                }
                if (!matrixTablefor){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        4,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            4
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 4,
                        userId: user.id,
                        count: 5,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 4, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTablefor.count + 6 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTablefor.id } })
                }
                if (!matrixTablesix){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        6,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            6
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 6,
                        userId: user.id,
                        count: 1,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 6, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTablesix.count + 2 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTablesix.id } })
                }
                if (!matrixTables){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        7,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            7
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 6,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 7, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTablesix.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTables.id } })
                }
                if (!matrixTablesi){
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdSweeps(
                        8,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                            parentIdForCheck,
                            user.id,
                            8
                        );
                        parentId = resultFuncCheckCountParentId.parentId;
                        side_matrix = resultFuncCheckCountParentId.side_matrix;
                    } else {
                        parentId = null;
                        side_matrix = null;
                    }

                    const matrixItem = await MatrixThird.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableThird.create({
                        matrixThirdId: matrixItem.id,
                        typeMatrixThirdId: 8,
                        userId: user.id,
                        count: 0,
                    });
                    const marketingCheck = await marketingSweepsCheck(parentId);
                    if (marketingCheck > 0) {
                        const gift = await marketingSweepsGift(parentId, 8, marketingCheck);
                    }
                    return res.json(true);
                }else {
                    let updateCount = { count: matrixTablesi.count + 1 }
                    await Matrix_TableThird.update(updateCount, { where: { id: matrixTablesi.id } })
                }
                let updateBalance = { balance: (+walletRUBBalance.balance) + 501600 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                return res.json(true);
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
    let matrix = await MatrixThird.findAll({
        where: {parent_id: node},
        include: {
            model: User,
            as: "user",
        },
    });
    return matrix;
};

class SweepsControllers {
    async getCloneStat(req, res, next) {
        const count = await CloneStatThird.findAll();
        return res.json({items: count});
    }
    async buy(req, res, next) {
        const {authorization} = req.headers;
        const token = authorization.slice(7);
        const {username} = jwt_decode(token);
        const {matrix_id} = req.body;
        const price = (await TypeMatrixThird.findOne({where: {id: matrix_id}}))
            .summ;
        const user = await User.findOne({where: {username}});
        const walletRUBId = await Wallet.findOne({where: {name: 'RUR'}})
        const walletRUBBalance = await BalanceCrypto.findOne({
            where: {
                userId: user.id,
                walletId: walletRUBId.id
            }
        })
        if (((+walletRUBBalance.balance) < price) && (+user.locale < price)) {
            return next(ApiError.badRequest("Недостатосно средств"));
        } else if ((+walletRUBBalance.balance) >= price) {
            let update = {balance: (+walletRUBBalance.balance) - price};
            await BalanceCrypto.update(update, {where: {id: walletRUBBalance.id}});
        } else {
            let update = {locale: (+user.locale) - price};
            await User.update(update, {where: {id: user.id}});
        }

        let checkMatrixTable = await Matrix_TableThird.findOne({
            where: {userId: user.id, typeMatrixThirdId: matrix_id},
        });
        if (!checkMatrixTable) {
            const referalId = user.referal_id;
            let parentId, side_matrix;
            const parentIdForCheck = await findParentIdSweeps(
                matrix_id,
                referalId,
                user.id
            );
            if (parentIdForCheck) {
                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
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

            const matrixItem = await MatrixThird.create({
                date: new Date(),
                parent_id: parentId,
                userId: user.id,
                side_matrix,
            });

            const matrixTableItem = await Matrix_TableThird.create({
                matrixThirdId: matrixItem.id,
                typeMatrixThirdId: matrix_id,
                userId: user.id,
                count: 0,
            });
            const marketingCheck = await marketingSweepsCheck(parentId);
            if (marketingCheck > 0) {
                const gift = await marketingSweepsGift(parentId, matrix_id, marketingCheck, res);
            }
            return res.json(true);
        } else {
            let updateTable = {count: checkMatrixTable.count + 1};
            await Matrix_TableThird.update(updateTable, {
                where: {userId: user.id, typeMatrixThirdId: matrix_id},
            });
            return res.json(updateTable);
        }
    }
    async getType(req, res, next) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const user = await User.findOne({ where: { username } });
        const type = await Matrix_TableThird.findAll({
            where: { userId: user.id },
        });
        const typeMatrix = await TypeMatrixThird.findAll();
        let result = [];
        for (let i = 1; i < 14; i++) {
            const countItem = type.filter((j)=>{
                return j.typeMatrixThirdId === i
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
    async structure(req, res, next) {
        const {matrix_type, matrix_id} = req.query;

        if (matrix_id) {
            const rootUserId = await MatrixThird.findOne({
                where: {id: matrix_id},
            });
            const rootUser = await User.findOne({where: {id: rootUserId.userId}});

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

            for (let i = 0; i < 3; i++) {
                if (!result[i]) {
                    result[i] = null;
                }
            }

            return res.json({items: result});
        }

        if (matrix_type) {
            const {authorization} = req.headers;
            const token = authorization.slice(7);
            const {username} = jwt_decode(token);

            const user = await User.findOne({where: {username}});
            const dataMatrixTable = await Matrix_TableThird.findOne({
                where: {userId: user?.id, typeMatrixThirdId: matrix_type},
            });
            if (!dataMatrixTable) {
                let result = {};
                for (let i = 0; i < 3; i++) {
                    if (!result[i]) {
                        result[i] = null;
                    }
                }
                return res.json({items: result});
            }
            const root_matrix_tables = await MatrixThird.findOne({
                where: {id: dataMatrixTable?.matrixThirdId},
                include: {model: User, as: "user"},
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

            for (let i = 0; i < 3; i++) {
                if (!result[i]) {
                    result[i] = null;
                }
            }
            return res.json({items: result});
        }
    }
    async structureUpper(req, res, next) {
        const {matrix_id} = req.query;

        if (matrix_id) {
            const temp = await MatrixThird.findOne({where: {id: matrix_id}});
            const rootUserId = await MatrixThird.findOne({
                where: {id: temp.parent_id},
            });
            const rootUser = await User.findOne({where: {id: rootUserId.userId}});
            const firstChildes = await childNode(rootUserId.id);

            // return res.json(firstChildes)
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

            for (let i = 0; i < 3; i++) {
                if (!result[i]) {
                    result[i] = null;
                }
            }

            return res.json({items: result});
        }
    }
    async clone(req, res, next) {
        const {matrix_type} = req.query;
        const {authorization} = req.headers;
        const token = authorization.slice(7);
        const {username} = jwt_decode(token);
        const user = await User.findOne({where: {username}});
        const count = await Matrix_TableThird.findOne({
            where: {userId: user.id, typeMatrixThirdId: matrix_type},
        });
        if (count?.count) {
            return res.json({count: count.count});
        } else {
            return res.json(null);
        }
    }
    async targetClone(req, res, next) {
        let {place, ancestor_id, matrix_id} = req.body;
        const {authorization} = req.headers;
        const token = authorization.slice(7);
        const {username} = jwt_decode(token);
        const user = await User.findOne({where: {username}});
        const matrixTableData = await findRealUser(ancestor_id, user.id);
        if (matrixTableData.count < 1) {
            return next(ApiError.badRequest("У Вас нет клонов"));
        }
        let updateBalance
        let update = {count: matrixTableData.count - 1};
        await Matrix_TableThird.update(update, {
            where: {id: matrixTableData.id},
        });
        const walletRUBId = await Wallet.findOne({where: {name: 'RUR'}})
        const walletRUBBalance = await BalanceCrypto.findOne({
            where: {
                userId: user.id,
                walletId: walletRUBId.id
            }
        })
        const typeMatrix = (
            await Matrix_TableThird.findOne({where: {id: matrixTableData.id}})
        ).typeMatrixThirdId;
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
        }
        if (place === 1) {
            switch (matrix_id){
                case 1:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
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
                        const matrixItem = MatrixThird.create({
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
                        const matrixItem = MatrixThird.create({
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
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 300 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        return res.json(true);
                    }
                    break;
                case 5:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true);
                    }
                    break;
                case 6:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 1 } })
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
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
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 1,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 1, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 600 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        return res.json(true);
                    }
                    break;
                case 7:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 1000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        return res.json(true);
                    }
                    break;
                case 8:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 2 } })
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                2,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    2
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 2,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 2, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 2000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        return res.json(true);
                    }
                    break;
                case 9:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        return res.json(true);
                    }
                    break;
                case 10:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 3 } })
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                3,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    3
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 3,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 3, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        return res.json(true);
                    }
                    break;
                case 11:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        const matrixTab = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 1 } })
                        const matrixTabl = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 2 } })
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 3 } })
                        if (!matrixTab){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
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
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 1,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 1, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTab.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTab.id } })
                        }
                        if (!matrixTabl){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                2,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    2
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 2,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 2, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTabl.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTabl.id } })
                        }
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                3,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    3
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 3,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 3, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 10000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        return res.json(true);
                    }
                    break;
                case 12:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 4 } })
                        const matrixTabl = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 5 } })
                        if (!matrixTabl){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                5,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    5
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 5,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 5, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTabl.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTabl.id } })
                        }
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                4,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    4
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 4,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 4, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 20000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        return res.json(true);
                    }
                    break;
                case 13:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 10 } })
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                10,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    10
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 10,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 10, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 498400 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        return res.json(true);
                    }
                    break;
                default:
                    break;
            }
        }
        if (place === 2) {
            switch (matrix_id){
                case 1:
                    if (matrix_id){
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 2:
                    if (matrix_id){
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 3:
                    if (matrix_id){
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 4:
                    if (matrix_id){
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 1 } })
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
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
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 1,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 1, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 5:
                    if (matrix_id){
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                    }
                    break;
                case 6:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 600 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 1 } })
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
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
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 1,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 1, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)

                    }
                    break;
                case 7:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 1000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                        return res.json(true);
                    }
                    break;
                case 8:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 2 } })
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                2,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    2
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 2,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 2, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 2000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                        return res.json(true);
                    }
                    break;
                case 9:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                        return res.json(true);
                    }
                    break;
                case 10:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 3 } })
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                3,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    3
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 3,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 3, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                        return res.json(true);
                    }
                    break;
                case 11:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 10000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                        return res.json(true);
                    }
                    break;
                case 12:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 4 } })
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                4,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    4
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 4,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 4, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 20000 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                        return res.json(true);
                    }
                    break;
                case 13:
                    if (matrix_id){
                        const matrixItem = MatrixThird.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        const matrixTable = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 1 } })
                        const matrixTabletwo = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 2 } })
                        const matrixTableth = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 3 } })
                        const matrixTablefor = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 4 } })
                        const matrixTablesix = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 6 } })
                        const matrixTables = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 7 } })
                        const matrixTablesi = await Matrix_TableThird.findOne({ where: { userId: user.id, typeMatrixThirdId: 8 } })
                        if (!matrixTable){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
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
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 1,
                                userId: user.id,
                                count: 9,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 1, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTable.count + 10 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTable.id } })
                        }
                        if (!matrixTabletwo){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                2,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    2
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 2,
                                userId: user.id,
                                count: 5,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 2, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTabletwo.count + 6 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTabletwo.id } })
                        }
                        if (!matrixTableth){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                3,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    3
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 3,
                                userId: user.id,
                                count: 5,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 3, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTableth.count + 6 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTableth.id } })
                        }
                        if (!matrixTablefor){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                4,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    4
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 4,
                                userId: user.id,
                                count: 5,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 4, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTablefor.count + 6 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTablefor.id } })
                        }
                        if (!matrixTablesix){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                6,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    6
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 6,
                                userId: user.id,
                                count: 1,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 6, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTablesix.count + 2 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTablesix.id } })
                        }
                        if (!matrixTables){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                7,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    7
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 6,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 7, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTablesix.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTables.id } })
                        }
                        if (!matrixTablesi){
                            const referalId = user.referal_id;
                            let parentId, side_matrix;
                            const parentIdForCheck = await findParentIdSweeps(
                                8,
                                referalId,
                                user.id
                            );
                            if (parentIdForCheck) {
                                const resultFuncCheckCountParentId = await checkCountParentIdSweeps(
                                    parentIdForCheck,
                                    user.id,
                                    8
                                );
                                parentId = resultFuncCheckCountParentId.parentId;
                                side_matrix = resultFuncCheckCountParentId.side_matrix;
                            } else {
                                parentId = null;
                                side_matrix = null;
                            }

                            const matrixItem = await MatrixThird.create({
                                date: new Date(),
                                parent_id: parentId,
                                userId: user.id,
                                side_matrix,
                            });

                            const matrixTableItem = await Matrix_TableThird.create({
                                matrixThirdId: matrixItem.id,
                                typeMatrixThirdId: 8,
                                userId: user.id,
                                count: 0,
                            });
                            const marketingCheck = await marketingSweepsCheck(parentId);
                            if (marketingCheck > 0) {
                                const gift = await marketingSweepsGift(parentId, 8, marketingCheck);
                            }
                            return res.json(true);
                        }else {
                            let updateCount = { count: matrixTablesi.count + 1 }
                            await Matrix_TableThird.update(updateCount, { where: { id: matrixTablesi.id } })
                        }
                        let updateBalance = { balance: (+walletRUBBalance.balance) + 501600 };
                        await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                        await placetwo(matrix_id, parent_id, user, side_matrix, res)
                        return res.json(true);
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
module.exports = new SweepsControllers();