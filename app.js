import express from "express";//const express = require("express");
const app = express();
import ProductManager from "./ProductManager.js";
//const fs = require("fs/promises");
import { promises as fs } from "fs";

import CartManager from "./CartManager.js";
import { parse } from "path";




app.use(express.json());
const PORT = 8080;

const productos = new ProductManager("./data/products.json");
const carritos = new CartManager("./data/carts.json");

//Rutas Productos

//GET /api/products
app.get("/api/products", async (req, res) => {
    try{
        const allProducts = await productos.getProducts();
        res.json(allProducts);
    }catch(error){
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

//GET /api/products/:pid
app.get("/api/products/:pid", async (req, res) => {
    try{
        const product = await productos.getProductById(parseInt(req.params.pid));
        if(!product){
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    }catch(error){
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

//POST /api/products
app.post("/api/products", async (req, res) => {
    try{
        const newProduct = req.body;
        await productos.addProduct(newProduct);
        res.status(201).json(newProduct);
    }catch(error){
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

//PUT /api/products/:pid
app.put("/api/products/:pid", async (req, res) => {
    try{
        const updatedProduct = req.body;
        const product = await productos.updateProduct(parseInt(req.params.pid), updatedProduct);
        if(!product){
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    }catch(error){
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

//DELETE /api/products/:pid
app.delete("/api/products/:pid", async (req, res) => {
    try{
        const deletedProduct = await productos.deleteProduct(parseInt(req.params.pid));
        if(!deletedProduct){
            return res.status(404).json({ error: "Producto no encontrado 22" });
        }
        res.json({ message: "Producto eliminado" });
    }catch(error){
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

//Rutas Carritos

//GET /api/carts/:cid
app.get("/api/carts/:cid", async (req, res) => {
    try{
        const cart = await carritos.getCartById(parseInt(req.params.cid));
        if(!cart){
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(cart);
    }catch(error){
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});


//POST /api/carts
app.post("/api/carts", async (req, res) => {
    try{
        const newCart = await carritos.createCart();
        res.status(201).json(newCart);
    }catch(error){
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

//POST /api/carts/:cid/product/:pid
app.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try{
        const { cid, pid } = req.params;
        const cart = await carritos.getCartById(parseInt(cid));
        const product = await productos.getProductById(parseInt(pid));
        if(!cart){
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        if(!product){
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        await carritos.addProductToCart(cart.id, product.id);
        res.status(201).json({ message: "Producto agregado al carrito" });
    }catch(error){
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});