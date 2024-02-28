
from random import random

from generation_data.formula_parser import FormulaParser
from generation_data.setting import Setting

class FormulaSetting(Setting):
    def __init__(self, name, value, count):
        self.parser = FormulaParser()
        super().__init__(name, value, count)
    
    def generate(self):
        self.expr = self.parser.parse(self.value)
        if self.expr != None and self.expr!=random:
            started_value = [random() for _ in range(len(self.parser.r_s))]
            
            values = started_value[:]
            
            for _ in range(self.count-len(started_value)): 
                res_exp = self.parser.rhs.subs(zip(self.parser.r_s, started_value[-len(self.parser.r_s):]))
                values.append(res_exp)

            return(values)
        elif self.expr == random:
            return [random() for _ in range(self.count)]
        
        return [0]*self.count
        
        
        
        
        


        


    