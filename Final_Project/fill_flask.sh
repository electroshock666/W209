#!/usr/local/bin/bash
####################################################################
# script name: fill_flask.sh
# author: matt white <matt.white@ucberkeley.edu>
# date: 10/23/2022
# purpose: setup python virtualenv and create files for flask app
# invocation: ./fill_flask.sh <project name>
# notes: execute from your home directory. Remember you need to activate
#        your project every time you use it going forward 
#        "source <project name>/bin/activate"
# website: https://apps-fall22.ischool.berkeley.edu/~<username>/<project name>
#####################################################################
#
CWD=`pwd`

# only take one argument
if [ "$#" -gt 1 ]; then
        echo "Usage: ./fill_flask.sh <project name>"
        echo "       Default project name is w209"
        exit 1
fi

PROJECTNAME=$1
# check to see if projectname was passed or not
if [ -z "$PROJECTNAME" ]
then
        PROJECTNAME='w209'
fi

#check to see if directory exists if not create it
if [ ! -d "$CWD/$PROJECTNAME" ] 
then
        echo "$CWD/$PROJECTNAME does not exist, creating..."
        mkdir $CWD/$PROJECTNAME
fi

# check to see if writable, if not or doesn't exist will fail
if [ ! -w "$CWD/$PROJECTNAME" ] 
then
        echo "$CWD/$PROJETNAME is not writable"
        echo "Please check permissions of directory"
        exit 1
fi

# setup the environment
/usr/local/bin/virtualenv $PROJECTNAME
# cd to directory
cd $CWD/$PROJECTNAME
# activate the virtual env
source bin/activate
# upgrade pip
python -m pip install --upgrade pip
# install flask
pip install Flask
# snapshot our env
pip freeze > requirements.txt

# create default hello world app, html file is loaded into 'templates' directoy
# any images, javascript libraries, CSS are placed in static directory.
# first create the <project name>.py entrypoint
cat <<EOF > $PROJECTNAME.py
from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def w209():
    return render_template("w209.html")

if __name__ == "__main__":
    app.run()
EOF

# create some directories (if they don't exist)
mkdir templates static
mkdir static/css static/img static/js static/lib

# create the <project name>.html file in templates/
cat <<EOF > templates/$PROJECTNAME.html
<!DOCTYPE html>
<html><head><title>Project $PROJECTNAME</title></head>
<body>
<h2>Hello World!</h3>
<p>You should replace this HTML file with your main project file!</p>
</body></html>
EOF

# create the start.wsgi
cat <<EOF > start.wsgi
import os, sys

PROJECT_DIR = '$CWD/$PROJECTNAME'

activate_this = '$CWD/$PROJECTNAME/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

sys.path.append(PROJECT_DIR)

from $PROJECTNAME import app as application
EOF

# deactivate to exit env
deactivate

# all done
echo "All done!"
echo "Directory and file structure is as follows:"
ls -R | grep ":$" | sed -e 's/:$//' -e 's/[^-][^\/]*\//--/g' -e 's/^/   /' -e 's/-/|/'

# final message
echo
echo "If you want to upgrade or add libraries or other work in the env you must activate the env"
echo "Use the command 'cd $CWD/$PROJECTNAME && source bin/activiate'"
echo 
echo "Replace the file $CDW/$PROJECTNAME/templates/$PROJECTNAME.html with your main project HTML file" 
echo "Put all your own Javascript files in $CDW/$PROJECTNAME/static/js"
echo "Put all your Javascript libraries in $CDW/$PROJECTNAME/static/lib"
echo "Put all your CSS files in $CDW/$PROJECTNAME/static/css"
echo "Put all your images in $CDW/$PROJECTNAME/static/img"
echo "For further instructions please see help file at: https://htmlpreview.github.io/?https://raw.githubusercontent.com/electroshock666/W209/main/Final_Project/help.html"
echo
echo "Thanks for shopping!"