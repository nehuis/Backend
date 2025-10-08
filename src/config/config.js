import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program
  .option("-m, --Mode <mode>", "Mode to run the application", "dev")
  .option("-p, --PORT <port>", "Port to run the application", 8080)
  .option("-d, --DEBUG <debug>", "Debug mode", false)
  .option("-P, --persist <persist>", "Persistence method", "mongodb");
program.parse();

console.log("program.opts(): ", program.opts());

const enviroment = program.opts().Mode;
console.log("enviroment: ", enviroment);

dotenv.config({ quiet: true });

export default {
  persistence: program.opts().persist,
};
