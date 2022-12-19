const {
    Matrix,
    Matrix_Table,
} = require("../models/models");
const giftMarketingMilkyway = require("./giftMarketingMilkyway");

const checkForLevel = async (parentId, level) => {

    if (!parentId) {
        return false
    }
    let countRows = await Matrix.count({
        where: { parent_id: parentId }
    })
    const matrixTableEmpty = await Matrix_Table.count({
        matrixId: parentId
    })
    if (matrixTableEmpty < 1) {
        return false
    }
    if (countRows < 3) {
        return false
    } else {
        const matrixTemp = await Matrix.findAll({ include: { model: Matrix_Table, as: "matrix_table" } })
        const matrix = matrixTemp.filter((i, index) => {
            return ((i.matrix_table[0]?.typeMatrixId === level + 1) && (i.matrix_table[0]?.count > 6))
        })
        let parentIdForLevel
        if (matrix.length === 0) {
            parentIdForLevel = null
        } else {
            parentIdForLevel = matrix[0].id
        }

        const user = await Matrix.findOne({ where: { id: parentId } })

        const matrixItem = await Matrix.create({
            date: new Date,
            parent_id: parentIdForLevel,
            userId: user.userId
        })

        const matrixTableCount = await Matrix_Table.findOne({
            where: { typeMatrixId: level, matrixId: parentId }
        })
        if (matrixTableCount) {
            matrixTableCount.matrixId = matrixItem.id;
            matrixTableCount.typeMatrixId = level + 1
            await matrixTableCount.save()

            if (level > 5) {
                const gift = await giftMarketingMilkyway(level, matrixTableCount)
            }
            if (parentIdForLevel && (level < 15)) {
                return checkForLevel(parentIdForLevel, level + 1)
            }
        }

    }

}


module.exports = {
    checkForLevel
}
