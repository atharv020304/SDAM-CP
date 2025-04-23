import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';

describe('Register Page Tests', function () {
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function () {
        await driver.quit();
    });

    it('should register a new user', async function () {
        this.timeout(20000);

        await driver.get('http://localhost:5173/register'); 
        
    
        const roleDropdown = await driver.findElement(By.css('select')); 
        await roleDropdown.click(); 
        const employerOption = await driver.findElement(By.css('select option[value="Employer"]')); 
        await employerOption.click(); 


        await driver.findElement(By.css('input[placeholder="Your Name"]')).sendKeys('Test User7');
        await driver.findElement(By.css('input[placeholder="youremail@gmail.com"]')).sendKeys('testuser8@example.com');
        await driver.findElement(By.css('input[placeholder="111-222-333"]')).sendKeys('1234567890');
        await driver.findElement(By.css('input[placeholder="Your Address"]')).sendKeys('123 Test St, Test City');
        await driver.findElement(By.css('input[placeholder="Your Password"]')).sendKeys('TestPassdword123');

    
        await driver.findElement(By.css('button[type="submit"]')).click();

      
        await driver.wait(until.urlIs('http://localhost:5173/'), 10000); 

       
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal('http://localhost:5173/'); 
    });
});
