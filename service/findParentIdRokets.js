const {
    User, Matrix_TableFive,
} = require("../models/models");

const findParentIdRockets = async (typeMatrix, referalId, userId) => {
    const temp = await Matrix_TableFive.findAll({
        where: { typeMatrixFiveId: typeMatrix },
    });
    if (temp.length === 0) {
        return null;
    }
    if (referalId === userId) {
        return null;
    }
    let matrixTableItems = await Matrix_TableFive.findOne({
        where: { userId: referalId, typeMatrixFiveId: typeMatrix },
    });
    let parentId =
        matrixTableItems === null ? null : matrixTableItems.matrixFiveId;
    if (!parentId) {
        const referalUser = await User.findOne({ where: { id: referalId } });
        return findParentIdRockets(typeMatrix, referalUser.referal_id, referalUser);
    } else {
        return parentId;
    }
};

module.exports = {findParentIdRockets}
