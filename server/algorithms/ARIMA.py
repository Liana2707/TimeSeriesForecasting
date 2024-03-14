import os
from matplotlib import pyplot as plt
import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler

from algorithms.base_algorithm import BaseAlgorithm
from algorithms import UPLOAD_FOLDER
from uploading_data.uploader import Uploader


class ARIMAAlgorithm(BaseAlgorithm):
    def predict(self, file_name):
        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        use_cols = [self.date_column, self.value_column]
        uploader = Uploader()
        df = uploader.upload(path=file_path, usecols=use_cols)[0]
        
        horizon_ = 10 

        df[self.date_column] = pd.to_datetime(df[self.date_column])
        df.set_index(self.date_column,  inplace=True)

        order = (int(self.params['p']), int(self.params['d']), int(self.params['q']))

        arima = ARIMA(df[self.value_column], order=order)
        model_fit = arima.fit()

        fcast = model_fit.forecast(steps=horizon_)
        fcast_dates = pd.date_range(start=df.index[-1], periods=horizon_+1, freq=df.index.freq)[-horizon_:]
        fcast_df = pd.DataFrame({self.date_column: fcast_dates, self.value_column: fcast})
        fcast_df.set_index(self.date_column,  inplace=True)
        
        merged_df = pd.concat([df, fcast_df])

        date_index_datetime = merged_df.index.astype(np.int64)

        scaler = StandardScaler()
        x = date_index_datetime.to_numpy().reshape(-1, 1)
        x = scaler.fit_transform(x)
        
        y = merged_df
        model = LinearRegression()
        model.fit(x, y)

        # y = k*x + b

        model_linear_y = model.predict(x)

        points_list, line_list = [], []
        for i in range(0, len(model_linear_y)):
            point = {'x': str(merged_df.index[i]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                     'y': model_linear_y[i][0]}
            points_list.append(point)


        line_list.append(points_list)
        return line_list