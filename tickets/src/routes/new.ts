import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@ticketsyt/common/build';
import { newTicketValidation } from '../validations/new.validation';
import { Ticket } from '../models/ticket';
import { TicketCreatedPubliser } from '../events/publishers/ticket-created-published';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.post('/api/tickets',
    requireAuth,
    newTicketValidation,
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id
        })

        await ticket.save();

        await new TicketCreatedPubliser(natsWrapper.client).publish({
            id: ticket.id, 
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });

        res.status(201).send(ticket);
    })

export { router as createTicketRouter }