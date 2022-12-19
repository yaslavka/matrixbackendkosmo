const { Op } = require("sequelize")
const { Matrix, Matrix_Table } = require("../models/models")


const findParentIdForMilkyWay = async (level, userId) => {
    if (level <= 15) {
        const matrixTemp = await Matrix.findAll({ include: { model: Matrix_Table, as: "matrix_table" } })
        const matrix = matrixTemp.filter((i, index) => {
            return ((i.matrix_table[0]?.typeMatrixId === level) && (i.matrix_table[0]?.count > 6))
        })
        const parentId = matrix[0]?.id
        if (parentId) {
            return { parentId, typeMatrixId: level }
        } else {
            const checkMatrixTable = await Matrix_Table.findAll({ where: { typeMatrixId: { [Op.gt]: level } } })
            if (checkMatrixTable.length > 0) {
                return (await findParentIdForMilkyWay(level + 1, userId))
            } else {
                return { parentId: null, typeMatrixId: level }
            }

        }
    }
    // else if (level > 15) {
    //     return {parentId: null, typeMatrixId: 1}
    // } else {
    //     return {parentId: null, typeMatrixId: level}
    // }

}

module.exports = {
    findParentIdForMilkyWay
}