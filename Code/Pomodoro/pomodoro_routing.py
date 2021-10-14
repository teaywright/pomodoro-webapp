# to run:
# 1) Have all proper things installed
# 2) Be in venv
# 3) export FLASK_ENV=development  <------ if developer/debugger mode on desired (with auto refresh/watch)
# 4) export FLASK_APP=pomodoro_routing
# 5) flask run

from flask import Flask, redirect, url_for, render_template, request, session, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

# __name__ is just a built in flask variable to be similar to a "Main" function
app = Flask(__name__)

# Secret key is needed for encryption with post methods
app.secret_key = "secretKey"

# How long someone stays logged in
app.permanent_session_lifetime = timedelta(minutes=5)

# Set location of database as a configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create database instance
db = SQLAlchemy(app)

# Each table in the database is a class
class User(db.Model):
    userID = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    rawPass = db.Column(db.String(20), nullable=False)
    dateAdded = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, password):
        self.username = username
        self.rawPass = password

    # Function to return string when we add something
    def __repr__(self):
        return f"User('{self.userID}', '{self.username}', '{self.rawPass}', '{self.dateAdded}')"


# begin URL decorators
@app.route("/")  # route page / home page
def main_page():
    return render_template("main.html")

# Checks if a user is already logged in and allows login
@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        session.permanent = True
        inputName = request.form["nm"]
        inputPass = request.form["pass"]

        # Check for matching saved username in db
        searchUser = User.query.filter_by(username=inputName).first()
        if searchUser:
            session["user"] = inputName

            # Check password for found user
            if inputPass == searchUser.rawPass:
                return redirect(url_for("user"))
            else:
                flash("Incorrect password!")
                return render_template("login.html")
        else:
            flash("Username not found!")
            return render_template("login.html")
        
    else:
        # Redirects if session saved login
        if "user" in session:
            # flash("Already logged in!")
            return redirect(url_for("user"))
        return render_template("login.html")


@app.route("/user")
def user():
    if "user" in session:
        user = session["user"]
        return f"<h1>Welcome, {user}</h1>"
    else:
        flash("You are not logged in!")
        return redirect(url_for("login"))


@app.route("/logout")
def logout():
    if "user" in session:
        user = session["user"]
        flash(f"You have been logged out, {user}!", "info")
    session.pop("user", None)
    # 2nd parameter is optional, options: info, warning, error
    return redirect(url_for("login"))


@app.route("/registration", methods=["POST", "GET"])
def registration():
    if request.method == "POST":
        inputName = request.form["createName"]
        inputPass = request.form["createPass"]

        # Check if username is already taken
        foundUser = User.query.filter_by(username=inputName).first()
        if foundUser:
            flash("Username already taken!")
        else:
            newUser = User(inputName, inputPass)
            db.session.add(newUser)
            db.session.commit()
            flash("Account created!")
            return redirect(url_for("admin"))
    return render_template("registration.html")


@app.route("/admin")
def admin():
    # if an admin:
    return render_template("admin.html", values=User.query.all())
    # else:
    # return redirect(url_for("main_page"))


@app.route("/navbar")
def navbar():
    return render_template("navbar.html")


# app.run(debug=True)       Commented out for testing db
# # juuuust necessary
if __name__ == '__main__':
    # Creates db if not exists
    db.drop_all()
    db.create_all()
    app.run(debug=True, host="0.0.0.0", port=5500)
