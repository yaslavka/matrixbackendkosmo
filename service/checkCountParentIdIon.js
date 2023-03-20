const {MatrixIon} = require("../models/ModelsIon/ModulesIon");

const checkCountParentIdIon = async (parentId, userId, level) => {
    if (level > 1){
        const itemsParentId = await MatrixIon.findAll({
            where: { parent_id: parentId },
        });
        if (itemsParentId.length > 1) {
            let one = await checkCountParentIdIon(itemsParentId[0].id, userId, level);
            let two = await checkCountParentIdIon(itemsParentId[1].id, userId, level);
            let countOne = await MatrixIon.count({
                where: { parent_id: one.parentId },
            });
            let countTwo = await MatrixIon.count({
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
    } else {
        const itemsParentId = await MatrixIon.findAll({
            where: { parent_id: parentId },
        });
        if (itemsParentId.length === 2) {
            return { parentId, side_matrix: 2 };
        } else if (itemsParentId.length === 1) {
            return { parentId, side_matrix: 1 };
        } else if (itemsParentId.length === 3){
            let one = await checkCountParentIdIon(itemsParentId[0].id, userId, level);
            let two = await checkCountParentIdIon(itemsParentId[1].id, userId, level);
            let three = await checkCountParentIdIon(itemsParentId[2].id, userId, level);
            let countOne = await MatrixIon.count({
                where: { parent_id: one.parentId },
            });
            let countTwo = await MatrixIon.count({
                where: { parent_id: two.parentId },
            });
            let countThree = await MatrixIon.count({
                where: { parent_id: three.parentId },
            });
            if ((countOne > countTwo) && (countOne > countThree)){
                return one
            } else if ((countTwo > countOne) && (countTwo > countThree)){
                return two
            } else if ((countThree > countOne) && (countThree > countTwo)){
                return three
            } else {
                if ((one.parentId < two.parentId) && (one.parentId < three.parentId)){
                    return one
                } else if ((two.parentId < one.parentId) && (two.parentId < three.parentId)){
                    return two
                } else {
                    return three
                }
            }
        } else {
            return { parentId, side_matrix: 0 };
        }
    }
};

module.exports = {checkCountParentIdIon}
