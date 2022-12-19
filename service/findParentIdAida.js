const {
    User,
    Matrix_TableSix,
} = require("../models/models");

const findParentIdAida = async (typeMatrix, referalId, userId) => {
    const temp = await Matrix_TableSix.findAll({
        where: { typeMatrixSixId: typeMatrix },
    });
    if (temp.length === 0) {
        return null;
    }
    if (referalId === userId) {
        return null;
    }
    let matrixTableItems = await Matrix_TableSix.findOne({
        where: { userId: referalId, typeMatrixSixId: typeMatrix },
    });
    let parentId =
        matrixTableItems === null ? null : matrixTableItems.matrixSixId;
    if (!parentId) {
        const referalUser = await User.findOne({ where: { id: referalId } });
        return findParentIdAida(typeMatrix, referalUser.referal_id, referalUser);
    } else {
        return parentId;
    }
};

module.exports = {findParentIdAida}