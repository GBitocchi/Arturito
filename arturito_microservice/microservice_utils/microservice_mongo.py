from bson.objectid import ObjectId


def change_status(mongo, patient_info, status):
    file_collection = mongo['files']
    patient_collection = mongo['patients']

    patient_id = patient_info['patient_id']
    file_id = patient_info['file_id']

    patient_collection.update_one(
        {'_id': ObjectId(patient_id), 'files._id': ObjectId(file_id)}, 
        {"$set": {'files.$.stage': status}}
    )

    file_collection.update_one(
        {'_id': ObjectId(file_id)},
        {'$set': {'stage': status}}
    )

def retrieve_doctor(mongo,id_file):
    try:
        file_collection = mongo["files"]       
        
        query_file = { "_id": ObjectId(id_file) }

        updated_file = file_collection.find_one(query_file) 
        id_doctor = updated_file.get('doctor')['id']
        doctor_collection = mongo["doctors"]       
        
        query_doctor = { "_id": ObjectId(id_doctor) }

        updated_doctor = doctor_collection.find_one(query_doctor) 

        return updated_doctor.get('mail'), updated_doctor.get('name'), updated_doctor.get('lastname')
    except Exception as e:
        raise e

'''def save_file(mongo, patient_info, result_path, prediction_info, increment):
    try:
        seconds = prediction_info["total_seconds"] - prediction_info["size_artifacts"]

        file_collection = mongo["files"]       
        
        query = { "_id": ObjectId(patient_info["file_id"]) }
        
        values = { "$set": { "resultPath": result_path, "seconds": seconds, "artifacts": prediction_info["size_artifacts"] } }

        file_collection.update_one(query, values)
    except Exception as e:
        raise e'''


def set_results(mongo, patient_info, result, total_seconds):
    file_collection = mongo['files']
    patient_collection = mongo['patients']
    gadget_collection = mongo['gadgets']

    patient_id = patient_info['patient_id']
    file_id = patient_info['file_id']
    filename = patient_info['filename']

    seconds = result['seconds']
    artifacts = result['artifacts']

    acc_length = 0
    acc_bottom = 4
    acc_top = 6

    while acc_bottom <= acc_top:
        acc_length += len(result['metrics'].get(str(acc_bottom)))       
        acc_bottom += 1

    acc_length = int(round(100 - ((acc_length * 100) / total_seconds)))

    patient_collection.update_one(
        {'_id': ObjectId(patient_id), 'files._id': ObjectId(file_id)},
        {'$set': {
            'files.$.seconds': seconds, 
            'files.$.artifacts': artifacts, 
            'files.$.originalPath': filename, 
            'files.$.resultPath': f'_modified_{filename}'
            }
        }
    )

    query_file = { "_id": ObjectId(file_id) }

    retrieved_gadget = file_collection.find_one(query_file).get('gadget')

    gadget_collection.update_one(
        {'_id': ObjectId(retrieved_gadget)},
        {'$inc': {
            'artifacts': artifacts,
            'seconds': seconds
            }
        }
    )

    file_collection.update_one(
        {'_id': ObjectId(file_id)},
        {'$set': {
            'seconds': seconds, 
            'artifacts': artifacts,
            'originalPath': filename,
            'resultPath': f'_modified_{filename}',
            'metrics': result['metrics'],
            'acc': acc_length
            }
        }
    )


def set_seconds(mongo, patient_info, total):
    file_collection = mongo['files']
    patient_collection = mongo['patients']

    patient_id = patient_info['patient_id']
    file_id = patient_info['file_id']

    patient_collection.update_one(
        {'_id': ObjectId(patient_id), 'files._id': ObjectId(file_id)}, 
        {'$set': {'files.$.status.total': total, 'files.$.status.seconds': 0}}
    )
    file_collection.update_one(
        {'_id': ObjectId(file_id)},
        {'$set': {'status.total': total, 'status.seconds': 0}}
    )

    def increment():
        patient_collection.update_one(
            {'_id': ObjectId(patient_id), 'files._id': ObjectId(file_id)}, 
            {'$inc': {
                'files.$.status.seconds': 1 
            }}
        )
        file_collection.update_one(
            {'_id': ObjectId(file_id)},
            {'$inc': {
                'status.seconds': 1
            }}
        )
    return increment
