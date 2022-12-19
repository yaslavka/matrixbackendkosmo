const {
    MatrixThird,
} = require("../models/models");

const checkCountParentIdSweeps = async (parentId, userId, typeMatrixThirdId) => {
    const itemsParentId = await MatrixThird.findAll({
        where: { parent_id: parentId },
    });
    if (itemsParentId.length > 1) {
        let one = await checkCountParentIdSweeps(itemsParentId[0].id, userId);
        let two = await checkCountParentIdSweeps(itemsParentId[1].id, userId);
        let countOne = await MatrixThird.count({
            where: { parent_id: one.parentId },
        });
        let countTwo = await MatrixThird.count({
            where: { parent_id: two.parentId },
        });
        if (countOne > countTwo) {
            return one;
        } else if (countOne < countTwo) {
            return two;
        } else {
            if (one.parentId < two.parentId) {
                return one;
            } else {
                return two;
            }
        }
    } else if (itemsParentId.length > 0) {
        return { parentId, side_matrix: 1 };
    } else {
        return { parentId, side_matrix: 0 };
    }
};

module.exports = {checkCountParentIdSweeps}