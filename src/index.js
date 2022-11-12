import 'dotenv/config';
import productRepository from './controller/productController.js'
import userController from './controller/userController.js'

import express from 'express';
import cors from 'cors';

const server = express();
server.use(cors());
server.use(express.json())
server.use('/storage/userIcon', express.static('storage/userIcon'))
server.use('/storage/productsIcon', express.static('storage/productsIcon'))
server.use(productRepository)
server.use(userController)
server.listen(process.env.PORT,
    () => console.log(`API online na porta ${process.env.PORT}`));