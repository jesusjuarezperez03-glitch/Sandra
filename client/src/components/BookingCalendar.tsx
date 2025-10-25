import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { timeSlots, type TimeSlot } from "@shared/schema";

interface BookingCalendarProps {
  selectedDate: string | null;
  selectedTime: TimeSlot | null;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: TimeSlot) => void;
  bookedSlots?: { date: string; time: string }[];
}

export function BookingCalendar({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  bookedSlots = [],
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  const formatDate = (day: number): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isSlotBooked = (date: string, time: string): boolean => {
    return bookedSlots.some((slot) => slot.date === date && slot.time === time);
  };

  const isPastDate = (day: number): boolean => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Selecciona una fecha</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={previousMonth}
                data-testid="button-previous-month"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                data-testid="button-next-month"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="text-center font-semibold text-foreground" data-testid="text-current-month">
            {monthNames[month]} {year}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
            
            {blanks.map((blank) => (
              <div key={`blank-${blank}`} />
            ))}
            
            {days.map((day) => {
              const dateStr = formatDate(day);
              const isSelected = selectedDate === dateStr;
              const isDisabled = isPastDate(day);

              return (
                <Button
                  key={day}
                  variant={isSelected ? "default" : "outline"}
                  className={`min-h-12 ${isDisabled ? "opacity-40" : ""}`}
                  onClick={() => !isDisabled && onDateSelect(dateStr)}
                  disabled={isDisabled}
                  data-testid={`button-date-${dateStr}`}
                >
                  {day}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Time slots */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selecciona una hora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((time) => {
                const isBooked = isSlotBooked(selectedDate, time);
                const isSelected = selectedTime === time;

                return (
                  <Button
                    key={time}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => !isBooked && onTimeSelect(time)}
                    disabled={isBooked}
                    data-testid={`button-time-${time}`}
                    className="min-h-10"
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
