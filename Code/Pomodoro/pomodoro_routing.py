# to run:
# 1) Have all proper things installed
# 2) Be in venv
# 3) export FLASK_ENV=development  <------ if developer/debugger mode on desired (with auto refresh/watch)
# 4) export FLASK_APP=pomodoro_routing
# 5) flask run

from flask import Flask, render_template

# __name__ is just a built in flask variable to be similar to a "Main" function
app = Flask(__name__)


# begin URL decorators
@app.route("/")  # route page / home page
def main_page():
    return render_template("main.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/registration")
def registration():
    return render_template("registration.html")


@app.route("/admin")
def admin():
    return render_template("admin.html")


@app.route("/navbar")
def navbar():
    return render_template("navbar.html")


app.run(debug=True)
# # juuuust necessary
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5500)
