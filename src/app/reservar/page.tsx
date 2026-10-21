import type { Metadata } from "next";
import { getAgency, getTours } from "@/lib/dunastour/server";
import { redirect } from "next/navigation";
import { site } from "@/config/site";
import { agencyInfo } from "@/lib/agency-info";
import { Checkout } from "@/components/checkout/Checkout";

export const revalidate = 300;
export const metadata: Metadata = { title: "Minha reserva", robots: { index: false } };

export default async function ReservePage() {
  if (!site.onlineBooking) redirect("/passeios");
  const [agency, tours] = await Promise.all([getAgency(), getTours()]);
  return <Checkout phone={agencyInfo(agency).phone} agencyName={agency?.tradeName ?? "RS Adventure"} suggestions={tours} />;
}
