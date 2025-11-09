const log = console.log;
import dotenv from "dotenv";
dotenv.config();
import chalk from "chalk";
import inquirer from "inquirer";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

const promptOption = [
  {
    type: "list",
    name: "role",
    message: "Press arrow up and down key to choose role",
    choices: [chalk.green("User"), chalk.blue("Admin"), chalk.red("Exit")],
  },
];

const inputOptions = [
  {
    type: "input",
    name: "fullname",
    message: "Enter your fullname ?",
    validate: (input) => {
      return input.length > 0 ? true : log(chalk.red("Fullname is required"));
    },
  },
  {
    type: "input",
    name: "email",
    message: "Enter your email ?",
    validate: (input) => {
      return input.length > 0 ? true : log(chalk.red("Email is required"));
    },
  },
  {
    type: "input",
    name: "password",
    mask: "*",
    message: "Enter your password ?",
    validate: (input) => {
      return input.length > 0 ? true : log(chalk.red("Password is required"));
    },
  },
];

const welcome = async (db) => {
  log(chalk.bgRed.white.bold(" ⭐ Admin signup console ⭐ "));
  const { role } = await inquirer.prompt(promptOption);
  if (role.includes("User")) {
    return createRole("user", db);
  }

  if (role.includes("Admin")) {
    return createRole("admin", db);
  }

  if (role.includes("Exit")) {
    return exitApp();
  }
};

const createRole = async (role, db) => {
  try {
    const input = await inquirer.prompt(inputOptions);
    input.password = await bcrypt.hash(input.password, 12);
    input.role = role;
    input.createdAt = new Date();
    input.updatedAt = new Date();
    input.__v = 0;
    const User = db.collection("users");
    await User.insertOne(input);
    log(chalk.green(`${role} has been created!`));
    process.exit();
  } catch (error) {
    log(chalk.red(`Signup failed - ${error.message}`));
    process.exit();
  }
};

const exitApp = () => {
  log(chalk.blue("Goodbye! Exiting the app"));
  process.exit();
};

const main = async () => {
  let db = null;

  MongoClient.connect(process.env.DB)
    .then((conn) => {
      db = conn.db(process.env.DB_NAME);
      welcome(db);
    })
    .catch(() => {
      log(chalk.redBright(`Failed to connect with database`));
      process.exit();
    });
};
main();
