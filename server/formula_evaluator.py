from random import random
from sympy import Eq, symbols, sympify


class FormulaEvaluator:
    def __init__(self, letter):
        self.variables = self.__generate_variables(letter)

    def __generate_variables(self, letter: str):
        try:
            negative_with_t = {f'{letter}_'+'{t-'+f'{i}'+'}': symbols(f'{letter}t_(0:101)')[i] 
                               for i in range(1, 101)} 
            positive_with_t = {f'{letter}'+'_{t+'+f'{i}'+'}': symbols(f'{letter}t(0:101)')[i] 
                               for i in range(1, 101)}
            zero = {f'{letter}_t': symbols(f'{letter}t'), f'{letter}'+'_{'+'0}': symbols(f'{letter}0'), f'{letter}'+'_{'+'t}': symbols(f'{letter}t')}
            negative_without_t = {f'{letter}_'+'{-'+f'{i}' + '}': symbols(f'{letter}_(0:101)')[i] 
                                  for i in range(1, 101)} 
            positive_without_t = {f'{letter}_{i}': symbols(f'{letter}(0:101)')[i] 
                                  for i in range(0, 101)}
            system = {'undefined': symbols('undefined')}

            variables = {**negative_with_t, 
                         **negative_without_t, 
                         **positive_with_t, 
                         **positive_without_t, 
                         **zero,
                         **system
                        }
            return variables
        except:
            "Can not generate variables"


    def evaluate(self, formula: str):
        if formula == '' or formula == 'undefined':
            return None
        elif formula == 'random':
            return random
        else:
            formula = formula.replace('\ ', '')
            self.symbols = []
            for old, new in self.variables.items():
                formula = formula.replace(old, str(new))
                if str(new) in formula:
                    self.symbols.append(new)

            lhs, rhs = formula.split('=',1)

            self.l_s, self.r_s = [], []
            for s in self.symbols:
                if str(s) in lhs:
                    self.l_s.append(s)
                else:
                    self.r_s.append(s)
                    
            self.l_s, self.r_s = list(set(self.l_s)), list(set(self.r_s))
            self.lhs, self.rhs = sympify(lhs),sympify(rhs)
            return Eq(self.lhs, self.rhs)
            
