class BaseAlgorithm:
    def __init__(self, window_size, date_column, value_column, params):
        self.window_size = window_size
        self.date_column = date_column
        self.value_column = value_column
        self.params = params

    def predict(self, data):
        pass