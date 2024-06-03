import os

from algorithms import UPLOAD_FOLDER
from uploading_data.uploader import Uploader

class WindowSlider(object):

    def __init__(self, window_size, date_column, value_column):
        self.window_size = window_size
        self.date_column = date_column
        self.value_column = value_column

    def slide(self, file_name):
        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        use_cols = [self.date_column, self.value_column]
        uploader = Uploader()
        df = uploader.upload(path=file_path, usecols=use_cols)[0]

        windows = (df.iloc[i:i+self.window_size] for i in range(0, len(df)))

        for window_df in windows:
            if len(window_df) == self.window_size:
                yield window_df.dropna()
    