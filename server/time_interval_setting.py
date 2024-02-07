import numpy as np
import pandas as pd
from setting import Setting

def generate_count_sequence(count):
    random_date = pd.to_datetime('2022-01-01')
    date_range = pd.date_range(start=random_date, periods=count, freq='D')

    return date_range.day

def generate_day_sequence(count):
    start_date = pd.Timestamp('1900-01-01')
    end_date = pd.Timestamp('2024-12-31')
    random_date = start_date + pd.to_timedelta(np.random.randint((end_date - start_date).days), unit='D')

    return pd.date_range(start=random_date, periods=count, freq='D')

def generate_hour_sequence(count):
    random_date = pd.to_datetime(np.random.randint(0, 2**63 - 1), unit='ns', origin='1970-01-01')
    
    return pd.date_range(start=random_date, periods=count, freq='h')

def generate_minute_sequence(count):
    random_date = pd.to_datetime(np.random.randint(0, 2**63 - 1), unit='m', origin='1970-01-01')

    return pd.date_range(start=random_date, periods=count, freq='min')

def generate_second_sequence(count):
    random_date = pd.to_datetime(np.random.randint(0, 2**63 - 1), unit='s', origin='1970-01-01')
    
    return pd.date_range(start=random_date, periods=count, freq='s')


class TimeIntervalSetting(Setting):

    __options = {
        'Count': generate_count_sequence, 
        'Day': generate_day_sequence,
        'Hour': generate_hour_sequence,
        'Minute': generate_minute_sequence,
        'Second': generate_second_sequence
    }
    
    def generate(self):
        date_range = self.__options.get(self.value)(self.count)
        return date_range
        