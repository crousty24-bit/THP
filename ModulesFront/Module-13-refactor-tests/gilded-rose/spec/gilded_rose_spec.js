const { Shop, Item } = require('../src/gilded_rose.js');

describe('Gilded Rose', function() {
  function updateItem(item, days = 1) {
    const gildedRose = new Shop([item]);

    for (let day = 0; day < days; day += 1) {
      gildedRose.updateQuality();
    }

    return gildedRose.items[0];
  }

  it('updates the full inventory after 2 days', function() {
    const items = [
      new Item('+5 Dexterity Vest', 10, 20),
      new Item('Aged Brie', 2, 0),
      new Item('Elixir of the Mongoose', 5, 7),
      new Item('Sulfuras, Hand of Ragnaros', 0, 80),
      new Item('Sulfuras, Hand of Ragnaros', -1, 80),
      new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
      new Item('Backstage passes to a TAFKAL80ETC concert', 10, 49),
      new Item('Backstage passes to a TAFKAL80ETC concert', 5, 39),
      new Item('Conjured Mana Cake', 3, 6),
    ];

    const gildedRose = new Shop(items);

    gildedRose.updateQuality();
    gildedRose.updateQuality();

    expect(items).toEqual([
      new Item('+5 Dexterity Vest', 8, 18),
      new Item('Aged Brie', 0, 2),
      new Item('Elixir of the Mongoose', 3, 5),
      new Item('Sulfuras, Hand of Ragnaros', 0, 80),
      new Item('Sulfuras, Hand of Ragnaros', -1, 80),
      new Item('Backstage passes to a TAFKAL80ETC concert', 13, 22),
      new Item('Backstage passes to a TAFKAL80ETC concert', 8, 50),
      new Item('Backstage passes to a TAFKAL80ETC concert', 3, 45),
      new Item('Conjured Mana Cake', 1, 2),
    ]);
  });

  it('decreases sellIn by 1 for normal items', function() {
    const item = updateItem(new Item('+5 Dexterity Vest', 10, 20));

    expect(item.sellIn).toBe(9);
  });

  it('decreases normal item quality by 1 before the sell date', function() {
    const items = new Shop([
      new Item('+5 Dexterity Vest', 10, 20),
      new Item('Elixir of the Mongoose', 5, 7),
    ]).updateQuality();

    expect(items[0].quality).toBe(19);
    expect(items[1].quality).toBe(6);
  });

  it('decreases normal item quality by 2 after the sell date', function() {
    const items = new Shop([
      new Item('+5 Dexterity Vest', 0, 20),
      new Item('Elixir of the Mongoose', -1, 7),
    ]).updateQuality();

    expect(items[0].quality).toBe(18);
    expect(items[1].quality).toBe(5);
  });

  it('never makes quality negative', function() {
    const items = new Shop([
      new Item('+5 Dexterity Vest', 5, 0),
      new Item('Conjured Mana Cake', 0, 1),
    ]).updateQuality();

    expect(items[0].quality).toBe(0);
    expect(items[1].quality).toBe(0);
  });

  it('never increases quality above 50', function() {
    const items = new Shop([
      new Item('Aged Brie', 5, 50),
      new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49),
    ]).updateQuality();

    expect(items[0].quality).toBe(50);
    expect(items[1].quality).toBe(50);
  });

  it('increases Aged Brie quality as it gets older', function() {
    const items = new Shop([
      new Item('Aged Brie', 2, 0),
      new Item('Aged Brie', 0, 10),
    ]).updateQuality();

    expect(items[0].quality).toBe(1);
    expect(items[1].quality).toBe(12);
  });

  it('never changes Sulfuras sellIn or quality', function() {
    const items = new Shop([
      new Item('Sulfuras, Hand of Ragnaros', 0, 80),
      new Item('Sulfuras, Hand of Ragnaros', -1, 80),
      new Item('Sulfuras, Hand of Ragnaros', 5, 79),
    ]).updateQuality();

    expect(items[0]).toEqual(new Item('Sulfuras, Hand of Ragnaros', 0, 80));
    expect(items[1]).toEqual(new Item('Sulfuras, Hand of Ragnaros', -1, 80));
    expect(items[2]).toEqual(new Item('Sulfuras, Hand of Ragnaros', 5, 79));
  });

  it('increases Backstage passes quality by 2 when there are 10 days or fewer', function() {
    const items = new Shop([
      new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20),
      new Item('Backstage passes to a TAFKAL80ETC concert', 6, 30),
    ]).updateQuality();

    expect(items[0].quality).toBe(22);
    expect(items[1].quality).toBe(32);
  });

  it('increases Backstage passes quality by 3 when there are 5 days or fewer', function() {
    const items = new Shop([
      new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20),
      new Item('Backstage passes to a TAFKAL80ETC concert', 1, 30),
    ]).updateQuality();

    expect(items[0].quality).toBe(23);
    expect(items[1].quality).toBe(33);
  });

  it('drops Backstage passes quality to 0 after the concert', function() {
    const items = new Shop([
      new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20),
      new Item('Backstage passes to a TAFKAL80ETC concert', -1, 30),
    ]).updateQuality();

    expect(items[0].quality).toBe(0);
    expect(items[1].quality).toBe(0);
  });

  it('degrades Conjured items twice as fast as normal items', function() {
    const items = new Shop([
      new Item('Conjured Mana Cake', 3, 6),
      new Item('Conjured Dark Blade', 0, 6),
    ]).updateQuality();

    expect(items[0].quality).toBe(4);
    expect(items[1].quality).toBe(2);
  });

  it('returns the updated inventory', function() {
    const gildedRose = new Shop([new Item('+5 Dexterity Vest', 10, 20)]);
    const items = gildedRose.updateQuality();

    expect(items).toBe(gildedRose.items);
    expect(items[0]).toEqual(new Item('+5 Dexterity Vest', 9, 19));
  });
});
