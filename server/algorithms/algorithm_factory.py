from algorithms.holt import HoltAlgorithm
from algorithms.LinearRegression import LinearRegressionAlgorithm
from algorithms.kalman_filter import KalmanFilterAlgorithm
from algorithms.SPS import SPSAlgorithm
from algorithms.ARIMA import ARIMAAlgorithm


class AlgorithmFactory:
    algorithms = {'Holt': HoltAlgorithm,
                  'Linear Regression': LinearRegressionAlgorithm,
                  'Kalman Filter': KalmanFilterAlgorithm,
                  'SPS': SPSAlgorithm,
                  'ARIMA': ARIMAAlgorithm
                  }

    @classmethod
    def register_algorithm(cls, name, algorithm_class):
        cls.algorithms[name] = algorithm_class

    @classmethod
    def create_algorithm(cls, id, name, date_column, value_column, params):
        algorithm_class = cls.algorithms.get(name)
        if algorithm_class:
            return algorithm_class(id, date_column, value_column, params)
        else:
            raise ValueError(f"Unknown algorithm: {name}")