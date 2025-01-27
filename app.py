from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import random
import os
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Product Model
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    cost = db.Column(db.Float, nullable=False)
    lead_time = db.Column(db.Integer, nullable=False)

# Create the database
with app.app_context():
    db.create_all()

# Mock Sales Data (for demonstration)
def generate_mock_sales():
    sales = []
    for i in range(30):  # Generate 30 days of sales data
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        for product in Product.query.all():
            sales.append({
                "date": date,
                "product_id": product.id,
                "quantity": random.randint(1, 10),
                "revenue": product.price * random.randint(1, 10),
            })
    return sales


# Routes

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/inventory")
def inventory():
    return render_template("inventory.html")

@app.route("/profit_maximization")
def profit_maximization():
    return render_template("profit_maximization.html")

@app.route("/marketing")
def marketing():
    return render_template("marketing.html")

@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")

@app.route("/api/sales-trends", methods=["GET"])
def get_sales_trends():
    return jsonify(sales)

@app.route("/api/product-performance", methods=["GET"])
def get_product_performance():
    performance = []
    for product in products:
        total_sales = sum(sale["quantity"] for sale in sales if sale["product_id"] == product["id"])
        performance.append({
            "name": product["name"],
            "total_sales": total_sales,
        })
    return jsonify(performance)

@app.route("/api/inventory-turnover", methods=["GET"])
def get_inventory_turnover():
    turnover = []
    for product in products:
        total_sales = sum(sale["quantity"] for sale in sales if sale["product_id"] == product["id"])
        turnover.append({
            "name": product["name"],
            "turnover_ratio": total_sales / product["stock"] if product["stock"] > 0 else 0,
        })
    return jsonify(turnover)

@app.route("/api/profit-margins", methods=["GET"])
def get_profit_margins():
    margins = []
    for product in products:
        total_revenue = sum(sale["revenue"] for sale in sales if sale["product_id"] == product["id"])
        total_cost = product["cost"] * sum(sale["quantity"] for sale in sales if sale["product_id"] == product["id"])
        profit_margin = ((total_revenue - total_cost) / total_revenue) * 100 if total_revenue > 0 else 0
        margins.append({
            "name": product["name"],
            "profit_margin": round(profit_margin, 2),
        })
    return jsonify(margins)

@app.route("/api/customer-insights", methods=["GET"])
def get_customer_insights():
    insights = {
        "total_customers": len(customers),
        "average_age": round(sum(customer["age"] for customer in customers) / len(customers), 2),
        "gender_distribution": {
            "Male": len([c for c in customers if c["gender"] == "Male"]),
            "Female": len([c for c in customers if c["gender"] == "Female"]),
        },
        "top_spenders": sorted(customers, key=lambda x: x["total_spent"], reverse=True)[:3],
    }
    return jsonify(insights)


# Routes for Inventory Management
# Helper function to generate mock sales data
def generate_mock_sales():
    products = Product.query.all()
    return [
        {
            "product_id": product.id,
            "quantity": random.randint(1, 10),
            "date": (datetime.now() - timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
        }
        for product in products
    ]

# API Routes
@app.route("/api/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([{
        "id": product.id,
        "name": product.name,
        "category": product.category,
        "stock": product.stock,
        "price": product.price,
        "cost": product.cost,
        "lead_time": product.lead_time,
    } for product in products])

@app.route("/api/products", methods=["POST"])
def add_product():
    data = request.get_json()
    new_product = Product(
        name=data["name"],
        category=data["category"],
        stock=data["stock"],
        price=data["price"],
        cost=data["cost"],
        lead_time=data["lead_time"],
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added successfully"})

@app.route("/api/products/<int:id>", methods=["GET"])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify({
        "id": product.id,
        "name": product.name,
        "category": product.category,
        "stock": product.stock,
        "price": product.price,
        "cost": product.cost,
        "lead_time": product.lead_time,
    })

@app.route("/api/products/<int:id>", methods=["PUT"])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    product.name = data.get("name", product.name)
    product.category = data.get("category", product.category)
    product.stock = data.get("stock", product.stock)
    product.price = data.get("price", product.price)
    product.cost = data.get("cost", product.cost)
    product.lead_time = data.get("lead_time", product.lead_time)
    db.session.commit()
    return jsonify({"message": "Product updated successfully"})

@app.route("/api/products/<int:id>", methods=["DELETE"])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully"})

@app.route("/api/replenishment-alerts", methods=["GET"])
def get_replenishment_alerts():
    sales = generate_mock_sales()
    alerts = []
    for product in Product.query.all():
        total_sales = sum(sale["quantity"] for sale in sales if sale["product_id"] == product.id)
        avg_daily_sales = total_sales / 30  # Average daily sales over 30 days
        days_until_stockout = product.stock / avg_daily_sales if avg_daily_sales > 0 else 0
        refill_date = (datetime.now() + timedelta(days=days_until_stockout - product.lead_time)).strftime("%Y-%m-%d")
        alerts.append({
            "name": product.name,
            "refill_date": refill_date,
            "days_until_stockout": round(days_until_stockout, 2),
        })
    return jsonify(alerts)

@app.route("/api/stockout-predictions", methods=["GET"])
def get_stockout_predictions():
    sales = generate_mock_sales()
    predictions = []
    for product in Product.query.all():
        total_sales = sum(sale["quantity"] for sale in sales if sale["product_id"] == product.id)
        avg_daily_sales = total_sales / 30  # Average daily sales over 30 days
        days_until_stockout = product.stock / avg_daily_sales if avg_daily_sales > 0 else 0
        predictions.append({
            "name": product.name,
            "days_until_stockout": round(days_until_stockout, 2),
            "suggestion": "Increase stock" if days_until_stockout < product.lead_time else "Stock is sufficient",
        })
    return jsonify(predictions)

@app.route("/api/dead-stock", methods=["GET"])
def get_dead_stock():
    sales = generate_mock_sales()
    dead_stock = []
    for product in Product.query.all():
        total_sales = sum(sale["quantity"] for sale in sales if sale["product_id"] == product.id)
        if total_sales == 0:  # Identify products with no sales
            dead_stock.append({
                "name": product.name,
                "suggestion": "Clearance sale or discontinue",
            })
    return jsonify(dead_stock)

# Routes for Profit Maximization
@app.route("/api/pricing-strategies", methods=["GET"])
def get_pricing_strategies():
    strategies = []
    for product in Product.query.all():
        total_sales = sum(sale["quantity"] for sale in sales if sale["product_id"] == product.id)
        avg_daily_sales = total_sales / 30  # Average daily sales over 30 days
        demand_level = "High" if avg_daily_sales > 5 else "Low"
        strategies.append({
            "name": product.name,
            "current_price": product.price,
            "suggested_price": product.price * 1.1 if demand_level == "High" else product.price * 0.9,
            "reason": f"Demand is {demand_level}",
        })
    return jsonify(strategies)

@app.route("/api/discount-optimization", methods=["GET"])
def get_discount_optimization():
    discounts = []
    for product in Product.query.all():
        total_sales = sum(sale["quantity"] for sale in sales if sale["product_id"] == product.id)
        if total_sales < 10:  # Identify slow-moving products
            discounts.append({
                "name": product.name,
                "current_stock": product.stock,
                "suggested_discount": "20% off",
                "reason": "Slow-moving stock",
            })
    return jsonify(discounts)

@app.route("/api/cost-reduction-tips", methods=["GET"])
def get_cost_reduction_tips():
    tips = []
    for product in Product.query.all():
        if product.cost > 50:  # Identify high-cost products
            tips.append({
                "name": product.name,
                "current_cost": product.cost,
                "suggestion": "Negotiate with suppliers or switch to bulk purchasing",
            })
    return jsonify(tips)

# Routes for Marketing Module
@app.route("/api/promotion-planning", methods=["GET"])
def get_promotion_planning():
    promotions = []
    for product in products:
        total_sales = sum(sale["quantity"] for sale in sales if sale["product_id"] == product["id"])
        if total_sales < 10:  # Identify products needing promotion
            promotions.append({
                "name": product["name"],
                "campaign": "Seasonal Sale",
                "reason": "Low sales volume",
            })
    return jsonify(promotions)

@app.route("/api/social-media-posts", methods=["POST"])
def create_social_media_post():
    data = request.get_json()
    post_content = data.get("content", "")
    scheduled_time = data.get("scheduled_time", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    # In a real app, this would integrate with a social media API (e.g., Facebook, Twitter)
    return jsonify({
        "status": "success",
        "message": f"Post scheduled for {scheduled_time}",
        "content": post_content,
    })

@app.route("/api/loyalty-programs", methods=["GET"])
def get_loyalty_programs():
    programs = [
        {
            "name": "Points-Based Rewards",
            "description": "Customers earn points for each purchase, redeemable for discounts or free products.",
        },
        {
            "name": "Tiered Membership",
            "description": "Customers unlock higher tiers (e.g., Silver, Gold) based on spending, with exclusive benefits.",
        },
        {
            "name": "Referral Program",
            "description": "Customers earn rewards for referring new customers to the store.",
        },
    ]
    return jsonify(programs)



# Routes for AI Chatbot
from telegram import Update, Bot
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, CallbackContext
import asyncio

# Telegram Bot Token
# Telegram Bot Token
# TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
# bot = Bot(token=TELEGRAM_BOT_TOKEN)

# # Gemini API Key
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"

# # Database to store dealer quotes and chat IDs
# dealer_quotes = {}
# dealer_chat_ids = {}  # Store dealer chat IDs
# negotiation_states = {}  # Track negotiation state for each dealer

# def generate_gemini_response(prompt):
#     """Generate a response using Gemini API."""
#     headers = {"Content-Type": "application/json"}
#     data = {
#         "contents": [{"parts": [{"text": prompt}]}]
#     }
#     response = requests.post(GEMINI_API_URL, json=data, headers=headers)
#     if response.status_code == 200:
#         return response.json()["candidates"][0]["content"]["parts"][0]["text"]
#     else:
#         return "Error: Failed to generate response."

# @app.route("/webhook", methods=["POST"])
# def webhook():
#     """Handle incoming Telegram messages."""
#     update = Update.de_json(request.get_json(force=True), bot)
#     application.process_update(update)
#     return jsonify({"status": "success"})

# async def handle_message(update: Update, context: CallbackContext):
#     """Handle incoming messages from Telegram."""
#     user_message = update.message.text
#     chat_id = update.message.chat.id

#     # Check if this chat ID is a registered dealer
#     if chat_id in dealer_chat_ids:
#         # If it's a dealer's message, send it back to the user (not handled here)
#         pass  # You can implement logic here if needed for dealer replies

#     # If it's a user's message, send it directly to the dealer
#     if chat_id in negotiation_states:
#         dealer_number = negotiation_states[chat_id]["dealer_number"]
#         await bot.send_message(chat_id=dealer_number, text=user_message)  # Send user message to dealer

# @app.route("/api/negotiate", methods=["POST"])
# def negotiate():
#     """Handle negotiation requests from the frontend."""
#     data = request.json
#     dealer_number = data.get("dealer_number")
#     product_name = data.get("product_name")
#     price = data.get("price")

#     if not dealer_number or not product_name or not price:
#         return jsonify({"error": "Missing required fields"}), 400

#     # Store the initial negotiation state for this dealer
#     negotiation_states[dealer_number] = {
#         "context": f"Negotiating for {product_name} at {price}.",
#         "dealer_response": None,
#         "user_chat_id": None  # This will be set when the user first sends a message
#     }

#     # Send an initial message to the dealer (optional)
#     response_text = f"User wants to negotiate for {product_name} at {price}."
    
#     # Store chat ID for future reference when sending messages back from dealers
#     if dealer_number not in dealer_chat_ids:
#         dealer_chat_ids[dealer_number] = True  # Mark this chat ID as a registered dealer

#     await bot.send_message(chat_id=dealer_number, text=response_text)  # Send initial message to dealer

#     return jsonify({"response": response_text})

# @app.route("/api/rank-dealers", methods=["GET"])
# def rank_dealers():
#     """Rank dealers based on their quotes."""
#     sorted_dealers = sorted(dealer_quotes.items(), key=lambda x: min([quote["price"] for quote in x[1]]))
#     return jsonify({"ranked_dealers": sorted_dealers})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Ensure the database is created
    app.run(port=5000)