import deploy from "../../hooks/useDeployer";

deploy("Dex")
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
