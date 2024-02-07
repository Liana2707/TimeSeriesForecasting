
from formula_setting import FormulaSetting
from time_interval_setting import TimeIntervalSetting


class Generator:

    def __init__(self, form):
        self.count = int(form['count'])
        self.time_interval = TimeIntervalSetting('timeInterval', form['timeInterval'], self.count)
        self.model = FormulaSetting('model', form['model'], self.count, 'x')
        self.motion = FormulaSetting('motion', form['motion'], self.count, 'z')
        self.noise = FormulaSetting('noise', form['noise'], self.count, 'e')
        

    def generate(self):
        time = self.time_interval.generate()
        print(f'time = {time}')
        model = self.model.generate()
        print(f'model = {model}')
        motion = self.motion.generate()
        print(f'motion = {motion}')
        noise = self.noise.generate()
        print(f'noise = {noise}')
        return(time, model, motion, noise)
        

