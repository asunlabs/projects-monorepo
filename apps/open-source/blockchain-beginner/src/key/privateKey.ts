import CryptoJS from "crypto-js";
import { v4 } from "uuid";

const privateKeys = new Map(); // key: username, value: private key
const publicKeys = new Map();
const users = new Map(); // key: username, value: user id

// Mimic: Redux action creator => Reducer(switch~case)
function enrollUser(name: string) {
  return {
    username: name,
    userId: v4(),
    balance: 100,
  };
}

const seed = "developerasun";

function generatePrivateKey(seed: string) {
  // dynamic key generation
  return CryptoJS.SHA256(seed.concat(v4())).toString();
}

function generatePublicKey(seed: string) {
  const privateKey = generatePrivateKey(seed);
  // ECDSA: Elliptic Curve Digital Signature Algorithm
  return CryptoJS.SHA256(privateKey.concat(seed)).toString();
}

function initSignUp(data: Map<any, any>, key: string, callback: Function) {
  if (!callback.name.includes("generate")) {
    data.set(key, callback(key));
  } else {
    data.set(key, callback(seed));
  }
}

function initWithoutPattern() {
  initSignUp(users, "Jake", enrollUser);
  initSignUp(users, "Sally", enrollUser);
  initSignUp(privateKeys, "Jake", generatePrivateKey);
  initSignUp(privateKeys, "Sally", generatePrivateKey);
  initSignUp(publicKeys, "Jake", generatePublicKey);
  initSignUp(publicKeys, "Sally", generatePublicKey);
}

class initWithPattern {
  static SEED = "developerasun";
  name;
  constructor(_name: string) {
    this.name = _name;
  }
  enroll() {
    enrollUser(this.name);
    this.initPrivateKey();
    this.initPublicKey();
    return {
      privateKeys,
      publicKeys,
      users,
    };
  }
  private initPrivateKey() {
    generatePrivateKey(initWithPattern.SEED);
  }
  private initPublicKey() {
    generatePublicKey(initWithPattern.SEED);
  }
}

initWithoutPattern();

export { privateKeys, users, publicKeys, initWithPattern };
