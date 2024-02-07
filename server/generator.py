
import pandas as pd
from formula_setting import FormulaSetting
from time_interval_setting import TimeIntervalSetting


class Generator:

    def __init__(self, form):
        self.count = int(form['count'])
        self.time_interval = TimeIntervalSetting('timeInterval', form['timeInterval'], self.count)
        self.model = FormulaSetting('model', repr(form['model']), self.count)
        self.motion = FormulaSetting('motion', repr(form['motion']), self.count)
        self.noise = FormulaSetting('noise', repr(form['noise']), self.count)
        

    def generate(self):
        time = self.time_interval.generate()
        model = self.model.generate()
        motion = self.motion.generate()
        noise = self.noise.generate()
        value = [x + y for x, y in zip(model, noise)]
        return pd.Series(data=value, index=time)
        

