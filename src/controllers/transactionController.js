import { db } from "../db/db.js"
import { transactionSchema } from "../schemas/transactionSchema.js"

async function insertTransaction(req, res) {
    const { description, value, type } = req.body;
    const { session, user } = res.locals;

    const isValid = transactionSchema.validate({description, value, type})

    if(isValid.error){
        return res.sendStatus(400)
    }
  
    try {
      db.collection("transactions").insertOne({
        description,
        value,
        type,
        userId: session.userId,
        date: +new Date(),
      });
  
      return res.send(201);
    } catch (error) {
      console.log(error);
      return res.send(500);
    }
  }
  
  async function list(req, res) {
    const { user } = res.locals;
  
    try {
      const transactions = await db
        .collection("transactions")
        .find({
          userId: user._id,
        })
        .toArray();
  
      const total = transactions.reduce((acc, curr) => {
        if (curr.type === "debit") {
          return acc - curr.value;
        }
        return acc + curr.value;
      }, 0);
  
      transactions.push({
        type: 'total',
        value: total,
      });
      return res.send(transactions);
    } catch (error) {
      console.log(error);
      return res.send(500);
    }
  }
  
  export { insertTransaction, list };