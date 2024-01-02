import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, UnauthorizedError } from '@ngirimanasc/common';
import { Ticket } from '../models/ticket';


const router = express.Router();

router.put("/api/tickets/:id",
    
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    
    requireAuth, validateRequest, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        throw new NotFoundError();
    }
    if(ticket.userId !== req.currentUser!.id){
        throw new UnauthorizedError();
    }
        
    ticket.set({
        title: req.body.title,
        price: req.body.price
    });
    await ticket.save();
    res.send(ticket);

});

export { router as updateTicketRouter };