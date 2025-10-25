import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MessageSquare, Scissors, Clock, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Modern_barbershop_hero_image_af87723e.png";

export default function Home() {
  const features = [
    {
      icon: MessageSquare,
      title: "Chat Inteligente",
      description: "Pregunta sobre servicios, precios y horarios a nuestro asistente virtual",
    },
    {
      icon: Calendar,
      title: "Reserva Online",
      description: "Agenda tu cita en segundos, elige tu barbero y horario preferido",
    },
    {
      icon: Scissors,
      title: "Barberos Expertos",
      description: "Profesionales calificados con años de experiencia en cortes modernos",
    },
  ];

  const hours = [
    { day: "Lunes - Viernes", time: "9:00 AM - 8:00 PM" },
    { day: "Sábado", time: "9:00 AM - 7:00 PM" },
    { day: "Domingo", time: "10:00 AM - 4:00 PM" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Barbería moderna"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Reserva tu cita en segundos
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Los mejores cortes y servicios de barbería con nuestro sistema de reserva inteligente
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/booking">
              <Button
                size="lg"
                className="text-base px-8 backdrop-blur-md bg-primary/90 hover:bg-primary border border-primary-border"
                data-testid="button-book-now"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Reservar Ahora
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border-white/30"
                data-testid="button-chat-now"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat con IA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Combinamos tradición y tecnología para ofrecerte la mejor experiencia
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="hover-elevate" data-testid={`card-feature-${idx}`}>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios para verte y sentirte genial
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "content_cut", name: "Corte de Cabello", price: 25 },
              { icon: "face", name: "Arreglo de Barba", price: 15 },
              { icon: "brush", name: "Coloración", price: 45 },
              { icon: "spa", name: "Tratamiento Capilar", price: 35 },
            ].map((service, idx) => (
              <Card key={idx} className="hover-elevate" data-testid={`card-service-preview-${idx}`}>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-3">
                    <span className="material-icons text-primary text-3xl">
                      {service.icon}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{service.name}</h3>
                  <p className="text-2xl font-bold text-primary">${service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/booking">
              <Button size="lg" data-testid="button-view-all-services">
                Ver Todos los Servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hours & Contact */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Hours */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Horarios</h3>
                </div>
                <div className="space-y-3">
                  {hours.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{item.day}</span>
                      <span className="font-medium">{item.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Contacto</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Dirección</p>
                      <p className="text-sm text-muted-foreground">
                        Av. Principal 123, Centro
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <p className="text-sm text-muted-foreground">+52 123 456 7890</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
