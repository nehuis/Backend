import { Command } from "commander";

const program = new Command();

program
  .option("-d", "Variable para debug", false)
  .option("-p <port>", "Puerto del servidor", 9090)
  .option("-m <mode>", "Modo de trabajo", "dev")
  .requiredOption(
    "-u user",
    "Usuario que va a usar la aplicación",
    "No se declaró un usuario"
  );

program.parse();

console.log("Options: ", program.opts());
console.log("Puerto: ", program.opts().p);
console.log("Mode: ", program.opts().m);

process.on("exit", (code) => {
  console.log("El codigo se ejecuta antes de finalizar el proceso", code);
});

process.on("uncaughtException", (exception) => {
  console.log("Excepción no capturada", exception);
});

process.on("message", (message) => {
  console.log("El codigo se ejecuta cuando recibe un mensaje", message);
});

export default program;
