const socket = io();

socket.emit("mensaje", "Cliente");

socket.on("msj_2", (data) => {
  console.log("Data: ", data);
});
