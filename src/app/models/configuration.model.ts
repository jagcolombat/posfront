import {CompanyType} from "../utils/company-type.enum";

export interface Configuration {
  posNumber?: number;
  allowClear?: boolean;
  allowAddMiscellany?: boolean;
  companyType?: CompanyType;
  externalScale?: boolean;
  allowCardSplit?: boolean;
  fullRefund?: boolean;
  allowEBT?: boolean;
}
