const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const CloneStatSecond = sequelize.define("clone_stat_second", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    count: {type: DataTypes.INTEGER, allowNull: false},
});

const CloneStatThird = sequelize.define("clone_stat_third", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    count: {type: DataTypes.INTEGER, allowNull: false},
});

const CloneStatFour = sequelize.define("clone_stat_four", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    count: {type: DataTypes.INTEGER, allowNull: false},
});

const CloneStatFive = sequelize.define("clone_stat_five", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    count: {type: DataTypes.INTEGER, allowNull: false},
});

const CloneStatSix = sequelize.define("clone_stat_six", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    count: {type: DataTypes.INTEGER, allowNull: false},
});

const CloneStatSeven = sequelize.define("clone_stat_seven", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    count: {type: DataTypes.INTEGER, allowNull: false},
});

const Matrix = sequelize.define(
    "matrix",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        date: {type: DataTypes.DATE, defaultValue: null},
        matrix_essence: {type: DataTypes.INTEGER, defaultValue: null},
        side_matrix: {type: DataTypes.INTEGER, defaultValue: null},
        // parent_id: { type: DataTypes.BIGINT, primaryKey: true, },
    }
);
const MatrixSecond = sequelize.define(
    "matrix_second",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        date: {type: DataTypes.DATE, defaultValue: null},
        matrix_essence: {type: DataTypes.INTEGER, defaultValue: null},
        side_matrix: {type: DataTypes.INTEGER, defaultValue: null},
        // parent_id: { type: DataTypes.BIGINT, defaultValue: null },
    }
);
const MatrixThird = sequelize.define(
    "matrix_third",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        date: {type: DataTypes.DATE, defaultValue: null},
        matrix_essence: {type: DataTypes.INTEGER, defaultValue: null},
        side_matrix: {type: DataTypes.INTEGER, defaultValue: null},
        // parent_id: { type: DataTypes.BIGINT, defaultValue: null },
    }
);
const MatrixFour = sequelize.define(
    "matrix_four",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        date: {type: DataTypes.DATE, defaultValue: null},
        matrix_essence: {type: DataTypes.INTEGER, defaultValue: null},
        side_matrix: {type: DataTypes.INTEGER, defaultValue: null},
        // parent_id: { type: DataTypes.BIGINT, defaultValue: null },
    }
);
const MatrixFive = sequelize.define(
    "matrix_five",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        date: {type: DataTypes.DATE, defaultValue: null},
        matrix_essence: {type: DataTypes.INTEGER, defaultValue: null},
        side_matrix: {type: DataTypes.INTEGER, defaultValue: null},
        // parent_id: { type: DataTypes.BIGINT, defaultValue: null },
    }
);
const MatrixSix = sequelize.define(
    "matrix_six",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        date: {type: DataTypes.DATE, defaultValue: null},
        matrix_essence: {type: DataTypes.INTEGER, defaultValue: null},
        side_matrix: {type: DataTypes.INTEGER, defaultValue: null},
        // parent_id: { type: DataTypes.BIGINT, defaultValue: null },
    }
);
const MatrixSeven = sequelize.define(
    "matrix_seven",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        date: {type: DataTypes.DATE, defaultValue: null},
        matrix_essence: {type: DataTypes.INTEGER, defaultValue: null},
        side_matrix: {type: DataTypes.INTEGER, defaultValue: null},
        // parent_id: { type: DataTypes.BIGINT, defaultValue: null },
    }
);
const Matrix_TableSecond = sequelize.define(
    "matrix_table_second",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: null},
        can_buy: {type: DataTypes.BOOLEAN, defaultValue: null},
        count: {type: DataTypes.INTEGER, defaultValue: null},
    }
);
const Matrix_TableThird = sequelize.define(
    "matrix_table_third",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: null},
        can_buy: {type: DataTypes.BOOLEAN, defaultValue: null},
        count: {type: DataTypes.INTEGER, defaultValue: null},
    }
);
const Matrix_TableFour = sequelize.define(
    "matrix_table_four",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: null},
        can_buy: {type: DataTypes.BOOLEAN, defaultValue: null},
        count: {type: DataTypes.INTEGER, defaultValue: null},
    }
);
const Matrix_TableFive = sequelize.define(
    "matrix_table_five",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: null},
        can_buy: {type: DataTypes.BOOLEAN, defaultValue: null},
        count: {type: DataTypes.INTEGER, defaultValue: null},
    }
);
const Matrix_TableSix = sequelize.define(
    "matrix_table_six",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: null},
        can_buy: {type: DataTypes.BOOLEAN, defaultValue: null},
        count: {type: DataTypes.INTEGER, defaultValue: null},
    }
);
const Matrix_TableSeven = sequelize.define(
    "matrix_table_seven",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: null},
        can_buy: {type: DataTypes.BOOLEAN, defaultValue: null},
        count: {type: DataTypes.INTEGER, defaultValue: null},
    }
);
const Matrix_Table = sequelize.define(
    "matrix_table",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        is_active: {type: DataTypes.BOOLEAN, defaultValue: null},
        can_buy: {type: DataTypes.BOOLEAN, defaultValue: null},
        count: {type: DataTypes.INTEGER, defaultValue: null},
    }
);

const Statistics = sequelize.define(
    "statiistic",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        all_comet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        all_planet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        first_planet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        my_comet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        myInviterIncome: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        my_planet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        structure_planet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    }
);
const Statistic = sequelize.define(
    "statistic",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
        all_comet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        all_planet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        first_planet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        my_comet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        myInviterIncome: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        my_planet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        structure_planet: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    }
);

const Role = sequelize.define("role", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null},
});

const InvestBox = sequelize.define("invest-box", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    summ: {type: DataTypes.DECIMAL(61, 8), defaultValue: null},
    status: {type: DataTypes.STRING, defaultValue: null}
});


const Transaction = sequelize.define("transaction", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, allowNull: false},
    position: {type: DataTypes.INTEGER, allowNull: false},
    transaction_type: {type: DataTypes.INTEGER, defaultValue: null},
    value: {type: DataTypes.DECIMAL(61, 8), allowNull: false},
    comment: {type: DataTypes.STRING, defaultValue: null},
    date_of_transaction: {type: DataTypes.DATE, defaultValue: null},
    parent_matrix_id: {type: DataTypes.BIGINT, defaultValue: null},
});
const Winthdraw = sequelize.define("winthdraw", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    amount: {type: DataTypes.DECIMAL(61, 8), defaultValue: null},
    system: {type: DataTypes.STRING, defaultValue: null},
    wallet: {type: DataTypes.STRING, defaultValue: null},
});

const TypeMatrix = sequelize.define("type_matrix", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null},
    summ: {type: DataTypes.INTEGER, allowNull: false},
    matrixTableRepository: {type: DataTypes.STRING, defaultValue: null},
    canBuy: {type: DataTypes.BOOLEAN, defaultValue: true},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
});

const TypeMatrixSecond = sequelize.define("type_matrix_second", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null},
    summ: {type: DataTypes.INTEGER, allowNull: false},
    matrixTableRepository: {type: DataTypes.STRING, defaultValue: null},
    canBuy: {type: DataTypes.BOOLEAN, defaultValue: true},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
});

const TypeMatrixThird = sequelize.define("type_matrix_third", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null},
    summ: {type: DataTypes.INTEGER, allowNull: false},
    matrixTableRepository: {type: DataTypes.STRING, defaultValue: null},
    canBuy: {type: DataTypes.BOOLEAN, defaultValue: true},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
});

const TypeMatrixFour = sequelize.define("type_matrix_four", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null},
    summ: {type: DataTypes.INTEGER, allowNull: false},
    matrixTableRepository: {type: DataTypes.STRING, defaultValue: null},
    canBuy: {type: DataTypes.BOOLEAN, defaultValue: true},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
});

const TypeMatrixFive = sequelize.define("type_matrix_five", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null},
    summ: {type: DataTypes.INTEGER, allowNull: false},
    matrixTableRepository: {type: DataTypes.STRING, defaultValue: null},
    canBuy: {type: DataTypes.BOOLEAN, defaultValue: true},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
});

const TypeMatrixSix = sequelize.define("type_matrix_six", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null},
    summ: {type: DataTypes.INTEGER, allowNull: false},
    matrixTableRepository: {type: DataTypes.STRING, defaultValue: null},
    canBuy: {type: DataTypes.BOOLEAN, defaultValue: true},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
});

const TypeMatrixSeven = sequelize.define("type_matrix_seven", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null},
    summ: {type: DataTypes.INTEGER, allowNull: false},
    matrixTableRepository: {type: DataTypes.STRING, defaultValue: null},
    canBuy: {type: DataTypes.BOOLEAN, defaultValue: true},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
});

// const Key = sequelize.define("key", {
//   id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
//   username: { type: DataTypes.STRING, defaultValue: null },
//   level: { type: DataTypes.INTEGER, allowNull: false },
//   password: { type: DataTypes.STRING, allowNull: false },
//   phone: { type: DataTypes.STRING, defaultValue: true },
// });

const News = sequelize.define("news", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    ruTitle: {type: DataTypes.TEXT, defaultValue: null},
    ruText: {type: DataTypes.TEXT, defaultValue: null},
    ruText1: {type: DataTypes.TEXT, defaultValue: null},
    ruText2: {type: DataTypes.TEXT, defaultValue: null},
    ruText5: {type: DataTypes.TEXT, defaultValue: null},
    ruText6: {type: DataTypes.TEXT, defaultValue: null},
    ruDescription: {type: DataTypes.TEXT, defaultValue: null},
    image: {type: DataTypes.STRING, defaultValue: null},
    ruHeadline: {type: DataTypes.TEXT, defaultValue: null},
    enHeadline: {type: DataTypes.TEXT, defaultValue: null},
    enDescription: {type: DataTypes.TEXT, defaultValue: null},
    date: {type: DataTypes.DATE, allowNull: false},
});


const User = sequelize.define(
    "user",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11,},
        referal_id: {type: DataTypes.BIGINT, defaultValue: null},
        statistic_id: {type: DataTypes.BIGINT, defaultValue: null},
        activation_date: {type: DataTypes.DATE, defaultValue: null},
        active_partners: {type: DataTypes.INTEGER, defaultValue: 0},
        avatar: {type: DataTypes.STRING, defaultValue: null},
        balance: {type: DataTypes.DECIMAL(61, 8), defaultValue: 0.00000000, allowNull: false},
        can_create_comment: {type: DataTypes.BOOLEAN, defaultValue: false},
        email: {type: DataTypes.STRING, allowNull: false},
        finance_password: {type: DataTypes.STRING, defaultValue: null},
        first_enter: {type: DataTypes.BOOLEAN, defaultValue: false},
        first_lines: {type: DataTypes.INTEGER, defaultValue: 0},
        first_name: {type: DataTypes.STRING, defaultValue: null},
        has_fin_password: {type: DataTypes.BOOLEAN, defaultValue: false},
        income: {type: DataTypes.INTEGER, defaultValue: 0},
        instagram: {type: DataTypes.STRING, defaultValue: null},
        is_verified: {type: DataTypes.INTEGER, defaultValue: 0},
        last_name: {type: DataTypes.STRING, defaultValue: null},
        locale: {type: DataTypes.DECIMAL(61, 8), defaultValue: 0.00000000, allowNull: false},
        password: {type: DataTypes.STRING, allowNull: false},
        phone: {type: DataTypes.STRING, allowNull: false},
        ref_link: {type: DataTypes.STRING, defaultValue: null},
        registration_date: {type: DataTypes.DATE, defaultValue: null},
        show_inviter: {type: DataTypes.BOOLEAN, defaultValue: null},
        telegram: {type: DataTypes.STRING, defaultValue: null},
        tg_key: {type: DataTypes.STRING, defaultValue: null},
        user_on_links: {type: DataTypes.INTEGER, defaultValue: 0},
        username: {type: DataTypes.STRING, allowNull: false},
        vkontakte: {type: DataTypes.STRING, defaultValue: null},
        description: {type: DataTypes.STRING, defaultValue: null},
    },
    {
        // initialAutoIncrement: 11,
    }
);

const UserRole = sequelize.define("user_role", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
});

Matrix.hasOne(Matrix, {
    foreignKey: 'parent_id'
});

MatrixSecond.hasOne(MatrixSecond, {
    foreignKey: 'parent_id'
});

MatrixThird.hasOne(MatrixThird, {
    foreignKey: 'parent_id'
});

MatrixFour.hasOne(MatrixFour, {
    foreignKey: 'parent_id'
});

MatrixFive.hasOne(MatrixFive, {
    foreignKey: 'parent_id'
});

MatrixSix.hasOne(MatrixSix, {
    foreignKey: 'parent_id'
});

MatrixSeven.hasOne(MatrixSeven, {
    foreignKey: 'parent_id'
});


// User.hasOne(Favourite);
// Favourite.belongsTo(User);

User.hasMany(Matrix, {as: "matrix"});
Matrix.belongsTo(User, {as: 'user'});

User.hasMany(MatrixSecond, {as: "matrix_second"});
MatrixSecond.belongsTo(User, {as: 'user'});

User.hasMany(MatrixThird, {as: "matrix_third"});
MatrixThird.belongsTo(User, {as: 'user'});

User.hasMany(MatrixFour, {as: "matrix_four"});
MatrixFour.belongsTo(User, {as: 'user'});

User.hasMany(MatrixFive, {as: "matrix_five"});
MatrixFive.belongsTo(User, {as: 'user'});

User.hasMany(MatrixSix, {as: "matrix_six"});
MatrixSix.belongsTo(User, {as: 'user'});

User.hasMany(MatrixSeven, {as: "matrix_seven"});
MatrixSeven.belongsTo(User, {as: 'user'});


User.hasMany(Transaction);
Transaction.belongsTo(User);
User.hasMany(Winthdraw);
Winthdraw.belongsTo(User);
User.hasMany(Statistic);
Statistic.belongsTo(User);
User.hasMany(Statistics);
Statistics.belongsTo(User);

User.hasMany(Matrix_Table, {as: 'matrix_table'});
Matrix_Table.belongsTo(User, {as: "user"});

User.hasMany(Matrix_TableSecond, {as: 'matrix_table_two'});
Matrix_TableSecond.belongsTo(User, {as: "user"});

User.hasMany(Matrix_TableThird, {as: 'matrix_table_third'});
Matrix_TableThird.belongsTo(User, {as: "user"});

User.hasMany(Matrix_TableFour, {as: 'matrix_table_four'});
Matrix_TableFour.belongsTo(User, {as: "user"});

User.hasMany(Matrix_TableFive, {as: 'matrix_table_five'});
Matrix_TableFive.belongsTo(User, {as: "user"});

User.hasMany(Matrix_TableSix, {as: 'matrix_table_six'});
Matrix_TableSix.belongsTo(User, {as: "user"});

User.hasMany(Matrix_TableSeven, {as: 'matrix_table_seven'});
Matrix_TableSeven.belongsTo(User, {as: "user"});


User.hasMany(InvestBox, {as: "invest"});
InvestBox.belongsTo(User, {as: "user"});


User.belongsToMany(Role, {through: UserRole});
Role.belongsToMany(User, {through: UserRole});

Matrix.hasMany(Matrix_Table, {as: 'matrix_table'}, {
    foreignKey: {name: 'matrix_parent_id',}
});
// Matrix_Table.belongsTo(Matrix, {as: 'matrix'});

MatrixSecond.hasMany(Matrix_TableSecond, {as: 'matrix_table'}, {
    foreignKey: {name: 'matrix_parent_id'}
});
// Matrix_TableSecond.belongsTo(MatrixSecond, {as: 'matrix'});

MatrixThird.hasMany(Matrix_TableThird, {as: 'matrix_table'}, {
    foreignKey: {name: 'matrix_parent_id'}
});
// Matrix_TableThird.belongsTo(MatrixThird, {as: 'matrix'});

MatrixFour.hasMany(Matrix_TableFour, {as: 'matrix_table'}, {
    foreignKey: {name: 'matrix_parent_id'}
});
// Matrix_TableFour.belongsTo(MatrixFour, {as: 'matrix'});

MatrixFive.hasMany(Matrix_TableFive, {as: 'matrix_table'}, {
    foreignKey: {name: 'matrix_parent_id'}
});
// Matrix_TableFive.belongsTo(MatrixFive, {as: 'matrix'});

MatrixSix.hasMany(Matrix_TableSix, {as: 'matrix_table'}, {
    foreignKey: {name: 'matrix_parent_id'}
});
// Matrix_TableSix.belongsTo(MatrixSix, {as: 'matrix'});

MatrixSeven.hasMany(Matrix_TableSeven, {as: 'matrix_table'}, {
    foreignKey: {name: 'matrix_parent_id'}
});

TypeMatrixSecond.hasOne(CloneStatSecond, {
    foreignKey: 'level'
});

TypeMatrixThird.hasOne(CloneStatThird, {
    foreignKey: 'level'
});

TypeMatrixFour.hasOne(CloneStatFour, {
    foreignKey: 'level'
});

TypeMatrixFive.hasOne(CloneStatFive, {
    foreignKey: 'level'
});

TypeMatrixSix.hasOne(CloneStatSix, {
    foreignKey: 'level'
});

TypeMatrixSeven.hasOne(CloneStatSeven, {
    foreignKey: 'level'
});
// CloneStatSecond.belongsTo(TypeMatrixSecond,  {
//   foreignKey: 'level'
// });

TypeMatrix.hasMany(Matrix_Table);
Matrix_Table.belongsTo(TypeMatrix, {as: 'type_matrix'});

TypeMatrixSecond.hasMany(Matrix_TableSecond);
// Matrix_TableSecond.belongsTo(TypeMatrixSecond, {as: 'type_matrix'});

TypeMatrixThird.hasMany(Matrix_TableThird);
// Matrix_TableThird.belongsTo(TypeMatrixThird, {as: 'type_matrix'});

TypeMatrixFour.hasMany(Matrix_TableFour);
// Matrix_TableFour.belongsTo(TypeMatrixFour, {as: 'type_matrix'});

TypeMatrixFive.hasMany(Matrix_TableFive);
// Matrix_TableFive.belongsTo(TypeMatrixFive, {as: 'type_matrix'});

TypeMatrixSix.hasMany(Matrix_TableSix);
// Matrix_TableSix.belongsTo(TypeMatrixSix, {as: 'type_matrix'});

TypeMatrixSeven.hasMany(Matrix_TableSeven);
// Matrix_TableSeven.belongsTo(TypeMatrixSeven, {as: 'type_matrix'});


module.exports = {
    CloneStatSecond,
    CloneStatThird,
    CloneStatFour,
    CloneStatFive,
    CloneStatSix,
    CloneStatSeven,
    Matrix,
    MatrixSecond,
    MatrixThird,
    MatrixFour,
    MatrixFive,
    MatrixSix,
    MatrixSeven,
    Matrix_Table,
    Matrix_TableSecond,
    Matrix_TableThird,
    Matrix_TableFour,
    Matrix_TableFive,
    Matrix_TableSix,
    Matrix_TableSeven,
    Role,
    News,
    InvestBox,
    Statistic,
    Transaction,
    TypeMatrix,
    TypeMatrixSecond,
    TypeMatrixThird,
    TypeMatrixFour,
    TypeMatrixSix,
    TypeMatrixFive,
    TypeMatrixSeven,
    User,
    Statistics,
    Winthdraw
};
