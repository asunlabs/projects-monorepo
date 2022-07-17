import path from "path";
import fs from "fs";
import chalk from "chalk";
import { promisify } from "util"; // callback to promise
import Listr from "listr";
import ncp from "ncp"; // Asynchronous recursive file & directory copying

/*

1. check files permission with error handling
2. set tasks and run
3. copy template files
4. finish program

*/

// __dirname, __filename is not defined in ES module scope
const filename = import.meta.url.split("/").pop();
const dirname = import.meta.url.split("/").slice(3, -1).join("/");

const access = promisify(fs.access); // Tests a user's permissions for the file or directory specified by path
const copy = promisify(ncp); // (source, destination)

async function copyTemplate(options) {
  return copy(options.sourceDir, options.targetDir, {
    clobber: false, // do not override if already exists
  });
}

export async function setLabel(fromCli) {
  // update source/destination directories for copying
  fromCli = {
    ...fromCli,
    targetDir: fromCli.targetDir || process.cwd(),
  };

  // get template path
  const sourceDir = path.join(
    dirname,
    "/templates",
    `/${fromCli.labelType.toLowerCase()}`
  );

  fromCli.sourceDir = sourceDir;

  // file permission error handling
  try {
    access(sourceDir, fs.constants.R_OK); // Constant for fs.access(). File can be read by the calling process.
    console.log("OK");
  } catch (err) {
    console.error("%s Invalide template name", chalk.red.bold("ERROR"));
    process.exitCode = 1; // safer than process.exit(1
  }

  const tasks = new Listr([
    {
      title: "Copy template labels",
      task: () => copyTemplate(fromCli),
    },
  ]);

  await tasks.run();
  console.log("Copy project files");
  await copyTemplate(fromCli);
  console.log("%s YOUR LABEL is ready!", chalk.green.bold("DONE"));
  console.log("%s node app in terminal!", chalk.green.bold("RUN"));
}
