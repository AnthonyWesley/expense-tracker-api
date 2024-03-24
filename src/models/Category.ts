import { DataTypes, Model } from "sequelize";
import { sequelize } from "../instances/pg";
import { User } from "./User";

export interface CategoryInstance extends Model {
  id?: string;
  title: string;
  color: string;
  expense?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user_id: string; // Renomeado para corresponder ao nome da coluna no banco de dados
}

export const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expense: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
  },
  {
    tableName: "categories",
  }
);

User.hasMany(Category, { foreignKey: "user_id" });
Category.belongsTo(User, { foreignKey: "user_id" });
