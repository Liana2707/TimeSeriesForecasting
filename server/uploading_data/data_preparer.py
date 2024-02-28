import pandas as pd
from datetime import datetime

class DataPreparer:

    def prepare(self, data):
        values = data[0]
        date_columns = data[1]
        value_columns = [col for col in values.columns if col not in data[1]]
    

        return {
            'data': values.values.tolist(),
            'columns': values.columns.tolist(),
            'date_columns': date_columns,
            'value_columns': value_columns
        }
