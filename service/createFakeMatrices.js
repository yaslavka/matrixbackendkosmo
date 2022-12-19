const {
    Matrix,
    Matrix_Table,
} = require("../models/models");
const { checkForLevel } = require("./checkForLevel");

module.exports = async ()=>{
    const level = await Matrix_Table.min('typeMatrixId')
    const matrixTemp = await Matrix.findAll({ include: { model: Matrix_Table, as: "matrix_table" } })
    const matrix = matrixTemp.filter((i, index) => {
        return ((i.matrix_table[0]?.typeMatrixId === level) && (i.matrix_table[0]?.count > 6))

    })
    const parentId = matrix[0]?.id
    const matrixItem = await Matrix.create({
        date: new Date,
        parent_id: parentId,
        userId: 1,
        matrix_essence: 11
    })

    await checkForLevel(parentId, level)
}        
 