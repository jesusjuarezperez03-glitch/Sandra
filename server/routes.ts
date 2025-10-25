import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatbotResponse } from "./openai";
import { insertAppointmentSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all barbers
  app.get("/api/barbers", async (req, res) => {
    try {
      const barbers = await storage.getBarbers();
      res.json(barbers);
    } catch (error) {
      console.error("Error fetching barbers:", error);
      res.status(500).json({ error: "Failed to fetch barbers" });
    }
  });

  // Get barber by ID
  app.get("/api/barbers/:id", async (req, res) => {
    try {
      const barber = await storage.getBarber(req.params.id);
      if (!barber) {
        return res.status(404).json({ error: "Barber not found" });
      }
      res.json(barber);
    } catch (error) {
      console.error("Error fetching barber:", error);
      res.status(500).json({ error: "Failed to fetch barber" });
    }
  });

  // Serve barber photos
  app.get("/api/barber-photo/:id", (req, res) => {
    const photoMap: Record<string, string> = {
      "1": "Barber_profile_photo_one_b9cb4795.png",
      "2": "Barber_profile_photo_two_6d3c029b.png",
      "3": "Barber_profile_photo_three_fcb1867c.png",
    };

    const photoFile = photoMap[req.params.id];
    if (!photoFile) {
      return res.status(404).send("Photo not found");
    }

    const photoPath = path.join(process.cwd(), "attached_assets", "generated_images", photoFile);
    
    if (fs.existsSync(photoPath)) {
      res.sendFile(photoPath);
    } else {
      res.status(404).send("Photo file not found");
    }
  });

  // Get all services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Get service by ID
  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // Get appointments (with optional filters)
  app.get("/api/appointments", async (req, res) => {
    try {
      const { barberId, date } = req.query;

      if (barberId && date) {
        const appointments = await storage.getAppointmentsByDate(
          barberId as string,
          date as string
        );
        return res.json(appointments);
      }

      if (barberId) {
        const appointments = await storage.getAppointmentsByBarber(barberId as string);
        return res.json(appointments);
      }

      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  // Create appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid appointment data", details: error.errors });
      }
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  // Get chat messages for a session
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  // Send chat message and get AI response
  app.post("/api/chat", async (req, res) => {
    try {
      const { sessionId, message } = req.body;

      if (!sessionId || !message) {
        return res.status(400).json({ error: "Session ID and message are required" });
      }

      // Save user message
      await storage.createChatMessage({
        sessionId,
        role: "user",
        content: message,
      });

      // Get AI response
      const aiResponse = await getChatbotResponse(message);

      // Save AI response
      await storage.createChatMessage({
        sessionId,
        role: "assistant",
        content: aiResponse,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
