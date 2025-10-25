import { 
  type Barber, 
  type InsertBarber,
  type Service,
  type InsertService,
  type Appointment,
  type InsertAppointment,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Barbers
  getBarbers(): Promise<Barber[]>;
  getBarber(id: string): Promise<Barber | undefined>;
  createBarber(barber: InsertBarber): Promise<Barber>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByBarber(barberId: string): Promise<Appointment[]>;
  getAppointmentsByDate(barberId: string, date: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;

  // Chat Messages
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private barbers: Map<string, Barber>;
  private services: Map<string, Service>;
  private appointments: Map<string, Appointment>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.barbers = new Map();
    this.services = new Map();
    this.appointments = new Map();
    this.chatMessages = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed barbers
    const barber1: Barber = {
      id: randomUUID(),
      name: "Carlos Martínez",
      specialty: "Especialista en cortes clásicos y modernos",
      photo: "/api/barber-photo/1",
      rating: 5,
      available: true,
    };

    const barber2: Barber = {
      id: randomUUID(),
      name: "Miguel Ángel",
      specialty: "Experto en barbas y fade cuts",
      photo: "/api/barber-photo/2",
      rating: 5,
      available: true,
    };

    const barber3: Barber = {
      id: randomUUID(),
      name: "Ana García",
      specialty: "Coloración y tratamientos capilares",
      photo: "/api/barber-photo/3",
      rating: 5,
      available: true,
    };

    this.barbers.set(barber1.id, barber1);
    this.barbers.set(barber2.id, barber2);
    this.barbers.set(barber3.id, barber3);

    // Seed services
    const services: InsertService[] = [
      {
        name: "Corte de Cabello",
        description: "Corte profesional con lavado y styling incluido",
        duration: 30,
        price: 250,
        icon: "content_cut",
      },
      {
        name: "Arreglo de Barba",
        description: "Perfilado y arreglo de barba con toalla caliente",
        duration: 20,
        price: 150,
        icon: "face",
      },
      {
        name: "Corte + Barba",
        description: "Paquete completo de corte de cabello y arreglo de barba",
        duration: 45,
        price: 350,
        icon: "clean_hands",
      },
      {
        name: "Coloración",
        description: "Coloración profesional con productos de alta calidad",
        duration: 60,
        price: 450,
        icon: "brush",
      },
      {
        name: "Tratamiento Capilar",
        description: "Tratamiento revitalizante para todo tipo de cabello",
        duration: 40,
        price: 350,
        icon: "spa",
      },
      {
        name: "Afeitado Tradicional",
        description: "Afeitado clásico con navaja y toalla caliente",
        duration: 25,
        price: 200,
        icon: "auto_fix_high",
      },
    ];

    services.forEach((service) => {
      const id = randomUUID();
      this.services.set(id, { ...service, id });
    });
  }

  // Barbers
  async getBarbers(): Promise<Barber[]> {
    return Array.from(this.barbers.values());
  }

  async getBarber(id: string): Promise<Barber | undefined> {
    return this.barbers.get(id);
  }

  async createBarber(insertBarber: InsertBarber): Promise<Barber> {
    const id = randomUUID();
    const barber: Barber = { ...insertBarber, id };
    this.barbers.set(id, barber);
    return barber;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentsByBarber(barberId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.barberId === barberId
    );
  }

  async getAppointmentsByDate(barberId: string, date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (apt) => apt.barberId === barberId && apt.date === date
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  // Chat Messages
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
