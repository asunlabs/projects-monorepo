import { createRequire } from "module";
const require = createRequire(import.meta.url); // use node.js require in moudle system

const customLabel = require("../custom.json"); // import .json with require

const Setup = new Map();

const ShowInstruction = () => {
  // change this to terminal interaction
  console.log(`
    1. Add your labels in labels.json
    2. Enter your repository, secret token, username in order.
    3. Execute program with command: node app
    `);
};

// arguments should be string
const isValidTypes = (...args) => {
  const isConformed = [...args].every((val) => {
    return typeof val === "string";
  });

  if (!isConformed) throw new Error("Inputs should be string");
  else return true;
};

const UpdateSetup = (repoName, token, username) => {
  if (isValidTypes(repoName, token, username)) {
    [repoName, token, username].forEach((val) => {
      Setup.set(`${val}`, val);
    });
    Setup.set("labels", "custom.json" || "standard.json"); // fixed value
  }
};

const LogCommand = () => {
  // destructuring map values in array
  let [repoName, token, userName, labels] = [...Setup.values()];

  const labelCommand = `copy and paste this to terminal: npx github-label-sync --access-token ${token} --labels ${labels} ${userName}/${repoName}`;
  console.log(`${labelCommand}\n`);
};

export { UpdateSetup, LogCommand, ShowInstruction };
