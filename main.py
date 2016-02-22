import datetime, requests, sqlite3, schedule,time
# Shedule
import simplejson as json
# Flask imports
from flask import Flask, request, session, g, redirect, url_for, abort, \
	 render_template, flash
# DB tools
from contextlib import closing
# Utils
from tsne import *
import numpy as Math
import os, io
import wikipedia, unicodedata, textrazor
import csv, json
textrazor.api_key = "5aab3e501babf5d3154a86e0b7b290546babfd92fd65791a1e220aa4"
client = textrazor.TextRazor(extractors=["entities", "topics", "dependenciy-trees", "words", "relation"])
import os
##########################################################################

# Initialize the Flask application
app = Flask(__name__)



# Defining a route for the default URL, which loads the form
@app.route('/')
def home():
	return render_template('layout.html')

 
# accepting: POST requests 
@app.route('/visual/', methods=['POST'])
def visual():
	# assigning form input to variables
	link = request.form['Link']
	visualize(link)
	return render_template('ScatterPlot3D1.html')



################################
# Run the app :)
if __name__ == '__main__':
  app.run(  debug=True,
			host="0.0.0.0",
			port=int("80")
  )
