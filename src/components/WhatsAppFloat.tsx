import { whatsappLink } from "@/lib/products";
import { WhatsAppIcon } from "./icons";

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("שלום CU29, אשמח לעזרה בבחירת מוצר")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שליחת הודעת וואטסאפ"
      className="fixed bottom-5 start-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
