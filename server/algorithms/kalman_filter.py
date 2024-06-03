import numpy as np
import pandas as pd
from algorithms.base_algorithm import BaseAlgorithm

from filterpy.kalman import KalmanFilter as kf
from algorithms.window_slider import WindowSlider

from scipy.stats import norm



def matrix2np_arr(elements):
    return np.array([[float(x) for x in sublist] for sublist in elements])


class KalmanFilterAlgorithm(BaseAlgorithm):
    
    def stock_predict(self, measurements, initial_price):
        transition_matrix = matrix2np_arr(self.params['Transition matrix'])
        observation_matrix = matrix2np_arr(self.params['Observation matrix'])
        measurement_noise = float(self.params['Measurement noise'])
        process_noise = float(self.params['Process noise'])
        # Создание фильтра Калмана
        self.model = kf(dim_x=2, dim_z=1)

        # Инициализация матриц перехода и измерения
        self.model.F = transition_matrix #np.array([[1., 1.],[0., 1.]])
        self.model.H = observation_matrix #np.array([[1., 0.]])

        # Установка начального состояния
        self.model.x = np.array([[initial_price], [0.]])
        self.model.P *= 1000.

        # Установка ковариаций шумов процесса и измерения
        self.model.R *= measurement_noise
        self.model.Q = np.eye(2) * process_noise

        # Применение фильтра Калмана к каждому измерению
        predictions = []
        for z in measurements:
            self.model.predict()
            self.model.update(z)
            predictions.append(self.model.x[0, 0])  # Предсказанное значение цены

        return predictions


    def predict(self, file_name):
        
        slider = WindowSlider(file_name, int(self.params['window_size']), self.date_column, self.value_column)
        linear_trends  = []
        obs_ci_lower, obs_ci_upper = [], []
        mean_ci_lower, mean_ci_upper = [], []
        
        for df in slider.slide():
            df[self.date_column] = pd.to_datetime(df[self.date_column])
            df.set_index(self.date_column, inplace=True)
            measurements = df[self.value_column]
            initial_price = measurements.iloc[0]

            predictions = np.array(self.stock_predict(measurements, initial_price))

            trend_point = {'x': str(df.index[-1]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                        'y': predictions[len(predictions) - 1]}
            self.trend_values.append(predictions[len(predictions) - 1])
            self.dates.append(df.index[-1])
            alpha = 0.0001

            mean_prediction = np.mean(predictions)
            std_prediction = np.std(predictions)

            mean_ci_lower_point = {'x': str(df.index[-1]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                        'y': (mean_prediction - norm.ppf(1 - alpha/2) * std_prediction)}
            mean_ci_upper_point = {'x': str(df.index[-1]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                        'y': (mean_prediction + norm.ppf(1 - alpha/2) * std_prediction)}
                        
            self.lower_ci_values.append(mean_prediction - norm.ppf(1 - alpha/2) * std_prediction)
            self.upper_ci_values.append(mean_prediction + norm.ppf(1 - alpha/2) * std_prediction)
            linear_trends.append(trend_point)
            self.threshold = self.window_size
            mean_ci_lower.append(mean_ci_lower_point)
            mean_ci_upper.append(mean_ci_upper_point)
            


        self.trends.append(linear_trends)
        self.mean_ci_lower.append(mean_ci_lower)
        self.mean_ci_upper.append(mean_ci_upper)
        self.obs_ci_lower.append(obs_ci_lower)
        self.obs_ci_upper.append(obs_ci_upper)      
            
        self.trend_changes = self.calculate_trend_changes()
        return self.trends, self.obs_ci_lower, self.obs_ci_upper, self.mean_ci_lower, self.mean_ci_upper, self.trend_changes