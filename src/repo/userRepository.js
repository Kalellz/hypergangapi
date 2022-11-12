import { con } from './connection.js'

export async function logup(nome, sobrenome, email, senha){
    const c = `
    INSERT INTO tb_usuario(nm_usuario, sbr_usuario, ds_email, ds_senha, vr_admin)
        VALUES(?, ?, ?, ?, 0);`

    const [resp] = await con.query(c, [nome, sobrenome, email, senha])
    return resp;
}
export async function alterimage(image, id){
    const c = `
    UPDATE  tb_usuario
    SET     img_icon =      ?
    WHERE   id_usuario =    ?`

    const [resp] = await con.query(c, [image, id])
    return resp.affectedRows;
}
export async function login(email, senha){
    const c = `
    SELECT 		id_usuario 	        id,
                nm_usuario          nome,
                sbr_usuario         sobrenome,
                ds_email            email,
                ds_senha            senha,
                vr_admin			admin,
                img_icon            imagem
        FROM    tb_usuario
        WHERE   ds_email =          ?
        AND     ds_senha   =        ?`

    const [resp] = await con.query(c, [email, senha])
    return resp[0];
}
export async function verifUserEmail(email) {
	const c = `
        SELECT ds_email FROM tb_usuario WHERE ds_email = ?;
        `;
	const [res] = await con.query(c, [email]);
	return res[0];
}
export async function showUser(id) {
	const c = `
        SELECT * FROM tb_usuario WHERE id_usuario = ?;
        `;
	const [res] = await con.query(c, [id]);
	return res[0];
}
export async function alterUser(id, user){
	const comando = `
    UPDATE tb_usuario 
    SET 	nm_usuario    	= ?,
            sbr_usuario    	= ?,
            ds_email      	= ?,
            ds_senha		= ?
    WHERE 	id_usuario 		= ?`

	const [linhas] = await con.query(comando, [user.nome, user.sobrenome, user.email, user.senha, id])
	return linhas.affectedRows
}
