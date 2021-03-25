from flask import Flask, request, Response, jsonify, make_response
import pymongo
from bson.objectid import ObjectId
import os
from bson.json_util import dumps
import time
import datetime
from werkzeug.utils import secure_filename
from threading import Thread
from microservice_notations.microservice_edf_config import create_uploads_folder
from microservice_utils.microservice_mongo import change_status, set_seconds, set_results, retrieve_doctor
from microservice_notations.microservice_edf_img import plot_edf, retrieve_file_from_S3, get_raw, upload_S3
from microservice_notations.microservice_edf_utils import predict_edf, send_email
from microservice_notations.microservice_edf_notate import write_edf
ACCESS_KEY = 'AKIAJH6F66SBCJO6WVPQ'
SECRET_KEY = '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'

# Mongo connection function
def connect_mongo(path):
    try:
        arturito_client = pymongo.MongoClient(path)
        db = arturito_client.get_default_database()
        return db
    except Exception as e:
        raise e

application = app = Flask(__name__)

# Select actual string connection
mongo1_path = 'mongodb://heroku_mjldhvzp:q0rrd1akklls3140jc12p88np3@ds339348.mlab.com:39348/heroku_mjldhvzp?retryWrites=false'
port = 5000

# Create connections
mongo1_connection = connect_mongo(mongo1_path)

# Asynchronos executor (mutithreading)
def do_time(patient_info):
    global mongo1_connection

    b_processing = datetime.datetime.now()
    
    change_status(mongo1_connection, patient_info, 'Preprocesando archivo')

    st_path = f'_modified_{patient_info["filename"]}'
    create_uploads_folder()

    retrieve_file_from_S3(patient_info['filename'], ACCESS_KEY, SECRET_KEY)

    raw_info = get_raw(f'upload/{patient_info["filename"]}')
    raw = raw_info['raw']
    picks = raw_info['picks']

    total_seconds = round(raw.times.max())
    currified = set_seconds(mongo1_connection, patient_info, total_seconds)

    change_status(mongo1_connection, patient_info, 'Procesando archivo')
    
    plot_edf(raw, currified)

    currified = set_seconds(mongo1_connection, patient_info, total_seconds)  

    change_status(mongo1_connection, patient_info, 'Evaluando')

    artifacts, prediction_dictionary, total_seconds = predict_edf(currified)
    size_artifacts = len(artifacts)
    
    prediction_info = {
            'artifacts': size_artifacts,
            'seconds': total_seconds,
            'total_progress': size_artifacts,
            'metrics': prediction_dictionary
        }

    currified = set_seconds(mongo1_connection, patient_info, prediction_info['total_progress'])

    change_status(mongo1_connection, patient_info, 'Marcando archivo')
    
    write_edf(raw, st_path, artifacts, currified, picks=picks, overwrite=True)

    change_status(mongo1_connection, patient_info, 'Guardando archivo')

    set_results(mongo1_connection, patient_info, prediction_info, total_seconds)

    upload_S3(st_path, ACCESS_KEY, SECRET_KEY, currified)

    email, name, lastname = retrieve_doctor(mongo1_connection, patient_info["file_id"])

    a_processing = datetime.datetime.now()
    
    time_diff = a_processing - b_processing

    procesado = int(time_diff.total_seconds())

    send_email(email, f'Processing/RESULTS/{st_path}' , name + " " + lastname, patient_info["filename"], int(total_seconds) - int(size_artifacts), int(size_artifacts), int(procesado))
                       
    change_status(mongo1_connection, patient_info, 'Finalizado')
                       

@app.route("/notations", methods=['POST'])
def get_notated_file():
    if request.method == 'POST':
        global mongo1_connection
        
        json_data = request.json
        file_name = json_data['filename']
        file_id = json_data['_id']
        patient = json_data['patient']

        patient_info = {
            'patient_id': patient,
            'file_id': file_id,
            'filename': file_name
        }

        change_status(mongo1_connection, patient_info, 'En cola')

        thread = Thread(target=do_time, kwargs={'patient_info':patient_info})
        thread.start()
        return 'processed', 200
    else:
        return 404

if __name__ == '__main__':
    application.run(debug=True, port=port)
