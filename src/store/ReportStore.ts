import { makeAutoObservable } from "mobx";
import data from "../assets/data.json";
import type { RemainRecord } from "../assets/types";

// Возможные поля для фильтрации и группировки
export const GROUP_FIELDS = [
  "warehouse",
  "client",
  "good",
  "zone",
  "batch",
  "package",
  "cargo"
] as const;
export type GroupField = typeof GROUP_FIELDS[number];

// Тип фильтров: ключ - поле, значение - выбранные значения
export type Filters = Partial<{
  warehouse: string[];
  client: string[];
  good: string[];
  zone: string[];
  batch: string[];
  package: string[];
  cargo: string[];
}>;

class ReportStore {
  // Исходные данные
  data: RemainRecord[] = data;

  // Фильтры (по каждому полю - массив выбранных значений)
  filters: Filters = {
    warehouse: [],
    client: [],
    good: [],
    zone: [],
    batch: [],
    package: [],
    cargo: [],
  };

  // Группировка (массив полей в порядке вложенности)
  groupBy: GroupField[] = ["warehouse", "client", "good"];

  constructor() {
    makeAutoObservable(this);
  }

  // Установить фильтр по полю
  setFilter = <K extends keyof Filters>(field: K, values: Filters[K]) => {
    this.filters[field] = values;
  };

  // Установить порядок группировки
  setGroupBy = (fields: GroupField[]) => {
    this.groupBy = fields;
  };

  // Получить отфильтрованные данные
  get filteredData(): RemainRecord[] {
    return this.data.filter((rec) => {
      return Object.entries(this.filters).every(([field, values]) => {
        if (!values || values.length === 0) return true;
        // Особая обработка для batch, client, good (объекты)
        if (field === "batch") {
          return rec.batch && values.includes(rec.batch.batch_id);
        }
        if (field === "client") {
          return values.includes(rec.client.client_id);
        }
        if (field === "good") {
          return values.includes(rec.good.good_id);
        }
        // Остальные поля (строки или null)
        return values.includes((rec as any)[field]);
      });
    });
  }

  // Рекурсивно группирует данные по выбранным полям
  groupData(data: RemainRecord[], groupFields: GroupField[]): any[] {
    if (groupFields.length === 0) {
      // Листовые строки
      return data.map((rec) => ({ ...rec, quantityTotal: rec.quantity }));
    }
    const [field, ...rest] = groupFields;
    // Группируем по текущему полю
    const groups: Record<string, RemainRecord[]> = {};
    data.forEach((rec) => {
      let key: string = "";
      if (field === "batch") key = rec.batch ? rec.batch.batch_id : "(нет партии)";
      else if (field === "client") key = rec.client.client_id;
      else if (field === "good") key = rec.good.good_id;
      else key = (rec as any)[field] ?? "(пусто)";
      if (!groups[key]) groups[key] = [];
      groups[key].push(rec);
    });
    // Формируем иерархию
    return Object.entries(groups).map(([key, items]) => {
      const children = this.groupData(items, rest);
      const quantityTotal = children.reduce((sum, child) => sum + (child.quantityTotal ?? child.quantity), 0);
      return {
        groupField: field,
        groupKey: key,
        items,
        children,
        quantityTotal
      };
    });
  }

  // Группированные данные для отчёта
  get groupedData() {
    return this.groupData(this.filteredData, this.groupBy);
  }
}

export const reportStore = new ReportStore(); 