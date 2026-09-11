import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { CatalogProducts } from './components/Models/CatalogProducts';
import { CartProducts } from './components/Models/CartProducts';
import { Buyer } from './components/Models/Buyer';
import { OrderService } from './components/Models/OrderService';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// методы класса CatalogProducts
const catalog = new CatalogProducts();
catalog.setProducts(apiProducts.items); // сохранение массива товаров
console.log("Массив товаров из каталога: ", catalog.getProducts()); // получение массива товаров

const product =  catalog.getProductById(apiProducts.items[2].id);
console.log('Товар по ID:', product); // получение одного товара по id

if (product) {
  catalog.setSelectedProduct(product);
}
console.log('Выбранный товар', catalog.getSelectedProduct()); // сохранение товара для подробного оторбражение

// методы класса CartProducts
const cart = new CartProducts([]);
console.log("Массив товаров из корзины: ", cart.getSelectedProducts()); // получение массива товара из корзины

cart.addSelectedProducts(apiProducts.items[1]); // добавление товара в корзину
cart.addSelectedProducts(apiProducts.items[2]); // добавление товара в корзину
cart.addSelectedProducts(apiProducts.items[3]); // добавление товара в корзину
console.log("Новый массив товаров из корзины: ", cart.getSelectedProducts());

console.log("Стоимость товаров в корзине:", cart.getTotalPrice()); // получение стоимости всех товаров

console.log("Количество товаров в корзине:", cart.getTotalCount()); // получение количества товаров в корзине

console.log("Наличие товара в корзине:", cart.hasProduct(apiProducts.items[3].id)); // проверить наличие товара в корзине

cart.removeSelectedProducts(apiProducts.items[1].id); // удаление товара из корзины
console.log("Массив товаров из корзины после удаления одного товара: ", cart.getSelectedProducts());

cart.clearCart(); // очистка корзины
console.log("Массив товаров после очистки корзины: ", cart.getSelectedProducts());

console.log("Стоимость товаров в корзине после очистки:", cart.getTotalPrice()); // получение стоимости всех товаров

console.log("Количество товаров в корзине после очистки:", cart.getTotalCount()); // получение количества товаров в корзине

console.log("Наличие товара в корзине после очистки:", cart.hasProduct(apiProducts.items[3].id)); // проверить наличие товара в корзине

// методы класса Buyer
const buyer = new Buyer;
buyer.setAddress("г. Сургут"); // сохранение данных об адресе
buyer.setEmail("ya@ya.ru"); // сохранение данных об электронной почте
buyer.setPayment("card"); // сохранение данных о способе оплаты
buyer.setPhone("+7 982"); // сохранение данных о номере телефона

console.log("Данные покупателя: ", buyer.getBuyerData()); // получение данных покупателя

buyer.clearData(); // очистка данных
console.log("Данные покупателя: ", buyer.getBuyerData());
console.log("Валидация", buyer.validate()); // валидация данных

// работа с api и классов OrderService
const api = new Api(API_URL);
console.log('api:', api);
console.log('api.get:', api.get);
const orderService = new OrderService(api);

orderService.getProducts() // запрос к серверу
  .then((data) => {
    console.log('Данные полученные с сервера', data);

    catalog.setProducts(data); // сохранение массива

    console.log('Массив товаров из каталога:', catalog.getProducts()); // вывод массива в консоль
  })
  .catch((error) => {
    console.error('Ошибка при получении товара', error); // сообщение об ошибки
  })