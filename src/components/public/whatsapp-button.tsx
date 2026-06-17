import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/settings";

export function WhatsappFab({
  number,
  message,
}: {
  number: string;
  message?: string;
}) {
  if (!number) return null;
  return (
    <a
      href={whatsappLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">Chat WhatsApp</span>
    </a>
  );
}
