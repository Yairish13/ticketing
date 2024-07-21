import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketsyt/common/build";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

