export interface ShippingDetails {
  weight: number;
}

export interface CostBreakdownItem {
  product: string;
  gross: number;
  tax: number;
  net: number;
}

export interface ShippingCostResult {
  totalCost: number;
  breakdown: CostBreakdownItem[];
}
