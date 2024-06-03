
import numpy as np
from datetime import datetime, timedelta

def generate_gaussian_noise(shape, mean=0, std=0.1):
        noise = np.random.normal(mean, std, shape)
        return noise

def generate_poisson_noise(shape, lam=1.0):
    noise = np.random.poisson(lam, shape) / lam
    return noise - lam

def generate_speckle_noise(shape, std=0.1):
    noise = np.random.normal(0, std, shape)
    return noise

def generate_sin(shape):
    rows, cols = shape
    x = np.linspace(0, 2 * np.pi, cols)
    y = np.sin(x) * 0.1
    noise = np.tile(y, (rows, 1))
    return noise

class Generator: 
    __options = {
        'gaussian': generate_gaussian_noise,
        'sin(x)': generate_sin,
        'poisson': generate_poisson_noise,
        'speckle': generate_speckle_noise
    }

    def generate(self, form):
        count = int(form['count'])
        trend_changes_count = int(form['trendChangesCount'])
        noise = self.__options.get(form['noise'])((1, count))

        start_date = datetime(1971, 1, 1)
        dates = [start_date + timedelta(days=i) for i in range(count)]
        
        
        part_size = count // trend_changes_count
        data = np.zeros(count)
        
        positive_trend = True
        current_value = 30
        for i in range(trend_changes_count):
            start = i * part_size
            end = start + part_size if i < trend_changes_count - 1 else count
            
            slope = np.random.uniform(0.01, 0.1) if positive_trend else np.random.uniform(-0.1, -0.01)
            trend = np.linspace(current_value, current_value + slope * (end - start), end - start)
            
            data[start:end] = trend
            current_value = trend[-1]
            positive_trend = not positive_trend
        
        data += 10 * noise.flatten()
        
        return dates, data
        
        
        
        
        

