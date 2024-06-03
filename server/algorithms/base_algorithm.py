from io import BytesIO
import math
import os

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from algorithms import UPLOAD_FOLDER
from algorithms.window_slider import WindowSlider
from uploading_data.uploader import Uploader
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, Image


class BaseAlgorithm:
    def __init__(self, id, date_column, value_column, params):
        self.params = params
        self.window_size = int(self.params['Window size'])
        self.date_column = date_column
        self.value_column = value_column
        self.slider = WindowSlider(self.window_size, self.date_column, self.value_column)
        self.id = id
        self.trends = []
        self.trend_angles = []
        self.trend_changes = []
        self.trend_values = []
        self.json_ci_lower, self.json_ci_upper = [], []
        self.lower_ci_values, self.upper_ci_values = [], []
        self.dates = []
        
    def predict(self, file_name):
        pass

    def calculate_angle(self, slope):
        return math.degrees(math.atan(slope)*10)
    
    def calculate_trend_changes(self):
        previous_angle = 0
        trend_change_points = []
        for start in range(0, len(self.trend_values), self.window_size):
            end = start + self.window_size
            if end > len(self.trend_values):
                end = len(self.trend_values)

            x = np.arange(start, end).reshape(-1, 1)
            y = np.array(self.trend_values[start:end])

            if len(x) < 2:
                continue

            model = LinearRegression().fit(x, y)
            slope = model.coef_[0]
            angle = self.calculate_angle(slope)

            angle_change = abs(angle - previous_angle)
            if angle_change >= 30:
                trend_change_points.append((self.dates[end - 1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'))
                previous_angle = angle
            self.trend_angles.append(angle)
            
        self.trend_changes = trend_change_points
        return self.trend_changes
        

    def calculate_metrics(self):
        self.consern_values, self.trend_values = np.array(self.consern_values), np.array(self.trend_values[:len(self.trend_values)//2])
        self.lower_ci_values = np.array(self.lower_ci_values[0:len(self.lower_ci_values)//2])
        self.upper_ci_values = np.array(self.upper_ci_values[0:len(self.upper_ci_values)//2])

        
        mae = mean_absolute_error(self.consern_values, self.trend_values)
        rmse = np.sqrt(mean_squared_error(self.consern_values, self.trend_values))
        mape = np.mean(np.abs((self.consern_values - self.trend_values) / self.consern_values)) * 100

        ci_coverage = np.mean((self.consern_values >= self.lower_ci_values) & (self.consern_values <= self.upper_ci_values))
        ci_width = np.mean(self.upper_ci_values - self.lower_ci_values)
        return mae, rmse, mape, ci_coverage, ci_width


    def save_results(self, file_name, buffer):
        self.predict(file_name=file_name)
        
        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        use_cols = [self.date_column, self.value_column]
        uploader = Uploader()
        df = uploader.upload(path=file_path, usecols=use_cols)[0]

        self.consern_dates = df[self.date_column].tolist()
        self.consern_dates = [pd.Timestamp(date) for date in self.consern_dates 
                              if date in self.dates
                              ]
        self.consern_values = [df[self.value_column][i] for i in range(len(df[self.value_column]))
                               if df[self.date_column][i] in self.consern_dates
                               ]
        
        
        mae, rmse, mape, ci_coverage, ci_width = self.calculate_metrics()

        plt.figure(figsize=(10, 5))
        plt.plot(self.consern_dates, self.consern_values, label='Actual')
        plt.plot(self.consern_dates, self.trend_values, label='Trend')
        plt.fill_between(self.consern_dates, self.lower_ci_values, self.upper_ci_values, color='gray', alpha=.5, label='Confidence Interval')

        img_buffer = BytesIO()
        plt.savefig(img_buffer, format='png')
        img_buffer.seek(0)
        plt.close()


        table_data = []
        table_data.append(['MAE','','','', mae])
        table_data.append(['RMSE','','','', rmse])
        table_data.append(['MAPE','','','', mape])
        table_data.append(['CI_Coverage','','','', ci_coverage])
        table_data.append(['CI_width', '', '', '', ci_width])
        table_data.append(
            ['Index','Value', 'Trend', 'Upper CI', 'Lower CI']
        )

        for i in range(len(self.trend_values)):
            table_data.append([i + 1, 
                               self.consern_values[i],
                               self.trend_values[i],
                               self.lower_ci_values[i],
                               self.upper_ci_values[i]
            ])
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []

        elements.append(Image(img_buffer, width=500, height=300))

        table = Table(table_data)
        elements.append(table)

        doc.build(elements)

        buffer.seek(0)
        return buffer
