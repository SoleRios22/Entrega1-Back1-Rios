//const fs= require("fs/promises");
import { promises as fs } from "fs";





class ProductManager {
  constructor(filePath) {
    this.path = filePath; // ruta al archivo JSON
  }

  // Método privado para leer archivo
  async #readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
         throw error;
    }
  }

  // Método privado para escribir archivo
  async #writeFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error escribiendo el archivo:", error);
    }
  }

  // Agregar producto
  async addProduct(product) {
    try{
    const products = await this.#readFile();
    

    // Validar campos obligatorios
    const { title, description, price, thumbnail, stock , status, category} = product;
    if (!title || !description || !price || !thumbnail || !stock || !status || !category) {
      console.log("Todos los campos son obligatorios");
    }
  // Validar que el código no se repita
  /*  const exists = products.find((p) => p.id === id);
    if (exists) {
      console.log("El código ya existe");
    }*/
 

    // Generar id autoincremental
    const newProduct = {
      id: products.length > 0 ? parseInt(products[products.length - 1].id) + 1 : 1,
      status:true,
      ...product,
    };
    console.log("Nuevo producto creado:", newProduct.id);

    products.push(newProduct);
    await this.#writeFile(products);
    return newProduct;
    
    } catch (error) {
        console.log("Error al crear el producto:", error);
        }
    }

  // Obtener todos los productos
  async getProducts() {
    try{
         return await this.#readFile();
    }catch (error) {
        console.log("Error al obtener los productos:", error);
    }   
  }




  // Buscar producto por id
  async getProductById(id) {
    try{
        const products = await this.#readFile();
        const product = products.find((p) => p.id === id);
        if(!product){
            console.log("Producto no encontrado!");
            return;
            }
        return product ;
        }
        catch (error) {
            console.log("Error al obtener el producto:", error);
        }   
  }

  // Actualizar producto por id
  async updateProduct(id, updatedFields) {
    try{
        const products = await this.#readFile();
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) {
            console.log("Producto no encontrado");
        }

        products[index] = { ...products[index], ...updatedFields, id };
        await this.#writeFile(products);
        return products[index];

    }catch (error) {
        console.log("Error al actualizar el producto:", error);
        }
  }

  //  Eliminar producto por id
  async deleteProduct(id) {
    try{
        const products = await this.#readFile();
        const filtered = products.filter((p) => p.id !== id);

        if (products.length === filtered.length) {
            console.log("Producto no encontrado11");
            return false;
        }

        await this.#writeFile(filtered);
        return true;
    }catch(error){
    console.log("Error al eliminar el producto:", error);
  }
}}

export default ProductManager;

/*const prueba= new ProductManager(filePath);

prueba.addProduct({
  title: "Producto de prueba",
  description: "Este es un producto de prueba",
  price: 100,
  thumbnail: "sin imagen",
  id: "6",
  stock: 50,
  status:true,
  category:"prueba"
});*/