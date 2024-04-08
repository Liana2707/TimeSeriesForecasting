import os 

import pandas as pd
from statsmodels.tsa.api import Holt

from algorithms.base_algorithm import BaseAlgorithm
from algorithms import UPLOAD_FOLDER
from uploading_data.uploader import Uploader


class HoltAlgorithm(BaseAlgorithm):
    def __init__(self, id, date_column, value_column, params):
        super().__init__(id, date_column, value_column, params)

        self.smoothing_level = float(self.params['alpha'])
        self.smoothing_trend = float(self.params['beta'])
        
    def predict(self, file_name):
        #горизонт по идее тоже желательно с сервера получать
        #лучше также проверить настройки
        #отправление данных в виде двух списков тоже не нужно

        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        use_cols = [self.date_column, self.value_column]
        uploader = Uploader()
        df = uploader.upload(path=file_path, usecols=use_cols)[0]
        
        horizon_ = 10 
        
        fit = Holt(df[self.value_column], initialization_method="estimated").fit(
        smoothing_level=self.smoothing_level, 
        smoothing_trend=self.smoothing_trend, 
        optimized=False
        )

        fcast = fit.forecast(horizon_).rename("Holt's linear trend")

        trend = fit.trend

        dates, values = [], []
        dataset = []

        for i in range(0, len(df)):
            if i == 0 or i == len(df) - 1:
                continue
            x_values = [df[self.date_column][i - 1], df[self.date_column][i + 1]]
            y_values = [df[self.value_column][i] - trend[i], df[self.value_column][i] + trend[i]]

            dataset.append([{'x': str(x_values[0]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'), 
                             'y': y_values[0]}, 
                            {'x': str(x_values[1]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'), 'y': y_values[1]}
                            ])

        return dataset
        
        