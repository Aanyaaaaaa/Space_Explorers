const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const GamePage = require('../pageObjects/GamePage');

describe('Space Saga Game E2E Tests', function() {
  let driver, game;

  before(async function() {
    driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    game = new GamePage(driver);
    await game.open();
  });

  after(async function() {
    await driver.quit();
  });

  it('should display planets', async function() {
    const planets = await game.getPlanets();
    assert.ok(planets.length > 0, "Planets should be visible");
  });

  it('should move the player right', async function() {
    // Move right 3 times
    await game.movePlayer('right', 3);
    // No assertion here, but you can check position if you expose it in the DOM
  });

  it('should show a question when near a planet and pressing space', async function() {
    // Move player near the first planet (adjust steps as needed)
    await game.movePlayer('left', 20);
    await game.pressSpace();
    // Wait for question container to appear
    const question = await driver.wait(
      async () => {
        const els = await driver.findElements({ css: '.question' });
        return els.length > 0 ? els[0] : null;
      },
      2000,
      "Question did not appear"
    );
    assert.ok(question, "Question should be displayed when near a planet and space is pressed");
  });
});
 