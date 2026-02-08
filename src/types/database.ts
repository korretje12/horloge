export interface Watch {
  id: string;
  brand: string;
  model: string;
  reference_number: string;
  image_url: string | null;
  movement: string | null;
  category: string | null;
  created_at: string;
}

export interface UserCollection {
  id: string;
  user_id: string;
  watch_id: string;
  status: "owned" | "wishlist";
  created_at: string;
  watch?: Watch;
}

export interface Wristcheck {
  id: string;
  user_id: string;
  watch_model: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  user_email?: string;
}
