const fs=require("fs/promises");
const path= require("path");

const filePath= path.join(__dirname,"data", "carts.json");

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error){
      return [];
    }
  }

  async #writeFile(data) {
    try{
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }catch(error){
      console.error("Error escribiendo el archivo:", error);
    }
  }

  async createCart() {
    try{
      const carts = await this.#readFile();
      const newCart = {
        id: carts.length ? carts[carts.length - 1].id + 1 : 1,
        products: []
      };

      carts.push(newCart);
      await this.#writeFile(carts);
      return newCart;
    }catch(error){
      console.error("Error al crear el carrito:", error);
    }
  }

  async getCartById(id) {
    try{
      const carts = await this.#readFile();
      return carts.find(c => c.id === id);
    }catch(error){
      console.error("Error al obtener el carrito:", error);
    }
  }

  async addProductToCart(cartId, productId) {
    try{
      const carts = await this.#readFile();
      const cart = carts.find(c => c.id === cartId);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product === productId);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this.#writeFile(carts);
    return cart;
  }catch(error){
    console.error("Error al agregar el producto al carrito:", error);
  }
}
}
/*const prueba= new CartManager(filePath);

prueba.addProductToCart(1, 7);
prueba.getCartById(1).then(result => {
  console.log(result);  
});*/