import os
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler

from algorithms.base_algorithm import BaseAlgorithm
from algorithms.window_slider import WindowSlider
from algorithms import UPLOAD_FOLDER
from uploading_data.uploader import Uploader



class LinearRegressionAlgorithm(BaseAlgorithm):
    def predict(self, file_name): 
        slider = WindowSlider(file_name, int(self.params['window_size']), self.date_column, self.value_column)
        self.trends = []
        
        for df in slider.slide():
            df[self.date_column] = pd.to_datetime(df[self.date_column])
            df.set_index(self.date_column, inplace=True)

            date_index_datetime =  df.index.astype(np.int64) 

            scaler = StandardScaler()
            x = date_index_datetime.to_numpy().reshape(-1, 1)
            x = scaler.fit_transform(x)
            
            y = df 
            model = LinearRegression()
            model.fit(x, y)

            # y = k*x + b

            model_linear_y = model.predict(x)

            points_list = [] 
            for i in range(0, len(model_linear_y)):
                point = {'x': str(df.index[i]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                         'y': model_linear_y[i][0]}
                points_list.append(point)

            self.trends.append(points_list)

        return self.trends, []
    
        