# Zerodha Trading Algorithm

This documentation covers the implementation details and API endpoints of the Stock Exchange application built with Express and TypeScript.
Please note, here we assume only one market

## Overview

The Stock Exchange app simulates a simple stock market where users can place buy (bid) and sell (ask) orders for a specific stock (e.g., TESLA). The app manages user balances, order fulfillment, and provides endpoints for trading operations.

## Installation

To run the Stock Exchange app locally, follow these steps:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the server with `npm start`.

## API Endpoints

### 1. POST /order

#### Request Body

- `side`: "bid" or "ask" indicating the order type.
- `price`: Price per stock.
- `quantity`: Number of stocks.
- `userId`: User ID placing the order.

#### Response

- If the order is filled completely, returns `{ filledQuantities: quantity }`.
- If partially filled, returns `{ filledQuantities: quantity - remainingQuantity }`.

### 2. GET /balance/:userId

#### Parameters

- `userId`: User ID to fetch balances.

#### Response

Returns user balances in USD and STOCK.

### 3. POST /quote

#### Request Body

- `side`: "bid" or "ask" indicating the order type.
- `quantity`: Number of stocks.
- `userId`: User ID requesting the quote.

#### Response

Returns the average price for the requested quantity based on current orders.

### 4. GET /depth

#### Response

Returns the order depth for both bid and ask orders.

## Data Structures

The application uses the following data structures:

- `Balance`: An object representing user balances in different currencies.
- `User`: Contains user details including ID and balances.
- `Order`: Represents an order with user ID, price, and quantity.
- `STOCK`: Constant representing the stock symbol.

## Functions

### 1. `calculateAveragePrice(items: Order[], quantity: number)`

Calculates the average price for a given quantity of stocks based on existing orders.

### 2. `fillOrders(userId: string, side: string, price: number, quantity: number)`

Fills user orders based on bid/ask prices and quantities.

### 3. `flipOrders(userId1: string, userId2: string, price: number, quantity: number)`

Updates user balances after a successful order fill.

## Usage

1. Start the server with `npm start`.
2. Use API endpoints to place orders, fetch balances, get quotes, and view order depth.

---

This documentation provides a high-level overview of the Stock Exchange app. For detailed API usage and examples, refer to the source code and API documentation.

