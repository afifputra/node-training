import path from "path";
import express from "express";
import bodyParser from "body-parser";

import sequelize from "./utils/database";
import Product from "./models/product";
import User from "./models/user";
import Cart from "./models/cart";
import CartItem from "./models/cart-item";

import errorController from "./controllers/error";

import rootDir from "./utils/path";
import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "../", "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((result: unknown) => {
      const user = result as { id: string; name: string; email: string };
      Object.assign(req, { user: user });
      next();
    })
    .catch((error: Error) => console.log(error));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  //   .sync({ force: true })
  .sync()
  .then(() => {
    User.findByPk(1)
      .then((user: unknown) => {
        if (!user) {
          return User.create({ name: "Afif", email: "afif@mailinator.com" });
        }
        return user;
      })
      .then((user: any) => {
        return user.createCart();
      })
      .then((cart: any) => {
        app.listen(3001);
      })
      .catch((error: Error) => console.log(error));
  })
  .catch((error: Error) => console.log(error));
