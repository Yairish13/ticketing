import { Publisher, OrderCreatedEvent, Subjects } from "@ticketsyt/common/build";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
