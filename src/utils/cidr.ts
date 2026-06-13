import { Address4, Address6 } from "ip-address";

type IPAddress = Address4 | Address6;

function parseAddress(value: string): IPAddress | null {
  const trimmed = value.trim();
  if (Address4.isValid(trimmed)) return new Address4(trimmed);
  if (Address6.isValid(trimmed)) return new Address6(trimmed);
  return null;
}

function isValidCIDR(value: string): boolean {
  return value.includes("/") && parseAddress(value) !== null;
}

function isValidAddress(value: string): boolean {
  return parseAddress(value) !== null;
}

export default class CIDR {
  private readonly range: IPAddress;

  constructor(value: string) {
    const range = parseAddress(value);
    if (!range || !value.includes("/")) {
      throw new Error(`invalid CIDR range: ${value}`);
    }
    this.range = range;
  }

  contains(value: string): boolean {
    const address = parseAddress(value);
    if (!address) return false;
    if (this.range.constructor !== address.constructor) return false;

    const candidate = address.bigInt();
    return (
      candidate >= this.range.startAddress().bigInt() &&
      candidate <= this.range.endAddress().bigInt()
    );
  }

  static isValidAddress(value: string): boolean {
    return isValidAddress(value);
  }

  static isValidCIDR(value: string): boolean {
    return isValidCIDR(value);
  }
}
