# to run:
# 1) Have all proper things installed
# 2) Be in venv
# 3) export FLASK_ENV=development  <------ if developer/debugger mode on desired (with auto refresh/watch)
# 4) export FLASK_APP=pomodoro_routing
# 5) flask run

from flask import Flask, redirect, url_for, render_template, request, session, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import bcrypt
# imports used for/with spotify api
import os
from flask import Flask, session, request, redirect, render_template
from flask_session import Session
import spotipy as sp
import uuid
from spotipy.oauth2 import SpotifyOAuth

os.environ["SPOTIPY_CLIENT_ID"] = '8949721794b24206a0147b227653e819'
os.environ["SPOTIPY_CLIENT_SECRET"] = 'a86723e66f584dea8628741f7b09a4ce'
os.environ["SPOTIPY_REDIRECT_URI"] = 'http://127.0.0.1:5000/spotify-auth'

sp_scope = 'playlist-read-private'

# __name__ is just a built in flask variable to be similar to a "Main" function
app = Flask(__name__)

# more spotify
# app.config['SECRET_KEY'] = os.urandom(64)
# app.config['SESSION_TYPE'] = 'filesystem'
# app.config['SESSION_FILE_DIR'] = './.flask_session/'
# Session(app)

caches_folder = './.spotify_caches/'
if not os.path.exists(caches_folder):
    os.makedirs(caches_folder)


def session_cache_path():
    print("UUID 1: ", session['uuid'])
    return caches_folder + session.get('uuid')


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
    hashedPass = db.Column(db.String(50), nullable=False)
    dateAdded = db.Column(db.Date, default=datetime.utcnow)
    isAdmin = db.Column(db.Boolean, default=False, nullable=False)
    videos = db.relationship('Video', backref='user')

    def __init__(self, username, password):
        self.username = username
        self.hashedPass = password


#class Playlist(db.Model):
#    playlistID = db.Column(db.Integer, primary_key=True)
#    playlistName = db.Column(db.String(20), default = 'default', nullable=False)
#    forRest = db.Column(db.Boolean, default=True, nullable=False)
#    playlistUsers = db.relationship('UserPlaylist', backref='owner')
#
#    def __init__(self, name):
#        self.playlistName = name


#class UserPlayist(db.Model):
#    user_id = db.Column(db.Integer, db.ForeignKey("user.userID"), primary_key=True)
#    playlist_id = db.Column(db.Integer, db.ForeignKey("playlist.playlistID"), primary_key=True)
#    given_name = db.Column(db.String(20), default = 'default', nullable=False)
#    
#    def __init__(self, givenName):
#        self.given_name = givenName


class Video(db.Model):
    videoID = db.Column(db.Integer, primary_key=True)
    videoName = db.Column(db.String(20), default = 'default', nullable=False)
    videoURL = db.Column(db.String(200), default = 'default', nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.userID"))

    def __init__(self, name, url):
        self.videoName = name
        self.videoURL = url


#class UserVideo(db.Model):
#    user_id = db.Column(db.Integer, db.ForeignKey("user.userID"), primary_key=True)
#    video_id = db.Column(db.Integer, db.ForeignKey("video.videoID"), primary_key=True)
#    given_name = db.Column(db.String(20), default = 'default', nullable=False)
#    
#    def __init__(self, givenName):
#        self.given_name = givenName


# begin URL decorators
@app.route("/", methods=["POST", "GET"])  # route page / home page
def main_page():
    if request.method == "POST":
        #url = request.form["urlYoutube"]
        vidName = request.form.get('vidName')
        vidURL = request.form.get('vidURL')
        newVid = Video(vidName, vidURL)
        db.session.add(newVid)
        db.session.commit()
        
        vid_ID = newVid.videoID
        #vid_ID = Video.query.filter_by(url=videoURL).first()
        return str(vid_ID)
    return render_template("main.html")


@app.route("/navbar")
def navbar():
    return render_template("navbar.html")


@app.route('/mediaPlayer')
def mediaPlayer():
    return render_template("sharedTemplates/mediaPlayer.html")


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
            # Save the user in the session
            session["user"] = inputName


            # Check that an unhashed password matches one that has previously been hashed
            if bcrypt.checkpw(inputPass.encode('utf-8'), searchUser.hashedPass):
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

    # clear spotify caches
    try:
        os.remove(f".cache")
        app.config['SPOTIFY_USER_TOKEN'] = "null"
    except OSError as e:
        print("Error: %s - %s." % (e.filename, e.strerror))
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
            # Hash a password for the first time, with a randomly-generated salt
            passHash = bcrypt.hashpw(inputPass.encode('utf-8'), bcrypt.gensalt())

            newUser = User(inputName, passHash)
            db.session.add(newUser)
            db.session.commit()
            flash("Account created!")
            return redirect(url_for("admin"))
    return render_template("registration.html")


@app.route("/admin", methods=["POST", "GET"])
def admin():
    if request.method == "POST":
        if request.form.get("delete_user"):
            selectedUserID = request.form['delete_user']
            userToDelete = User.query.filter_by(userID=selectedUserID).first()
            db.session.delete(userToDelete)
            db.session.commit()
            flash(f"Deleted {userToDelete.username}")
    # if an admin:
    return render_template("admin.html", users=User.query.all(), videos=Video.query.all())
    # else:
    # return redirect(url_for("main_page"))


""" YOUTUBE endpoints """


@app.route("/youtube", methods=["POST", "GET"])
def youtube():
    return render_template("/sharedTemplates/youtube.html")


@app.route("/spotify")
def spotify():
    return render_template("/sharedTemplates/spotify.html")


""" SPOTIFY endpoints"""


@app.route("/spotify-auth")
# for when spotify auth returns authorization code
@app.route("/spotify-auth/<code>")
def spotify_auth():
    print("spot auth enter....")
    auth_manager = sp.oauth2.SpotifyOAuth(scope=sp_scope, show_dialog=True)
    token = {}
    if request.args.get("code"):
        # Step 3. Being redirected from Spotify auth page
        token = auth_manager.get_access_token(request.args.get("code"))
        app.config['SPOTIFY_USER_TOKEN'] = token

    if not auth_manager.validate_token(token):
        # Step 2. Display sign in link when no token
        auth_url = auth_manager.get_authorize_url()
        return render_template('spotify_login.html', auth_url=auth_url)

    # getplaylists
    spfy = sp.Spotify(auth_manager=SpotifyOAuth(scope=sp_scope))
    playlists = spfy.current_user_playlists()

    default_playlist = playlists['items'][0]['id']
    user_name = spfy.me()["display_name"]
    print("spotify_auth::playlists: ", playlists)
    print("spotify_auth::playlist: ", default_playlist)
    print("spotify_auth::username: ", user_name)
    return render_template("main.html",
                           playlists=playlists,
                           playlist_id=default_playlist,
                           user_name=user_name,
                           message=None,
                           spotify_activated=1)


@app.route("/playlists")
def user_playlists():
    print("/playlists::")
    playlists = None
    default_playlist = None
    user_name = None
    message = None

    try:
        token = app.config['SPOTIFY_USER_TOKEN']
        print("/playlists::GOT Token")
    except:
        token = None
    if token:
        print("/playlists::GOT Token")
        spfy = sp.Spotify(auth_manager=SpotifyOAuth(scope=sp_scope))
        playlists = spfy.current_user_playlists()
        print("PLAYLISTs::playlists ", playlists)
        # note: playlists are returned in reverse order
        default_playlist = playlists['items'][0]['id']
        user_name = spfy.me()["display_name"]
        print("PLAYLISTS::default_playlist: ", playlists['items'][0])
        # return { "playlist ID": playlists['items'][0]['id']}
    else:
        message = "Please log into your spotify account."

    return render_template("main.html",
                           playlists=playlists,
                           playlist_id=default_playlist,
                           user_name=user_name,
                           message=message)


@app.route('/playlist/<id>/')
def get_playlist(id):
    print("/playlist::")
    spfy = sp.Spotify(auth_manager=SpotifyOAuth(scope=sp_scope))
    playlists = spfy.current_user_playlists()
    playlist = spfy.playlist(id)
    print("/playlist::playlist ", playlist)
    return render_template("main.html",
                           playlists=playlists,
                           playlist_id=playlist["id"],
                           user_name=None,
                           message=None)


# app.run(debug=True)       Commented out for testing db
# # juuuust necessary
if __name__ == '__main__':
    # Refreshes and creates db
    db.drop_all()
    db.create_all()

    # Add all admin accounts
    usernames = ["Daniel", "Uri", "Josh", "Aiden", "Tea", "Yan"]
    passwords = ["Harris", "Soltz", "Richardson", "Wick", "Wright", "Zhang"]
    for i in range(len(usernames)):
        passHash = bcrypt.hashpw(passwords[i].encode('utf-8'), bcrypt.gensalt())
        newUser = User(usernames[i], passHash)
        newUser.isAdmin = True
        db.session.add(newUser)
    db.session.commit()

    # Adding videos to test table relations
    videoNames = ["The Best of Piano", "Elon Musk Interview"]
    videoURLs = ["https://www.youtube.com/watch?v=cGYyOY4XaFs", "https://www.youtube.com/watch?v=ESIjxVudERY"]
    videoUsers = ["Uri", "Tea"]
    for i in range(len(videoNames)):
        forUser = User.query.filter_by(username=videoUsers[i]).first()
        newVideo = Video(videoNames[i], videoURLs[i])
        newVideo.user = forUser
        db.session.add(newVideo)
    db.session.commit()


    app.run(debug=True, host="0.0.0.0", port=5500)
