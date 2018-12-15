import { cond } from '../shared/shared.functions';
import { EColumns } from './columns.enum';

export const getDisplayColumnToProductsTable = (column: EColumns) =>
  cond([
    [
      column === EColumns.SELECT,
      () => {
        return 'select';
      }
    ],
    [
      column === EColumns.UPC,
      () => {
        return 'upc';
      }
    ],
    [
      column === EColumns.NAME,
      () => {
        return 'name';
      }
    ],
    [
      column === EColumns.DESCRIPTION,
      () => {
        return 'description';
      }
    ],
    [
      column === EColumns.FORMAT,
      () => {
        return 'format';
      }
    ],
    [
      column === EColumns.QUANTITY,
      () => {
        return 'quantity';
      }
    ],
    [
      column === EColumns.PRICE,
      () => {
        return 'price';
      }
    ],
    [
      column === EColumns.DISCOUNT,
      () => {
        return 'discount';
      }
    ],
    [
      column === EColumns.SUBTOTAL,
      () => {
        return 'subTotal';
      }
    ],
    [
      column === EColumns.ACTIONS,
      () => {
        return 'actions';
      }
    ],
    [
      column === EColumns.AMOUNT,
      () => {
        return 'amount';
      }
    ]
  ]);

export const getDisplayColumnsToProductsTable = (columns: EColumns[]) =>
  columns.reduce((result, col) => [...result, getDisplayColumnToProductsTable(col)], []);

