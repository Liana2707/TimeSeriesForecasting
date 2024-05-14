import numpy as np
import pandas as pd
import statsmodels.api as sm
from matplotlib import pyplot as plt
from sklearn.discriminant_analysis import StandardScaler
from algorithms.base_algorithm import BaseAlgorithm
from algorithms.window_slider import WindowSlider


class SPSAlgorithm(BaseAlgorithm):

    def initialize(self):
        self.q = float(self.params['q'])
        self.m = int(self.params['m'])
        self.N = int(self.params['window_size'])


        self.signs = np.random.randint(0, 2, size=(self.N, self.m - 1)) * 2 - 1
        self.signs = np.hstack((np.ones((self.N, 1)), self.signs))

        self.tie_order = np.random.permutation(self.m)

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
        slider = WindowSlider(file_name, int(self.params['window_size']), self.date_column, self.value_column)
        self.trends = []
        self.obs_ci_lower, self.obs_ci_upper = [], []
        self.mean_ci_lower, self.mean_ci_upper = [], []
        linear_trends  = []
        mean_ci_lower, mean_ci_upper = [], []
        for df in slider.slide():
            df[self.date_column] = pd.to_datetime(df[self.date_column])
            df.set_index(self.date_column, inplace=True)

            date_index_datetime =  df.index.astype(np.int64) 

            scaler = StandardScaler() # to datapreparer
            x = date_index_datetime.to_numpy().reshape(-1, 1)
            x = scaler.fit_transform(x)
            x_ = sm.add_constant(x)
            y = df[self.value_column].to_numpy()

            x0 = x_[0][1]
            y0 = y[0]

            k = np.arange(-10, 10, 0.05)
            b = []
            for i in range(len(k)):
                current_b = y0 - k[i] * x0
                b.append(current_b)
            b = np.array(b)
            lines_coeff = []
            for i in range(len(k)):
                lines_coeff.append([b[i], k[i]])

            min_k, max_k, min_b, max_b = np.max(k), np.min(k), np.max(b), np.min(b)


            for line in lines_coeff:
                params = np.array(line)
                in_conf = self.is_parameter_in_confidence_interval(params, y, x_)
                
                if in_conf:
                    if min_k >= line[1]:
                        min_k = line[1]
                        min_b = line[0]
                    if max_k <= line[1]:
                        max_k = line[1]
                        max_b = line[0]

            trend_point = {'x': str(df.index[len(y) - 1]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                        'y': str(((min_k+(max_k-min_k)/2.0)*x[-1][0] + min_b+(max_b-min_b)/2.0))}
            mean_ci_lower_point = {'x': str(df.index[len(y) - 1]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                        'y': str(min_k*x[-1][0] + min_b)}
            mean_ci_upper_point = {'x': str(df.index[len(y) - 1]- pd.Timestamp("1970-01-01")) // pd.Timedelta('1ms'),
                        'y': str(max_k*x[-1][0] + max_b)}
              
                
            mean_ci_lower.append(mean_ci_lower_point)
            mean_ci_upper.append(mean_ci_upper_point)
            linear_trends.append(trend_point)


        self.trends.append(linear_trends)
        self.mean_ci_lower.append(mean_ci_lower)
        self.mean_ci_upper.append(mean_ci_upper)   

        return self.trends, self.obs_ci_lower, self.obs_ci_upper, self.mean_ci_lower, self.mean_ci_upper

