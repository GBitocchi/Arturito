import os
import numpy as np
import keras.backend.tensorflow_backend as tb
from keras.models import load_model
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
from microservice_notations.microservice_edf_config import MODEL, CATEGORIES, PATH, SECONDS
import smtplib
from email.message import EmailMessage
from datetime import datetime

def process_image(img):
    resulting_image = image.load_img(f'{PATH}{SECONDS}/{img}', target_size=(224, 224))
    image_array = image.img_to_array(resulting_image)
    image_array = np.expand_dims(image_array, axis=0)
    image_array = preprocess_input(image_array)
    return image_array


def predict_edf(increment):
    tb._SYMBOLIC_SCOPE.value = True
    second = 0
    model = load_model(MODEL)
    artifacts = []
    prediction_dictionary = crtPredDictionary()
    for img in os.listdir(f'{PATH}{SECONDS}'):
        try:
            prediction = (model.predict(process_image(img)))[0][1]           
            pred_index = int(round(prediction*10))
            prediction_dictionary.get(str(pred_index)).append(second)
            if CATEGORIES[int(round(prediction))] == CATEGORIES[1]:
                artifacts.append(second)
            increment()
            second += 1
        except Exception as e:
            print(e)
            pass
    return artifacts, prediction_dictionary, second

def crtPredDictionary():
    dictionary = {}
    index = 0

    while index <= 10:
        dictionary[str(index)] = []
        index += 1

    return dictionary


def generate_template(doctor, time_now, estudio, artificios, segundos, total_processed, procesado):
    return """<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Documento sin título</title>
    </head>
    <body style="width:100%; max-width:1200px; display:table; margin:auto; background:#fff;">
        <img style="width: 300px; margin: 20px auto; display: table;" src="https://i.ibb.co/x2gbJ8F/brain-eeg.png" />
        <h3 style="font-family: arial;  margin: 50px 0; padding: 0 0 10px;  border-bottom: 1px solid #ccc;  font-size: 24px; font-weight: 400;">Electroencefalograma evaluado</h3>
        <table width="100%" style="font-family: Arial, Geneva, Tahoma, sans-serif;">
            <tr>
                <td style="width: 10%; font-size: 14px; padding: 10px 5px 10px 20px;">Medico</td>
                <td style=" width: 23.3%; border: 1px solid #e15200; text-indent: 5px; padding: 5px 0;">
                    """ + """ """ + doctor + """ """ """
                </td>
                <td style="width: 10%; font-size: 14px; padding: 10px 5px 10px 20px;">Fecha</td>
                <td style=" width: 23.3%; border: 1px solid #e15200; text-indent: 5px; padding: 5px 0;">
                    """ + """ """ + time_now + """ """ """
                </td>
                <td style="width: 10%; font-size: 14px; padding: 10px 5px 10px 20px;">Estudio</td>
                <td style=" width: 23.3%; border: 1px solid #e15200; text-indent: 5px; padding: 5px 0;">
                    """ + """ """ + estudio + """ """ """
                </td>
            </tr>
            <tr>
                <td style="height:20px"></td>
            </tr>
            <tr>
                <td style="height:20px"></td>
            </tr>
        </table>
        <h3 style="font-family: arial;  margin: 50px 0; padding: 0 0 10px;  border-bottom: 1px solid #ccc;  font-size: 24px; font-weight: 400;">Detalle de la evaluacion</h3>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="font-family: Arial, Geneva, Tahoma, sans-serif; font-size: 12px; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="font-size: 14px; border-bottom: 1px solid #000; text-align: left; padding: 5px 0;">Cantidad de Artificios</th>
                    <th style="font-size: 14px; border-bottom: 1px solid #000; text-align: left; padding: 5px 0;">Cantidad de segundos normales</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="font-size: 14px; border-bottom: 1px solid #ccc; text-align: left; min-width: 120px;">""" + str(artificios) + """</td>
                    <td style="font-size: 14px; border-bottom: 1px solid #ccc; text-align: left; min-width: 120px;">""" + str(segundos) + """</td>
                </tr>
            </tbody>
        </table>
        <table width="50%" border="0" cellpadding="0" cellspacing="0" align="center" style="font-family: Arial, Geneva, Tahoma, sans-serif; float: right; margin: 50px 0;">
            <tr>
                <td style="padding: 20px 0; font-size: 18px;border-bottom: 1px solid #ccc; text-align: left;">Segundos totales:</td>
                <td style="padding: 20px 0; font-size: 18px;border-bottom: 1px solid #ccc; text-align: right; font-weight: 600;"> """ + total_processed + """ segundos</td>
            </tr>
            <tr>
                <td style="padding: 20px 0; font-size: 18px;border-bottom: 1px solid #ccc; text-align: left;">Tiempo de procesamiento:</td>
                <td style="padding: 20px 0; font-size: 18px;border-bottom: 1px solid #ccc; text-align: right; font-weight: 600;"> """ + str(procesado) + """ segundos</td>
            </tr>
        </table>
    </body>
    </html>"""

def send_email(receiver, result_path, doctor, estudio, segundos, artificios, procesado):
    
    time_now = datetime.today().strftime('%d-%m-%Y')

    msg = EmailMessage()
    msg['Subject'] = '¡Electroencefalograma "' + estudio + '" evaluado con exito! | ' + time_now
    msg['From'] = 'brain.eeg.arturito.5403@gmail.com'
    msg['To'] = receiver

    total_processed = str(segundos + artificios)

    email_template = generate_template(doctor, time_now, estudio, artificios, segundos, total_processed, procesado)

    msg.add_alternative(email_template, subtype='html')

    file_info = os.stat(result_path)
    maximum_bytes = 20000000 #Envio el archivo si es menor a 20MB

    if(file_info.st_size < maximum_bytes):   
        with open(result_path, 'rb') as f:
            file_data = f.read()
            file_name = f.name

        msg.add_attachment(file_data, maintype='application', subtype='octet-stream', filename=file_name)

    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.ehlo() #Identificacion
        smtp.starttls() #Encriptacion de trafico
        smtp.ehlo() #Reidentificacion

        smtp.login('brain.eeg.arturito.5403@gmail.com','artubrain19')	

        smtp.send_message(msg)
