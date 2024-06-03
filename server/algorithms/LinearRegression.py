import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

from algorithms.base_algorithm import BaseAlgorithm
from algorithms.window_slider import WindowSlider
import statsmodels.api as sm



class LinearRegressionAlgorithm(BaseAlgorithm):
    def predict(self, file_name): 
        slider = WindowSlider(file_name, int(self.params['window_size']), self.date_column, self.value_column)
        linear_trends  = []
        mean_ci_lower, mean_ci_upper = [], []
        
        for df in slider.slide():
            df[self.date_column] = pd.to_datetime(df[self.date_column])
            df.set_index(self.date_column, inplace=True)

            date_index_datetime =  df.index.astype(np.int64) 

            scaler = StandardScaler() # to datapreparer
            x = date_index_datetime.to_numpy().reshape(-1, 1)
            x = sm.add_constant(scaler.fit_transform(x))
            
            y = df 
            model = sm.OLS(y, x).fit()

            results = model.get_prediction()
            predictions_summary_frame = results.summary_frame()

            confidence_intervals = predictions_summary_frame[['mean_ci_lower', 'mean_ci_upper']]

            chunk_prediction = model.predict(x)

            trend_point = {'x': str(df.index[-1]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                        'y': chunk_prediction[-1]}        
            self.trend_values.append(chunk_prediction[-1])
            self.dates.append(df.index[-1])
            mean_ci_lower_point = {'x': str(df.index[-1]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                        'y': confidence_intervals['mean_ci_lower'][-1]}
            mean_ci_upper_point = {'x': str(df.index[-1]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                        'y': confidence_intervals['mean_ci_upper'][-1]}
                
            self.lower_ci_values.append(confidence_intervals['mean_ci_lower'][-1])
            self.upper_ci_values.append(confidence_intervals['mean_ci_upper'][-1])
            linear_trends.append(trend_point)
            mean_ci_lower.append(mean_ci_lower_point)
            mean_ci_upper.append(mean_ci_upper_point)


        self.trends.append(linear_trends)
        self.mean_ci_lower.append(mean_ci_lower)
        self.mean_ci_upper.append(mean_ci_upper)  
        self.trend_changes = self.calculate_trend_changes() 
        return self.trends, self.obs_ci_lower, self.obs_ci_upper, self.mean_ci_lower, self.mean_ci_upper, self.trend_changes
