// category.model.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../instances/pg";
import { User } from "./User";

export interface CategoryInstance extends Model {
  id: string;
  title: string;
  color: string;
  expense: boolean;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Category = sequelize.define<CategoryInstance>(
  "Category",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      field: "user_id",
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
  },
  {
    tableName: "categories",
  }
);

export default Category;
