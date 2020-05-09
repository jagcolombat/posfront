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
}
