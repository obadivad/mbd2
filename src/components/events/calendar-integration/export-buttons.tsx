"use client";

import { Calendar, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  start_datetime: string;
  end_datetime?: string;
  location_name?: string;
  address?: string;
  description_pt?: string;
  description_en?: string;
  description_fr?: string;
  description_es?: string;
}

interface CalendarIntegrationProps {
  event: Event;
  locale: string;
}

export function CalendarIntegration({
  event,
  locale,
}: CalendarIntegrationProps) {
  // Get localized description
  const getDescription = () => {
    switch (locale) {
      case "en":
        return event.description_en || event.description_pt || event.title;
      case "fr":
        return event.description_fr || event.description_pt || event.title;
      case "es":
        return event.description_es || event.description_pt || event.title;
      default:
        return event.description_pt || event.title;
    }
  };

  // Format dates for calendar
  const formatDateForCalendar = (datetime: string) => {
    return (
      new Date(datetime).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    );
  };

  // Generate iCal content
  const generateICalContent = () => {
    const startDate = formatDateForCalendar(event.start_datetime);
    const endDate = event.end_datetime
      ? formatDateForCalendar(event.end_datetime)
      : formatDateForCalendar(
          new Date(
            new Date(event.start_datetime).getTime() + 2 * 60 * 60 * 1000
          ).toISOString()
        ); // Default 2 hours

    const location = [event.location_name, event.address]
      .filter(Boolean)
      .join(", ");
    const description = getDescription();

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ministério do Bloco//Event//PT
BEGIN:VEVENT
UID:${event.id}@ministeriodobloco.com
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
  };

  // Download iCal file
  const downloadICalFile = () => {
    const icalContent = generateICalContent();
    const blob = new Blob([icalContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Google Calendar URL
  const generateGoogleCalendarUrl = () => {
    const startDate =
      new Date(event.start_datetime)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";
    const endDate = event.end_datetime
      ? new Date(event.end_datetime)
          .toISOString()
          .replace(/[-:]/g, "")
          .split(".")[0] + "Z"
      : new Date(new Date(event.start_datetime).getTime() + 2 * 60 * 60 * 1000)
          .toISOString()
          .replace(/[-:]/g, "")
          .split(".")[0] + "Z";

    const location = [event.location_name, event.address]
      .filter(Boolean)
      .join(", ");
    const description = getDescription();

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${startDate}/${endDate}`,
      details: description,
      location: location,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div className="space-y-3">
      {/* Google Calendar */}
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => window.open(generateGoogleCalendarUrl(), "_blank")}
      >
        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
        <span className="text-sm">
          {locale === "pt" ? "Google Calendar" : "Google Calendar"}
        </span>
        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
      </Button>

      {/* Download iCal */}
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={downloadICalFile}
      >
        <Download className="w-4 h-4 mr-2 text-green-600" />
        <span className="text-sm">
          {locale === "pt" ? "Baixar arquivo .ics" : "Download .ics file"}
        </span>
      </Button>

      {/* Outlook Web */}
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => {
          const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
            event.title
          )}&startdt=${new Date(event.start_datetime).toISOString()}&enddt=${
            event.end_datetime
              ? new Date(event.end_datetime).toISOString()
              : new Date(
                  new Date(event.start_datetime).getTime() + 2 * 60 * 60 * 1000
                ).toISOString()
          }&body=${encodeURIComponent(
            getDescription()
          )}&location=${encodeURIComponent(
            [event.location_name, event.address].filter(Boolean).join(", ")
          )}`;
          window.open(outlookUrl, "_blank");
        }}
      >
        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
        <span className="text-sm">
          {locale === "pt" ? "Outlook" : "Outlook"}
        </span>
        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
      </Button>

      <div className="text-xs text-gray-500 text-center pt-2">
        {locale === "pt"
          ? "Adicione este evento à sua agenda pessoal"
          : "Add this event to your personal calendar"}
      </div>
    </div>
  );
}
