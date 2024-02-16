import numpy as np
import pandas as pd
from scipy.io import loadmat 

import pandas as pd

def create_time_column(df):
    date_columns = [col for col in df.columns if col in ['date', 'Date', 'DATE']]
    for col in date_columns:
        df[col] = pd.to_datetime(df[col], errors='coerce')
    if date_columns.__len__() == 0:
        df['date'] = pd.to_datetime('1970-01-01') 
   


def upload_csv(path):
    df = pd.read_csv(path)  
    create_time_column(df)
    return df

def upload_xls(path):
    df = pd.read_excel(path)
    create_time_column(df)
    return df

def upload_json(path):
    df = pd.read_json(path)
    create_time_column(df)
    return df

def upload_mat(path):
    mat_data = loadmat(path)
    
    all_keys = mat_data.keys()

    
    for key in all_keys:
        # Пропускаем служебные ключи
        if key.startswith('__') and key.endswith('__'):
            continue
        
        if isinstance(mat_data[key], np.ndarray):
            array_data = mat_data[key]
            print(f"Имя массива: {key}")
            print(f"Содержимое массива: {array_data}")
            
            df = pd.DataFrame(array_data)
            create_time_column(df)
            return df
    

class Uploader:
    __options = {
        'csv':  upload_csv, 
        'xls':  upload_xls, 
        'xlsx':  upload_xls,
        'json': upload_json,
        'mat':  upload_mat
        } 
        

    def upload(self, path):
        file_extension = path.rsplit('.', 1)[1].lower()
        date_range = self.__options.get(file_extension)(path)
        return date_range
    
   
   

