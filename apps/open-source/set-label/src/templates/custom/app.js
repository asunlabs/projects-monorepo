import * as myLabelSetter from "./config/setup.js";
import metadata from "./metadata.js";

myLabelSetter.ShowInstruction();

// FIX: userMetadta value undefined
// THINK: how to deliver values between files
myLabelSetter.UpdateSetup(
  metadata[0], // repo
  metadata[1], // token
  metadata[2] // username
);

myLabelSetter.LogCommand();
