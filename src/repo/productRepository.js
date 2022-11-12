import { con } from './connection.js'

export async function listproducts(){
    const c = `
    SELECT * FROM tb_produto;
    `
    const [resp] = await con.query(c)
    return resp
}
export async function createProduct(product){
    const c = `
    INSERT INTO tb_produto(nm_produto, ds_produto, vl_produto, qnt_produto, id_categoria)
        VALUES (?, ?, ?, ?, ?);
    `
    const [resp] = await con.query(c, [product.nome, product.descricao, product.preco, product.quantidade, product.idcategoria ])
    product.id = resp.insertId
    return product
}
export async function createCategory(categoria){
    const c = `
    INSERT INTO tb_categoria(nm_categoria)
    VALUES (?);
    `
    const [resp] = await con.query(c, [categoria.nome])
    categoria.id = resp.insertId
    return categoria
}

export async function alterimage(image, id){
    const c = `
    UPDATE  tb_produto
    SET     img_produto =      ?
    WHERE   id_produto =    ?`

    const [resp] = await con.query(c, [image, id])
    return resp.affectedRows;
}
export async function listcategories(){
    const c = `
    SELECT * FROM tb_categoria;
    `
    const [resp] = await con.query(c)
    return resp
}
export async function alterimagecategory(image, id){
    const c = `
    UPDATE  tb_categoria
    SET     img_categoria =      ?
    WHERE   id_categoria =    ?`

    const [resp] = await con.query(c, [image, id])
    return resp.affectedRows;
}
export async function searchProductsName(name, category){
    const c = `
    SELECT * FROM   tb_produto 
    WHERE           nm_produto LIKE ?
    AND (? = '0' OR id_categoria = ?);
    `
    
    const [resp] = await con.query(c, [`%${name}%`, category, category])
    return resp;
}
export async function searchProductsId(id){
    const c = `
    SELECT * FROM tb_produto
    WHERE id_produto = ?
    `
    
    const [resp] = await con.query(c, [id])
    return resp;
}
export async function alterProduct(id, produto){
    const c = `
    UPDATE  tb_produto
    SET     nm_produto      = ?,
            ds_produto      = ?,
            vl_produto      = ?,
            qnt_produto     = ?,
            id_categoria    = ?
    WHERE   id_produto      = ?`

    const [resp] = await con.query(c, [produto.nome, produto.descricao, produto.preco, produto.quantidade, produto.idcategoria, id])
    return produto;
}
export async function deleteProduct(id){
    const c = `
    DELETE FROM tb_produto
    WHERE       id_produto = ?`

    const [resp] = await con.query(c, [id])
    return resp.affectedRows;
}