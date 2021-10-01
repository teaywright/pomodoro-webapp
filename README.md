# CSCI-3308-Fall21-015-06
Welcome to the team Misunderstood Pandas repository. We are making a pomodoro clock.


Best way to start project:  Open Flask documentation and follow.


Alternative:


Check which python you are currently running on:

**python --version

If showing earlier than 3, try

**python3 --version

If python 3.** never shows then please update.

If python3 was only available please follow all steps while saying either “python3” or “pip3” when applicable


**pip --version

If pip is found missing please install


Set up a virtual environment to prevent future issues with new releases of python /  flask, and other contradictory frameworks such as Django

​​ <------ Documentation on how

For Windows Bash it was CD into desired environment directory (can be anywhere, and I recommend having a folder accessible for future projects), mkdir a new environment folder, mkdir a new 2021 Flask folder.  then follow the documentation to do something similar to “python3 -m venv ./” to create the new area


Activate the environment

CD into environment folder/Scripts.  Next command can be different depending on OS.

**source activate


Now ensure flask is installed on your venv:

flask --version


If not, then type:

** pip install flask        (remember the 3 if you need to)



Following Commands are through Bash in Windows.  If you are using something else please use ​​  to see your translation

Now navigate to your main code

** export FLASK_APP=hello


Set to debug/developer mode in order to watch and refresh the server

** export FLASK_ENV=development


Finally, the following SHOULD start the project up

** flask run


Ensure to have auto save on in editor if you want up to date  refresh’s on project.








