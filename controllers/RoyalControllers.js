const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const {
    User,
} = require("../models/models");
const { Wallet } = require("../models/TablesExchange/tableWallet");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");
const {MatrixRoyals, Matrix_TableRoyals, CloneStatRoyals, TypeMatrixRoyals} = require("../models/ModelsRoyals/ModulesRoyals");
const {findParentIdRoyals} = require("../service/findParentIdRoyals");
const {checkCountParentIdRoyals} = require("../service/checkCountParentIdRoyals");


const marketingAidaCheck = async (parent_id) => {
    if (!parent_id) {
        return false;
    }
    const countNode = await MatrixRoyals.count({ where: { parent_id } });
    return countNode
};


const findRealUser = async (id, userId) => {
    const matrixThirdItem = await MatrixRoyals.findOne({ where: { id } });
    const matrixTableData = await Matrix_TableRoyals.findOne({
        where: { matrixRoyalId: id },
    });
    if (matrixTableData) {
        const result = await Matrix_TableRoyals.findOne({
            where: {
                typeMatrixRoyalId: matrixTableData.typeMatrixRoyalId,
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
    const parentIdForCheck = await findParentIdRoyals(nextLevel, referalId, user.id);
    if (parentIdForCheck) {
        const resultFuncCheckCountParentId = await checkCountParentIdRoyals(
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

    const matrixItem = await MatrixRoyals.create({
        date: new Date(),
        parent_id: parentId,
        userId: user.id,
        side_matrix,
    });

    const matrixTableItem = await Matrix_TableRoyals.create({
        matrixRoyalId: matrixItem.id,
        typeMatrixRoyalId: nextLevel,
        userId: user.id,
        count: 0,
    });
    const marketingCheck = await marketingAidaCheck(parentId);
    if (marketingCheck > 0) {
        await marketingAidaGift(parentId, nextLevel);
    }
};

const marketingAidaGift = async (parentId, type_matrix_id, count, res) => {
    const matrixItemThree = await MatrixRoyals.findOne({
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
            if (count === 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 20000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count === 3){
                await transitionToHighLevelAida(parentId, type_matrix_id, user);
            }
            break;
        case 2:
            if (count === 2){
                await transitionToHighLevelAida(parentId, type_matrix_id, user);
            }
            break;
        case 3:
            if (count === 1){
                updateBalance = { balance: (+walletRUBBalance.balance) + 80000 };
                await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
            }
            if (count === 2){
                let checkMatrixTabl = await Matrix_TableRoyals.findOne({
                    where: { userId: user.id, typeMatrixRoyalId: 1 },
                });
                const matrixKeplerCheckReferal = await Matrix_TableRoyals.findOne({where:{userId:user.referal_id}})
                if (matrixKeplerCheckReferal){
                    const referalUser = await User.findOne({where:{id:user.referal_id}})
                    const walletRUBBalanceReferal = await BalanceCrypto.findOne({
                        where: {
                            userId: referalUser.id,
                            walletId: walletRUBId.id
                        }
                    })
                    let updateBalanceReferal = { balance: (+walletRUBBalanceReferal.balance) + 60000 };
                    await BalanceCrypto.update(updateBalanceReferal, { where: { id: walletRUBBalanceReferal.id } });
                }

                if (!checkMatrixTabl) {
                    const referalId = user.referal_id;
                    let parentId, side_matrix;
                    const parentIdForCheck = await findParentIdRoyals(
                        1,
                        referalId,
                        user.id
                    );
                    if (parentIdForCheck) {
                        const resultFuncCheckCountParentId = await checkCountParentIdRoyals(
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

                    const matrixItem = await MatrixRoyals.create({
                        date: new Date(),
                        parent_id: parentId,
                        userId: user.id,
                        side_matrix,
                    });

                    const matrixTableItem = await Matrix_TableRoyals.create({
                        matrixRoyalId: matrixItem.id,
                        typeMatrixRoyalId: 1,
                        userId: user.id,
                        count: 9,
                    });
                    const marketingCheck = await marketingAidaCheck(parentId);
                    if (marketingCheck > 0) {
                        await marketingAidaGift(parentId, 1, marketingCheck);
                    }
                } else {
                    let updateTable = { count: checkMatrixTabl.count + 10 };
                    await Matrix_TableRoyals.update(updateTable, {
                        where: { userId: user.id, typeMatrixRoyalId: 1 },
                    });
                    return res.json(true)
                }
            }
            if (count === 3){
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
    let matrix = await MatrixRoyals.findAll({
        where: { parent_id: node },
        include: {
            model: User,
            as: "user",
        },
    });
    return matrix;
};

class RoyalsControllers {
    async getCloneStat(req, res) {
        const count = await CloneStatRoyals.findAll();
        return res.json({ items: count });
    }
    async buy(req, res, next) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const { matrix_id } = req.body;
        const price = (await TypeMatrixRoyals.findOne({ where: { id: matrix_id } }))
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

        let checkMatrixTable = await Matrix_TableRoyals.findOne({
            where: { userId: user.id, typeMatrixRoyalId: matrix_id },
        });
        if (!checkMatrixTable) {
            const referalId = user.referal_id;
            let parentId, side_matrix;
            const parentIdForCheck = await findParentIdRoyals(
                matrix_id,
                referalId,
                user.id
            );
            if (parentIdForCheck) {
                const resultFuncCheckCountParentId = await checkCountParentIdRoyals(
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

            const matrixItem = await MatrixRoyals.create({
                date: new Date(),
                parent_id: parentId,
                userId: user.id,
                side_matrix,
            });

            const matrixTableItem = await Matrix_TableRoyals.create({
                matrixRoyalId: matrixItem.id,
                typeMatrixRoyalId: matrix_id,
                userId: user.id,
                count: 0,
            });
            const marketingCheck = await marketingAidaCheck(parentId);
            if (marketingCheck > 0) {
                await marketingAidaGift(parentId, matrix_id, marketingCheck, res);
            }
            return res.json(true);
        }else {
            return next(ApiError.badRequest("Повторная покупка недоступна"));
        }
    }
    async getType(req, res) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const user = await User.findOne({ where: { username } });
        const type = await Matrix_TableRoyals.findAll({
            where: { userId: user.id },
        });
        const typeMatrix = await TypeMatrixRoyals.findAll();
        let result = [];
        for (let i = 1; i < 4; i++) {
            const countItem = type.filter((j)=>{
                return j.typeMatrixRoyalId === i
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
    async structure(req, res) {
        const { matrix_type, matrix_id } = req.query;

        if (matrix_id) {
            const rootUserId = await MatrixRoyals.findOne({
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
            const dataMatrixTable = await Matrix_TableRoyals.findOne({
                where: { userId: user?.id, typeMatrixRoyalId: matrix_type },
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
            const root_matrix_tables = await MatrixRoyals.findOne({
                where: { id: dataMatrixTable?.matrixRoyalId },
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
    async structureUpper(req, res) {
        const { matrix_id } = req.query;

        if (matrix_id) {
            const temp = await MatrixRoyals.findOne({ where: { id: matrix_id } });
            const rootUserId = await MatrixRoyals.findOne({
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
    async clone(req, res) {
        const { matrix_type } = req.query;
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const user = await User.findOne({ where: { username } });
        const count = await Matrix_TableRoyals.findOne({
            where: { userId: user.id, typeMatrixRoyalId: matrix_type },
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
        await Matrix_TableRoyals.update(update, {
            where: { id: matrixTableData.id },
        });
        const typeMatrix = (
            await Matrix_TableRoyals.findOne({ where: { id: matrixTableData.id } })
        ).typeMatrixRoyalId;
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
                        const matrixItem = MatrixRoyals.create({
                            date: new Date(),
                            parent_id: parent_id,
                            userId: user.id,
                            side_matrix,
                        });
                        await marketingAidaGift(parent_id, matrix_id, place, res)
                        return res.json(true);
                    }
                    break;
                case 2:
                    if (matrix_id){
                        const matrixItem = MatrixRoyals.create({
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
                        const matrixItem = MatrixRoyals.create({
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
                        const matrixItem = MatrixRoyals.create({
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
                        const matrixItem = MatrixRoyals.create({
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
                        const matrixItem = MatrixRoyals.create({
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
                        const matrixItem = MatrixRoyals.create({
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
                        const matrixItem = MatrixRoyals.create({
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
module.exports = new RoyalsControllers();
