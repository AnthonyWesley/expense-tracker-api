import { DataTypes, Model, UUIDV4 } from "sequelize";
import { sequelize } from "../instances/pg";
import { User } from "./User";

export interface CategoryInstance extends Model {
  id?: string;
  title: string;
  color: string;
  expense?: boolean;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export const Category = sequelize.define<CategoryInstance>(
  "Category",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      field: "user_id", // Especifica o nome correto da coluna
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "categories",
  }
);

User.hasMany(Category, { foreignKey: "user_id" });
Category.belongsTo(User, { foreignKey: "user_id" });
