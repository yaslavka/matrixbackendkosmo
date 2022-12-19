const {
    User,
    Matrix_TableThird,
} = require("../models/models");

const findParentIdSweeps = async (typeMatrix, referalId, userId) => {
    const temp = await Matrix_TableThird.findAll({
        where: { typeMatrixThirdId: typeMatrix },
    });
    if (temp.length === 0) {
        return null;
    }
    if (referalId === userId) {
        return null;
    }
    let matrixTableItems = await Matrix_TableThird.findOne({
        where: { userId: referalId, typeMatrixThirdId: typeMatrix },
    });
    let parentId =
        matrixTableItems === null ? null : matrixTableItems.matrixThirdId;
    if (!parentId) {
        const referalUser = await User.findOne({ where: { id: referalId } });
        return findParentIdSweeps(typeMatrix, referalUser.referal_id, referalUser);
    } else {
        return parentId;
    }
};

module.exports = {findParentIdSweeps}