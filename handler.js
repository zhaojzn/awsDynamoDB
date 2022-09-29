const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const cors = require('cors');
const app = express();

const SERVER_TABLE = process.env.SERVER_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(cors());
app.use(express.json());

app.get("/amountopened", async function(req, res) {
  

  const getParams = {
    TableName: SERVER_TABLE,
    Key: {
      userId: "Jason",
    },
  };
  try {
    const { Item } = await dynamoDbClient.get(getParams).promise();
    if (Item) {
      const { userId, amount } = Item;
      const update = {
        TableName: SERVER_TABLE,
        Item: {
          userId: "Jason",
          amount: amount+1,
        },
      };
      try {
        await dynamoDbClient.put(update).promise();
        res.json({ amount });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not edit file" });
      }
    } else {
        const params = {
            TableName: SERVER_TABLE,
            Item: {
              userId: "Jason",
              amount: 0,
            },
        };
        
          try {
            await dynamoDbClient.put(params).promise();
            res.json({message: "Created server file"});
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not server file" });
          }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not get server data" });
  }
});



app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
