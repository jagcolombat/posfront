import {CompanyType} from "../utils/company-type.enum";
import {BreakTextEnum} from "../utils/breaktext.enum";
import {PAXConnTypeEnum} from "../utils/pax-conn-type.enum";

export interface Configuration {
  posNumber?: number;
  allowClear?: boolean;
  allowAddMiscellany?: boolean;
  companyType?: CompanyType;
  externalScale?: boolean;
  allowCardSplit?: boolean;
  fullRefund?: boolean;
  allowEBT?: boolean;
  breakText?: BreakTextEnum;
  paxTimeout?: number;
  allowAddProdGen?: boolean;
  paxConnType?: PAXConnTypeEnum;
  inactivityTime?: number;
  closeChange?: boolean;
  allowGiftCard?: boolean;
  allowLastProdClear?: boolean;
  allowPromotion?: boolean;
  allowFoodStampMark?: boolean;
  allowApplyDiscount?: boolean;
  allowClock?: boolean;
  allowChangePrice?: boolean;
  changePriceBySelection?: boolean;
  closeAuth?: boolean;
  debitAsCreditCard?: boolean;
  closeDayAutomatic?: boolean;
  restartDayAutomatic?: boolean;
  printVoid?: boolean;
  printHold?: boolean;
  printInitTicket?: boolean;
  printMerchantTicket?: boolean;
  printTicket?: boolean;
}
