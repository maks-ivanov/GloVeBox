# GloVeBox
##TreeHacks 2016 - Creating data visuals from text.

This app takes a link to a text article as input, and produces a 3D scatter plot of relations between key terms in the text using a word2vec model. The extraction of key terms is done with TextRazor. We are reducing 50-dimensional word vectors into 3-dimensional representations using t-Distributed Stochastic Neighbor Embedding (credit for design and implementation: [Laurens van der Maaten](https://lvdmaaten.github.io/))

The plot gives some intersting insights of relationships between the words in the context of the article. An example would be the [Wikipedia article for Bitcoin](https://en.wikipedia.org/wiki/Bitcoin). In the resulting scatter you can see the word "cryptocurrency" to be roughly in the middle between the points corresponding to "crime" and "libertarianism", which is a very concise representation of the fact that cryptocurrency is both a tool for freeing the individual from the influence of centralazied banking systems, and a known economic medium for criminal activity. The 3D representation allows for visualization of the more complex relations between the concepts. The user can rotate the plot in any direction and zoom in to examine the details. 

Currently only the local version is functional. The code is very "hackathon quality" and the performance is not optimized for web. 

This app requires glove.6B.50d.txt in the app directory from [GloVe: Global Vectors for Word Representation pretrained model](http://nlp.stanford.edu/data/glove.6B.zip) *AND* [CORS](https://goo.gl/v8h6sh) enabled in your browser (Chrome extension is the easiest)

To run:

1. python -m SimpleHTTPServer in app directory to serve data.json
2. python tsne-l.py link_to_article
3. Open examples/ScatterPlot3D1.html in your browser


