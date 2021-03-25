import pyedflib
from datetime import datetime
import mne
import os


def write_edf(mne_raw, name, seconds, increment, picks=None, tmin=0, tmax=None, overwrite=False):
    if not os.path.exists('Processing/RESULTS'):
        os.mkdir('Processing/RESULTS')
    
    os.chmod('Processing/RESULTS',0o777)
    
    fname = 'Processing/RESULTS/' + name
    if not issubclass(type(mne_raw), mne.io.BaseRaw):
        raise TypeError('Must be mne.io.Raw type')
    if not overwrite and os.path.exists(fname):
        raise OSError('File already exists. No overwrite.')
    # static settings
    file_type = pyedflib.FILETYPE_EDFPLUS 
    sfreq = mne_raw.info['sfreq']
    date = datetime.now().strftime( '%d %b %Y %H:%M:%S')
    first_sample = int(sfreq*tmin)
    last_sample  = int(sfreq*tmax) if tmax is not None else None

    
    # convert data
    channels = mne_raw.get_data(picks, 
                                start = first_sample,
                                stop  = last_sample)
    
    # convert to microvolts to scale up precision
    channels *= 1e6
    
    # set conversion parameters
    dmin, dmax = [-32768,  32767]
    pmin, pmax = [channels.min(), channels.max()]
    n_channels = len(channels)
    
    # create channel from this   
    try:
        f = pyedflib.EdfWriter(fname,
                               n_channels=n_channels, 
                               file_type=file_type)
        
        channel_info = []
        data_list = []
        
        for i in range(n_channels):
            ch_dict = {'label': mne_raw.ch_names[i], 
                       'dimension': 'uV', 
                       'sample_rate': sfreq, 
                       'physical_min': pmin, 
                       'physical_max': pmax, 
                       'digital_min':  dmin, 
                       'digital_max':  dmax, 
                       'transducer': '', 
                       'prefilter': ''}
        
            channel_info.append(ch_dict)
            data_list.append(channels[i])
        
        index = 0

        pro_seconds = []
    
        for second in seconds:    
            if(second in pro_seconds):
                pass
            elif(index+1 < len(seconds) and second+1 == seconds[index+1]):
                pro_seconds.append(second)
                extension = index + 1
                increment()
                while extension+1 < len(seconds) and seconds[extension]+1 == seconds[extension+1]:
                    extension = extension + 1
                    pro_seconds.append(seconds[extension+1])
                    increment()
                index = extension
                duration = seconds[index] - second
                f.writeAnnotation(second, duration, "Artificio")
            else:
                pro_seconds.append(second)
                f.writeAnnotation(second, 0, "Artificio")
                index = index + 1
                increment()
        
        f.setTechnician('mne-gist-save-edf-skjerns')
        f.setSignalHeaders(channel_info)
        f.setStartdatetime(date)
        f.writeSamples(data_list)
    except Exception as e:
        print(e)
        return False
    finally:
        f.close()    
    return True