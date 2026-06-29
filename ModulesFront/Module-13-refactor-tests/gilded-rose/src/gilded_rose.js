class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  static MAX_QUALITY = 50;

  static MIN_QUALITY = 0;

  static AGED_BRIE = 'Aged Brie';

  static BACKSTAGE_PASSES = 'Backstage passes to a TAFKAL80ETC concert';

  static SULFURAS = 'Sulfuras, Hand of Ragnaros';

  static CONJURED_PREFIX = 'Conjured';

  constructor(items = []) {
    this.items = items;
  }

  updateQuality() {
    this.items.forEach(item => this.updateItem(item));

    return this.items;
  }

  updateItem(item) {
    if (this.isSulfuras(item)) {
      return;
    }

    if (this.isAgedBrie(item)) {
      this.updateAgedBrie(item);
    } else if (this.isBackstagePass(item)) {
      this.updateBackstagePass(item);
    } else {
      this.updateStandardItem(item);
    }

    item.sellIn -= 1;
  }

  updateAgedBrie(item) {
    const increase = item.sellIn <= 0 ? 2 : 1;
    this.changeQuality(item, increase);
  }

  updateBackstagePass(item) {
    if (item.sellIn <= 0) {
      item.quality = Shop.MIN_QUALITY;
      return;
    }

    let increase = 1;

    if (item.sellIn <= 5) {
      increase = 3;
    } else if (item.sellIn <= 10) {
      increase = 2;
    }

    this.changeQuality(item, increase);
  }

  updateStandardItem(item) {
    const baseDecrease = this.isConjured(item) ? 2 : 1;
    const expirationMultiplier = item.sellIn <= 0 ? 2 : 1;

    this.changeQuality(item, -(baseDecrease * expirationMultiplier));
  }

  changeQuality(item, amount) {
    item.quality = Math.min(
      Shop.MAX_QUALITY,
      Math.max(Shop.MIN_QUALITY, item.quality + amount)
    );
  }

  isAgedBrie(item) {
    return item.name === Shop.AGED_BRIE;
  }

  isBackstagePass(item) {
    return item.name === Shop.BACKSTAGE_PASSES;
  }

  isSulfuras(item) {
    return item.name === Shop.SULFURAS;
  }

  isConjured(item) {
    return item.name.startsWith(Shop.CONJURED_PREFIX);
  }
}

module.exports = {
  Item,
  Shop
};
