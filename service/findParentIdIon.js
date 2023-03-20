const {
    User,
} = require("../models/models");
const {Matrix_TableIon} = require("../models/ModelsIon/ModulesIon");

const findParentIdIon = async (typeMatrix, referalId, userId) => {
    const temp = await Matrix_TableIon.findAll({
        where: { typeMatrixIonId: typeMatrix },
    });
    if (temp.length === 0) {
        return null;
    }
    if (referalId === userId) {
        return null;
    }
    let matrixTableItems = await Matrix_TableIon.findOne({
        where: { userId: referalId, typeMatrixIonId: typeMatrix },
    });
    let parentId =
        matrixTableItems === null ? null : matrixTableItems.matrixIonId;
    if (!parentId) {
        const referalUser = await User.findOne({ where: { id: referalId } });
        return findParentIdIon(typeMatrix, referalUser.referal_id, referalUser);
    } else {
        return parentId;
    }
};

module.exports = {findParentIdIon}
