const {findParentIdRockets} = require("./findParentIdRokets");
const {checkCountParentIdRockets} = require("./checkCountParentIdRockets");
const {MatrixIon, Matrix_TableIon} = require("../models/ModelsIon/ModulesIon");


const transitionToHighLevelAida = async (matrixId, level, user) => {
    let nextLevel = level + 1;
    const referalId = user.referal_id;
    let parentId, side_matrix;
    const parentIdForCheck = await findParentIdRockets(nextLevel, referalId, user.id);
    if (parentIdForCheck) {
        const resultFuncCheckCountParentId = await checkCountParentIdRockets(
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

    const matrixItem = await MatrixIon.create({
        date: new Date(),
        parent_id: parentId,
        userId: user.id,
        side_matrix,
    });

    const matrixTableItem = await Matrix_TableIon.create({
        matrixIonId: matrixItem.id,
        typeMatrixIonId: nextLevel,
        userId: user.id,
        count: 0,
    });
    const marketingCheck = await marketingAidaCheck(parentId);
    if (marketingCheck > 0) {
        await marketingAidaGift(parentId, nextLevel);
    }
};
