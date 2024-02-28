class BaseAlgorithm:
    def __init__(self, date_column, value_column, params):
        self.date_column = date_column
        self.value_column = value_column
        self.params = params

    def predict(self, data):
        pass