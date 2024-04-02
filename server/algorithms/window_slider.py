import os
import numpy as np
import pandas as pd
from pandas import DataFrame

from algorithms import UPLOAD_FOLDER
from uploading_data.uploader import Uploader

class WindowSlider(object):

    def __init__(self, filename, window_size, date_column, value_column):
        self.file_name = filename
        self.window_size = window_size
        self.date_column = date_column
        self.value_column = value_column

    def slide(self):
        file_path = os.path.join(UPLOAD_FOLDER, self.file_name)
        use_cols = [self.date_column, self.value_column]
        uploader = Uploader()
        df = uploader.upload(path=file_path, usecols=use_cols)[0]

        windows = (df.iloc[i:i+self.window_size] for i in range(0, len(df), self.window_size - 1))

        for window_df in windows:
            yield window_df.dropna()
    