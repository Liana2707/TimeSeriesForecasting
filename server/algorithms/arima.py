import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from algorithms.base_algorithm import BaseAlgorithm

class ARIMAAlgorithm(BaseAlgorithm):
    def __init__(self, id, date_column, value_column, params):
        super().__init__(id, date_column, value_column, params)
        self.order = (int(self.params['p']), 
                      int(self.params['d']),
                      int(self.params['q']))

    def predict(self, file_name):
        arima_trends = []
        json_ci_lower, json_ci_upper = [], []

        for df in self.slider.slide(file_name):
            df[self.date_column] = pd.to_datetime(df[self.date_column])
            df.set_index(self.date_column, inplace=True)

            model = ARIMA(df[self.value_column], order=self.order)
            model_fit = model.fit()

            predictions = model_fit.get_prediction(start=df.index[0], end=df.index[-1])
            mean_pred = predictions.predicted_mean
            conf_int = predictions.conf_int()

            json_trend_point = {'x': str(df.index[-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                           'y': mean_pred[-1]}
            json_ci_lower_point = {'x': str(df.index[-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                                   'y': conf_int['lower ' + self.value_column][-1]}
            json_ci_upper_point = {'x': str(df.index[-1] - pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                                   'y': conf_int['upper ' + self.value_column][-1]}
            self.dates.append(df.index[-1])
            self.trend_values.append(mean_pred[-1])
            self.lower_ci_values.append(conf_int['lower ' + self.value_column][-1])
            self.upper_ci_values.append(conf_int['upper ' + self.value_column][-1])
            arima_trends.append(json_trend_point)
            json_ci_lower.append(json_ci_lower_point)
            json_ci_upper.append(json_ci_upper_point)

        self.trends.append(arima_trends)
        self.json_ci_lower.append(json_ci_lower)
        self.json_ci_upper.append(json_ci_upper)

        self.trend_changes = self.calculate_trend_changes()
        return self.trends, self.json_ci_lower, self.json_ci_upper, self.trend_changes