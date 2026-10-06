import { IBuyer, TPayment, Valid } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = "";
  private phone: string = "";
  private email: string = "";

  constructor(protected events: IEvents) {}

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit("buyer:change");
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit("buyer:change");
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit("buyer:change");
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit("buyer:change");
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment!,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clearData(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
    this.events.emit("buyer:change");
  }

  validate(): Valid {
    const errors: Valid = {};

    if (!this.payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this.address.trim()) {
      errors.address = "Не указан адрес";
    }

    if (!this.email.trim()) {
      errors.email = "Email не указан";
    }

    if (!this.phone.trim()) {
      errors.phone = "Телефон не указан";
    }

    return errors;
  }
}
