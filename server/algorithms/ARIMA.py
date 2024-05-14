import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from sklearn.preprocessing import StandardScaler
from algorithms.window_slider import WindowSlider
from algorithms.base_algorithm import BaseAlgorithm

class ARIMAAlgorithm(BaseAlgorithm):
    def predict(self, file_name):
        slider = WindowSlider(file_name, int(self.params['window_size']), self.date_column, self.value_column)
        self.trends = []
        self.obs_ci_lower, self.obs_ci_upper = [], []
        self.mean_ci_lower, self.mean_ci_upper = [], []
        arima_trends = []
        mean_ci_lower, mean_ci_upper = [], []

        for df in slider.slide():
            df[self.date_column] = pd.to_datetime(df[self.date_column])
            df.set_index(self.date_column, inplace=True)

            # Обучение модели ARIMA
            model = ARIMA(df[self.value_column], order=(int(self.params['p']), int(self.params['d']), int(self.params['q'])))
            model_fit = model.fit()

            predictions = model_fit.get_prediction(start=df.index[0], end=df.index[-1])
            mean_pred = predictions.predicted_mean
            conf_int = predictions.conf_int()

            # Добавление последнего предсказания и доверительных интервалов
            trend_point = {'x': str(df.index[-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                           'y': mean_pred[-1]}
            mean_ci_lower_point = {'x': str(df.index[-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                                   'y': conf_int['lower ' + self.value_column][-1]}
            mean_ci_upper_point = {'x': str(df.index[-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                                   'y': conf_int['upper ' + self.value_column][-1]}

            arima_trends.append(trend_point)
            mean_ci_lower.append(mean_ci_lower_point)
            mean_ci_upper.append(mean_ci_upper_point)

        self.trends.append(arima_trends)
        self.mean_ci_lower.append(mean_ci_lower)
        self.mean_ci_upper.append(mean_ci_upper)

        return self.trends, self.obs_ci_lower, self.obs_ci_upper, self.mean_ci_lower, self.mean_ci_upper