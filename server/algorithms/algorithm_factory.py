


from algorithms.holt import HoltAlgorithm
from algorithms.LinearRegression import LinearRegressionAlgorithm
from algorithms.kalman_filter import KalmanFilterAlgorithm
from algorithms.SPS import SPSAlgorithm


class AlgorithmFactory:
    algorithms = {'Holt': HoltAlgorithm,
                  'LinearRegression': LinearRegressionAlgorithm,
                  'KalmanFilter': KalmanFilterAlgorithm,
                  'SPS': SPSAlgorithm
                  }

    @classmethod
    def register_algorithm(cls, name, algorithm_class):
        cls.algorithms[name] = algorithm_class

    @classmethod
    def create_algorithm(cls, name, window_size, date_column, value_column, params):
        algorithm_class = cls.algorithms.get(name)
        if algorithm_class:
            return algorithm_class(window_size, date_column, value_column, params)
        else:
            raise ValueError(f"Unknown algorithm: {name}")