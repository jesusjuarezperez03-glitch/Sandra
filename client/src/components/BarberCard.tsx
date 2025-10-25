import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar } from "lucide-react";
import type { Barber } from "@shared/schema";

interface BarberCardProps {
  barber: Barber;
  onSelect: (barberId: string) => void;
}

export function BarberCard({ barber, onSelect }: BarberCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-barber-${barber.id}`}>
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <img
            src={barber.photo}
            alt={barber.name}
            className="w-full h-full object-cover"
          />
          {barber.available && (
            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white border-0">
              Disponible
            </Badge>
          )}
          {!barber.available && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Ocupado
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1" data-testid={`text-barber-name-${barber.id}`}>
            {barber.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{barber.specialty}</p>
          
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < barber.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({barber.rating}/5)
            </span>
          </div>

          <Button
            onClick={() => onSelect(barber.id)}
            className="w-full"
            data-testid={`button-select-barber-${barber.id}`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Ver Disponibilidad
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
