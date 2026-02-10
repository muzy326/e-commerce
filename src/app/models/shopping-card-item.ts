



export interface ShoppingCardItem {
  title: string;
  productId: string;   // unique id of the product
          // <-- use this instead of 'title'
  price: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
}


