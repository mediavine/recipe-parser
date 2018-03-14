import { expect } from 'chai';
import { parse, combine, prettyPrintingPress } from '../src/index';

describe('recipe parser', () => {
  it('returns an object', () => {
    expect(typeof parse('1 cup water')).to.equal('object');
  });

  describe('translates the quantity', () => {
    it('of "1 teaspoon water"', () => {
      expect(parse('1 teaspoon water').quantity).to.equal('1');
    });
    it('of "1.5 teaspoon water"', () => {
      expect(parse('1.5 teaspoon water').quantity).to.equal('1.5');
    });
    it('of "1 1/2 teaspoon water"', () => {
      expect(parse('1 1/2 teaspoon water').quantity).to.equal('1.5');
    });
    it('of "1/3 teaspoon water"', () => {
      expect(parse('1/3 cup water').quantity).to.equal('0.333');
    });
    it('of "10-20 teaspoon water"', () => {
      expect(parse('10-20 teaspoon water')).to.deep.equal({
        quantity: '10',
        maxQuantity: '20',
        unit: 'teaspoon',
        ingredient: 'water'
      });
    });
    it('of "10 - 20 teaspoon water"', () => {
      expect(parse('10-20 teaspoon water')).to.deep.equal({
        quantity: '10',
        maxQuantity: '20',
        unit: 'teaspoon',
        ingredient: 'water'
      });
    });
    it('of "10–20 teaspoon water"', () => {
      expect(parse('10-20 teaspoon water')).to.deep.equal({
        quantity: '10',
        maxQuantity: '20',
        unit: 'teaspoon',
        ingredient: 'water'
      });
    });
    it('of "10 – 20 teaspoon water"', () => {
      expect(parse('10-20 teaspoon water')).to.deep.equal({
        quantity: '10',
        maxQuantity: '20',
        unit: 'teaspoon',
        ingredient: 'water'
      });
    });
    it('of "1/2 teaspoon water"', () => {
      expect(parse('1/2 teaspoon water').quantity).to.equal('0.5');
    });
    it('of "10 1/2 teaspoon water"', () => {
      expect(parse('10 1/2 teaspoon water').quantity).to.equal('10.5');
    });

    describe('of unicode fractions', () => {
      const unicodeAmounts = ['¼', '½', '¾', '⅐', '⅑', '⅒', '⅓', '⅔', '⅕', '⅖', '⅗', '⅘', '⅙', '⅚', '⅛', '⅜', '⅝', '⅞'];
      const unicodeExpectedAmounts = ['0.25', '0.5', '0.75', '0.142', '0.111', '0.1', '0.333', '0.666', '0.2', '0.4', '0.6', '0.8', '0.166', '0.833', '0.125', '0.375', '0.625', '0.875'];

      for (let u = 0; u < unicodeAmounts.length; u++) {
        const element = unicodeAmounts[u];
        const expectedAmount = unicodeExpectedAmounts[u];
        it(`${element} to ${expectedAmount}`, () => {
          expect(parse(`${element} teaspoon water`).quantity).to.equal(expectedAmount);
        });
      }

      const mixedValues = ['1¼', '2½', '3¾', '4⅐', '5⅑', '6⅒', '7⅓', '8⅔', '9⅕', '10⅖', '11⅗', '12⅘', '13⅙', '14⅚', '15⅛', '16⅜', '17⅝', '18⅞'];
      const mixedExpectedValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];

      for (let u = 0; u < mixedValues.length; u++) {
        const element = mixedValues[u];
        const expectedAmount = (Number(mixedExpectedValues[u]) + Number(unicodeExpectedAmounts[u])).toString();
        it(`${element} to ${expectedAmount}`, () => {
          expect(parse(`${element} teaspoon water`).quantity).to.equal(expectedAmount);
        });
      }
    });

    it('doesn\'t freak out if a strange unicode character is present', () => {
      expect(parse('1/3 cup confectioners’ sugar')).to.deep.equal({
        quantity: '0.333',
        maxQuantity: undefined,
        unit: 'cup',
        ingredient: 'confectioners’ sugar'
      });
    });
  });

  describe('translates the literal units', () => {
    it('of "1 cup water"', () => {
      expect(parse('1 cup water').unit).to.equal('cup');
    });
    it('of "1 gallon water"', () => {
      expect(parse('1 gallon water').unit).to.equal('gallon');
    });
    it('of "1 ounce water"', () => {
      expect(parse('1 ounce water').unit).to.equal('ounce');
    });
    it('of "1 pint water"', () => {
      expect(parse('1 pint water').unit).to.equal('pint');
    });
    it('of "1 pound water"', () => {
      expect(parse('1 pound water').unit).to.equal('pound');
    });
    it('of "1 quart water"', () => {
      expect(parse('1 quart water').unit).to.equal('quart');
    });
    it('of "1 tablespoon water"', () => {
      expect(parse('1 tablespoon water').unit).to.equal('tablespoon');
    });
    it('of "1 teaspoon water"', () => {
      expect(parse('1 teaspoon water').unit).to.equal('teaspoon');
    });
    it('of "1 gram water"', () => {
      expect(parse('1 gram water').unit).to.equal('gram');
    });
    it('of "1 kilogram water"', () => {
      expect(parse('1 kilogram water').unit).to.equal('kilogram');
    });
    it('of "1 liter water"', () => {
      expect(parse('1 liter water').unit).to.equal('liter');
    });
    it('of "1 milligram water"', () => {
      expect(parse('1 milligram water').unit).to.equal('milligram');
    });
    it('of "1 milliliter water"', () => {
      expect(parse('1 milliliter water').unit).to.equal('milliliter');
    });
    it('of "1 large onion"', () => {
      expect(parse('1 large onion').unit).to.equal('large');
    });
    it('of "1 whole onion"', () => {
      expect(parse('1 whole onion').unit).to.equal('whole');
    });
    it('of "1 clove garlic"', () => {
      expect(parse('1 clove garlic').unit).to.equal('clove');
    });
    it('of "1 bag garlic"', () => {
      expect(parse('1 bag garlic').unit).to.equal('bag');
    });
    it('of "1 package sausage"', () => {
      expect(parse('1 package sausage').unit).to.equal('package');
    });
    it('"1 pinch water"', () => {
      expect(parse('1 pinch salt').unit).to.equal('pinch');
    });
    it('"1/3 stick of butter"', () => {
      expect(parse('1/3 stick of butter').unit).to.equal('stick');
    });
    it('"1 (14.5 oz) can tomatoes"', () => {
      expect(parse('1 (14.5 oz) can tomatoes')).to.deep.equal({
        unit: 'can',
        quantity: '1',
        maxQuantity: undefined,
        ingredient: '(14.5 oz) tomatoes'
      });
    });
    it('"1 (16 oz) box pasta"', () => {
      expect(parse('1 (16 oz) box pasta')).to.deep.equal({
        unit: 'box',
        quantity: '1',
        maxQuantity: undefined,
        ingredient: '(16 oz) pasta'
      });
    });
    it('"1 slice cheese"', () => {
      expect(parse('1 slice cheese')).to.deep.equal({
        unit: 'slice',
        quantity: '1',
        maxQuantity: undefined,
        ingredient: 'cheese'
      });
    });
  });

  it('translates unit when no unit provided', () => {
    expect(parse('1 tortilla')).to.deep.equal({
      unit: null,
      ingredient: 'tortilla',
      quantity: '1',
      maxQuantity: undefined,
    });
  });

  it('doesn\'t explode when no unit and no quantity provided', () => {
    expect(parse('powdered sugar')).to.deep.equal({
      unit: null,
      ingredient: 'powdered sugar',
      quantity: null,
      maxQuantity: undefined,
    });
  });

  describe('translates the abbreviated units of', () => {
    it('"1 cup water"', () => {
      expect(parse('1 c water').unit).to.equal('cup');
      expect(parse('2 c. water').unit).to.equal('cup');
      expect(parse('2 cups water').unit).to.equal('cup');
    });
    it('"1 gallon water"', () => {
      expect(parse('1 gal water').unit).to.equal('gallon');
      expect(parse('1 gallons water').unit).to.equal('gallon');
    });
    it('"1 ounce water"', () => {
      expect(parse('1 oz water').unit).to.equal('ounce');
      expect(parse('1 oz. water').unit).to.equal('ounce');
      expect(parse('2 ounces water').unit).to.equal('ounce');
    });
    it('"1 pint water"', () => {
      expect(parse('1 pt water').unit).to.equal('pint');
      expect(parse('2 pts water').unit).to.equal('pint');
      expect(parse('1 pt. water').unit).to.equal('pint');
      expect(parse('2 pints water').unit).to.equal('pint');
    });
    it('"1 pound water"', () => {
      expect(parse('1 lb water').unit).to.equal('pound');
      expect(parse('1 lb. water').unit).to.equal('pound');
      expect(parse('2 lbs water').unit).to.equal('pound');
      expect(parse('2 pounds water').unit).to.equal('pound');
    });
    it('"1 quart water"', () => {
      expect(parse('1 qt water').unit).to.equal('quart');
      expect(parse('1 qt. water').unit).to.equal('quart');
      expect(parse('1 qts water').unit).to.equal('quart');
      expect(parse('1 quarts water').unit).to.equal('quart');
    });
    it('"1 tablespoon water"', () => {
      expect(parse('1 T water').unit).to.equal('tablespoon');
      expect(parse('1 T. water').unit).to.equal('tablespoon');
      expect(parse('1 tbs water').unit).to.equal('tablespoon');
      expect(parse('1 tbsp water').unit).to.equal('tablespoon');
      expect(parse('1 tbspn water').unit).to.equal('tablespoon');
      expect(parse('2 tablespoons water').unit).to.equal('tablespoon');
      expect(parse('1 Tablespoon water').unit).to.equal('tablespoon');
      expect(parse('2 Tablespoons water').unit).to.equal('tablespoon');
    });
    it('"1 teaspoon water"', () => {
      expect(parse('1 tsp water').unit).to.equal('teaspoon');
      expect(parse('1 tspn water').unit).to.equal('teaspoon');
      expect(parse('1 t water').unit).to.equal('teaspoon');
      expect(parse('1 t. water').unit).to.equal('teaspoon');
      expect(parse('2 teaspoons water').unit).to.equal('teaspoon');
    });
    it('"1 gram water"', () => {
      expect(parse('1 g water').unit).to.equal('gram');
      expect(parse('1 g. water').unit).to.equal('gram');
      expect(parse('2 grams water').unit).to.equal('gram');
    });
    it('"1 kilogram water"', () => {
      expect(parse('1 kg water').unit).to.equal('kilogram');
      expect(parse('1 kg. water').unit).to.equal('kilogram');
      expect(parse('2 kilograms water').unit).to.equal('kilogram');
    });
    it('"1 liter water"', () => {
      expect(parse('1 l water').unit).to.equal('liter');
      expect(parse('1 l. water').unit).to.equal('liter');
      expect(parse('2 liters water').unit).to.equal('liter');
    });
    it('"1 milligram water"', () => {
      expect(parse('1 mg water').unit).to.equal('milligram');
      expect(parse('1 mg. water').unit).to.equal('milligram');
      expect(parse('1 milligrams water').unit).to.equal('milligram');
    });
    it('"1 milliliter water"', () => {
      expect(parse('1 ml water').unit).to.equal('milliliter');
      expect(parse('1 ml. water').unit).to.equal('milliliter');
      expect(parse('1 milliliters water').unit).to.equal('milliliter');
    });
    it('"1 pinch water"', () => {
      expect(parse('2 pinches salt').unit).to.equal('pinch');
    });
  });

  describe('translates the ingredient of', () => {
    it('"1 teaspoon water"', () => {
      expect(parse('1 teaspoon water').ingredient).to.equal('water');
    });
    it('"1 teaspoon milk"', () => {
      expect(parse('1 teaspoon milk').ingredient).to.equal('milk');
    });
  });
});

describe('combine ingredients', () => {
  it('accepts an empty array', () => {
    expect(combine([])).to.deep.equal([]);
  });

  it('returns sorted ingredients', () => {
    const ingredientArray = [
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      },
      {
        ingredient: 'apples',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'pound'
      }
    ];
    expect(combine(ingredientArray)).to.deep.equal([
      {
        ingredient: 'apples',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'pound'
      },
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      }
    ]);
  });

  it('combines two ingredient objects into one', () => {
    const ingredientArray = [
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      },
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      }
    ];
    expect(combine(ingredientArray)).to.deep.equal([
      {
        ingredient: 'butter',
        quantity: '4',
        maxQuantity: undefined,
        unit: 'tablespoon'
      }
    ]);
  });

  it('combines three ingredient objects into one', () => {
    const ingredientArray = [
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      },
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      },
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      }
    ];
    expect(combine(ingredientArray)).to.deep.equal([
      {
        ingredient: 'butter',
        quantity: '6',
        maxQuantity: undefined,
        unit: 'tablespoon'
      }
    ]);
  });

  it('combines four ingredient objects into two', () => {
    const ingredientArray = [
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      },
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      },
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      },
      {
        ingredient: 'apple',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'pound'
      }
    ];
    expect(combine(ingredientArray)).to.deep.equal([
      {
        ingredient: 'apple',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'pound'
      },
      {
        ingredient: 'butter',
        quantity: '6',
        maxQuantity: undefined,
        unit: 'tablespoon'
      }
    ]);
  });

  it('does not combine if ingredients have different units (for now)', () => {
    const ingredientArray = [
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      },
      {
        ingredient: 'butter',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'tablespoon'
      },
      {
        ingredient: 'butter',
        quantity: '1',
        maxQuantity: undefined,
        unit: 'stick'
      },
      {
        ingredient: 'apple',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'pound'
      }
    ];
    expect(combine(ingredientArray)).to.deep.equal([
      {
        ingredient: 'apple',
        quantity: '2',
        maxQuantity: undefined,
        unit: 'pound'
      },
      {
        ingredient: 'butter',
        quantity: '4',
        maxQuantity: undefined,
        unit: 'tablespoon'
      },
      {
        ingredient: 'butter',
        quantity: '1',
        maxQuantity: undefined,
        unit: 'stick'
      }
    ]);
  });

  it('handles the no-unit case', () => {
    const ingredientArray = [
      {
        ingredient: 'tortilla',
        quantity: '10',
        maxQuantity: undefined,
        unit: null
      },
      {
        ingredient: 'tortilla',
        quantity: '5',
        maxQuantity: undefined,
        unit: null
      }
    ];
    expect(combine(ingredientArray)).to.deep.equal([
      {
        ingredient: 'tortilla',
        quantity: '15',
        maxQuantity: undefined,
        unit: null
      }
    ]);
  });

  it('handles the no-unit and no-quantity case', () => {
    const ingredientArray = [
      {
        ingredient: 'Powdered Sugar',
        quantity: null,
        maxQuantity: undefined,
        unit: null
      },
      {
        ingredient: 'Powdered Sugar',
        quantity: null,
        maxQuantity: undefined,
        unit: null
      }
    ];
    expect(combine(ingredientArray)).to.deep.equal([
      {
        ingredient: 'Powdered Sugar',
        quantity: null,
        maxQuantity: undefined,
        unit: null
      }
    ]);
  });
});

describe('pretty printing press', () => {
  const ingredients = [{
    ingredient: 'milk',
    unit: 'cup',
    quantity: '1.5'
  }, {
    ingredient: 'milk',
    unit: 'cup',
    quantity: '0.25'
  }, {
    ingredient: 'milk',
    unit: 'cup',
    quantity: '1'
  }, {
    ingredient: 'something',
    unit: 'box',
    quantity: '2'
  }, {
    ingredient: 'milk',
    unit: 'teaspoon',
    quantity: '1.333'
  }, {
    ingredient: 'milk',
    unit: 'teaspoon',
    quantity: '1.666'
  }, {
    ingredient: 'milk',
    unit: 'teaspoon',
    quantity: '1.111'
  }, {
    ingredient: 'milk',
    unit: 'teaspoon',
    quantity: '1.166'
  }, {
    ingredient: 'milk',
    unit: 'teaspoon',
    quantity: '1.833'
  }, {
    ingredient: 'powdered sugar',
    unit: null,
    quantity: null
  }, {
    ingredient: 'eggs',
    unit: null,
    quantity: '18'
  }, {
    ingredient: 'eggs',
    unit: 'large',
    quantity: '18'
  }];
  const expectedOutcome = [
    '1 1/2 cups milk',
    '1/4 cup milk',
    '1 cup milk',
    '2 boxes something',
    '1 1/3 teaspoons milk',
    '1 2/3 teaspoons milk',
    '1 1/9 teaspoons milk',
    '1 1/6 teaspoons milk',
    '1 5/6 teaspoons milk',
    'powdered sugar',
    '18 eggs',
    '18 large eggs'
  ];
  for (let i = 0; i < ingredients.length; i++) {
    it(`returns expected outcome ${expectedOutcome[i]}`, () => {
      expect(prettyPrintingPress(ingredients[i])).to.equal(expectedOutcome[i]);
    });
  }
});
