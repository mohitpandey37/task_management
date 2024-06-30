import { Server, Socket } from "socket.io";
import * as Jwt from "jsonwebtoken";
import User from "../models/User";

export class SocketService {
  io: any;
  public sockets: any;

  constructor() {
    this.io;
    this.sockets;
  }

  init(server) {
    this.io = new Server(server, {
      maxHttpBufferSize: 100000000,
      connectTimeout: 5000,
      transports: ["websocket", "polling"],
      pingInterval: 25 * 1000,
      pingTimeout: 5000,
    });

    // console.log('io', this.io);
  }
  async provideSocket(id) {
    console.log("provide socket for id", id);
    let userSocket = this.sockets[id];
    return userSocket;
  }
  globalSocket() {
    return this.io;
  }
  async connect() {

    this.io.on("connection", async (socket: Socket) => {
      this.sockets = socket;
      socket.on("eventList", (data, callback) => {});

      socket.on("disconnect", async (data) => {
        let socket_key = this.getKeyByValue(this.sockets, socket);
        delete this.sockets[socket_key];
      });
    });
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
}
let socketObj = new SocketService();
export default socketObj;
