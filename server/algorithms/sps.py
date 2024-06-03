import numpy as np
import pandas as pd
import statsmodels.api as sm
from sklearn.discriminant_analysis import StandardScaler
from algorithms.base_algorithm import BaseAlgorithm


class SPSAlgorithm(BaseAlgorithm):

    def initialize(self):
        self.q = float(self.params['q'])
        self.m = int(self.params['m'])
        self.N = int(self.params['window_size'])


        self.signs = np.random.randint(0, 2, size=(self.N, self.m - 1)) * 2 - 1
        self.signs = np.hstack((np.ones((self.N, 1)), self.signs))

        self.tie_order = np.arange(self.m)

    def determine_rank(self, functions):
        # сортировка по убыванию функций
        sorted_functions, sorted_indexes = sorted(functions, reverse=True), sorted(range(len(functions)), key=lambda i: functions[i], reverse=True)

        # Поиск позиций тех функций, которые равны по значению с delta-суммой(ссылочной суммой, H0)
        tie_indexes = [i for i, val in enumerate(sorted_functions) if val == functions[0]]

        # Индексы, которые находятся на этих позициях
        indexes_to_sort = [sorted_indexes[i] for i in tie_indexes]

        #сортировка в соответствии с перестановкой
        idx_order = sorted(indexes_to_sort, key=lambda i: self.tie_order[i], reverse=True)

        for i, val in zip(tie_indexes, idx_order):
            sorted_indexes[i] = val

        rang = sorted_indexes.index(0)
        return rang


    def is_parameter_in_confidence_interval(self, theta, Y, X):
        # Y = X * theta + E
        theta = theta.reshape(-1, 1)

        # Создаём матрицу, из которой потом будем считать sign portubated sums
        matrix = np.zeros((len(Y), self.m))

        # В качестве первого столбца просто элементы delta = Y - theta X
        delta = np.array(Y - (theta.T @ X.T)[0])
        for i in range(len(delta)):
            matrix[i, 0] = delta[i]

        # Заполнение остальных столбцов матрицы
        for k in range(1, self.m):
            matrix[:, k] = matrix[:, 0] * self.signs[:, k]

        # Расчет значения сумм
        sign_perturbed_sums = np.zeros(self.m)
        for k in range(self.m):
            sum = np.sum(matrix[:, k])
            sign_perturbed_sums[k] = sum**2

        rang = self.determine_rank(sign_perturbed_sums)

        in_confidence_set = rang >= self.q

        return in_confidence_set

    def predict(self, file_name):
        self.initialize()
        local_trends  = []
        local_ci_lower, local_ci_upper = [], []
        for df in self.slider.slide(file_name):
            df[self.date_column] = pd.to_datetime(df[self.date_column])
            df.set_index(self.date_column, inplace=True)

            date_index_datetime =  df.index.astype(np.int64) 
            scaler = StandardScaler()
            x = date_index_datetime[:-1].to_numpy().reshape(-1, 1)
            x_last = scaler.fit_transform([[date_index_datetime[-1]]])
            x = scaler.fit_transform(x)
            x_vector = sm.add_constant(x)
            y = df[self.value_column][:-1].to_numpy()

            x0 = x[0][0]
            y0 = y[0]

            y0_lower = 0.75 * y0
            y0_upper = 1.5 * y0

            k = np.arange(-10, 10)
            lines = []
            for y0_val in np.arange(y0_lower, y0_upper, 1):
                for i in range(len(k)):
                    current_b = y0_val - k[i] * x0
                    lines.append([current_b, k[i]])

            min_value = float('inf')
            max_value = float('-inf')

            for line in lines:
                params = np.array(line)
                in_conf = self.is_parameter_in_confidence_interval(params, y, x_vector)
                
                if in_conf:
                    y_values = (params[1] * np.array(x_last[0]) + params[0])[0]
                    min_value = min(min_value, y_values)
                    max_value = max(max_value, y_values)
                
            if min_value!= float('inf'):
                json_trend_point = {'x': str(df.index[int(self.window_size/2)]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                            'y': str(min_value + (max_value - min_value)/2.0)}
                self.dates.append(df.index[int(self.window_size/2)])
                self.trend_values.append(min_value + (max_value - min_value)/2.0)
                json_ci_lower_point = {'x': str(df.index[int(self.window_size/2)]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                            'y': str(min_value)}
                self.lower_ci_values.append(min_value)
                json_ci_upper_point = {'x': str(df.index[int(self.window_size/2)]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                            'y': str(max_value)}
                self.upper_ci_values.append(max_value)

                local_ci_lower.append(json_ci_lower_point)
                local_ci_upper.append(json_ci_upper_point)
                local_trends.append(json_trend_point)


        self.trends.append(local_trends)
        self.json_ci_lower.append(local_ci_lower)
        self.json_ci_upper.append(local_ci_upper) 

        self.trend_changes = self.calculate_trend_changes()
        return self.trends, self.json_ci_lower, self.json_ci_upper, self.trend_changes
