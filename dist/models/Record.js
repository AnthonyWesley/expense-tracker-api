"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Record = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = require("../instances/pg");
const User_1 = require("./User");
exports.Record = pg_1.sequelize.define("Record", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.UUIDV4,
        primaryKey: true,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "created_at",
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "updated_at",
    },
}, {
    tableName: "records",
});
User_1.User.hasMany(exports.Record, { foreignKey: "userId" });
exports.Record.belongsTo(User_1.User, { foreignKey: "userId" });
//# sourceMappingURL=Record.js.map