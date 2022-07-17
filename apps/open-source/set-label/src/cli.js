import arg from "arg";
import inquirer from "inquirer";
import { setLabel } from "./main.js";
import fs from "fs";

// 1. User enters commands with flag
// 2. Get the commands with arg and deliver to inquirer
// 3. inquirer invokes choices to user in terminal

/**
 *
 * @param {*} fromCli: user terminal input
 * @returns: terminal option object
 */
function convertArgvIntoOptions(fromCli) {
  // variable name should be args to invoke autocomplete
  // set custom cli options in arg module
  const args = arg(
    {
      "--custom-label": Boolean,
      "--yes": Boolean,
      "--repo": String,
      "--token": String,
      "--username": String,
      "-c": "--custom-label",
      "-y": "--yes",
    },
    {
      argv: fromCli.slice(2), // get command from cli and deliver to arg module
    }
  );

  return {
    skipPrompts: args["--yes"] || false,
    template: args._[0], // first args in terminal, excluding node.exe and directory path
    labelType: args["--custom-label"] || false,
    repo: args["--repo"] || false,
    token: args["--token"] || false,
    username: args["--username"] || false,
  };
}

/**
 *
 * @param {*} fromCli: user terminal input
 * @returns: terminal option object
 */
async function requireMissingOptions(fromCli) {
  const defaultTemplate = "standard";

  if (fromCli.skipPrompts) {
    return {
      ...fromCli,
      template: fromCli.template || defaultTemplate,
    };
  }

  const questions = [];

  if (!fromCli.labelType) {
    questions.push({
      type: "list", // pre-defined by inquirer
      name: "labelType",
      message: "Please choose labels types",
      choices: ["standard", "custom"],
      default: defaultTemplate,
    });
  }

  if (!fromCli.repo) {
    questions.push({
      type: "input",
      name: "repo",
      message: "Please enter a git repository name.",
    });
  }

  if (!fromCli.token) {
    questions.push({
      type: "input",
      name: "token",
      message: "Please enter a github secret token.",
    });
  }

  if (!fromCli.username) {
    questions.push({
      type: "input",
      name: "username",
      message: "Please enter a github username.",
    });
  }

  const answer = await inquirer.prompt(questions);

  return {
    ...fromCli,
    template: fromCli.template || answer.template,
    labelType: fromCli.labelType || answer.labelType,
    repo: fromCli.repo || answer.repo,
    token: fromCli.token || answer.token,
    username: fromCli.username || answer.username,
  };
}

// SOLUTION: create a file that accepts process.argv during runtime
// and use it as a source for terminal arguments
// TO DO: find a way to create a .json file
export function getUserMetaData({ repo, token, username }) {
  try {
    fs.writeFileSync(
      "./metadata.js",
      "const metadata = "
        .concat(JSON.stringify([repo, token, username]))
        .concat("\n export default metadata")
    );
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function cli(...args) {
  // set option object
  let options = convertArgvIntoOptions(...args);
  options = await requireMissingOptions(options);

  // deliver the option object
  getUserMetaData(options);
  await setLabel(options);
}
