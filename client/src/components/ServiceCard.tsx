import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import type { Service } from "@shared/schema";

interface ServiceCardProps {
  service: Service;
  onSelect: (serviceId: string) => void;
  selected?: boolean;
}

export function ServiceCard({ service, onSelect, selected }: ServiceCardProps) {
  return (
    <Card
      className={`hover-elevate cursor-pointer transition-all ${
        selected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect(service.id)}
      data-testid={`card-service-${service.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
            <span className="material-icons text-primary text-2xl">
              {service.icon}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-1" data-testid={`text-service-name-${service.id}`}>
              {service.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {service.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{service.duration} min</span>
              </div>
              
              <div className="text-lg font-bold text-primary" data-testid={`text-service-price-${service.id}`}>
                ${service.price}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
