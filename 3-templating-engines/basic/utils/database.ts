import { Sequelize } from "sequelize";

const sequelize = new Sequelize("node", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

export default sequelize;
