const {
    User,
    Matrix_TableUno,
} = require("../models/ModelsUno/ModulesIon");

const findParentIdUno = async (typeMatrix, referalId, userId) => {
    const temp = await Matrix_TableUno.findAll({
        where: { typeMatrixUnoId: typeMatrix },
    });
    if (temp.length === 0) {
        return null;
    }
    if (referalId === userId) {
        return null;
    }
    let matrixTableItems = await Matrix_TableUno.findOne({
        where: { userId: referalId, typeMatrixUnoId: typeMatrix },
    });
    let parentId =
        matrixTableItems === null ? null : matrixTableItems.matrixUnoId;
    if (!parentId) {
        const referalUser = await User.findOne({ where: { id: referalId } });
        return findParentIdUno(typeMatrix, referalUser.referal_id, referalUser);
    } else {
        return parentId;
    }
};

module.exports = {findParentIdUno}
