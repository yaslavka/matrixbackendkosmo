const {
    User,
} = require("../models/models");
const {Matrix_TableRoyals} = require("../models/ModelsRoyals/ModulesRoyals");

const findParentIdRoyals = async (typeMatrix, referalId, userId) => {
    const temp = await Matrix_TableRoyals.findAll({
        where: { typeMatrixRoyalId: typeMatrix },
    });
    if (temp.length === 0) {
        return null;
    }
    if (referalId === userId) {
        return null;
    }
    let matrixTableItems = await Matrix_TableRoyals.findOne({
        where: { userId: referalId, typeMatrixRoyalId: typeMatrix },
    });
    let parentId =
        matrixTableItems === null ? null : matrixTableItems.matrixRoyalId;
    if (!parentId) {
        const referalUser = await User.findOne({ where: { id: referalId } });
        return findParentIdRoyals(typeMatrix, referalUser.referal_id, referalUser);
    } else {
        return parentId;
    }
};

module.exports = {findParentIdRoyals}
