import { Container, Typography, Box, AppBar, Toolbar, Button } from "@mui/material";
import { ReportSettings } from "./ReportSettings";
import { ReportTable } from "./ReportTable";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import React from "react";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Drawer } from '@mui/material';
import { translations } from './localization';
import type { Lang } from './localization';
import BookCarousel from './BookCarousel';
import book1 from './assets/book1.jpg';
import book2 from './assets/book2.jpg';
import book3 from './assets/book3.jpg';

const BOOKS = [
  { id: 'b1', title: 'Мастер и Маргарита', author: 'Михаил Булгаков', price: 500, img: book1 },
  { id: 'b2', title: 'Преступление и наказание', author: 'Фёдор Достоевский', price: 450, img: book2 },
  { id: 'b3', title: 'Война и мир', author: 'Лев Толстой', price: 700, img: book3 },
  { id: 'b4', title: '1984', author: 'Джордж Оруэлл', price: 400 }, // без картинки
];

type Book = { id: string; title: string; author: string; price: number };
type CartItem = Book & { qty: number };

function Books({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = React.useState(false);

  const addToCart = (book: Book) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === book.id);
      if (found) {
        return prev.map((item) => item.id === book.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...book, qty: 1 }];
    });
  };
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((item) => item.id !== id));
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>{t.books}</Typography>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {BOOKS.map((book) => (
          <Box key={book.id} border={1} borderRadius={2} p={2} minWidth={220}>
            <Typography variant="h6">{book.title}</Typography>
            <Typography variant="subtitle1">{t.author}: {book.author}</Typography>
            <Typography>{t.price}: {book.price} ₽</Typography>
            <Button variant="contained" sx={{ mt: 1 }} onClick={() => addToCart(book)}>{t.buy}</Button>
          </Box>
        ))}
      </Box>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box width={320} p={2} role="presentation">
          <Typography variant="h6" gutterBottom>{t.cart}</Typography>
          {cart.length === 0 ? (
            <Typography>{t.emptyCart}</Typography>
          ) : (
            cart.map((item) => (
              <Box key={item.id} display="flex" alignItems="center" justifyContent="space-between" my={1}>
                <span>{item.title} × {item.qty}</span>
                <span>{item.price * item.qty} ₽</span>
                <Button size="small" color="error" onClick={() => removeFromCart(item.id)}>{t.close}</Button>
              </Box>
            ))
          )}
          <Box mt={2} fontWeight="bold">{t.total}: {total} ₽</Box>
          <Button fullWidth sx={{ mt: 2 }} onClick={() => setCartOpen(false)}>{t.close}</Button>
        </Box>
      </Drawer>
      <IconButton color="inherit" sx={{ position: 'fixed', top: 16, right: 72 }} onClick={() => setCartOpen(true)}>
        <ShoppingCartIcon />
        {cart.length > 0 && <Box component="span" sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'red', color: 'white', borderRadius: '50%', px: 0.5, fontSize: 12 }}>{cart.length}</Box>}
      </IconButton>
    </Box>
  );
}

function About({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return <Box p={3}><Typography variant="h4">{t.about}</Typography></Box>;
}
function AudioBooks({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return <Box p={3}><Typography variant="h4">{t.audiobooks}</Typography></Box>;
}
function Comics({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return <Box p={3}><Typography variant="h4">{t.comics}</Typography></Box>;
}
function Blog({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return <Box p={3}><Typography variant="h4">{t.blog}</Typography></Box>;
}

function MenuBar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const navigate = useNavigate();
  const t = translations[lang];
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" onClick={() => navigate("/")}>{t.main}</Button>
        <Button color="inherit" onClick={() => navigate("/about")}>{t.about}</Button>
        <Button color="inherit" onClick={() => navigate("/books")}>{t.books}</Button>
        <Button color="inherit" onClick={() => navigate("/audiobooks")}>{t.audiobooks}</Button>
        <Button color="inherit" onClick={() => navigate("/comics")}>{t.comics}</Button>
        <Button color="inherit" onClick={() => navigate("/blog")}>{t.blog}</Button>
        <Box flex={1} />
        <Button color="inherit" onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}>
          {lang === 'ru' ? 'EN' : 'RU'}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function MainReport({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return (
    <>
      {/* Карусель книг на главной странице */}
      <Box py={2} px={2}>
        <BookCarousel books={BOOKS} />
      </Box>
      <Box py={2} px={2}>
        <Typography variant="h4" gutterBottom>{t.report}</Typography>
        {/* Настройки фильтров и группировки */}
        <ReportSettings />
      </Box>
      {/* Иерархическая таблица отчёта */}
      <Box flex={1} minHeight={0} minWidth={0} px={2} pb={2}>
        <ReportTable />
      </Box>
    </>
  );
}

function App() {
  const [lang, setLang] = React.useState<Lang>('ru');
  return (
    <Router>
      <Container disableGutters sx={{ width: '100vw', height: '100vh', minWidth: 0, minHeight: 0 }}>
        <Box display="flex" flexDirection="column" sx={{ height: '100vh', width: '100vw', minWidth: 0, minHeight: 0 }}>
          <MenuBar lang={lang} setLang={setLang} />
          <Box flex={1} minHeight={0} minWidth={0}>
            <Routes>
              <Route path="/" element={<MainReport lang={lang} />} />
              <Route path="/about" element={<About lang={lang} />} />
              <Route path="/books" element={<Books lang={lang} />} />
              <Route path="/audiobooks" element={<AudioBooks lang={lang} />} />
              <Route path="/comics" element={<Comics lang={lang} />} />
              <Route path="/blog" element={<Blog lang={lang} />} />
            </Routes>
          </Box>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
