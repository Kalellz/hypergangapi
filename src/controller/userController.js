import { login, logup, alterimage, verifUserEmail, showUser, alterUser } from "../repo/userRepository.js";
import { Router } from "express";
import multer from 'multer';

const upload = multer({ dest : 'storage/userIcon' })
const server = Router();

server.post("/user/logup", async (req, res) => {
	try {
		const {nome, sobrenome, email, senha} = req.body;
		const verif = await verifUserEmail(email);
		if (!verif) {
			const r = await logup(nome, sobrenome, email, senha);
			res.send(r);
		} else {
			throw new Error("E-mail já está em uso.");
		}
	} catch (err) {
		res.status(400).send({
			erro: err.message,
		});
	}
});
server.post('/user/login', async (req, resp) => {
    try{
        const {email, senha} = req.body;
        const resposta = await login(email, senha)
        if(!resposta){
            throw new Error('Credenciais inválidas')
        }
        resp.send(resposta)
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.put('/user/:id/imagem', upload.single('capa'), async (req, resp) => {
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
server.get('/user/:id', async (req, resp) => {
    try{
        const { id } = req.params
        const r = await showUser(id)
        resp.send(r)
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
}})
server.put('/user/:id', async (req, resp) => {
    try{
        const { id } = req.params
        const user = req.body
        const r = await alterUser(id, user)

        if(!user.nome.trim())
			throw new Error('Nome do usuario é obrigatório!')
        if(!user.sobrenome.trim())
			throw new Error('Sobrenome do usuario é obrigatório!')
        if(!user.email.trim())
			throw new Error('Email do usuario é obrigatório!')
        if(!user.senha.trim())
			throw new Error('Senha do usuario é obrigatório!')
        if (r != 1) 
			throw new Error('Usuario nao pôde ser alterado') 
        else 
			resp.status(204).send()
    } catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})
export default server;