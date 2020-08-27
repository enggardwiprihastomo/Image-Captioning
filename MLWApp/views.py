from django.shortcuts import render
from django.http import HttpResponse
import logging
import os
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from pickle import load
from numpy import argmax
from keras.preprocessing.sequence import pad_sequences
from keras.applications.vgg16 import VGG16
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.applications.vgg16 import preprocess_input
from keras.models import Model
from keras.models import load_model

# Create your views here.
def index(request):
        if request.method == 'POST':
                data = request.POST.get("tetu")
                return render(request, "index.html", data)
        else:
                return render(request, "index.html")


def predict(request):
        def extract_features(filename):
                model = VGG16()
                model.layers.pop()
                model = Model(inputs=model.inputs, outputs=model.layers[-1].output)
                image = load_img(filename, target_size=(224, 224))
                image = img_to_array(image)
                image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
                image = preprocess_input(image)
                feature = model.predict(image, verbose=0)
                return feature
        
        def word_for_id(integer, tokenizer):
                for word, index in tokenizer.word_index.items():
                        if index == integer:
                                return word
                return None
        
        def generate_desc(model, tokenizer, photo, max_length):
                in_text = 'startseq'
                for i in range(max_length):
                        sequence = tokenizer.texts_to_sequences([in_text])[0]
                        sequence = pad_sequences([sequence], maxlen=max_length)
                        yhat = model.predict([photo,sequence], verbose=0)
                        yhat = argmax(yhat)
                        word = word_for_id(yhat, tokenizer)
                        if word is None:
                                break
                        in_text += ' ' + word
                        if word == 'endseq':
                                break
                return in_text
        
        if request.method == "GET":
                raise Http404("URL doesn't exists")
        else:   
                response_data = {}
                filename = request.POST["filename"]
                pathFile = os.path.dirname(os.path.abspath(__file__))
                tokenizer = load(open(pathFile + '/tokenizer.pkl', 'rb'))
                max_length = 34
                model = load_model(pathFile + '/model_49.h5')
                photo = extract_features(pathFile + '/Test Images/' + filename)
                description = generate_desc(model, tokenizer, photo, max_length)
                response_data["desc"] = description
                return JsonResponse(response_data)
