import numpy as np
import pandas as pd
from statsmodels.tsa.api import Holt

from algorithms.base_algorithm import BaseAlgorithm
from algorithms.window_slider import WindowSlider

class HoltAlgorithm(BaseAlgorithm):
    def __init__(self, id, date_column, value_column, params):
        super().__init__(id, date_column, value_column, params)

        self.smoothing_level = float(self.params['alpha'])
        self.smoothing_trend = float(self.params['beta'])
        self.window_size = int(self.params['window_size'])
        
    def predict(self, file_name):

        slider = WindowSlider(file_name, self.window_size, self.date_column, self.value_column)
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
            lower_bound = mean - 2 * std_dev
            upper_bound = mean + 2 * std_dev
            self.threshold = self.window_size 
            trend_point = {'x': str(df.index[-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                           'y': fit.fittedvalues[-1]}
            mean_ci_lower_point = {'x': str(df.index[-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                                   'y': str(fit.fittedvalues[-1] - (upper_bound - lower_bound)/2.0) }
            mean_ci_upper_point = {'x': str(df.index[-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                                   'y': str(fit.fittedvalues[-1] + (upper_bound - lower_bound)/2.0)}
            
            self.dates.append(df.index[-1])                     
            self.trend_values.append(fit.fittedvalues[-1])
            self.lower_ci_values.append(fit.fittedvalues[-1] - (upper_bound - lower_bound)/2.0)
            self.upper_ci_values.append(fit.fittedvalues[-1] + (upper_bound - lower_bound)/2.0)
            trends.append(trend_point)
            mean_ci_lower.append(mean_ci_lower_point)
            mean_ci_upper.append(mean_ci_upper_point)

        self.trends.append(trends)
        self.mean_ci_lower.append(mean_ci_lower)
        self.mean_ci_upper.append(mean_ci_upper)
        self.trend_changes = self.calculate_trend_changes()
        return self.trends, self.obs_ci_lower, self.obs_ci_upper, self.mean_ci_lower, self.mean_ci_upper, self.trend_changes
        
        