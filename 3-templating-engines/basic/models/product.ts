const products: {
  title: string;
}[] = [];

module.exports = class Product {
  title: string;

  constructor(title: string) {
    this.title = title;
  }

  save() {
    products.push(this);
  }

  static fetchAll() {
    return products;
  }
};
