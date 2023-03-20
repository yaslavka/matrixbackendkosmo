const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");
const {User} = require("../models/models");
const { Wallet } = require("../models/TablesExchange/tableWallet");
const { BalanceCrypto } = require("../models/TablesExchange/tableBalanceCrypto");
const {checkCountParentIdUno} = require("../service/checkCountParentIdUno");
const {findParentIdUno} = require("../service/findParentIdUno");
const {MatrixUno, Matrix_TableUno, CloneStatUno, TypeMatrixUno} = require("../models/ModelsUno/ModulesIon");
const jwt = require("jsonwebtoken");

const marketingKeplerCheck = async (parent_id) => {
    if (!parent_id) {
        return false;
    }
    const countNode = await MatrixUno.count({ where: { parent_id } });
    return countNode
};

const findRealUser = async (id, userId) => {
    const matrixThirdItem = await MatrixUno.findOne({ where: { id } });
    const matrixTableData = await Matrix_TableUno.findOne({
        where: { matrixUnoId: id },
    });
    if (matrixTableData) {
        const result = await Matrix_TableUno.findOne({
            where: {
                typeMatrixUnoId: matrixTableData.typeMatrixUnoId,
                userId: userId,
            },
        });
        return result;
    } else {
        return findRealUser(matrixThirdItem.parent_id, userId);
    }
};

const marketingKeplerGift = async (parentId, type_matrix_id, count) => {
    const matrixItemThree = await MatrixUno.findOne({
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
            updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
          }
          if (count === 2){
            updateBalance = { balance: (+walletRUBBalance.balance) + 5000 };
            await BalanceCrypto.update(updateBalance, { where: { id: walletRUBBalance.id } });
          }
          if (count === 3){
              let checkMatrixTable = await Matrix_TableUno.findOne({
                where: { userId: user.id, typeMatrixUnoId: 1 },
              });
              if (!checkMatrixTable) {
                const referalId = user.referal_id;
                let parentId, side_matrix;
                const parentIdForCheck = await findParentIdUno(
                  1,
                  referalId,
                  user.id
                );
                if (parentIdForCheck) {
                  const resultFuncCheckCountParentId = await checkCountParentIdUno(
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

                const matrixItem = await MatrixUno.create({
                  date: new Date(),
                  parent_id: parentId,
                  userId: user.id,
                  side_matrix,
                });

                const matrixTableItem = await Matrix_TableUno.create({
                  matrixUnoId: matrixItem.id,
                  typeMatrixUnoId: 1,
                  userId: user.id,
                  count: 0,
                });
                const marketingCheck = await marketingKeplerCheck(parentId);
                if (marketingCheck > 0) {
                  await marketingKeplerGift(parentId, 1, marketingCheck);
                }
              } else {
                let updateTable = { count: checkMatrixTable.count + 1 };
                await Matrix_TableUno.update(updateTable, {
                  where: { userId: user.id, typeMatrixUnoId: 1 },
                });
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
    let matrix = await MatrixUno.findAll({
        where: { parent_id: node },
        include: {
            model: User,
            as: "user",
        },
    });
    return matrix;
};

class UnoControllers {
    async getCloneStat(req, res, next) {
        const count = await CloneStatUno.findAll();
        return res.json({ items: count });
    }
    async buy(req, res, next) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt.decode(token);
        const { matrix_id } = req.body;
        const price = (await TypeMatrixUno.findOne({ where: { id: matrix_id } }))
            .summ;
        const user = await User.findOne({ where: { username } });
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
        }
        let checkMatrixTable = await Matrix_TableUno.findOne({
            where: { userId: user.id, typeMatrixUnoId: matrix_id },
        });
        if (!checkMatrixTable) {
            const referalId = user.referal_id;
            let parentId, side_matrix;
            const parentIdForCheck = await findParentIdUno(
                matrix_id,
                referalId,
                user.id
            );
            if (parentIdForCheck) {
                const resultFuncCheckCountParentId = await checkCountParentIdUno(
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

            const matrixItem = await MatrixUno.create({
                date: new Date(),
                parent_id: parentId,
                userId: user.id,
                side_matrix,
            });

            const matrixTableItem = await Matrix_TableUno.create({
                matrixUnoId: matrixItem.id,
                typeMatrixUnoId: matrix_id,
                userId: user.id,
                count: 0,
            });
            const marketingCheck = await marketingKeplerCheck(parentId);
            if (marketingCheck > 0) {
                await marketingKeplerGift(parentId, matrix_id, marketingCheck, res);
            }
            return res.json(true);
        } else {
            return next(ApiError.badRequest("Повторная покупка не доступна"))
        }
    }
    async getType(req, res) {
        const { authorization } = req.headers;
        const token = authorization.slice(7);
        const { username } = jwt_decode(token);
        const user = await User.findOne({ where: { username } });
        const type = await Matrix_TableUno.findAll({
            where: { userId: user.id },
        });
        const typeMatrix = await TypeMatrixUno.findAll();
        let result = [];
        for (let i = 1; i < 2; i++) {
            const countItem = type.filter((j)=>{
                return j.typeMatrixUnoId === i
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
            const rootUserId = await MatrixUno.findOne({
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
            const dataMatrixTable = await Matrix_TableUno.findOne({
                where: { userId: user?.id, typeMatrixUnoId: matrix_type },
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
            const root_matrix_tables = await MatrixUno.findOne({
                where: { id: dataMatrixTable?.matrixUnoId },
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
            const temp = await MatrixUno.findOne({ where: { id: matrix_id } });
            const rootUserId = await MatrixUno.findOne({
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
        const count = await Matrix_TableUno.findOne({
            where: { userId: user.id, typeMatrixUnoId: matrix_type },
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
        await Matrix_TableUno.update(update, {
            where: { id: matrixTableData.id },
        });
        const typeMatrix = (
            await Matrix_TableUno.findOne({ where: { id: matrixTableData.id } })
        ).typeMatrixUnoId;
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
                        const matrixItem = MatrixUno.create({
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
        if (place === 2){
            switch (matrix_id){
                case 1:
                    if (matrix_id){
                        const matrixItem = MatrixUno.create({
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
                        const matrixItem = MatrixUno.create({
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
module.exports = new UnoControllers();
