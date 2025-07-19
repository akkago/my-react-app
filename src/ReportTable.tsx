import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { reportStore } from "./store/ReportStore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// Рекурсивный компонент для отображения группы или строки
const GroupRow: React.FC<{ node: any; level: number }> = ({ node, level }) => {
  const [open, setOpen] = useState(false);
  const isGroup = !!node.children;

  // Для отображения названия группы
  const getGroupLabel = () => {
    if (node.groupField === "client") {
      const rec = node.items[0];
      return `${node.groupKey} — ${rec.client.client_name}`;
    }
    if (node.groupField === "good") {
      const rec = node.items[0];
      return `${node.groupKey} — ${rec.good.good_name}`;
    }
    if (node.groupField === "batch") {
      if (node.groupKey === "(нет партии)") return node.groupKey;
      const rec = node.items[0];
      return `${node.groupKey} — ${rec.batch.supplier}`;
    }
    return node.groupKey;
  };

  return (
    <>
      <TableRow>
        <TableCell style={{ paddingLeft: level * 24, width: 48 }}>
          {isGroup && (
            <IconButton size="small" onClick={() => setOpen(o => !o)}>
              {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell colSpan={isGroup ? 2 : 1}>
          {isGroup ? (
            <b>{getGroupLabel()}</b>
          ) : (
            <>
              {node.good.good_name}
              {node.batch && (
                <Typography variant="caption" color="text.secondary" ml={1}>
                  (Партия: {node.batch.batch_id})
                </Typography>
              )}
            </>
          )}
        </TableCell>
        <TableCell align="right">
          <b>{node.quantityTotal}</b>
        </TableCell>
      </TableRow>
      {isGroup && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={0}>
                {node.children.map((child: any, idx: number) => (
                  <GroupRow key={idx} node={child} level={level + 1} />
                ))}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export const ReportTable: React.FC = observer(() => {
  const data = reportStore.groupedData;

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 48 }} />
            <TableCell>Группа / Товар</TableCell>
            <TableCell align="right">Количество</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((node: any, idx: number) => (
            <GroupRow key={idx} node={node} level={0} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}); 