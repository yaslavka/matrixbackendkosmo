const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const { findParentIdAida } = require("../service/findParentIdAida");
const {
    checkCountParentIdAida,
} = require("../service/checkCoountParentIdAida");


const {
    CloneStatSix,
    User,
    Matrix_TableSix,
    TypeMatrixSix,
    MatrixSix,
} = require("../models/models");
const { Wallet } = require("../models/TablesExchange/tableWallet");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");

const marketingAidaCheck = async (parent_id) => {
    if (!parent_id) {
        return false;
    }
    const countNode = await MatrixSix.count({ where: { parent_id } });
    return countNode
};


const findRealUser = async (id, userId) => {
    const matrixThirdItem = await MatrixSix.findOne({ where: { id } });
    const matrixTableData = await Matrix_TableSix.findOne({
        where: { matrixSixId: id },
    });
    if (matrixTableData) {
        const result = await Matrix_TableSix.findOne({
            where: {
                typeMatrixSixId: matrixTableData.typeMatrixSixId,
                userId: userId,
            },
        });
        return result;
    } else {
        return findRealUser(matrixThirdItem.parent_id, userId);
    }
};

const transitionToHighLevelAida = async (matrixId, level, user) => {
    let nextLevel = level + 1;
    const referalId = user.referal_id;
    let parentId, side_matrix;
    const parentIdForCheck = await findParentIdAida(nextLevel, referalId, user.id);
    if (parentIdForCheck) {
        const resultFuncCheckCountParentId = await checkCountParentIdAida(
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

    const matrixItem = await MatrixSix.create({
        date: new Date(),
        parent_id: parentId,
        userId: user.id,
        side_matrix,
    });

    const matrixTableItem = await Matrix_TableSix.create({
        matrixSixId: matrixItem.id,
        typeMatrixSixId: nextLevel,
        userId: user.id,
        count: 0,
    });
    const marketingCheck = await marketingAidaCheck(parentId);
    if (marketingCheck > 0) {
        const gift = await marketingAidaGift(parentId, nextLevel);
    }
};

const marketingAidaGift = async (parentId, type_matrix_id, count, res) => {
    const matrixItemThree = await MatrixSix.findOne({
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
                updateBalance = { balance: (+walletRUBBalance.balance) + 90000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                await transitionToHighLevelAida(parentId, type_matrix_id, user);
            }
            break;
        case 2:
            if (count === 2){
                updateBalance = { balance: (+walletRUBBalance.balance) + 80000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
                await transitionToHighLevelAida(parentId, type_matrix_id, user);
            }
            break;
        case 3:
            if (count === 1){
                let checkMatrixTabl = await Matrix_TableSix.findOne({
                    where: { userId: user.id, typeMatrixSixId: 1 },
                });
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
                        count: 9,
                    });
                    const marketingCheck = await marketingAidaCheck(parentId);
                    if (marketingCheck > 0) {
                        await marketingAidaGift(parentId, 1, marketingCheck);
                    }
                } else {
                    let updateTable = { count: checkMatrixTabl.count + 10 };
                    await Matrix_TableSix.update(updateTable, {
                        where: { userId: user.id, typeMatrixSixId: 1 },
                    });
                    return res.json(true)
                }
            }
            if (count === 2){
                updateBalance = { balance: (+walletRUBBalance.balance) + 80000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
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
    let matrix = await MatrixSix.findAll({
        where: { parent_id: node },
        include: {
            model: User,
            as: "user",
        },
    });
    return matrix;
};

class AidaControllers {
    async getCloneStat(req, res, next) {
        const count = await CloneStatSix.findAll();
        return res.json({ items: count });
    }
    async buy(req, res, next) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const { matrix_id } = req.body;
        const price = (await TypeMatrixSix.findOne({ where: { id: matrix_id } }))
            .summ;
        const user = await User.findOne({ where: { username } });
        const walletRUBId = await Wallet.findOne({where:{name: 'RUR'}})
        const walletRUBBalance = await BalanceCrypto.findOne({
            where: {
                userId: user.id,
                walletId: walletRUBId.id
            }
        })
        if (((+walletRUBBalance.balance) < price) && (+user.locale < price)) {
            return next(ApiError.badRequest("Недостатосно средств"));
        } else if ((+walletRUBBalance.balance) >= price){
            let update = { balance: (+walletRUBBalance.balance) - price };
            await BalanceCrypto.update(update, { where: { id: walletRUBBalance.id } });
        } else {
            let update = { locale: (+user.locale) - price };
            await User.update(update, { where: { id: user.id } });
        }

        let checkMatrixTable = await Matrix_TableSix.findOne({
            where: { userId: user.id, typeMatrixSixId: matrix_id },
        });
        if (!checkMatrixTable) {
            const referalId = user.referal_id;
            let parentId, side_matrix;
            const parentIdForCheck = await findParentIdAida(
                matrix_id,
                referalId,
                user.id
            );
            if (parentIdForCheck) {
                const resultFuncCheckCountParentId = await checkCountParentIdAida(
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

            const matrixItem = await MatrixSix.create({
                date: new Date(),
                parent_id: parentId,
                userId: user.id,
                side_matrix,
            });

            const matrixTableItem = await Matrix_TableSix.create({
                matrixSixId: matrixItem.id,
                typeMatrixSixId: matrix_id,
                userId: user.id,
                count: 0,
            });
            const marketingCheck = await marketingAidaCheck(parentId);
            if (marketingCheck > 0) {
                await marketingAidaGift(parentId, matrix_id, marketingCheck, res);
            }
            return res.json(true);
        }else {
            let updateTable = { count: checkMatrixTable.count + 1 };
            await Matrix_TableSix.update(updateTable, {
                where: { userId: user.id, typeMatrixSixId: matrix_id },
            });
        }
        return res.json(true)
    }
    async getType(req, res, next) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const user = await User.findOne({ where: { username } });
        const type = await Matrix_TableSix.findAll({
            where: { userId: user.id },
        });
        const typeMatrix = await TypeMatrixSix.findAll();
        let result = [];
        for (let i = 1; i < 4; i++) {
            const countItem = type.filter((j)=>{
                return j.typeMatrixSixId === i
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

        if (matrix_id) {
            const rootUserId = await MatrixSix.findOne({
                where: { id: matrix_id },
            });
            if(!rootUserId){
                return res.json({message: 'Ненайден айди пользователя'});
            }
            const rootUser = await User.findOne({ where: { id: rootUserId.userId } });
            if(!rootUser){
                return res.json({message: 'Ненайден айди пользователя'});
            }
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

            return res.json({ items: result });
        }

        if (matrix_type) {
            const { authorization } = req.headers;
            const token = authorization.slice(7);
            const { username } = jwt_decode(token);

            const user = await User.findOne({ where: { username } });
            const dataMatrixTable = await Matrix_TableSix.findOne({
                where: { userId: user?.id, typeMatrixSixId: matrix_type },
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
            const root_matrix_tables = await MatrixSix.findOne({
                where: { id: dataMatrixTable?.matrixSixId },
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
    }
    async structureUpper(req, res, next) {
        const { matrix_id } = req.query;

        if (matrix_id) {
            const temp = await MatrixSix.findOne({ where: { id: matrix_id } });
            const rootUserId = await MatrixSix.findOne({
                where: { id: temp.parent_id },
            });
            if(!rootUserId){
                return res.json({message: 'Ненайден айди пользователя'});
            }
            const rootUser = await User.findOne({ where: { id: rootUserId.userId } });
            if(!rootUser){
                return res.json({message: 'Ненайден айди пользователя'});
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
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const user = await User.findOne({ where: { username } });
        const count = await Matrix_TableSix.findOne({
            where: { userId: user.id, typeMatrixSixId: matrix_type },
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
        let update = { count: matrixTableData.count - 1 };
        await Matrix_TableSix.update(update, {
            where: { id: matrixTableData.id },
        });
        const typeMatrix = (
            await Matrix_TableSix.findOne({ where: { id: matrixTableData.id } })
        ).typeMatrixSixId;
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
                        const matrixItem = MatrixSix.create({
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
                        const matrixItem = MatrixSix.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingAidaGift(parent_id, matrix_id, place, res)
                        return res.json(true)
                    }
                    break;
                case 3:
                    if (matrix_id){
                        const matrixItem = MatrixSix.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingAidaGift(parent_id, matrix_id, place, res)
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
                        const matrixItem = MatrixSix.create({
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
                        const matrixItem = MatrixSix.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingAidaGift(parent_id, matrix_id, place, res)
                        return res.json(true)
                    }
                    break;
                case 3:
                    if (matrix_id){
                        const matrixItem = MatrixSix.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingAidaGift(parent_id, matrix_id, place, res)
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
                        const matrixItem = MatrixSix.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingAidaGift(parent_id, matrix_id, place, res)
                        return res.json(true)
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
module.exports = new AidaControllers();
