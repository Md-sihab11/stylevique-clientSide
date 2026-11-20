import type { Appointment } from "@/features/appointments/types";
import { getAppointmentService } from "@/features/appointments/rules";
import { SafeImage } from "@/components/common/safe-image";

interface AppointmentServiceInfoProps {
  appointment: Appointment;
}

/** Small service thumbnail + name used in appointment tables and cards. */
export function AppointmentServiceInfo({ appointment }: AppointmentServiceInfoProps) {
  const service = getAppointmentService(appointment);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-sm bg-secondary">
        <SafeImage src={service.image} alt={service.name} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{service.name}</p>
        <p className="mt-0.5 truncate text-[0.68rem] uppercase tracking-[0.1em] text-muted-foreground">
          {service.category}
        </p>
      </div>
    </div>
  );
}
