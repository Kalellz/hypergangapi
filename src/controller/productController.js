import { createCategory, createProduct, alterimage ,alterimagecategory, listcategories, listproducts, searchProductsId, searchProductsName, alterProduct, deleteProduct } from "../repo/productRepository.js";
import { Router } from "express";
import multer from 'multer';
import { calcularPrecoPrazo,consultarCep, rastrearEncomendas } from 'correios-brasil';
const upload = multer({ dest : 'storage/productsIcon' })
const server = Router();

server.get('/products', async (req, resp) => {
    try{
        const resposta = await listproducts()
        resp.send(resposta)
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})
server.post('/category', async (req, resp) => {
    try{
        const categoria = req.body
		if(!categoria.nome) throw new Error('Nome da categoria é obrigatório!')

		const produtoinserido = await createCategory(categoria);
        resp.send(produtoinserido)

    } catch(err){
        resp.status(400).send({
            erro:err.message
        })
    }
})
server.post('/produto', async (req, resp) => {
    try{
        const product = req.body

		// verificações necessarias
		if(!product.nome.trim())
			throw new Error('Nome do produto é obrigatório!')
		if(!product.idcategoria)
			throw new Error('Categoria do produto é obrigatório!')
		if(!product.descricao.trim())
			throw new Error('Descrição do produto é obrigatório!')
		if(!product.preco)
			throw new Error('Preço do produto é obrigatório!')

		if(product.preco < 0) 
			throw new Error('Digite um preço válido')

		if(product.nome.length > 80)
			throw new Error('Nome excede o tamanho permitido')
		if(product.descricao.length > 200)
			throw new Error('Descrição excede o tamanho permitido')
		if(product.preco.length > 15)
			throw new Error('Preço excede o tamanho permitido')
			
		const produtoinserido = await createProduct(product);
        resp.send(produtoinserido)

    } catch(err){
        resp.status(400).send({
            erro:err.message
        })
    }
})
server.get('/product/category', async (req, resp) => {
    try{
        const resposta = await listcategories()
        resp.send(resposta)
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})
server.put('/product/:id/imagem', upload.single('capa'), async (req, resp) => {
    try{
        const { id } = req.params;
        const image = req.file.path;

        const resposta = await alterimage(image, id)
        if(resposta != 1) throw new Error('A imagem não pode ser salva.')
        resp.status(204).send()
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})
server.put('/product/category/:id/imagem', upload.single('capa'), async (req, resp) => {
    try{
        const { id } = req.params;
        const image = req.file.path;

        const resposta = await alterimagecategory(image, id)
        if(resposta != 1) throw new Error('A imagem não pode ser salva.')
        resp.status(204).send()
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})
server.get('/product/search', async (req, resp) => {
    try{
        const {name, category} = req.query
        const resposta = await searchProductsName(name, category)
        resp.send(resposta)
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})
server.get('/product/search/:id', async (req, resp) => {
    try{
        const {id} = req.params
        const resposta = await searchProductsId(id)
        resp.send(resposta)
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})
server.put('/product/:id', async (req, resp) => {
    try{
        const { id } = req.params;
        const product = req.body;

        if(!product.nome.trim())
			throw new Error('Nome do produto é obrigatório!')
		if(!product.idcategoria)
			throw new Error('Categoria do produto é obrigatório!')
		if(!product.descricao.trim())
			throw new Error('Descrição do produto é obrigatório!')
		if(!product.preco)
			throw new Error('Preço do produto é obrigatório!')

		if(product.preco < 0) 
			throw new Error('Digite um preço válido')

		if(product.nome.length > 80)
			throw new Error('Nome excede o tamanho permitido')
		if(product.descricao.length > 200)
			throw new Error('Descrição excede o tamanho permitido')
		if(product.preco.length > 15)
			throw new Error('Preço excede o tamanho permitido')

        const r = await alterProduct(id, product)
        resp.send(r)
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.delete('/product/:id', async (req, resp) => {
    try{
        const { id } = req.params;
        const r = await deleteProduct(id)
        if(r != 1) throw new Error('Produto não pode ser removido')
        resp.status(204).send()
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/correio/:cep', async (req, resp) => {
    try{
    const { cep } = req.params
    let args = {
    sCepOrigem: '04816070',
    sCepDestino: cep,
    nVlPeso: '1',
    nCdFormato: '1',
    nVlComprimento: '20',
    nVlAltura: '20',
    nVlLargura: '20',
    nCdServico: ['04014', '04510'],
    nVlDiametro: '0',
    };
    calcularPrecoPrazo(args).then(response => {
    resp.send(response);
});
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/correio/busca/:cep', async (req, resp) => {
    try{
    const { cep } = req.params
    consultarCep(cep).then(response => {
        resp.send(response.data);
      });
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})
export default server;