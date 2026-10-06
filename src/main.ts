import "./scss/styles.scss";

import { CatalogProducts } from "./components/Models/CatalogProducts";
import { CartProducts } from "./components/Models/CartProducts";
import { Buyer } from "./components/Models/Buyer";
import { OrderService } from "./components/services/OrderService";
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
import { IGetProductsResponse, IOrderRequest } from "./types";
import { TFormChange } from "./components/View/Form";

const events = new EventEmitter();
const catalog = new CatalogProducts(events);
const cart = new CartProducts(events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const orderService = new OrderService(api);
const header = new Header(ensureElement(".header"), events);
const gallery = new Gallery(ensureElement(".gallery"));
const modal = new Modal(ensureElement("#modal-container")); //, events);
const success = new Success(cloneTemplate("#success"), events);
const preview = new CardPreview(cloneTemplate("#card-preview"), events);
const basket = new Basket(cloneTemplate("#basket"), events);
const order = new Order(cloneTemplate("#order"), events);
const contacts = new Contacts(cloneTemplate("#contacts"), events);

orderService
  .getProducts() // запрос к серверу
  .then((data: IGetProductsResponse) => {
    catalog.setProducts(data.items); // сохранение массива
  })
  .catch((error) => {
    console.error("Ошибка при получении товара", error); // сообщение об ошибке
  });

events.on("catalog:change", () => {
  const items = catalog.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), () =>
      events.emit("card__catalog:click", { id: item.id }),
    );
    return card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: { src: `${CDN_URL}${item.image}`, alt: item.title },
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

  const textButton = product.price === null;

  modal.render({
    content: preview.render({
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      image: `${CDN_URL}${product.image}`,
      button: textButton
        ? "Недоступно"
        : cart.hasProduct(product.id)
          ? "Удалить из корзины"
          : "Купить",
      buttonDisabled: textButton,
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

  const orderErrors = [errors.payment, errors.address].filter(Boolean);
  const contactErrors = [errors.email, errors.phone].filter(Boolean);

  order.render({
    payment: data.payment,
    address: data.address,
    error: orderErrors.join(", "),
    buttonStatus: orderErrors.length > 0,
  });

  contacts.render({
    email: data.email,
    phone: data.phone,
    error: contactErrors.join(", "),
    buttonStatus: contactErrors.length > 0,
  });
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
  modal.openModal();
  modal.render({ content: basket.render() });
});

events.on<{ id: string }>("basket__item:click", ({ id }) =>
  cart.removeSelectedProducts(id),
);

events.on("cart:change", () => {
  header.counter = cart.getTotalCount();
  const cartShopItems = cart.getSelectedProducts().map((item, index) => {
    const cardBasket = new CardBasket(cloneTemplate("#card-basket"), () =>
      events.emit("basket__item:click", { id: item.id }),
    );

    cardBasket.index = index + 1;
    cardBasket.title = item.title;
    cardBasket.price = item.price;

    return cardBasket.render({
      index: index + 1,
      title: item.title,
      price: item.price,
    });
  });

  basket.basket = cartShopItems;
  basket.total = cart.getTotalPrice();
  basket.buttonStatus = cart.getTotalCount() === 0;
});

events.on("basket:checkout", () => {
  const errors = buyer.validate();
  const orderErrors = [errors.payment, errors.address].filter(Boolean);
  modal.render({
    content: order.render({
      error: orderErrors.join(", "),
      buttonStatus: orderErrors.length > 0,
    }),
  });
});

events.on<TFormChange>("form:change", (data) => {
  switch (data.field) {
    case "payment":
      buyer.setPayment(data.value);
      break;
    case "address":
      buyer.setAddress(data.value);
      break;
    case "email":
      buyer.setEmail(data.value);
      break;
    case "phone":
      buyer.setPhone(data.value);
      break;
  }
});

events.on("order:submit", () => {
  const errors = buyer.validate();
  const contactErrors = [errors.email, errors.phone].filter(Boolean);
  modal.render({
    content: contacts.render({
      error: contactErrors.join(", "),
      buttonStatus: contactErrors.length > 0,
    }),
  });
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

cart.clearCart();
buyer.clearData();
