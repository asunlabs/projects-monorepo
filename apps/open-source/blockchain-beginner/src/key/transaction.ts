import { v4 } from "uuid";
import { privateKeys, users } from "./privateKey";
import { createRequire } from "module";
import chalk from "chalk";
import CryptoJS from "crypto-js";

// execute this command at src directory
const PATH = "../../node_modules/.bin/ts-node transaction";

// compare with defi amm
const orderBook = {
  sender: "Jake",
  recipient: "Sally",
};

const txObject = {
  id: v4(),
  price: 100,
  from: orderBook.sender,
  to: orderBook.recipient,
  signature: privateKeys.get(orderBook.sender),
};

type transactionType = typeof txObject;

function createTransation(txObject: transactionType) {
  const { price, from, to, signature } = txObject;
  return {
    id: v4(),
    price,
    from,
    to,
    signature,
  };
}

function sendTransation(txObject: transactionType) {
  const { from, signature } = createTransation(txObject);
  const gasFee = 10;

  if (signature === privateKeys.get(from)) {
    users.get(from).balance -= gasFee;
    console.log(
      chalk.green.bold("CONFIRMED"),
      chalk.yellow("TX hash: "),
      CryptoJS.SHA256(from, signature).toString()
    );
    console.log(chalk.red("Balance: "), users.get(from).balance);
  } else {
    throw new Error("Invalid private key");
  }
}

sendTransation(txObject);

// console.log(chalk.green.bold("PK"), privateKeys.get("Jake"));
