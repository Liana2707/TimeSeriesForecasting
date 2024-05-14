import os 

import numpy as np
import pandas as pd
from statsmodels.tsa.api import Holt

from algorithms.base_algorithm import BaseAlgorithm
from algorithms import UPLOAD_FOLDER
from algorithms.window_slider import WindowSlider
from uploading_data.uploader import Uploader
from scipy.stats import t


class HoltAlgorithm(BaseAlgorithm):
    def __init__(self, id, date_column, value_column, params):
        super().__init__(id, date_column, value_column, params)

        self.smoothing_level = float(self.params['alpha'])
        self.smoothing_trend = float(self.params['beta'])
        
    def predict(self, file_name):

        slider = WindowSlider(file_name, int(self.params['window_size']), self.date_column, self.value_column)
        self.trends = []
        self.obs_ci_lower, self.obs_ci_upper = [], []
        self.mean_ci_lower, self.mean_ci_upper = [], []
        trends = []
        mean_ci_lower, mean_ci_upper = [], []
        
        for df in slider.slide():
            df[self.date_column] = pd.to_datetime(df[self.date_column])
            df.set_index(self.date_column, inplace=True)

            fit = Holt(df[self.value_column], initialization_method="estimated").fit(
            smoothing_level=self.smoothing_level, 
            smoothing_trend=self.smoothing_trend, 
            optimized=False
            )
            mean = np.mean(fit.fittedvalues)
            std_dev = np.std(fit.fittedvalues, ddof=1) 
            degrees_of_freedom = len(fit.fittedvalues) - 1
            
            t_score = t.ppf((1 + 0.95) / 2, degrees_of_freedom)
            
            standard_error = std_dev / np.sqrt(len(fit.fittedvalues) - 1)
            
            margin_of_error = t_score * standard_error
            lower_bound = mean - margin_of_error
            upper_bound = mean + margin_of_error

            trend_point = {'x': str(df.index[len(fit.fittedvalues)-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                           'y': fit.fittedvalues[-1]}
            mean_ci_lower_point = {'x': str(df.index[len(fit.fittedvalues)-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                                   'y': str(fit.fittedvalues[-1] - (upper_bound - lower_bound)/2.0) }
            mean_ci_upper_point = {'x': str(df.index[len(fit.fittedvalues)-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                                   'y': str(fit.fittedvalues[-1] + (upper_bound - lower_bound)/2.0)}
            
                                   

            trends.append(trend_point)
            mean_ci_lower.append(mean_ci_lower_point)
            mean_ci_upper.append(mean_ci_upper_point)

        self.trends.append(trends)
        self.mean_ci_lower.append(mean_ci_lower)
        self.mean_ci_upper.append(mean_ci_upper)
        #print(self.mean_ci_lower, self.mean_ci_upper)

        return self.trends, self.obs_ci_lower, self.obs_ci_upper, self.mean_ci_lower, self.mean_ci_upper
        
        