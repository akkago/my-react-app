import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { ReportSettings } from "./ReportSettings";
import { ReportTable } from "./ReportTable";

// Главный компонент приложения
function App() {
  return (
    <Container disableGutters sx={{ width: '100vw', height: '100vh', minWidth: 0, minHeight: 0 }}>
        <Box display="flex" flexDirection="column" sx={{ height: '100vh', width: '100vw', minWidth: 0, minHeight: 0 }}>
          <Box py={2} px={2}>
            <Typography variant="h4" gutterBottom>Отчёт по остаткам</Typography>
            {/* Настройки фильтров и группировки */}
            <ReportSettings />
          </Box>
          {/* Иерархическая таблица отчёта */}
          <Box flex={1} minHeight={0} minWidth={0} px={2} pb={2}>
            <ReportTable />
          </Box>
        </Box>
      </Container>
  );
}

export default App;
