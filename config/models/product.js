"use strict";
const { Model } = require("sequelize");
const formatRupiah = require("../helpers/formatRupiah");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get formatPrice(){
      return formatRupiah.formatCurrency(this.price)
    }
    
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category);
      Product.belongsToMany(models.Profile, {
        through: "Transactions",
        foreignKey: "ProductId",
      });
    }

    static async sortCategoryProduct(sortCategory, Product) {
      try {
        let sortProduct = {
          include: { model: Model.Category },
          order: [["name", "ASC"]],
        };

        if (sortCategory) {
          if (sortCategory !== "All") {
            sortProduct.where = {
              category: sortProduct,
            };
          }
        }

        return await Product.findAll(sortProduct);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `name cannot be empty`,
          },
          notNull: {
            msg: `name cannot be empty`,
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `description cannot be empty`,
          },
          notNull: {
            msg: `description cannot be empty`,
          },
        },
      },

      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `price cannot be empty`,
          },
          notNull: {
            msg: `price cannot be empty`,
          },
        },
      },
      CategoryId: DataTypes.INTEGER,
      
      stock: {
        allowNull : false,
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: `stock cannot be empty`,
          },
          notNull: {
            msg: `stock cannot be empty`,
          },
          isPositive(value) {
            if (value <= 0) {
              throw new Error('Stock cannot be less than 0');
            }
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `image cannot be empty`,
          },
          notNull: {
            msg: `image cannot be empty`,
          },
        },
      },
    },
    { 
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};