import ticketModel from "../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

export default class TicketService {
  async createTicket(userEmail, amount, products = []) {
    const ticket = await ticketModel.create({
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount,
      purchaser: userEmail,
      products,
    });

    return ticket;
  }
}
