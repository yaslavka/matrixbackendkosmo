const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const { findParentIdKepler } = require("../service/findParentIdKepler");
const {
    checkCountParentIdKepler
} = require("../service/checkCoountParentIdKepler");
const {findParentIdGliese} = require("../service/findParentIdGliese");
const {checkCountParentIdGliese} = require("../service/checkCountParentIdGliese");
const marketingGlieseGift = require("./GlieseControllers")


const {
    CloneStatSecond,
    User,
    Matrix_TableSecond,
    TypeMatrixSecond,
    MatrixSecond,
    Matrix_TableFour,
    MatrixFour
} = require("../models/models");
const { Wallet } = require("../models/TablesExchange/tableWallet");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");
const marketingGlieseCheck = async (parent_id) => {
    if (!parent_id) {
        return false;
    }
    const countNode = await MatrixFour.count({ where: { parent_id } });
    return countNode
};

const marketingKeplerCheck = async (parent_id) => {
    if (!parent_id) {
        return false;
    }
    const countNode = await MatrixSecond.count({ where: { parent_id } });
    return countNode
};

const findRealUser = async (id, userId) => {
    const matrixThirdItem = await MatrixSecond.findOne({ where: { id } });
    const matrixTableData = await Matrix_TableSecond.findOne({
        where: { matrixSecondId: id },
    });
    if (matrixTableData) {
        const result = await Matrix_TableSecond.findOne({
            where: {
                typeMatrixSecondId: matrixTableData.typeMatrixSecondId,
                userId: userId,
            },
        });
        return result;
    } else {
        return findRealUser(matrixThirdItem.parent_id, userId);
    }
};

const transitionToHighLevelKepler = async (matrixId, level, user) => {
    let nextLevel = level + 1;
    const referalId = user.referal_id;
    let parentId, side_matrix;
    const parentIdForCheck = await findParentIdKepler(nextLevel, referalId, user.id);
    if (parentIdForCheck) {
        const resultFuncCheckCountParentId = await checkCountParentIdKepler(
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

    const matrixItem = await MatrixSecond.create({
        date: new Date(),
        parent_id: parentId,
        userId: user.id,
        side_matrix,
    });

    const matrixTableItem = await Matrix_TableSecond.create({
        matrixSecondId: matrixItem.id,
        typeMatrixSecondId: nextLevel,
        userId: user.id,
        count: 0,
    });
    const marketingCheck = await marketingKeplerCheck(parentId);
    if (marketingCheck > 0) {
        await marketingKeplerGift(parentId, nextLevel);
    }
};

const marketingKeplerGift = async (parentId, type_matrix_id, count, res) => {
    const matrixItemThree = await MatrixSecond.findOne({
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
                updateBalance = { balance: (+walletRUBBalance.balance) + 600 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                await transitionToHighLevelKepler(parentId, type_matrix_id, user);
            }
            break;
        case 2:
            if (count === 2){
                updateBalance = { balance: (+walletRUBBalance.balance) + 600 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                await transitionToHighLevelKepler(parentId, type_matrix_id, user);
            }
            break;
        case 3:
            if (count === 2){
                updateBalance = { balance: (+walletRUBBalance.balance) + 600 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                await transitionToHighLevelKepler(parentId, type_matrix_id, user);
            }
            break;
        case 4:
            if (count === 2){
                updateBalance = { balance: (+walletRUBBalance.balance) + 1000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                await transitionToHighLevelKepler(parentId, type_matrix_id, user);
            }
            break;
        case 5:
            if (count === 2){
                let checkMatrixTable = await Matrix_TableSecond.findOne({
                    where: { userId: user.id, typeMatrixSecondId: 2 },
                });
                updateBalance = { balance: (+walletRUBBalance.balance) + 2000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                if (!checkMatrixTable) {
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdKepler(
                        2,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdKepler(
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

                    const matrixItem = await MatrixSecond.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableSecond.create({
                        matrixSecondId: matrixItem.id,
                        typeMatrixSecondId: 2,
                        userId: user.id,
                        count: 1,
                    });
                    const marketingCheck = await marketingKeplerCheck(parentId);
                    if (marketingCheck > 0) {
                        await marketingKeplerGift(parentId, 2, marketingCheck);
                    }
                } else {
                    let updateTable = { count: checkMatrixTable.count + 2 };
                    await Matrix_TableSecond.update(updateTable, {
                        where: { userId: user.id, typeMatrixSecondId: 2 },
                    });
                }
                await transitionToHighLevelKepler(parentId, type_matrix_id, user);
            }
            break;
        case 6:
            if (count === 2){
                let checkMatrixTable = await Matrix_TableFour.findOne({
                    where: { userId: user.id, typeMatrixFourId: 1 },
                });
                updateBalance = { balance: (+walletRUBBalance.balance) + 2000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
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
                        count: 0,
                    });
                    const marketingCheck = await marketingGlieseCheck(parentId);
                    if (marketingCheck > 0) {
                        await marketingGlieseGift(parentId, 1, marketingCheck);
                    }
                } else {
                    let updateTable = { count: checkMatrixTable.count + 1 };
                    await Matrix_TableFour.update(updateTable, {
                        where: { userId: user.id, typeMatrixFourId: 1 },
                    });
                    return res.json(true)
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
    let matrix = await MatrixSecond.findAll({
        where: { parent_id: node },
        include: {
            model: User,
            as: "user",
        },
    });
    return matrix;
};

class KeplerControllers {
    async getCloneStat(req, res, next) {
        const count = await CloneStatSecond.findAll();
        return res.json({ items: count });
    }
    async buy(req, res, next) {
        const { authorization } = req.headers;
        if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
        const token = authorization.slice(7);
        const { username, } = jwt_decode(token);
        const { matrix_id } = req.body;
        const price = (await TypeMatrixSecond.findOne({ where: { id: matrix_id } }))
            .summ;
        const user = await User.findOne({ where: { username } });
        const is_verified = await User.findOne({where: {is_verified: user.is_verified}})
        const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
        const walletRUBBalance = await BalanceCrypto.findOne({
            where: {
                userId: user.id,
                walletId: walletRUBId.id
            }
        })
        if (((+walletRUBBalance.balance) < price)) {
            return next(ApiError.badRequest("Недостатосно средств"));
        } else if ((+walletRUBBalance.balance) >= price){
            let update = { balance: (+walletRUBBalance.balance) - price };
            await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
            let verified = {is_verified: is_verified.is_verified + 1}
            await User.update(verified,{where: {id: user.id}})
        }
        let checkMatrixTable = await Matrix_TableSecond.findOne({
            where: { userId: user.id, typeMatrixSecondId: matrix_id },
        });
        if (!checkMatrixTable) {
            const referalId = user.referal_id;
            let parentId, side_matrix;
            const parentIdForCheck = await findParentIdKepler(
                matrix_id,
                referalId,
                user.id
            );
            if (parentIdForCheck) {
                const resultFuncCheckCountParentId = await checkCountParentIdKepler(
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

            const matrixItem = await MatrixSecond.create({
                date: new Date(),
                parent_id: parentId,
                userId: user.id,
                side_matrix,
            });

            const matrixTableItem = await Matrix_TableSecond.create({
                matrixSecondId: matrixItem.id,
                typeMatrixSecondId: matrix_id,
                userId: user.id,
                count: 0,
            });
            const marketingCheck = await marketingKeplerCheck(parentId);
            if (marketingCheck > 0) {
                await marketingKeplerGift(parentId, matrix_id, marketingCheck, res);
            }
            return res.json(true);
        } else {
            let updateTable = { count: checkMatrixTable.count + 1 };
            await Matrix_TableSecond.update(updateTable, {
                where: { userId: user.id, typeMatrixSecondId: matrix_id },
            });
        }
        return res.json(true)
    }
    async getType(req, res, next) {
        const { authorization } = req.headers;
        if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const user = await User.findOne({ where: { username } });
        const type = await Matrix_TableSecond.findAll({
            where: { userId: user.id },
        });
        const typeMatrix = await TypeMatrixSecond.findAll();
        let result = [];
        for (let i = 1; i < 7; i++) {
            const countItem = type.filter((j)=>{
                return j.typeMatrixSecondId === i
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
        const { matrix_type, matrix_id } = req.query;



        if (matrix_type) {
            const { authorization } = req.headers;
            if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
            const token = authorization.slice(7);
            const { username } = jwt_decode(token);

            const user = await User.findOne({ where: { username } });
            const dataMatrixTable = await Matrix_TableSecond.findOne({
                where: { userId: user?.id, typeMatrixSecondId: matrix_type },
            });
            if (!dataMatrixTable) {
                let result = {};
                for (let i = 0; i < 3; i++) {
                    if (!result[i]) {
                        result[i] = null;
                    }
                }
                return res.json({ items: result });
            }
            const root_matrix_tables = await MatrixSecond.findOne({
                where: { id: dataMatrixTable?.matrixSecondId },
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

            for (let i = 0; i < 3; i++) {
                if (!result[i]) {
                    result[i] = null;
                }
            }
            return res.json({ items: result });
        }
        if (matrix_id) {
            const rootUserId = await MatrixSecond.findOne({
                where: { id: matrix_id },
            });
            if(!rootUserId){
                return res.json('Ненайден айди пользователя');
            }
            const rootUser = await User.findOne({ where: { id: rootUserId.userId } });
            if(!rootUser){
                return res.json('Ненайден айди пользователя');
            }

            const firstChildes = await childNode(matrix_id);

            let result = {
                0: {
                    id: matrix_id,
                    userName: rootUser?.username,
                    photo: rootUser?.avatar,
                    typeId: null,
                    place: 0,
                    date: rootUser?.createdAt,
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

            return res.json({ items: result });
        }
    }
    async structureUpper(req, res, next) {
        const { matrix_id } = req.query;

        if (matrix_id) {
            const temp = await MatrixSecond.findOne({ where: { id: matrix_id } });
            const rootUserId = await MatrixSecond.findOne({
                where: { id: temp.parent_id },
            });
            if(!rootUserId){
                return res.json('Ненайден айди пользователя');
            }
            const rootUser = await User.findOne({ where: { id: rootUserId.userId } });
            if(!rootUser){
                return res.json('Ненайден айди пользователя');
            }

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

            for (let i = 0; i < 3; i++) {
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
        if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const user = await User.findOne({ where: { username } });
        const count = await Matrix_TableSecond.findOne({
            where: { userId: user.id, typeMatrixSecondId: matrix_type },
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
        if(!authorization){
                return res.json('Ненайден айди пользователя');
            }
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
        await Matrix_TableSecond.update(update, {
            where: { id: matrixTableData.id },
        });
        const typeMatrix = (
            await Matrix_TableSecond.findOne({ where: { id: matrixTableData.id } })
        ).typeMatrixSecondId;
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
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true)
                    }
                    break;
                case 2:
                    if (matrix_id){
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true)
                    }
                    break;
                case 3:
                    if (matrix_id){
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true)
                    }
                    break;
                case 4:
                    if (matrix_id){
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true)
                    }
                    break;
                case 5:
                    if (matrix_id){
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true)
                    }
                    break;
                case 6:
                    if (matrix_id){
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true)
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
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        return res.json(true)
                    }
                    break;
                case 2:
                    if (matrix_id){
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingKeplerGift(parent_id, matrix_id, place, res)
                        return res.json(true)
                    }
                    break;
                case 3:
                    if (matrix_id){
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingKeplerGift(parent_id, matrix_id, place, res)
                        return res.json(true)
                    }
                    break;
                case 4:
                    if (matrix_id){
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingKeplerGift(parent_id, matrix_id, place, res)
                        return res.json(true)
                    }
                    break;
                case 5:
                    if (matrix_id){
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingKeplerGift(parent_id, matrix_id, place, res)
                        return res.json(true)
                    }
                    break;
                case 6:
                    if (matrix_id){
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingKeplerGift(parent_id, matrix_id, place, res)
                        return res.json(true)
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
                        const matrixItem = MatrixSecond.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingKeplerGift(parent_id, matrix_id, place, res)
                        return res.json(true)
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
module.exports = new KeplerControllers();
