type Client = { client_id: string; client_name: string; };
type Good = { good_id: string; good_name: string; };
type Batch = { batch_id: string; supplier: string; delivery_date: string; } | null;

export type RemainRecord = {
  client: Client;
  good: Good;
  warehouse: string;
  zone: string | null;
  batch: Batch;
  package: string | null;
  cargo: string | null;
  quantity: number;
};

// Тестовые картинки для BookCarousel
export const TEST_BOOK_IMAGES = [
  require('./book1.jpg'),
  require('./book2.jpg'),
  require('./book3.jpg'),
  require('./book4.jpg'),
];
