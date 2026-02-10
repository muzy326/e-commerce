import { Shipping } from "./shipping.model";
import { ShoppingCardItem } from "./shopping-card-item";

export class Order {
    id?: string;
    userId?: string;
    datePlaced?: number;
    shippingDetails: Shipping = new Shipping();
    items: ShoppingCardItem[] = [];
    amount?: number;
}