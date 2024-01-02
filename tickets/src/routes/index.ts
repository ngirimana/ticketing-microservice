import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => { 
    const ticket = await Ticket.find();
    
    res.send(ticket);

});

export { router as indexTicketRouter };