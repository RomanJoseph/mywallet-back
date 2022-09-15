import joi from "joi"

const transactionSchema = joi.object({
    description: joi.string().required(),
    value: joi.number().required(),
    type: joi.valid("debit", "credit").required()
})

export { transactionSchema }
