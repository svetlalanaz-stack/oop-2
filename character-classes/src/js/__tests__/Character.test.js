import Character from '../Character';
import Bowerman from '../Bowerman';
import Swordsman from '../Swordsman';
import Magician from '../Magician';
import Daemon from '../Daemon';
import Undead from '../Undead';
import Zombie from '../Zombie';

describe('Класс Character', () => {
  describe('Конструктор', () => {
    test('должен корректно создавать персонажа с валидными данными', () => {
      const character = new Character('Legolas', 'Bowman');
      expect(character.name).toBe('Legolas');
      expect(character.type).toBe('Bowman');
      expect(character.health).toBe(100);
      expect(character.level).toBe(1);
    });

    test('должен выбрасывать ошибку при коротком имени', () => {
      expect(() => new Character('A', 'Bowman')).toThrow('Имя должно быть строкой от 2 до 10 символов');
    });

    test('должен выбрасывать ошибку при длинном имени', () => {
      expect(() => new Character('VeryLongName', 'Bowman')).toThrow('Имя должно быть строкой от 2 до 10 символов');
    });

    test('должен выбрасывать ошибку при нестроковом имени', () => {
      expect(() => new Character(123, 'Bowman')).toThrow('Имя должно быть строкой от 2 до 10 символов');
    });

    test('должен выбрасывать ошибку при некорректном типе', () => {
      expect(() => new Character('Legolas', 'Elf')).toThrow('Некорректный тип персонажа');
    });
  });
});

describe('Дочерние классы', () => {
  const testCases = [
    { Class: Bowerman, name: 'Legolas', type: 'Bowman', attack: 25, defence: 25 },
    { Class: Swordsman, name: 'Aragorn', type: 'Swordsman', attack: 40, defence: 10 },
    { Class: Magician, name: 'Gandalf', type: 'Magician', attack: 10, defence: 40 },
    { Class: Daemon, name: 'Balrog', type: 'Daemon', attack: 10, defence: 40 },
    { Class: Undead, name: 'Nazgul', type: 'Undead', attack: 25, defence: 25 },
    { Class: Zombie, name: 'Walker', type: 'Zombie', attack: 40, defence: 10 },
  ];

  testCases.forEach(({ Class, name, type, attack, defence }) => {
    describe(Class.name, () => {
      const character = new Class(name);

      test('должен наследовать свойства от Character', () => {
        expect(character).toBeInstanceOf(Character);
      });

      test('должен иметь правильный тип', () => {
        expect(character.type).toBe(type);
      });

      test('должен иметь правильные характеристики', () => {
        expect(character.attack).toBe(attack);
        expect(character.defence).toBe(defence);
        expect(character.health).toBe(100);
        expect(character.level).toBe(1);
      });

      test('должен корректно обрабатывать имя', () => {
        expect(character.name).toBe(name);
      });
    });
  });

  describe('Метод levelUp', () => {
    let character;

    beforeEach(() => {
      character = new Bowerman('Legolas');
    });

    test('должен повышать уровень, атаку, защиту и восстанавливать здоровье', () => {
      character.health = 50;
      character.level = 1;
      character.attack = 25;
      character.defence = 25;

      character.levelUp();

      expect(character.level).toBe(2);
      expect(character.attack).toBe(30); // 25 * 1.2 = 30
      expect(character.defence).toBe(30); // 25 * 1.2 = 30
      expect(character.health).toBe(100);
    });

    test('должен округлять атаку и защиту при повышении уровня', () => {
      character.attack = 33;
      character.defence = 33;
      character.health = 50;

      character.levelUp();

      expect(character.attack).toBe(40); // 33 * 1.2 = 39.6 → округляется до 40
      expect(character.defence).toBe(40);
    });

    test('должен выбрасывать ошибку при попытке повысить уровень у мёртвого персонажа', () => {
      character.health = 0;
    
      expect(() => character.levelUp()).toThrow('Нельзя повысить левел умершего');
    });

    test('должен выбрасывать ошибку при отрицательном здоровье', () => {
      character.health = -10;
    
      expect(() => character.levelUp()).toThrow('Нельзя повысить левел умершего');
    });
  });

  describe('Метод damage', () => {
    let character;

    beforeEach(() => {
      character = new Bowerman('Legolas');
    });

    test('должен корректно рассчитывать урон с учётом защиты', () => {
      character.defence = 25;
      character.health = 100;
    
      character.damage(50);
    
      // 50 * (1 - 25/100) = 50 * 0.75 = 37.5
      expect(character.health).toBe(62.5);
    });

    test('не должен опускать здоровье ниже нуля', () => {
      character.defence = 0;
      character.health = 30;
    
      character.damage(100);
    
      expect(character.health).toBe(0);
    });

    test('должен корректно работать с разной защитой', () => {
      character.defence = 50;
      character.health = 100;
    
      character.damage(100);
      // 100 * (1 - 50/100) = 100 * 0.5 = 50
      expect(character.health).toBe(50);
    });

    test('должен корректно работать с защитой 100 (не должен получать урон)', () => {
      character.defence = 100;
      character.health = 100;
    
      character.damage(100);
      // 100 * (1 - 100/100) = 100 * 0 = 0
      expect(character.health).toBe(100);
    });

    test('должен игнорировать урон, если персонаж уже мёртв', () => {
      character.health = 0;
      character.defence = 25;
    
      character.damage(50);
    
      expect(character.health).toBe(0);
    });

    test('должен корректно рассчитывать дробный урон', () => {
      character.defence = 30;
      character.health = 100;
    
      character.damage(33);
      // 33 * (1 - 30/100) = 33 * 0.7 = 23.1
      expect(character.health).toBe(76.9);
    });
  });

});