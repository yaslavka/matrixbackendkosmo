const {
    User,
    Matrix_TableSecond,
} = require("../models/models");

const findParentIdKepler = async (typeMatrix, referalId, userId) => {
    const temp = await Matrix_TableSecond.findAll({
        where: { typeMatrixSecondId: typeMatrix },
    });
    if (temp.length === 0) {
        return null;
    }
    if (referalId === userId) {
        return null;
    }
    let matrixTableItems = await Matrix_TableSecond.findOne({
        where: { userId: referalId, typeMatrixSecondId: typeMatrix },
    });
    let parentId =
        matrixTableItems === null ? null : matrixTableItems.matrixSecondId;
    if (!parentId) {
        const referalUser = await User.findOne({ where: { id: referalId } });
        return findParentIdKepler(typeMatrix, referalUser.referal_id, referalUser);
    } else {
        return parentId;
    }
};

module.exports = {findParentIdKepler}