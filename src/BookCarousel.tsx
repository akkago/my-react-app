import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';

// Тип книги с картинкой
interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  img?: string;
}

interface BookCarouselProps {
  books: Book[];
}

const PLACEHOLDER_IMG = 'https://via.placeholder.com/120x180?text=Book';
const VISIBLE_COUNT = 4;
const SLIDE_INTERVAL = 7500; // мс (замедлено в 3 раза)

const BookCarousel: React.FC<BookCarouselProps> = ({ books }) => {
  const [startIdx, setStartIdx] = useState(0);
  const total = books.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIdx((prev) => (prev + 1) % total);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [total]);

  // Получаем 4 книги подряд, с циклическим переходом
  const visibleBooks = Array(VISIBLE_COUNT)
    .fill(0)
    .map((_, i) => books[(startIdx + i) % total]);

  return (
    <Box display="flex" gap={2} justifyContent="center" alignItems="center">
      {visibleBooks.map((book) => (
        <Card key={book.id} sx={{ width: 160, minHeight: 260 }}>
          <CardMedia
            component="img"
            height="180"
            image={book.img || PLACEHOLDER_IMG}
            alt={book.title}
          />
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">{book.title}</Typography>
            <Typography variant="body2">{book.author}</Typography>
            <Typography variant="body2" color="text.secondary">{book.price} ₽</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default BookCarousel; 