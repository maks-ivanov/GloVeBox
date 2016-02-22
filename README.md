# GloVeBox
##TreeHacks 2016

This app makes a 3D word2vec scatter plot of key terms from a given article.

Currently only the local version is functional. The code is very "hackathon quality" and the performance is not optimized for web. 

This app requires glove.6B.50d.txt in the app directory from [GloVe: Global Vectors for Word Representation pretrained model](http://nlp.stanford.edu/data/glove.6B.zip) *AND* [CORS](https://goo.gl/v8h6sh) enabled in your browser (Chrome extension is the easiest)

To run:

1. python -m SimpleHTTPServer in app directory to serve data.json
2. python tsne-l.py link_to_article
3. Open examples/ScatterPlot3D1.html in your browser


