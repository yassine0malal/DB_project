export interface Visitor {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface EventVisitorAttendance {
    eventId: string;
    visitorId: string;
    status: 'confirmed' | 'cancelled' | 'attended';
    joinedAt: string;
    visitor: Visitor;
}
