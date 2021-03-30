import validate from 'express-validation'
import Joi from 'joi'
export async function loginValidation(body){
    try{
        let schema =  Joi.object().keys({
            email: Joi.string().required().allow(),
            password: Joi.string().required().allow(),
        }).unknown(true)
        await validate(schema,body)
    }catch(err){

    }

}