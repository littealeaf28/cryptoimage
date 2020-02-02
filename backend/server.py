from flask import Flask, request, send_file
from flask_cors import CORS
from PIL import Image
import json
from tempfile import NamedTemporaryFile
from io import BytesIO
import base64
import math
from shutil import copyfileobj
from os import remove

app = Flask(__name__)
cors = CORS(app)

def GetRGBTuple(msgIndex, curMsg):
    curMsgIndex = msgIndex
    toReturn = [0,0,0]
    for i in range(3):
        if curMsgIndex < len(curMsg):
            toReturn[i] = ord(curMsg[curMsgIndex])
            curMsgIndex += 1
    return tuple(toReturn)

@app.route("/encode", methods=['POST'])
def encode():
    data = request.get_json()
    msg = data['msg']
    imageEncoded = data['imageArray']
    im = Image.open(BytesIO(base64.b64decode(imageEncoded)))

    pixelInterval = 1000

    caesarShift = 700
    for c in msg:
        c = chr((ord(c) + caesarShift) % 256)
    
    if (len(msg) * pixelInterval / 3 > (im.size[0] * im.size[1])):
        aspectRatio = im.size[0] / im.size[1]
        squareSize = math.sqrt(len(msg) * pixelInterval / 3)
        size0 = round(squareSize * aspectRatio + 1) + 1
        size1 = round(squareSize / aspectRatio + 1)
        im = im.resize((size0, size1))

    pixInd = 0
    msgInd = 0
    pixels = im.load()
    try:
        for i in range(im.size[0]):
            for j in range(im.size[1]):
                if pixInd % pixelInterval == 0:
                    pixels[i,j] = GetRGBTuple(msgInd, msg)
                    msgInd += 3
                if msgInd >= len(msg):
                    raise AssertionError()
                pixInd += 1
    except:
        pass

    numZeros = 9 - len(str(len(msg)))
    stringLen = "0" * numZeros + str(len(msg))
    for x in range(3):
        thisPxl = (ord(stringLen[3*x]), ord(stringLen[3*x+1]), ord(stringLen[3*x+2]))
        pixels[im.size[0] - 1, round(im.size[1] - 1)/2*x] = thisPxl
    
    tempImg = NamedTemporaryFile(mode='w+b', suffix='png')
    im.save('newImg.png', 'png')
    openImg = open('newImg.png', 'rb')
    copyfileobj(openImg, tempImg)
    openImg.close()
    remove('newImg.png')
    tempImg.seek(0,0)
    response = send_file(tempImg, as_attachment=True, attachment_filename='newImg.png')

    return response

@app.route("/decode", methods=['POST'])
def decode():
    data = request.get_json()
    imageEncoded = data['imageArray']
    im = Image.open(BytesIO(base64.b64decode(imageEncoded)))

    pixelInterval = 1000
    msg = ""
    pixels = im.load()

    lenString = ""
    for x in range(3):
        thisPxl = pixels[im.size[0]-1, round(im.size[1]-1)/2*x]
        lenString += chr(thisPxl[0]) + chr(thisPxl[1]) + chr(thisPxl[2])

    msgLen = int(lenString)

    pixInd = 0
    msgInd = 0
    try:
        for i in range(im.size[0]):
            for j in range(im.size[1]):
                if pixInd % pixelInterval == 0:
                    msg += chr(pixels[i,j][0]) + chr(pixels[i,j][1]) + chr(pixels[i,j][2])
                    msgInd += 3
                if msgInd >= msgLen:
                    raise AssertionError()
                pixInd += 1
    except:
        pass

    caesar_shift = 700
    for c in msg:
        c = chr((ord(c) - caesar_shift) % 256)

    return msg

if(__name__ == '__main__'):
    app.run()