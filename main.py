import logging
from datetime import datetime
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import asyncio

app = Flask(__name__)
# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)

# Firebase credentials and initialization
firebase_creds = {
    "type": "service_account",
    "project_id": "wen-world",
    "private_key_id": "b68e2d114e709af3e47027261095f1f47d90e34f",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDAP2fa/QjzYcwM\nG7NqBPhKzNVQFleCWg/wBEjRBB7fp40Ge0ZOReQX9iZmMQ4amns7V7Z8nTiP1OFV\ncjam6wcJd1e5h9jphd1SCaLSFh0XV0OqrKOtT0wQ4f/WoiH6bT0/K5bQy5nUeHM0\n6gdxHuc6kHP7sIwVhgZXvo1bSZam8dAjCh5lf00h2kOb39p2U32XYX6djLVCPagf\nXln4ryuJb5QrWUe6lPQqZTlVi8CAbYLK9maQZNTDqUWwbisR58hg/3NL6tlEbcZc\n2SkBRB9lZ4ucoRYAf025XhuKwEXCn47C3jeAFWPNSFJP1iZDUVc51kDon+1mqwSn\nMisWeu3BAgMBAAECggEAEpuQf9USCAylOrQhBNf/owMkenX5zmIikhwNYuhqh0H+\nbRbYJ+dX5oHVbFAUig/9xtv8i8nj7vgElMf98OC6yPhw2JevhRrciyjnm5IMYB/6\n1WA/D3KnbX2Sd8HbAWmQDgyNXR731WWQhm9IfR3Sn7aE+Lg5Nt7Gv7jFPIVo5uDs\npAjZioYHa3/p2NszcrF7vZjRp0IVsjCx7nMecHhT1b42bqEw1Rkkj5c1xrhxDNd4\nqd820j2KIXnoTlZVZCW3KhxYuu+feEkglxhBODsoB/+yLdXq0wrBERGtX1YLEIiq\nV0JWuaH8JdXR080e/nSQ3XJ4O0s8pNsJEtL3fX7MyQKBgQDfktzPzHJhb8B2eUkD\nzz5tajOsjGkB0t6to7FvjJpNjiy+aiYCctfS8J/A7u5O1dHUlhm3XBq54cZf5NLA\nDin3PK2TYxunaV5571hs3Sx/EP/GS7kuitQng0YqgtNoN9IwzQIpWsu3bKGtfMjV\n0a98jBjrTMIwL3jI+uaSJ4qG/wKBgQDcIW4ccg5EqYuHGPgBtGqabItYZmJ8PfU1\n3quB95RNokjhqp2KLAca5nurOhsEtCNooUsug2b1f1UJdhq+L2PtuMz8AAp6C5Jz\nkL23MqH1690tMBP5gEJZr/8XKwhmW28A0ZdeIpGSctAlEYOHdF4N7pSPP6hcwgLv\n6h8A2SlLPwKBgDyiafx5aDQAyOPYtPKxjC7EdMtBMWFrPTU+herI6ThLbNsfkrtr\nRhlRZSJAKqV62/OZ2dOeySjMkK6FMpsfvEXvUOv+HwviSdssDIFJ4r17cMLo2opC\n4JLuyWLSJF/Jc9oEX6ezljhi395bT2Sd/8f5fvCh2rCSz2FCmrHcw3clAoGAb+rv\nOLckWfR5Y+5l6Tf5GxoknoUvfUti6EiVmjZtyCrCMzmzbxSDaEHWjm+0XOfZONEI\nkFVue1KJwY2yew9NFwfl8Bl1Oie4BdmJGyM7BPUuNlNDVI7JLSA16WmPk7rY7Omi\ns9GPgY2uFaqZ3LxlNWAfV9VdnAtnwuKdcKj4PbECgYByQt3npIHVUSiFwlCJ/1Ke\nE9xduDqH5vkgKgI1+FD2uNFSk4vNhwVgNrk0Tm3ajXmhuKz1EXxy7GHldDGmhXrZ\n9d0hZ/lXJT+48Po9sZR2vdML9ZoOfx7c97/RrN3M0D8h5rQydpyJtMmF5POTiSg2\nHIyWf/Hk58W4onQzIg9Lmw==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-2kzlg@wen-world.iam.gserviceaccount.com",
    "client_id": "117463761929069557825",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2kzlg@wen-world.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com",
}

cred = credentials.Certificate(firebase_creds)
firebase_admin.initialize_app(cred)
db = firestore.client()


# Serve the game HTML
@app.route("/")
def index():
    return render_template("index.html")


# Serve the leaderboard HTML
@app.route("/leaderboard")
def leaderboard_page():
    return render_template("leaderboard.html")


# Serve the tasks HTML
@app.route("/tasks")
def tasks_page():
    return render_template("tasks.html")


# Test route
@app.route("/profile")
def profile_page():
    return render_template("profile.html")


# Route to handle referral links and display custom message
# @app.route("/referral/<ref_code>")
# def referral(ref_code):
#     custom_message = (
#         f"Hey there! You were invited by @{ref_code} to join World of Wen! 🌟 Your go-to game for navigating the crypto market - "
#         "travel the world, navigate the bull and bear market, and dodge the SEC! 🌍📈🚀\n\n"
#         "Start farming points now, and who knows what cool stuff you'll snag with them soon! 🚀\n\n"
#         "Got friends? Bring 'em in! The more, the merrier! 🌱\n\n"
#         "Remember: World of Wen is where growth thrives and endless opportunities are discovered! 🌼\n\n"
#         f"<a href='https://t.me/Wenworldbot'>Launch Wen</a>\n"
#         "<a href='https://t.me/WenworldCommunity'>Join Community</a>"
#     )
#     return f"<html><body>{custom_message}</body></html>"


# Get FarmingTime
@app.route("/api/v1/farmingTime", methods=["GET"])
def farmingTime():
    if request.args.get("user_id"):
        user_id = str(request.args.get("user_id"))
        user_ref = db.collection("users").document(user_id)
        user_data = user_ref.get().to_dict()
        farmingTime = user_data.get("startFarming", 0)

    return (jsonify({"farmingTime": farmingTime}), 200)

# Get CurrentTime
@app.route("/api/v1/currentTime", methods=["GET"])
def currentTime():
    currentTime = int(datetime.utcnow().timestamp() * 1000)
    print("---------------------------->")
    print(currentTime)
    return (jsonify({"currentTime": currentTime}), 200)

# farmingpoint start api
@app.route("/api/v2/farmingStart", methods=["POST"])
def farmingStart():
    currentTime = int(datetime.utcnow().timestamp() * 1000)
    user_id = str(request.json.get("user_id"))
    user_ref = db.collection("users").document(user_id)
    user_ref.set({"startFarming": currentTime}, merge=True)

    return (jsonify({"message": "start the farming!"}), 200)

# farmingClaim api
@app.route("/api/v2/farmingClaim", methods=["POST"])
def farmingClaim():
    user_id = str(request.json.get("user_id"))
    user_ref = db.collection("users").document(user_id)

    user_data = user_ref.get().to_dict()

    # get the time difference
    currentTime = int(datetime.utcnow().timestamp() * 1000)
    oldTime = user_data.get("startFarming")

    if (currentTime - oldTime) > (6 * 3600 * 1000):
        # set farmingflag false
        user_ref.set({"startFarming": False}, merge=True)
        
        # get total value & set the total value
        total_value = user_data.get("totals", 0)
        total_value += 1000
        user_data.set({"totals", total_value}, merge=True)
        return jsonify({"message": "Added the farming reward!"})
    
    return jsonify({"message": "failed to add the farming reward!"}), 200

# farmingpoint API
@app.route("/api/v2/farmingPoint", methods=["POSxT"])
def farmingPoint():
    user_id = str(request.json.get("user_id"))
    name = request.json.get("name")
    add_point = request.json.get("point")

    # userlist creation
    user_ref = db.collection("users").document(user_id)
    user_ref.set({"name": name}, merge=True)

    farming_ref = user_ref.collection("farming")
    farming_ref.document().set({"point": add_point, "timestamp": currentTime})
    return (
        jsonify(
            {
                "status": "success",
                "message": "Point updated",
            }
        ),
        200,
    )


# Endpoint to update the score
@app.route("/api/v2/update_score", methods=["POST"])
def update_score():
    try:
        # get User data
        data = request.get_json()
        user_id = str(data.get("user_id"))
        name = data.get("name")
        score = data.get("score")
        currentTime = datetime.utcnow().strftime("%m-%d-%y")

        if not all([user_id, name, score]):
            return (
                jsonify({"status": "error", "message": "Missing required fields"}),
                400,
            )

        # userlist creation
        user_ref = db.collection("users").document(user_id)

        # user creation
        if not user_ref.get().exists:
            user_ref.set({"name": name, "totals": 0, "dailyCheckin": 0, "startFarming": 0}, merge=True)

        # get total score & scores data
        scores_ref = user_ref.collection("scores")
        user_data = user_ref.get().to_dict()
        total_value = user_data.get("totals", 0)
        
        current_score_doc = scores_ref.document(currentTime).get()

        # update total score & scores data
        if not current_score_doc.exists:
            scores_ref.document(currentTime).set({"score": score})
            total_value += int(score)
            user_ref.set({"totals": total_value}, merge=True)

        else:
            current_score = current_score_doc.to_dict().get("score", 0)
            if score > current_score:
                scores_ref.document(currentTime).set({"score": score})
                total_value += int(score) - int(current_score)
                user_ref.set({"totals": total_value}, merge=True)

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Score updated and user data saved",
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# Endpoint to get the leaderboard
@app.route("/api/v1/highscore_data", methods=["GET"])
def highscore_data():
    currentTime = datetime.utcnow().strftime("%m-%d-%y")

    if request.args.get("user_id"):
        user_id = request.args.get("user_id")
        # Get Scores
        scores_ref = db.collection("users").document(user_id).collection("scores")
        current_score_doc = scores_ref.document(currentTime).get()
        if current_score_doc.exists:
            score_data = current_score_doc.to_dict()
            user_ref = db.collection("users").document(user_id).get()
            return {
                "name": user_ref.to_dict().get("name", "Player"),
                "points": score_data.get("score", 0),
            }
    else:
        highscoredata = []
        users_ref = db.collection("users")
        users = users_ref.get()

        for user in users:
            user_ref = user.to_dict()
            # Get Scores
            scores_ref = db.collection("users").document(user.id).collection("scores")
            current_score_doc = scores_ref.document(currentTime).get()
            if current_score_doc.exists:
                score_data = current_score_doc.to_dict()
                highscoredata.append(
                    {
                        "name": user_ref.get("name", "Player"),
                        "points": score_data.get("score", 0),
                    }
                )

        highscoredata = sorted(highscoredata, key=lambda x: x["points"], reverse=True)
        return jsonify(highscoredata)


# Endpoint to get the leaderboard
@app.route("/api/v1/totalscore_data", methods=["GET"])
def totalscore_data():
    total_data = 0
    if request.args.get("user_id"):
        user_id = request.args.get("user_id")
        # Get Scores
        scores_ref = db.collection("users").document(user_id).collection("scores")
        current_score_docs = scores_ref.get()
        if current_score_docs:
            for current_score_doc in current_score_docs:
                current_score = current_score_doc.to_dict().get("score", 0)
                total_data += current_score

        # Get Farming
        farming_ref = db.collection("users").document(user_id).collection("farming")
        farming_score_docs = farming_ref.get()
        if farming_score_docs:
            for farming_score_doc in farming_score_docs:
                farming_score = farming_score_doc.to_dict().get("point", 0)
                total_data += farming_score

        user_ref = db.collection("users").document(user_id).get()
        return {
            "name": user_ref.to_dict().get("name", "Player"),
            "total": total_data,
        }

    else:
        users_ref = db.collection("users")
        users = users_ref.get()
        totalScoredata = []

        for user in users:
            user_ref = user.to_dict()
            scores_ref = db.collection("users").document(user.id).collection("scores")
            current_score_docs = scores_ref.get()

            if current_score_docs:
                for current_score_doc in current_score_docs:
                    current_score = current_score_doc.to_dict().get("score", 0)
                    total_data += current_score

            totalScoredata.append(
                {
                    "name": user_ref.get("name", "Player"),
                    "total": total_data,
                }
            )

        totalScoredata = sorted(totalScoredata, key=lambda x: x["total"], reverse=True)
        return jsonify(totalScoredata)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
