import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="font-serif text-7xl text-copper" dir="ltr">404</p>
      <h1 className="mt-6 font-serif text-3xl font-light text-ink">הדף לא נמצא</h1>
      <p className="mt-3 text-stone">ייתכן שהקישור שגוי או שהמוצר כבר לא זמין.</p>
      <ButtonLink href="/shop" className="mt-10">חזרה לחנות</ButtonLink>
    </Container>
  );
}
