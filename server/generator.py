
import pandas as pd
from formula_setting import FormulaSetting
from time_interval_setting import TimeIntervalSetting


class Generator: 
        

    def generate(self, form):
        count = int(form['count'])
        time_interval = TimeIntervalSetting('timeInterval', form['timeInterval'], count)
        model = FormulaSetting('model', repr(form['model']), count)
        motion = FormulaSetting('motion', repr(form['motion']), count)
        noise = FormulaSetting('noise', repr(form['noise']), count)
        
        time = time_interval.generate()
        model = model.generate()
        motion = motion.generate()
        noise = noise.generate()
        value = [x + y for x, y in zip(model, noise)]
        return pd.Series(data=value, index=time)
        

