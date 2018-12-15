import { CashModule } from './cash.module';

describe('CashModule', () => {
  let cashModule: CashModule;

  beforeEach(() => {
    cashModule = new CashModule();
  });

  it('should create an instance', () => {
    expect(cashModule).toBeTruthy();
  });
});
