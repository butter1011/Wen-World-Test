import logging
import requests
import time
from flask import Flask, request, jsonify, render_template
from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    WebAppInfo,
    Update,
)
from telegram.ext import (
    Application,
    CallbackContext,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
    ExtBot,
    MessageHandler,
    CallbackQueryHandler,
    filters,
)
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import asyncio

app = Flask(__name__)
# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)

logging.getLogger("httpx").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)

# Telegram bot token
# TOKEN = '7188910603:AAGG-9sIlhdrZ4y4ZTcoURrl5c4jqdI3zL4'
TOKEN = '7494962995:AAEwyFj7QT0qrDUmgrdHxaVqxiS00oLW8p4'  # Mine Telegram Bot
SERVER = 'https://wen-world-test.onrender.com'

# Firebase credentials and initialization
firebase_creds = {
    "type": "service_account",
    "project_id": "wen-world",
    "private_key_id": "b68e2d114e709af3e47027261095f1f47d90e34f",
    "private_key":
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDAP2fa/QjzYcwM\nG7NqBPhKzNVQFleCWg/wBEjRBB7fp40Ge0ZOReQX9iZmMQ4amns7V7Z8nTiP1OFV\ncjam6wcJd1e5h9jphd1SCaLSFh0XV0OqrKOtT0wQ4f/WoiH6bT0/K5bQy5nUeHM0\n6gdxHuc6kHP7sIwVhgZXvo1bSZam8dAjCh5lf00h2kOb39p2U32XYX6djLVCPagf\nXln4ryuJb5QrWUe6lPQqZTlVi8CAbYLK9maQZNTDqUWwbisR58hg/3NL6tlEbcZc\n2SkBRB9lZ4ucoRYAf025XhuKwEXCn47C3jeAFWPNSFJP1iZDUVc51kDon+1mqwSn\nMisWeu3BAgMBAAECggEAEpuQf9USCAylOrQhBNf/owMkenX5zmIikhwNYuhqh0H+\nbRbYJ+dX5oHVbFAUig/9xtv8i8nj7vgElMf98OC6yPhw2JevhRrciyjnm5IMYB/6\n1WA/D3KnbX2Sd8HbAWmQDgyNXR731WWQhm9IfR3Sn7aE+Lg5Nt7Gv7jFPIVo5uDs\npAjZioYHa3/p2NszcrF7vZjRp0IVsjCx7nMecHhT1b42bqEw1Rkkj5c1xrhxDNd4\nqd820j2KIXnoTlZVZCW3KhxYuu+feEkglxhBODsoB/+yLdXq0wrBERGtX1YLEIiq\nV0JWuaH8JdXR080e/nSQ3XJ4O0s8pNsJEtL3fX7MyQKBgQDfktzPzHJhb8B2eUkD\nzz5tajOsjGkB0t6to7FvjJpNjiy+aiYCctfS8J/A7u5O1dHUlhm3XBq54cZf5NLA\nDin3PK2TYxunaV5571hs3Sx/EP/GS7kuitQng0YqgtNoN9IwzQIpWsu3bKGtfMjV\n0a98jBjrTMIwL3jI+uaSJ4qG/wKBgQDcIW4ccg5EqYuHGPgBtGqabItYZmJ8PfU1\n3quB95RNokjhqp2KLAca5nurOhsEtCNooUsug2b1f1UJdhq+L2PtuMz8AAp6C5Jz\nkL23MqH1690tMBP5gEJZr/8XKwhmW28A0ZdeIpGSctAlEYOHdF4N7pSPP6hcwgLv\n6h8A2SlLPwKBgDyiafx5aDQAyOPYtPKxjC7EdMtBMWFrPTU+herI6ThLbNsfkrtr\nRhlRZSJAKqV62/OZ2dOeySjMkK6FMpsfvEXvUOv+HwviSdssDIFJ4r17cMLo2opC\n4JLuyWLSJF/Jc9oEX6ezljhi395bT2Sd/8f5fvCh2rCSz2FCmrHcw3clAoGAb+rv\nOLckWfR5Y+5l6Tf5GxoknoUvfUti6EiVmjZtyCrCMzmzbxSDaEHWjm+0XOfZONEI\nkFVue1KJwY2yew9NFwfl8Bl1Oie4BdmJGyM7BPUuNlNDVI7JLSA16WmPk7rY7Omi\ns9GPgY2uFaqZ3LxlNWAfV9VdnAtnwuKdcKj4PbECgYByQt3npIHVUSiFwlCJ/1Ke\nE9xduDqH5vkgKgI1+FD2uNFSk4vNhwVgNrk0Tm3ajXmhuKz1EXxy7GHldDGmhXrZ\n9d0hZ/lXJT+48Po9sZR2vdML9ZoOfx7c97/RrN3M0D8h5rQydpyJtMmF5POTiSg2\nHIyWf/Hk58W4onQzIg9Lmw==\n-----END PRIVATE KEY-----\n",
    "client_email":
    "firebase-adminsdk-2kzlg@wen-world.iam.gserviceaccount.com",
    "client_id": "117463761929069557825",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url":
    "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url":
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2kzlg@wen-world.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

cred = credentials.Certificate(firebase_creds)
firebase_admin.initialize_app(cred)
db = firestore.client()


# Serve the game HTML
@app.route('/')
def index():
    return render_template('index.html')


# Serve the leaderboard HTML
@app.route('/leaderboard')
def leaderboard_page():
    return render_template('leaderboard.html')


# Serve the tasks HTML
@app.route('/tasks')
def tasks_page():
    return render_template('tasks.html')


# Test route
@app.route('/test')
def test_page():
    return '<h1>Test Page</h1>'


# # Webhook route to handle Telegram updates
# @app.route(f'/{TOKEN}', methods=['POST'])
# def webhook():
#     update = Update.de_json(request.get_json(force=True), bot)
#     dispatcher.process_update(update)
#     return 'ok'

def setUserId(context: ContextTypes.DEFAULT_TYPE):
    # Init the user
    response = requests.post(
        f"{SERVER}/api/v1/user", json={"user_id": context.chat_data["userId"]}
    )

    # Reply Buttons when click '/start'
    startGameButton = InlineKeyboardButton(
        text="💰 Start the Game!",
        web_app=WebAppInfo(
            "https://wen-world-test.onrender.com"
        ),
    )

    # referralUser = InlineKeyboardButton(
    #     text="🪄 Invite the User", callback_data="inviteBtn"
    # )
    # connectWallet = InlineKeyboardButton(
    #     text="💰 Connect Wallet", callback_data="connect_wallet"
    # )
    # userProfile = InlineKeyboardButton(
    #     text="👤 Profile", callback_data="userprofileBtn"
    # )

    configKeyboardMarkup = InlineKeyboardMarkup(
        [
            [startGameButton],
            # [connectWallet],
            # [referralUser],
            # [userProfile],
        ]
    )

    return configKeyboardMarkup

# start commmand
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Get User ID
    context.chat_data["userId"] = update.effective_message.chat_id
    # Set User
    configKeyboardMarkup = setUserId(context)
    # Get Inviter Id
    args = context.args

    if update.effective_user.username:
        print(
            f"Username------------>{update.effective_user.username}\nTime-------------------->{time.strftime('%y/%m/%d %H:%M:%S', time.localtime())}\n"
        )

    # # Set the Inviter Id
    # if args:
    #     inviter_id = args[0]
    #     context.chat_data["inviter_id"] = inviter_id
    #     newUser = context.chat_data["userId"]
    #     response = setInviterUserId(context)

    #     if response.status_code == 200:
    #         # Send messages to the inviter and new user.
    #         await context.bot.send_message(
    #             chat_id=inviter_id,
    #             text=f"💰You earned 🌟30000 coins for inviting the new user.\n\nThe {newUser} earned 15000 coins for bonus.💰",
    #         )

    #         await update.message.reply_html(
    #             f"💰You now invited by <b>{inviter_id}</b>\n\nYou earned 🌟15000 coins. Inviter earned 30000 coins for bonus.💰"
    #         )
    #     else:
    #         await update.message.reply_html(
    #             f"❗The invite link is not invalid or you already set a inviter. No bonus point was added❗"
    #         )

    photo_file = open("./public/background.jpg", "rb")

    # Hello Message
    descText = f"""
    🎉🎉🎉 Welcome to WenWorld Game! 🎉🎉🎉\n\nYou can earn money by playing this game.
    """
    # certification = f"\n<b>Made with ❤️ by Bitcoin Millionaire Team</b>"

    # Send the image with the text
    await context.bot.send_photo(
        chat_id=update.effective_chat.id,
        photo=photo_file,
        caption=descText,
        reply_markup=configKeyboardMarkup,
    )

# if __name__ == "__main__":
#     application = Application.builder().token(TOKEN).build()

#     # Add handler to the bot
#     application.add_handler(CommandHandler("start", start))
#     # application.add_handler(
#     #     MessageHandler(filters.Text and ~filters.COMMAND, handleMessage)
#     # )

#     asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
#     application.run_polling(allowed_updates=Update.ALL_TYPES)


# # Command to start the game
# def start(update, context):
#     chat_id = update.message.chat_id
#     game_url = 'https://telegram-1-triend.replit.app'  # Replace with your Replit project URL
#     bot.send_message(chat_id=chat_id,
#                      text=f"Click the link to start the game: {game_url}")


# # Command to send the custom Telegram message
# def send_custom_message(update, context):
#     chat_id = update.message.chat_id
#     username = update.message.from_user.username
#     referral_link = f"https://telegram-1-triend.replit.app/referral/{username}"  # Create a referral link
#     message = (
#         f"Hey @{username}! It's World of Wen! 🌟 Your go-to game for navigating the crypto market - travel the world, navigate the bull and bear market, and dodge the SEC! 🌍📈🚀\n\n"
#         "Now we're rolling out our Telegram mini app! Start farming points now, and who knows what cool stuff you'll snag with them soon! 🚀\n\n"
#         "Got friends? Bring 'em in! The more, the merrier! 🌱\n\n"
#         "Remember: World of Wen is where growth thrives and endless opportunities are discovered! 🌼\n\n"
#         f"Use my invite link to join the fun: [Launch Wen]({referral_link})\n"
#         "[Join Community](https://t.me/WenworldCommunity)")

#     buttons = [[InlineKeyboardButton("Launch Wen", url=referral_link)],
#                [
#                    InlineKeyboardButton("Join Community",
#                                         url="https://t.me/WenworldCommunity")
#                ]]
#     reply_markup = InlineKeyboardMarkup(buttons)

#     bot.send_message(chat_id=chat_id,
#                      text=message,
#                      reply_markup=reply_markup,
#                      parse_mode=ParseMode.HTML)


# Route to handle referral links and display custom message
@app.route('/referral/<ref_code>')
def referral(ref_code):
    custom_message = (
        f"Hey there! You were invited by @{ref_code} to join World of Wen! 🌟 Your go-to game for navigating the crypto market - "
        "travel the world, navigate the bull and bear market, and dodge the SEC! 🌍📈🚀\n\n"
        "Start farming points now, and who knows what cool stuff you'll snag with them soon! 🚀\n\n"
        "Got friends? Bring 'em in! The more, the merrier! 🌱\n\n"
        "Remember: World of Wen is where growth thrives and endless opportunities are discovered! 🌼\n\n"
        f"<a href='https://t.me/Wenworldbot'>Launch Wen</a>\n"
        "<a href='https://t.me/WenworldCommunity'>Join Community</a>")
    return f"<html><body>{custom_message}</body></html>"


# Function to collect a coin
@app.route('/collect_coin', methods=['POST'])
def collect_coin():
    user_id = request.json.get('user_id')
    coin_id = request.json.get('coin_id')

    print(f"Collecting coin: {coin_id} for user: {user_id}")

    doc_ref = db.collection('collected_coins').document(coin_id)
    doc = doc_ref.get()
    if doc.exists():
        print("Coin already collected")
        return jsonify({'status': 'fail', 'message': 'Coin already collected'})

    doc_ref.set({'user_id': user_id})
    print(f"Coin {coin_id} collected")

    user_ref = db.collection('users').document(user_id)
    user_doc = user_ref.get()
    if user_doc.exists():
        user_data = user_doc.to_dict()
        user_data['points'] += 10
    else:
        user_data = {'points': 10}

    user_ref.set(user_data)
    print(f"Updated points for user {user_id}: {user_data['points']}")

    return jsonify({
        'status': 'success',
        'message': f'Coin {coin_id} collected'
    })


# Endpoint to update the score
@app.route('/update_score', methods=['POST'])
def update_score():
    print("update_data-------------------------------->",request.get_json())
    data = request.get_json()
    user_id = data['user_id']
    name = data['name']
    score = data['score']
    timestamp = datetime.now().isoformat()

    user_ref = db.collection('users').document(user_id)
    scores_ref = user_ref.collection('scores').document()

    user_ref.set({'name': name}, merge=True)
    scores_ref.set({'score': score, 'timestamp': timestamp})

    return jsonify({'status': 'success', 'message': 'Score updated'})


# Endpoint to get the leaderboard
@app.route('/leaderboard_data', methods=['GET'])
def leaderboard_data():
    users_ref = db.collection('users')
    print("--------------------------")
    users = users_ref.get()
    print("users---------->", users)
    leaderboard = []

    for user in users:
        user_data = user.to_dict()
        print("user_data-------->", user_data)
        scores_ref = db.collection('users').document(
            user.id).collection('scores')
        print("scores_ref----------->", scores_ref)
        scores = scores_ref.get()
        print("scores:---------->", scores)
        for score in scores:
            score_data = score.to_dict()
            leaderboard.append({
                'user_id': user.id,
                'name': user_data.get('name', 'Unknown'),
                'points': score_data.get('score', 0),
                'date': score_data.get('timestamp', 'N/A')
            })

    # Sort the leaderboard by points in descending order
    leaderboard = sorted(leaderboard, key=lambda x: x['points'], reverse=True)

    print(f"Leaderboard data: {leaderboard}")

    return jsonify(leaderboard)


# Test Firestore connection
# @app.route('/test_firestore', methods=['GET'])
# def test_firestore():
#     print("Testing Firestore connection...")
#     try:
#         test_doc_ref = db.collection('test').document('test_doc')
#         test_doc_ref.set({'status': 'working'})
#         doc = test_doc_ref.get()
#         if (doc.exists):
#             print("Firestore connection is working")
#             return jsonify({'status': 'success', 'data': doc.to_dict()})
#         else:
#             print("Document does not exist")
#             return jsonify({
#                 'status': 'fail',
#                 'message': 'Document does not exist'
#             })
#     except Exception as e:
#         print(f"Error testing Firestore: {e}")
#         return jsonify({'status': 'error', 'message': str(e)})


# Set up the updater and dispatcher
# updater = Updater(TOKEN, use_context=True)
# dispatcher = updater.dispatcher
# dispatcher.add_handler(CommandHandler('start', start))
# dispatcher.add_handler(CommandHandler('custom_message', send_custom_message))

if __name__ == '__main__':
    application = Application.builder().token(TOKEN).build()

    # Add handler to the bot
    application.add_handler(CommandHandler("start", start))
    # application.add_handler(
    #     MessageHandler(filters.Text and ~filters.COMMAND, handleMessage)
    # )

    # asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    application.run_polling(allowed_updates=Update.ALL_TYPES)
    app.run(host='0.0.0.0', port=8080)
