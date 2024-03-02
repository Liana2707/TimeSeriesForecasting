import numpy as np
import pandas as pd
from scipy.io import loadmat 

import pandas as pd

def create_time_column(df):
    date_columns = [col for col in df.columns if col in ['date', 'Date', 'DATE']]
    for col in date_columns:
        df[col] = pd.to_datetime(df[col])
        df[col] = (df[col] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms')
    if date_columns.__len__() == 0:
        start_date = '2022-01-01'
        step = pd.to_timedelta(1, 'D')
        df['date'] = pd.date_range(start=start_date, periods=len(df), freq=step)
    return date_columns

def upload_csv(path, **kwargs):
    df = pd.read_csv(path,**kwargs)  
    date_columns = create_time_column(df)
    return df, date_columns

def upload_xls(path, **kwargs):
    df = pd.read_excel(path, **kwargs)
    date_columns = create_time_column(df)
    return df, date_columns

def upload_json(path, **kwargs):
    df = pd.read_json(path, **kwargs)
    date_columns = create_time_column(df)
    return df, date_columns

def upload_mat(path, **kwargs):
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
            date_columns = create_time_column(df)
            return df, date_columns
    

class Uploader:
    __options = {
        'csv':  upload_csv, 
        'xls':  upload_xls, 
        'xlsx':  upload_xls,
        'json': upload_json,
        'mat':  upload_mat
        } 
        

    def upload(self, path, **kwargs):
        file_extension = path.rsplit('.', 1)[1].lower()
        series = self.__options.get(file_extension)(path, **kwargs)
        return series
    
   
   

