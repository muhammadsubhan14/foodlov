const { User, Profile, Product, Category } = require("../models");
const bcrypt = require("bcryptjs");
class AdminController {
  static async registerUserForm(req, res) {
    try {
      res.render("register");
    } catch (error) {
      res.send(error);
    }
  }
  static async postRegisterUser(req, res) {
    try {
      const { username, email, password, role } = req.body;
      let user = await User.create({ username, email, password, role });

      res.redirect(`/create-profile?id=${user.dataValues.id}`);
    } catch (error) {
      res.send(error.message);
    }
  }
  static async loginUser(req, res) {
    try {
      const { error } = req.query;
      res.render("login", { error });
    } catch (error) {
      res.send(error);
    }
  }
  static async loginUserPost(req, res) {
    try {
      const { username, password } = req.body;
      await User.findOne({ where: { username } }).then((user) => {
        if (user) {
          const isValidPass = bcrypt.compareSync(password, user.password);
          if (isValidPass) {
            req.session.user = {
              id: user.id,
              username: user.username,
              role: user.role,
            };
            // console.log(user.id);
            if (user.role === "admin") {
              res.redirect("/admin");
            } else if (user.role === "customer") {
              res.redirect("/products");
            }
          } else {
            const error = "Invalid Username/Password";
            return res.redirect(`/login?error=${error}`);
          }
        } else {
          const error = "Invalid Username/Password";
          return res.redirect(`/login?error=${error}`);
        }
      });
    } catch (error) {
      res.send(error);
    }
  }
  static async logoutUser(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    } catch (error) {}
  }
  static async createProfile(req, res) {
    try {
      const id = req.query.id;
      res.render("create-profile", { id });
    } catch (error) {
      res.send(error);
    }
  }
  static async createProfilePost(req, res) {
    try {
      const id = req.query.id;
      // console.log(id, "<<<<<<<<<<<");
      const { name, gender, phone, dateOfBirth, address } = req.body;
      await Profile.create({
        name: name,
        gender: gender,
        phone: phone,
        dateOfBirth: dateOfBirth,
        address: address,
        UserId: id,
      });
      res.redirect("/");
    } catch (error) {
      console.log(error);
      // res.send("hhh");
      // res.send(error)
    }
  }
  static async logoutUser(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    } catch (error) {}
  }
  static async createProfile(req, res) {
    try {
      const id = req.query.id;
      res.render("create-profile", { id });
    } catch (error) {
      res.send(error);
    }
  }
  static async createProfilePost(req, res) {
    try {
      const id = req.query.id;
      // console.log(id, "<<<<<<<<<<<");
      const { name, gender, phone, dateOfBirth, address } = req.body;
      await Profile.create({
        name: name,
        gender: gender,
        phone: phone,
        dateOfBirth: dateOfBirth,
        address: address,
        UserId: id,
      });
      res.redirect("/");
    } catch (error) {
      console.log(error.message);
      res.send("hhh");
    }
  }
  static async showListProduct(req, res) {
    try {
      const category = req.query.sortCategory;
      const { nameProduct } = req.query;
      if (category) {
        const product = await Product.findAll({
          include: {
            model: Category,
            where: { name: category },
          },
          order: [["id", "ASC"]],
        });

        res.render("products", { product, nameProduct });
      } else {
        const product = await Product.findAll({
          include: Category,
          order: [["id", "ASC"]],
        });

        res.render("products", { product, nameProduct });
      }
    } catch (error) {
      //   console.log(error);
      res.send(error.message);
    }
  }
  static async getAddProduct(req, res) {
    try {
      let {errors} = req.query
      if (!errors) {
        errors = []
      } else{
        errors = errors.split(",")
      }
      const category = await Category.findAll();
      res.render("addFormProduct", { category , errors});
    } catch (error) {
      //   console.log(error);
      res.send(error);
    }
  }

  static async addPostProduct(req, res) {
    try {
      const { name, description, price, imageUrl, CategoryId, stock } =
        req.body;
      await Product.create({
        name,
        description,
        price,
        imageUrl,
        CategoryId,
        stock,
      });
      res.redirect("/admin");
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
          let errors = error.errors.map((item) => {
              return item.message
          })
          res.redirect(`/admin/add?errors=${errors}`)
        } else {
          res.send(error)
    }
    }
  }

  static async getDecreaseProduct(req, res) {
    try {
      const id = req.params.productid;
      const product = await Product.findOne({where: {id: id}})
      if(product && product.stock > 0){
        let decreaseProduct = await Product.increment(
          { stock: -1 },
          {
            where: {
              id: id,
            },
          }
        );
      }

      res.redirect("/admin");
    } catch (error) {
      //   console.log(error);
      res.send(error);
    }
  }

  static async getIncrementProduct(req, res) {
    try {
      const id = req.params.productid;
      let incrementProduct = await Product.increment(
        { stock: 1 },
        {
          where: {
            id: id,
          },
        }
      );

      res.redirect("/admin");
    } catch (error) {
      //   console.log(error);
      res.send(error);
    }
  }

  static async deleteProduct(req, res) {
    try {
      const id = req.params.productid;

      let infoData = await Product.findOne({
        where: {
          id: id,
        },
      });

      //   console.log(infoData,">>>info");

      let nameProduct = infoData.name;

      await Product.destroy({
        where: { id: id },
      });

      //   res.redirect("/admin");
      res.redirect(`/admin?nameProduct=${nameProduct}`);
    } catch (error) {
      //   console.log(error);
      res.send(error);
    }
  }
}
module.exports = AdminController;
