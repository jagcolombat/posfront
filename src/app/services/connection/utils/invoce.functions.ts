import {Product} from '../../../models/index';
import {ProductFormat} from './product-format.enum';
import {InvoiceStatus} from './invoice-status.enum';
import {cond} from './shared.functions';


/*export const getTotal = (products: Product[]) => products.reduce((before, prd) => before + prd.subTotal, 0);
export const getAllSubtotal = (products: Product[]) =>
    products.reduce((before, prd) => before + prd.unitCost * prd.quantity, 0);

const getDiscount = (total: number, discount: number) => (discount ? (discount * total) / 100 : 0);

const computeTotal = (discountFn: (total: number, discount: number) => number) => (
    total: number,
    globalDiscount: number,
    clientDiscount: number
) => {
    const globalD = discountFn(total, globalDiscount);
    const newTotal = total - globalD;
    const clientD = discountFn(newTotal, clientDiscount);
    return newTotal - clientD;
};

export const getTotalDisplay = computeTotal(getDiscount);

const computeDiscountForProduct = (discountFn: (value: number, total: number) => number) => (product: Product) => {
    const subTotal = product.price * product.quantity;
    return subTotal - discountFn(subTotal, product.discount);
};

export const getDiscountForProductDisplay = computeDiscountForProduct(getDiscount);

const computeSavedForProduct = (discountFn: (value: number, total: number) => number) => (product: Product) =>
    discountFn(product.quantity * product.price, product.discount);

export const getSavedForProduct = computeSavedForProduct(getDiscount);

export const getSavedForProducts = (products: Product[], savedProductFn: (product: Product) => number) =>
    products.reduce((total, prd) => total + savedProductFn(prd), 0);

export const valueToNumberFormat = (value: string) => {
    switch (value.toString()) {
        case '0':
            return ProductFormat.UNIT;
        case '1':
            return ProductFormat.PACKAGE;
    }
};

export const formatToNumber = (format: string) => {
    switch (format) {
        case ProductFormat.UNIT:
            return 0;
        case ProductFormat.PACKAGE:
            return 1;
    }
};*/

export const invoiceStatusToInt = (status: InvoiceStatus) =>
    cond([
        [
            status === InvoiceStatus.IN_PROGRESS,
            () => {
                return 0;
            }
        ],
        [
            status === InvoiceStatus.PENDENT_FOR_AUTHORIZATION,
            () => {
                return 1;
            }
        ],
        [
            status === InvoiceStatus.PENDENT_FOR_PAYMENT,
            () => {
                return 2;
            }
        ],
        [
            status === InvoiceStatus.PAID,
            () => {
                return 3;
            }
        ],
        [
            status === InvoiceStatus.CANCEL,
            () => {
                return 4;
            }
        ]
    ]);

/*export const intToInvoiceStatus = (status: number) =>
    cond([
        [
            status === 0,
            () => {
                return InvoiceStatus.IN_PROGRESS;
            }
        ],
        [
            status === 1,
            () => {
                return InvoiceStatus.PENDENT_FOR_AUTHORIZATION;
            }
        ],
        [
            status === 2,
            () => {
                return InvoiceStatus.PENDENT_FOR_PAYMENT;
            }
        ],
        [
            status === 3,
            () => {
                return InvoiceStatus.PAID;
            }
        ],
        [
            status === 4,
            () => {
                return InvoiceStatus.CANCEL;
            }
        ]
    ]);
*/
