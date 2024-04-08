import os

import pandas as pd
from algorithms import UPLOAD_FOLDER
from uploading_data.uploader import Uploader


class BaseAlgorithm:
    def __init__(self, id, date_column, value_column, params):
        self.trends = []
        self.id = id
        self.date_column = date_column
        self.value_column = value_column
        self.params = params

    def predict(self, data):
        pass

    def save_results(self, file_name, buffer):
        self.predict(file_name=file_name)
        
        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        use_cols = [self.date_column, self.value_column]
        uploader = Uploader()
        df = uploader.upload(path=file_path, usecols=use_cols)[0]

        data = {
            'Date column':  [self.date_column],
            'Predicted column': [self.value_column],
        }
        df_with_trends = pd.DataFrame(data)
        trends_df = pd.DataFrame(self.trends).stack().apply(pd.Series)
        df = pd.concat([df_with_trends, trends_df], axis=1)

        df.to_csv(buffer, encoding='utf-8')
