import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { CatalogProducts } from './components/base/Models/CatalogProducts';
import { CartProducts } from './components/base/Models/CartProducts';
import { Buyer } from './components/base/Models/Buyer';



const catalog = new CatalogProducts([], null);
catalog.setProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", catalog.getProducts());

const cart = new CartProducts([]);
cart.addSelectedProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", cart.getSelectedProducts());

const buyers = new Buyer();
buyers.setPayment(apiProducts.items);
buyers.setAddress(apiProducts.items);
buyers.setPhone(apiProducts.items);
buyers.setEmail(apiProducts.items);
console.log("Массив товаров из каталога: ", buyers.getBuyerData());