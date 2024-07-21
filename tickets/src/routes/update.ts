import express, { Request, Response } from 'express';
import { updateTicketValidation } from '../validations/update.validation';
import { validateRequest, NotFoundError, requireAuth, NotAuthorizedError } from '@ticketsyt/common/build';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id',
    requireAuth,
    updateTicketValidation,
    validateRequest,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { title, price } = req.body;

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError
        }

        ticket.set({
            title,
            price
        })
        await ticket.save();

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });
        
        res.send(ticket);
    })

export { router as updateTicketRouter }