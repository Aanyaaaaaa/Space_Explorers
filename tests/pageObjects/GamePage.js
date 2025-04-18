const { By, Key, until } = require('selenium-webdriver');

class GamePage {
  constructor(driver) {
    this.driver = driver;
  }
  async open() {
    try {
      await this.driver.get('http://localhost:3000/game');
      // Use an explicit wait for something on the page to be present
      await this.driver.wait(
        until.elementLocated(By.css('div[tabindex="0"]')), 
        10000, 
        "Game container not found"
      );
    } catch (error) {
      console.error("Error opening game page:", error);
      throw error;
    }
  }

  async focusGameArea() {
    try {
      const gameArea = await this.driver.findElement(By.css('div[tabindex="0"]'));
      await this.driver.executeScript("arguments[0].focus();", gameArea);
      await this.driver.sleep(100); // Short pause to ensure focus is applied
    } catch (error) {
      console.error("Failed to focus game area:", error);
      throw error;
    }
  }

  async movePlayer(direction, steps = 1) {
    await this.focusGameArea();
    const keyMap = {
      'up': Key.ARROW_UP,
      'down': Key.ARROW_DOWN,
      'left': Key.ARROW_LEFT,
      'right': Key.ARROW_RIGHT
    };
    
    if (!keyMap[direction]) {
      throw new Error(`Invalid direction: ${direction}`);
    }
    
    for (let i = 0; i < steps; i++) {
      await this.driver.actions().keyDown(keyMap[direction]).perform();
      await this.driver.actions().keyUp(keyMap[direction]).perform();
      await this.driver.sleep(200); // Increased sleep to ensure movement registers
    }
  }

  async pressSpace() {
    await this.focusGameArea();
    await this.driver.actions().keyDown(Key.SPACE).perform();
    await this.driver.sleep(100);
    await this.driver.actions().keyUp(Key.SPACE).perform();
    await this.driver.sleep(500); // Wait for potential question to appear
  }

  async getPlanets() {
    return this.driver.wait(async () => {
      const planets = await this.driver.findElements(By.css('img[src*="/images/"]'));
      return planets.length > 0 ? planets : null;
    }, 5000, "No planets found within timeout").catch(() => []);
  }

  async getScore() {
    return this.driver.findElement(By.xpath("//*[contains(text(),'Current score')]"))
      .getText();
  }

  async endGame() {
    const btn = await this.driver.findElement(By.xpath("//button[contains(text(),'End Game')]"));
    await btn.click();
  }
}

module.exports = GamePage;
