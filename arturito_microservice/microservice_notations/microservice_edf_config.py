import os
import shutil

PATH = 'Processing'
CATEGORIES = ['SECONDS', 'ARTIFICES']
RESULT_PATH = 'Processing/RESULTS'
MODEL = './top_layers.vgg16.h5'
PLOTTED = '/PLOTTED'
SECONDS = '/SECONDS'


def create_directories():
    if os.path.exists('Processing'):
        shutil.rmtree('Processing')

    os.mkdir('Processing')
    os.mkdir('Processing/SECONDS')
    os.mkdir('Processing/PLOTTED')
    os.mkdir('Processing/RESULTS')
    
    os.chmod('Processing/RESULTS',0o777)
    os.chmod('Processing/PLOTTED',0o777)
    os.chmod('Processing/SECONDS',0o777)
    os.chmod('Processing',0o777)

def create_uploads_folder():
    if not os.path.exists('upload'):
        os.mkdir('upload')
    
    os.chmod('upload',0o777)

