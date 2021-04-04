import { productValidation } from '../config/validations';
import Product from '../models/product.model';

export async function addProduct(req, res) {
    try {
        let product = req.body;
        await productValidation(product);
        product.picture = req.file.filename;
        product.user = req.user.id;
        let data = await Product.create(product);
        return res.success('product added !', data);
    } catch (err) {
        return res.error("unable to add product!", err)
    }
}
export async function listProducts(req, res) {
    try {
        let data = await Product.find();
        return res.success('products!', data);
    } catch (err) {
        return res.error("unable to list products!", err)
    }
}

export function updateProduct(req,res){
    try{

    }catch(err){
        return res.error("unable to update product",err)
    }
}
export function deleteProduct(req,res){
    try{

    }catch(err){
        return res.error("unable to delete product",err)
    }
}