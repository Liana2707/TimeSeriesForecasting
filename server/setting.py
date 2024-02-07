from abc import ABC, abstractmethod

class Setting(ABC):
    def __init__(self, name, value, count):
        self.name = name
        self.value = value
        self.count = count

    @abstractmethod
    def validate(self):
        return "VALIDATE SETTING METHOD"

    @abstractmethod
    def generate(self):
        return "GENERATE SETTING METHOD"


