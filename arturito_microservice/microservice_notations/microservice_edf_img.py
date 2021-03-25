import mne
import os
import numpy as np
import shutil
import matplotlib
matplotlib.use('Agg')
import boto3
from boto3.session import Session
from matplotlib import pyplot as plt
from PIL import Image
from microservice_utils.microservice_mongo import set_seconds
from microservice_notations.microservice_edf_config import SECONDS, PLOTTED, create_directories

def retrieve_file_from_S3(filename, ACCESS_KEY, SECRET_KEY):
    session = Session(aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)
    s3 = session.resource('s3')

    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY , aws_secret_access_key=SECRET_KEY)

    s3.download_file('arturitoproyectofinal',filename,'upload/'+filename)

def upload_S3(local_file, ACCESS_KEY, SECRET_KEY, increment):
    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)

    s3.upload_file('Processing/RESULTS/' + local_file, 'arturitoproyectofinal', local_file)


def crop_edf(image_name):
    image = Image.open(f'Processing{PLOTTED}/{image_name}')
    cropped_img = image.crop((107, 30, 583, 384)).convert('L')
    return cropped_img


def set_strip_edf(total_seconds, increment):
    def strip_edf(image, image_number):
        seconds_dir = 'Processing' + SECONDS
        width, height = image.size
        sec_size = width / 10
        right = sec_size
        left = 0
        sec_number = image_number*10
        while (right <= width) and (sec_number < total_seconds):
            top = 0
            cropped_sec = image.crop((left, top, right, height))
            right = round(right + sec_size, 2)
            left = round(left + sec_size, 2)
            cropped_sec.save(seconds_dir + os.path.join(seconds_dir, "/" + str(sec_number)[:-2] + "_seg.png"))
            increment()
            sec_number = sec_number + 1
    return strip_edf

def filter_raw(raw):
    # ICA Preprocessing filter
    ica = mne.preprocessing.ICA()
    ica.fit(raw)
    raw.load_data()
    ica.apply(raw)

    return raw

def get_raw(path):
    mne.set_log_level("WARNING")
    matplotlib.pyplot.ioff()

    create_directories()

    # Leo archivo
    raw = mne.io.read_raw_edf(path, preload=True)
    raw.rename_channels(lambda s: s.strip("."))
    picks = mne.pick_channels(raw.ch_names, include=[], exclude=[], ordered=False)
    raw = filter_raw(raw)
    to_return = {
        'raw': raw,
        'picks': picks
    }

    return to_return


def plot_edf(raw, currified):
    # Impresión de eeg cada diez segundos (a partir del archivo edf)
    new_path = 'Processing' + PLOTTED


    total_seconds = round(raw.times.max())

    strip_edf = set_strip_edf(total_seconds, currified)
    segment = 0

    while segment < total_seconds:
        fig = raw.plot(n_channels=64, scalings={"eeg": 75e-6}, start=segment)
        plt.close(fig)
        fig.savefig(new_path + '/' + str(segment / 10)[:-2] + '.png', bbox_inches='tight')

        image = crop_edf(f'{str(segment/10)[:-2]}.png')

        strip_edf(image, segment/10)

        os.remove(f'{new_path}/{str(segment/10)[:-2]}.png')
        segment = segment + 10
    return new_path


