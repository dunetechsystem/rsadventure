// Tipos espelhando os DTOs públicos da API do DunasTour (com.dunastour.dto.*) — mesmo contrato
// usado pelo link de checkout dunastour.com.br/<slug> (dunas-tour-web/src/lib/types.ts).

export type TourRiskType = "QUADRICICLO" | "MOTO_CRF" | "UTV" | "OUTRA_AVENTURA";
export type TourSaleUnit = "PESSOA" | "QUADRICICLO" | "UTV" | "MOTO_CRF" | "CARRO";
export type TrekLevel = "FACIL" | "MODERADO" | "DIFICIL" | "EXTREMO";
export type SeatMode = "DAILY" | "DATES" | null;

export interface TrekDeparture {
  /** "YYYY-MM-DD" */
  date: string;
  seats: number;
  booked?: number | null;
  left?: number | null;
}

export interface TourCard {
  id: string;
  title: string;
  coverImageUrl: string | null;
  basePrice: number;
  ratingAvg: number;
  ratingCount: number;
  tags: string[];
  agencyName: string;
  riskType: TourRiskType | null;
  durationMinutes: number;
  currency?: string;
  saleUnit?: TourSaleUnit;
  vehicleMaxOccupancy?: number | null;
  /** Desconto em % (null = sem); basePrice é o preço cheio. */
  discountPercent?: number | null;
  transferFrom?: string | null;
  transferTo?: string | null;
  trekLevel?: TrekLevel | null;
  trekDistanceKm?: number | null;
  trekDays?: number | null;
  trekNextDeparture?: TrekDeparture | null;
}

export interface TourDetail extends Omit<TourCard, "coverImageUrl"> {
  description: string;
  mediaUrls: string[];
  /** "HH:mm:ss" */
  defaultPickupTime?: string | null;
  agencyId?: string;
  spotIds?: string[];
  /** Um item por linha. */
  included?: string | null;
  whatToBring?: string | null;
  recentBookings?: number;
  instantConfirmation?: boolean;
  agencyConfirmMinutes?: number | null;
  transferKm?: number | null;
  trek?: { level: TrekLevel; distanceKm: number; days: number; elevationM: number | null } | null;
}

export interface PackageCard {
  id: string;
  title: string;
  coverImageUrl: string | null;
  agencyName: string;
  toursCount: number;
  originalPrice: number;
  discountPercent: number;
  finalPrice: number;
  hasRisk?: boolean;
}

export interface PackageDetail {
  id: string;
  title: string;
  description: string;
  agencyName: string;
  mediaUrls: string[];
  discountPercent: number;
  originalPrice: number;
  finalPrice: number;
  tours: { id: string; title: string; coverImageUrl: string | null; basePrice: number }[];
}

export interface CheckoutPageContent {
  headline: string | null;
  subheadline: string | null;
  foundedYear: number | null;
  highlights: { icon: string | null; title: string; text: string | null }[];
  gallery: string[];
  faqs: { question: string; answer: string }[];
  showReviews: boolean;
  reviewShots: string[];
  googleReviewsUrl: string | null;
  googleReviews: { author: string; rating: number; date: string | null; text: string }[];
}

export interface AgencyPublicProfile {
  id: string;
  tradeName: string;
  coverImageUrl: string | null;
  logoUrl: string | null;
  addressCity: string;
  phone: string | null;
  description: string | null;
  slug: string;
  foreignMarkets: string[];
  showRouteMap: boolean;
  cadasturUrl: string | null;
  checkoutPage?: CheckoutPageContent | null;
  instagramHandle?: string | null;
  documentCnpj?: string | null;
  legalName?: string | null;
}

export interface AgencyPublicReviews {
  average: number;
  count: number;
  items: { touristName: string; rating: number; comment: string; tourTitle: string; createdAt: string }[];
}

/** GET /api/public/lagoons — nível (0–100) das lagoas, previsão e curva mês a mês. */
export interface LagoonStatus {
  level: number;
  status: string;
  current: { temperature: number; weatherCode: number; windSpeed: number; day: boolean } | null;
  days: { date: string; weatherCode: number; max: number; min: number; rainProbability: number; sunrise: string; sunset: string }[];
  monthLevels: number[];
}

export interface DayStatus {
  date: string;
  seats: number | null;
  booked: number;
  left: number | null;
  open: boolean;
}

/** GET /api/tours/{id}/availability — mode null = sem limite. */
export interface PublicAvailability {
  mode: SeatMode;
  days: DayStatus[];
}

export interface RiskTermSection {
  id: string;
  title: string;
  paragraphs: string[];
  items: string[];
  declarations: { id: string; text: string }[];
}

/** GET /api/agencies/{id}/risk-term (204 = nenhum passeio com risco). */
export interface RiskTerm {
  version: string;
  title: string;
  agencyName: string;
  activities: string[];
  tourTitles: string[];
  sections: RiskTermSection[];
}

export interface ReturningCustomer {
  name: string;
  email: string | null;
  pickupAddress: string | null;
  pickupLat: number | null;
  pickupLng: number | null;
  lastRiskTermAcceptedAt: string | null;
}

export interface CheckoutItemRequest {
  tourId?: string;
  packageId?: string;
  scheduledDate: string;
  seats: number;
  infants?: number;
}

/** POST /api/agencies/{agencyId}/checkout-submissions */
export interface CreateCheckoutSubmissionRequest {
  items: CheckoutItemRequest[];
  pickupAddress?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCpf?: string;
  privacyAccepted: boolean;
  termsAccepted: boolean;
  riskTerms?: { version: string; acceptedDeclarationIds: string[]; signatureName: string };
  notes?: string;
}

export interface CheckoutSubmissionResponse {
  id: string;
  tourTitle: string;
  scheduledDate: string;
  seats: number;
  totalAmount: number;
  agencyName: string;
  agencyPhone: string | null;
  checkOutDate: string | null;
  currency: string;
}
