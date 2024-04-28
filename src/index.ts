import express from 'express';
import bodyParser from 'body-parser';
export const app = express();
app.use(bodyParser.json());

interface Balance {
  [key: string]: number;
}

interface User {
  id: string;
  balances: Balance;
}

interface Order {
  userId: string;
  price: number;
  quantity: number;
}

export const STOCK = "TESLA";

const asks: Order[] = [];
const bids: Order[] = [];

const users: User[] = [{
  id: "1",
  balances: {
    STOCK: 10,
    "USD": 50000
  }
}, {
  id: "2",
  balances: {
    STOCK: 10,
    "USD": 50000
  }
}];

app.post('/order', (req, res) => {
  const { side, price, quantity, userId } = req.body;

  const remainingQuantity = fillOrders(userId, side, price, quantity);

  if (remainingQuantity === 0) {
    res.json({ filledQuantities: quantity });
  };
  if (side == "bid") {
    bids.push({ userId, price, quantity });
  }

  if (side == "asks") {
    asks.push({ userId, price, quantity });
  }
  res.json({ filledQuantities: quantity - remainingQuantity });
})

app.get('/balance/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find(x => x.id === userId);
  if (!user) {
    return res.json({
      id: userId,
      balances: {
        STOCK: 0,
        "USD": 0
      }
    })
  }
  res.json({ userBalance: user })
  return { usd: 123, stockShares: 22 }
})

app.get('/depth', (req, res) => {
  const depth: {
    [price: string]: {
      type: "ask" | "bid";
      quantity: number;
    }
  } = {};
  for (let i = 0; i < bids.length; i++) {
    if (!depth[bids[i].price]) {
      depth[bids[i].price] = {
        type: "bid",
        quantity: bids[i].quantity
      };
    } else {
      depth[bids[i].price].quantity += bids[i].quantity;

    }
  }
  for (let i = 0; i < asks.length; i++) {
    if (!depth[asks[i].price]) {
      depth[asks[i].price] = {
        quantity: asks[i].quantity,
        type: "ask"
      }
    } else {
      depth[asks[i].price].quantity += asks[i].quantity;
    }
  }
  res.json({
    depth: depth
  })
})

function flipOrders(userId1: string, userId2: string, price: number, quantity: number) {
  const user1 = users.find(x => x.id === userId1);
  const user2 = users.find(x => x.id === userId2);
  if (!user1 || !user2) {
    return;
  }
  user1.balances[STOCK] -= quantity;
  user2.balances[STOCK] += quantity;
  user1.balances["USD"] += (quantity * price);
  user2.balances["USD"] -= (quantity * price);


}

function fillOrders(userId: string, side: string, price: number, quantity: number) {
  let remainingQuantity = quantity;

  if (side == "bid") {
    for (let i = 0; i < asks.length; i++) {
      if (asks[i].price > price) {
        break;
      }
      if (asks[i].quantity > remainingQuantity) {
        asks[i].quantity -= remainingQuantity;
        flipOrders(asks[i].userId, userId, remainingQuantity, asks[i].price);
        return 0;
      } else {
        remainingQuantity -= asks[i].quantity;
        flipOrders(asks[i].userId, userId, asks[i].quantity, asks[i].price);
        asks.pop();
      }
    }
  } else {
    for (let i = 0; i < bids.length; i++) {
      if (bids[i].price < price) {
        break;
      }
      if (bids[i].quantity > remainingQuantity) {
        bids[i].quantity -= remainingQuantity;
        flipOrders(bids[i].userId, userId, remainingQuantity, bids[i].price);
        return 0;
      } else {
        remainingQuantity -= bids[i].quantity;
        flipOrders(bids[i].userId, userId, bids[i].quantity, bids[i].price);
        bids.pop();
      }
    }
  }
  return remainingQuantity;
}

app.listen(3000, () => {
  console.log('Listening on port 3000');
})
