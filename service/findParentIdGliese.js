const {
    User,
    Matrix_TableFour,
} = require("../models/models");


const findParentIdGliese = async (typeMatrix, referalId, userId) => {
    const temp = await Matrix_TableFour.findAll({
        where: { typeMatrixFourId: typeMatrix },
    });
    if (temp.length === 0) {
        return null;
    }
    if (referalId === userId) {
        return null;
    }
    let matrixTableItems = await Matrix_TableFour.findOne({
        where: { userId: referalId, typeMatrixFourId: typeMatrix },
    });
    let parentId =
        matrixTableItems === null ? null : matrixTableItems.matrixFourId;
    if (!parentId) {
        const referalUser = await User.findOne({ where: { id: referalId } });
        return findParentIdGliese(typeMatrix, referalUser.referal_id, referalUser);
    } else {
        return parentId;
    }
};

module.exports = {findParentIdGliese}