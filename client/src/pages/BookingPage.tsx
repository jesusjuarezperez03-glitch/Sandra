import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarberCard } from "@/components/BarberCard";
import { ServiceCard } from "@/components/ServiceCard";
import { BookingCalendar } from "@/components/BookingCalendar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Barber, Service, TimeSlot, Appointment } from "@shared/schema";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function BookingPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<"barber" | "service" | "datetime" | "details" | "confirmation">("barber");
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Fetch barbers
  const { data: barbers = [] } = useQuery<Barber[]>({
    queryKey: ["/api/barbers"],
  });

  // Fetch services
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // Fetch appointments for selected barber and date
  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments", selectedBarberId, selectedDate],
    enabled: !!selectedBarberId && !!selectedDate,
  });

  // Create appointment mutation
  const createAppointment = useMutation({
    mutationFn: async (data: {
      customerName: string;
      customerPhone: string;
      barberId: string;
      serviceId: string;
      date: string;
      time: string;
    }) => {
      return await apiRequest("POST", "/api/appointments", data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setConfirmedAppointment(data);
      setStep("confirmation");
      toast({
        title: "¡Cita reservada!",
        description: "Tu cita ha sido confirmada exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la cita. Intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);
  const selectedService = services.find((s) => s.id === selectedServiceId);

  const bookedSlots = appointments.map((apt) => ({
    date: apt.date,
    time: apt.time,
  }));

  const handleBarberSelect = (barberId: string) => {
    setSelectedBarberId(barberId);
    setStep("service");
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setStep("datetime");
  };

  const handleDateTimeComplete = () => {
    if (selectedDate && selectedTime) {
      setStep("details");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBarberId && selectedServiceId && selectedDate && selectedTime) {
      createAppointment.mutate({
        customerName,
        customerPhone,
        barberId: selectedBarberId,
        serviceId: selectedServiceId,
        date: selectedDate,
        time: selectedTime,
      });
    }
  };

  const resetBooking = () => {
    setStep("barber");
    setSelectedBarberId(null);
    setSelectedServiceId(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setCustomerName("");
    setCustomerPhone("");
    setConfirmedAppointment(null);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Reserva tu Cita</h1>
          <p className="text-muted-foreground">
            Sigue los pasos para agendar tu cita con nosotros
          </p>
        </div>

        {/* Progress Steps */}
        {step !== "confirmation" && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[
                { key: "barber", label: "Barbero" },
                { key: "service", label: "Servicio" },
                { key: "datetime", label: "Fecha y Hora" },
                { key: "details", label: "Tus Datos" },
              ].map((s, idx) => (
                <div key={s.key} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      step === s.key
                        ? "bg-primary text-primary-foreground"
                        : selectedBarberId && idx < 1 || selectedServiceId && idx < 2 || selectedDate && selectedTime && idx < 3
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">
                    {s.label}
                  </span>
                  {idx < 3 && (
                    <div className="w-8 h-0.5 bg-border mx-2 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Select Barber */}
        {step === "barber" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Selecciona tu Barbero</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbers.map((barber) => (
                <BarberCard
                  key={barber.id}
                  barber={barber}
                  onSelect={handleBarberSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Service */}
        {step === "service" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Selecciona el Servicio</h2>
              <Button
                variant="outline"
                onClick={() => setStep("barber")}
                data-testid="button-back-to-barbers"
              >
                Cambiar Barbero
              </Button>
            </div>
            
            {selectedBarber && (
              <Card className="mb-6">
                <CardContent className="p-4 flex items-center gap-4">
                  <img
                    src={selectedBarber.photo}
                    alt={selectedBarber.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{selectedBarber.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedBarber.specialty}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={handleServiceSelect}
                  selected={selectedServiceId === service.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Date & Time */}
        {step === "datetime" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Fecha y Hora</h2>
              <Button
                variant="outline"
                onClick={() => setStep("service")}
                data-testid="button-back-to-services"
              >
                Cambiar Servicio
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Barbero</p>
                  <p className="font-semibold">{selectedBarber?.name}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Servicio</p>
                  <p className="font-semibold">{selectedService?.name}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Duración</p>
                  <p className="font-semibold">{selectedService?.duration} minutos</p>
                </CardContent>
              </Card>
            </div>

            <BookingCalendar
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
              bookedSlots={bookedSlots}
            />

            {selectedDate && selectedTime && (
              <div className="mt-6 text-center">
                <Button
                  size="lg"
                  onClick={handleDateTimeComplete}
                  data-testid="button-continue-to-details"
                >
                  Continuar
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Customer Details */}
        {step === "details" && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Tus Datos</h2>
              <Button
                variant="outline"
                onClick={() => setStep("datetime")}
                data-testid="button-back-to-datetime"
              >
                Cambiar Fecha
              </Button>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Resumen de tu Cita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Barbero</span>
                  <span className="font-medium">{selectedBarber?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hora</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${selectedService?.price}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Juan Pérez"
                      required
                      data-testid="input-customer-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+52 123 456 7890"
                      required
                      data-testid="input-customer-phone"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={createAppointment.isPending}
                    data-testid="button-confirm-booking"
                  >
                    {createAppointment.isPending ? "Procesando..." : "Confirmar Reserva"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === "confirmation" && confirmedAppointment && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">¡Cita Confirmada!</h2>
              <p className="text-muted-foreground">
                Hemos reservado tu cita exitosamente
              </p>
            </div>

            <Card className="mb-6" data-testid="card-appointment-confirmation">
              <CardHeader>
                <CardTitle>Detalles de tu Cita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre</span>
                  <span className="font-medium">{confirmedAppointment.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono</span>
                  <span className="font-medium">{confirmedAppointment.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Barbero</span>
                  <span className="font-medium">{selectedBarber?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha</span>
                  <span className="font-medium">{confirmedAppointment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hora</span>
                  <span className="font-medium">{confirmedAppointment.time}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" size="lg" data-testid="button-go-home">
                  Volver al Inicio
                </Button>
              </Link>
              <Button size="lg" onClick={resetBooking} data-testid="button-new-booking">
                Hacer Otra Reserva
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
