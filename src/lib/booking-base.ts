import type { PackageCard, PackageDetail, TourCard, TourDetail } from "./dunastour/types";
import type { CartItem } from "./cart";
import { displayTitle, tourUnitPrice } from "./format";

type Base = Omit<CartItem, "date" | "seats" | "infants">;

/** Passeio → item do roteiro. Aventura (termo de risco) e transfer não levam criança de colo (regra do link). */
export function tourBase(tour: TourCard | TourDetail, image: string | null): Base {
  return {
    kind: "tour",
    id: tour.id,
    title: displayTitle(tour.title),
    image,
    unitPrice: tourUnitPrice(tour),
    fullPrice: tour.basePrice,
    saleUnit: tour.saleUnit,
    vehicleMaxOccupancy: tour.vehicleMaxOccupancy,
    risk: !!tour.riskType,
    riskType: tour.riskType,
    allowInfants: !tour.riskType && !(tour.transferFrom && tour.transferTo),
    durationMinutes: tour.durationMinutes,
    tags: tour.tags,
    trek: !!tour.trekLevel,
  };
}

export function packageBase(pkg: PackageCard | PackageDetail, image: string | null, hasRisk = false): Base {
  return {
    kind: "package",
    id: pkg.id,
    title: displayTitle(pkg.title),
    image,
    unitPrice: pkg.finalPrice,
    fullPrice: pkg.originalPrice,
    risk: hasRisk,
    allowInfants: !hasRisk,
    durationMinutes: 0,
    tags: [],
    trek: false,
  };
}
