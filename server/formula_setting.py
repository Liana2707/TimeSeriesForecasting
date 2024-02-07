
from random import random

from sympy import solve, symbols
from formula_evaluator import FormulaEvaluator
from setting import Setting

class FormulaSetting(Setting):
    def __init__(self, name, value, count, letter):
        self.evaluator = FormulaEvaluator(letter)
        super().__init__(name, value, count)

    def validate(self):
        self.expr = self.evaluator.evaluate(self.value)
        return self.expr
    
    def generate(self):
        # Получаем уравнение вида х_t = ...
        self.expr = self.evaluator.evaluate(self.value)
        if self.expr != None and self.expr!=random:
            started_value = [random() for _ in range(len(self.evaluator.r_s))]
            
            values = started_value[:]
            
            for _ in range(self.count-len(started_value)): 
                res_exp = self.evaluator.rhs.subs(zip(self.evaluator.r_s, started_value[-len(self.evaluator.r_s):]))
                values.append(res_exp)

            return(values)
        elif self.expr == random:
            return [random() for _ in range(self.count)]
        
        
        
        
        


        


    