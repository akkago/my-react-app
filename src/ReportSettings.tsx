import React from "react";
import { observer } from "mobx-react-lite";
import { reportStore, GROUP_FIELDS } from "./store/ReportStore";
import type { GroupField } from "./store/ReportStore";
import { Box, Typography, Autocomplete, TextField, Chip, Button, Stack } from "@mui/material";

// Русские названия полей
const FIELD_LABELS: Record<GroupField, string> = {
  warehouse: "Склад",
  client: "Клиент", 
  good: "Товар",
  zone: "Зона",
  batch: "Партия",
  package: "Упаковка",
  cargo: "Груз"
};

// Получить уникальные значения для фильтрации по полю (только id)
function getOptions(field: GroupField): string[] {
  const data = reportStore.data;
  switch (field) {
    case "client":
      return Array.from(new Set(data.map(r => r.client.client_id)));
    case "good":
      return Array.from(new Set(data.map(r => r.good.good_id)));
    case "batch":
      return Array.from(new Set(data.map(r => r.batch && r.batch.batch_id).filter(Boolean))) as string[];
    default:
      return Array.from(new Set(data.map(r => (r as any)[field]).filter(Boolean)));
  }
}

// Получить отображаемое имя по id
function getLabel(field: GroupField, id: string) {
  const data = reportStore.data;
  if (field === "client") {
    const rec = data.find(r => r.client.client_id === id);
    return rec ? `${id} — ${rec.client.client_name}` : id;
  }
  if (field === "good") {
    const rec = data.find(r => r.good.good_id === id);
    return rec ? `${id} — ${rec.good.good_name}` : id;
  }
  if (field === "batch") {
    const rec = data.find(r => r.batch && r.batch.batch_id === id);
    return rec ? `${id} — ${rec.batch?.supplier}` : id;
  }
  return id;
}

export const ReportSettings: React.FC = observer(() => {
  const { groupBy, setGroupBy, filters, setFilter } = reportStore;

  // Переместить поле группировки влево/вправо
  const moveGroup = (idx: number, dir: -1 | 1) => {
    const arr = [...groupBy];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setGroupBy(arr);
  };

  // Удалить поле из группировки
  const removeGroup = (idx: number) => {
    const arr = [...groupBy];
    arr.splice(idx, 1);
    setGroupBy(arr);
  };

  // Добавить поле в группировку
  const addGroup = (field: GroupField) => {
    if (!groupBy.includes(field)) setGroupBy([...groupBy, field]);
  };

  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>Настройки отчёта</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
        {/* Фильтры */}
        <Box minWidth={250}>
          <Typography variant="subtitle1">Фильтры</Typography>
          {GROUP_FIELDS.map(field => (
            <Autocomplete
              key={field}
              multiple
              size="small"
              options={getOptions(field)}
              value={filters[field] || []}
              onChange={(_, vals) => setFilter(field, vals)}
              renderInput={params => <TextField {...params} label={FIELD_LABELS[field]} margin="dense" />}
              style={{ marginBottom: 8 }}
              renderOption={(props, option) => (
                <li {...props}>{getLabel(field, option)}</li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={getLabel(field, option)} {...getTagProps({ index })} />
                ))
              }
            />
          ))}
        </Box>
        {/* Группировка */}
        <Box minWidth={250}>
          <Typography variant="subtitle1">Группировка</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {groupBy.map((field, idx) => (
              <Chip
                key={field}
                label={FIELD_LABELS[field]}
                color="primary"
                onDelete={() => removeGroup(idx)}
                deleteIcon={<span>×</span>}
                style={{ marginBottom: 4 }}
                clickable
                onClick={() => moveGroup(idx, 1)}
                onDoubleClick={() => moveGroup(idx, -1)}
              />
            ))}
          </Stack>
          <Box mt={1}>
            {GROUP_FIELDS.filter(f => !groupBy.includes(f)).map(f => (
              <Button key={f} size="small" variant="outlined" onClick={() => addGroup(f)} style={{ marginRight: 4, marginBottom: 4 }}>{FIELD_LABELS[f]}</Button>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            Клик по чипу — вправо, двойной клик — влево, крестик — удалить. Кнопки ниже — добавить поле.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}); 