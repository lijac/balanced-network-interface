import BigNumber from 'bignumber.js';
import { IconAmount, IconConverter } from 'icon-sdk-js';

import { ResponseJsonRPCPayload } from '..';
import addresses from '../addresses';
import ContractSettings from '../contractSettings';
import { Contract } from './contract';

export default class Dex extends Contract {
  constructor(contractSettings: ContractSettings) {
    super(contractSettings);
    this.address = addresses[this.nid].dex;
  }

  getPrice(pid: number) {
    const callParams = this.paramsBuilder({
      method: 'getPrice',
      params: {
        _pid: IconConverter.toHex(pid),
      },
    });

    return this.call(callParams);
  }

  async add(
    baseValue: BigNumber,
    quoteValue: BigNumber,
    baseToQuoteRatio: BigNumber,
    _baseToken: string,
    _quoteToken: string,
  ): Promise<ResponseJsonRPCPayload> {
    const calculatedQuoteValue = baseValue.multipliedBy(baseToQuoteRatio);
    const calculatedBaseValue = quoteValue.multipliedBy(new BigNumber(1).dividedBy(baseToQuoteRatio));
    let hexBasePrice = '';
    let hexQuotePrice = '';

    if (calculatedBaseValue.toString().length > calculatedQuoteValue.toString().length) {
      hexBasePrice = IconConverter.toHex(IconAmount.of(baseValue.toNumber(), IconAmount.Unit.ICX).toLoop());
      hexQuotePrice = IconConverter.toHex(IconAmount.of(calculatedQuoteValue.toNumber(), IconAmount.Unit.ICX).toLoop());
    } else {
      hexBasePrice = IconConverter.toHex(
        IconAmount.of(calculatedBaseValue.toFormat(17, BigNumber.ROUND_UP), IconAmount.Unit.ICX).toLoop(),
      );
      hexQuotePrice = IconConverter.toHex(IconAmount.of(quoteValue.toNumber(), IconAmount.Unit.ICX).toLoop());
    }

    alert('input: ' + baseValue);
    alert('hex input: ' + hexBasePrice);
    alert('output: ' + quoteValue);
    alert('hex output: ' + hexQuotePrice);
    const params = {
      _baseToken: _baseToken,
      _quoteToken: _quoteToken,
      _maxBaseValue: hexBasePrice,
      _quoteValue: hexQuotePrice,
    };
    const payload = this.transactionParamsBuilder({
      method: 'add',
      params,
    });
    console.log(payload);
    return this.callIconex(payload);
  }

  getDeposit(tokenAddress: string) {
    const callParams = this.paramsBuilder({
      method: 'getDeposit',
      params: {
        _tokenAddress: tokenAddress,
        _user: this.account,
      },
    });

    return this.call(callParams);
  }

  balanceOf(pid: number) {
    const callParams = this.paramsBuilder({
      method: 'balanceOf',
      params: {
        _owner: this.account,
        _id: IconConverter.toHex(pid),
      },
    });
    return this.call(callParams);
  }

  totalSupply(pid: number) {
    const callParams = this.paramsBuilder({
      method: 'totalSupply',
      params: {
        _pid: IconConverter.toHex(pid),
      },
    });

    return this.call(callParams);
  }

  getPoolTotal(pid: number, tokenAddress: string) {
    const callParams = this.paramsBuilder({
      method: 'getPoolTotal',
      params: {
        _pid: IconConverter.toHex(pid),
        _token: tokenAddress,
      },
    });

    return this.call(callParams);
  }

  transferICX(value: BigNumber) {
    const payload = this.transferICXParamsBuilder({
      value: value,
    });

    return this.callIconex(payload);
  }

  getICXBalance() {
    const callParams = this.paramsBuilder({
      method: 'getICXBalance',
      params: {
        _address: this.account,
      },
    });

    return this.call(callParams);
  }

  getICXWithdrawLock() {
    const callParams = this.paramsBuilder({
      method: 'getICXWithdrawLock',
    });

    return this.call(callParams);
  }

  cancelSicxIcxOrder() {
    const payload = this.transactionParamsBuilder({
      method: 'cancelSicxicxOrder',
    });

    return this.callIconex(payload);
  }

  // This method can withdraw up to a user's holdings in a pool, but it cannot
  // be called if the user has not passed their withdrawal lock time period.
  remove(pid: number, value: BigNumber) {
    const valueHex = IconConverter.toHex(IconAmount.of(value.toNumber(), IconAmount.Unit.ICX).toLoop());
    const payload = this.transactionParamsBuilder({
      method: 'remove',
      params: {
        _pid: IconConverter.toHex(pid),
        _value: valueHex,
        _withdraw: '0x1',
      },
    });
    console.log(payload);
    return this.callIconex(payload);
  }

  getFees() {
    const callParams = this.paramsBuilder({
      method: 'getFees',
    });

    return this.call(callParams);
  }

  isEarningRewards(address: string, id: number) {
    const callParams = this.paramsBuilder({
      method: 'isEarningRewards',
      params: {
        _address: address,
        _id: IconConverter.toHex(id),
      },
    });

    return this.call(callParams);
  }
}
