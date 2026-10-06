import "./scss/styles.scss";

import { CatalogProducts } from "./components/Models/CatalogProducts";
import { CartProducts } from "./components/Models/CartProducts";
import { Buyer } from "./components/Models/Buyer";
import { OrderService } from "./components/Models/OrderService";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Header } from "./components/View/Header";
import { Gallery } from "./components/View/Gallery";
import { Modal } from "./components/View/Modal";
import { Success } from "./components/View/Success";
import { CardCatalog } from "./components/View/CardCatalog";
import { CardPreview } from "./components/View/CardPreview";
import { CardBasket } from "./components/View/CardBasket";
import { Basket } from "./components/View/Basket";
import { Order } from "./components/View/Order";
import { Contacts } from "./components/View/Contacts";
import { EventEmitter } from "./components/base/Events";
import { IGetProductsResponse, IOrderRequest, IBuyer, TPayment } from "./types";

const events = new EventEmitter();
const catalog = new CatalogProducts(events);
const cart = new CartProducts([], events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const orderService = new OrderService(api);
const header = new Header(ensureElement(".header"), events);
const gallery = new Gallery(ensureElement(".gallery"));
const modal = new Modal(ensureElement("#modal-container"), events);
const success = new Success(cloneTemplate("#success"), events);
const preview = new CardPreview(cloneTemplate("#card-preview"), events);
const basket = new Basket(cloneTemplate("#basket"), events);
const order = new Order(cloneTemplate("#order"), events);
const contacts = new Contacts(cloneTemplate("#contacts"), events);

orderService
  .getProducts() // запрос к серверу
  .then((data: IGetProductsResponse) => {
    console.log("Данные, полученные с сервера:", data);
    catalog.setProducts(data.items); // сохранение массива
  })
  .catch((error) => {
    console.error("Ошибка при получении товара", error); // сообщение об ошибке
  });

events.on("catalog:change", () => {
  const items = catalog.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), events);
    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      category: item.category,
      image: `${CDN_URL}${item.image}`,
    });
  });
  gallery.render({ items });
});

events.on<{ id: string }>("card__catalog:click", ({ id }) => {
  const product = catalog.getProductById(id);
  if (product) catalog.setSelectedProduct(product);
});

events.on("card:selected", () => {
  const product = catalog.getSelectedProduct();

  if (!product) {
    return;
  }

  let textButton = "";
  if (product.price === null) {
    textButton = "Недоступно";
  } else {
    textButton = cart.hasProduct(product.id) ? "Удалить из корзины" : "Купить";
  }
  preview.button = textButton;

  modal.render({
    content: preview.render({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      image: `${CDN_URL}${product.image}`,
    }),
  });

  modal.openModal();
});

events.on("buyer:change", () => {
  const errors = buyer.validate();

  const data = buyer.getBuyerData();
  if (data) {
    order.payment = data.payment || null;
    order.address = data.address || "";
    contacts.email = data.email || "";
    contacts.phone = data.phone || "";
  }

  const orderErrors = [];
  if (errors.payment) orderErrors.push(errors.payment);
  if (errors.address) orderErrors.push(errors.address);
  order.error = orderErrors.join(", ");
  order.buttonStatus = orderErrors.length > 0;

  const contactErrors = [];
  if (errors.email) contactErrors.push(errors.email);
  if (errors.phone) contactErrors.push(errors.phone);
  contacts.error = contactErrors.join(", ");
  contacts.buttonStatus = contactErrors.length > 0;
});

events.on("card__preview:click", () => {
  const product = catalog.getSelectedProduct();

  if (!product) return;

  if (cart.hasProduct(product.id)) {
    cart.removeSelectedProducts(product.id);
  } else {
    cart.addSelectedProducts(product);
  }

  modal.closeModal();
});

events.on("basket:open", () => {
  header.counter = cart.getTotalCount();
  const cartShopItems = cart.getSelectedProducts().map((item, index) => {
    const cardBasket = new CardBasket(cloneTemplate("#card-basket"), events);

    cardBasket.index = index + 1;
    cardBasket.title = item.title;
    cardBasket.price = item.price;

    return cardBasket.render(item);
  });

  basket.basket = cartShopItems;
  basket.total = cart.getTotalPrice();

  modal.openModal();
  modal.render({ content: basket.render() });
});

events.on<{ id: string }>("basket__item:remove", ({ id }) =>
  cart.removeSelectedProducts(id),
);

events.on("cart:change", () => {
  header.counter = cart.getTotalCount();
  const cartShopItems = cart.getSelectedProducts().map((item, index) => {
    const cardBasket = new CardBasket(cloneTemplate("#card-basket"), events);

    cardBasket.index = index + 1;
    cardBasket.title = item.title;
    cardBasket.price = item.price;

    return cardBasket.render(item);
  });

  basket.basket = cartShopItems;
  basket.total = cart.getTotalPrice();
});

events.on("basket:checkout", () => {
  order.error = "";

  modal.render({ content: order.render() });
});

events.on<{ field: keyof IBuyer; value: string }>(
  "form:change",
  ({ field, value }) => {
    switch (field) {
      case "payment":
        buyer.setPayment(value as TPayment);
        break;
      case "address":
        buyer.setAddress(value);
        break;
      case "email":
        buyer.setEmail(value);
        break;
      case "phone":
        buyer.setPhone(value);
        break;
    }
  },
);

events.on("order:submit", () => {
  contacts.error = "";
  modal.render({ content: contacts.render() });
});

events.on("contacts:submit", () => {
  const data = buyer.getBuyerData();
  if (!data.payment) return;

  const request: IOrderRequest = {
    ...data,
    payment: data.payment,
    total: cart.getTotalPrice(),
    items: cart
      .getSelectedProducts()
      .filter((p) => p.price !== null)
      .map((p) => p.id),
  };

  orderService
    .sendOrder(request)
    .then((result) => {
      cart.clearCart();
      buyer.clearData();
      modal.render({ content: success.render({ total: result.total }) });
    })
    .catch((error) => console.error("Ошибка оформления заказа", error));
});

events.on("success:agree", () => {
  modal.closeModal();
});