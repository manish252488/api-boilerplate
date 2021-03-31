import Product from '../models/product.model';

export async function addProduct(req,res){
    try{
        const product = req.body;
        const user = req.user;
        product.user = user.id;
        //let data = await Product.create(product);
        return res.success('product added!', {product,req});
    }catch(err){
        return res.error("unable to add product!", err)
    }
}