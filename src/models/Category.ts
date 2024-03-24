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
  userId: string; // Alterado para string para corresponder ao tipo UUID
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
  },
  {
    tableName: "categories",
  }
);

User.hasMany(Category, { foreignKey: "userId" });
Category.belongsTo(User, { foreignKey: "userId" });
