import { Publisher, Subjects, TicketCreatedEvent } from "@ticketsyt/common/build";

export class TicketCreatedPubliser extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

}

