const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

function makePromiseWithConstructor(itShouldResolve) {
    return new Promise((resolve, reject) => {
        if (itShouldResolve) resolve('Success!');
        else reject('Failed!');
    });
}

function validateEmail(email) {
    return new Promise((resolve, reject) => {
        if (email.includes('@') && email.includes('.')) resolve(email);
        else reject('Invalid email format');
    });
}

function authenticateUser(username, password) {
    return new Promise((resolve, reject) => {
        if (!username) reject('Username is required');
        else if (!password) reject('Password is required');
        else if (password.length < 6) reject('Password too short');
        else resolve({ username: username, authenticated: true });
    });
}

function makePromiseResolveWith(value) {
    return Promise.resolve(value);
}

function sumNumbers(numbers) {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return Promise.resolve(sum);
}

function addFullName(user) {
    return Promise.resolve({ ...user, fullName: `${user.firstName} ${user.lastName}` });
}

function simpleChain() {
    return Promise.resolve(5).then(val => val * 2).then(val => val + 10).then(val => val.toString());
}

function validateNumber(number) {
    if (number < 0) throw new Error('Number must be positive');
    return number;
}

function safeCalculation(number) {
    return Promise.resolve(number)
        .then(val => validateNumber(val))
        .then(val => val * 2)
        .then(val => val + 5)
        .then(result => ({ original: number, result: result }))
        .catch(error => ({ error: error.message }));
}

const products = {
    101: { id: 101, name: 'Laptop', price: 1000, stock: 5 },
    102: { id: 102, name: 'Mouse', price: 25, stock: 50 },
    103: { id: 103, name: 'Keyboard', price: 75, stock: 0 }
};

function getProduct(productId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const product = products[productId];
            if (product) resolve(product);
            else reject(new Error('Product not found'));
        }, 100);
    });
}

function checkStock(product) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (product.stock > 0) resolve(product);
            else reject(new Error('Out of stock'));
        }, 100);
    });
}

function calculateTotal(product, quantity) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ product: product.name, quantity: quantity, unitPrice: product.price, total: product.price * quantity });
        }, 100);
    });
}

function placeOrder(productId, quantity) {
    return getProduct(productId)
        .then(product => checkStock(product))
        .then(product => calculateTotal(product, quantity))
        .catch(error => ({ error: error.message }));
}


function job(delay) {
    return new Promise(resolve => setTimeout(() => resolve(delay), delay));
}

function getFastestResponse(delays) {
    const promises = delays.map(d => job(d));
    return Promise.race(promises);
}

function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), ms);
    });
    return Promise.race([promise, timeout]);
}

function fetchFromServer(serverName, delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                server: serverName,
                data: `Data from ${serverName}`,
                responseTime: delay
            });
        }, delay);
    });
}

function fetchFromFastestServer() {
    return Promise.race([
        fetchFromServer('Server A', 1000),
        fetchFromServer('Server B', 500),
        fetchFromServer('Server C', 800)
    ]);
}

class PromiseQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    add(promiseFactory) {
        this.queue.push(promiseFactory);
        if (!this.processing) this.process();
    }

    async process() {
        this.processing = true;
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            await task();
        }
        this.processing = false;
    }
}

class PriorityQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    add(promiseFactory, priority = 0) {
        this.queue.push({ factory: promiseFactory, priority });
        this.queue.sort((a, b) => b.priority - a.priority);
        if (!this.processing) this.process();
    }

    async process() {
        this.processing = true;
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            await task.factory();
        }
        this.processing = false;
    }
}

async function runAllLabs() {
    console.log(" Task 1.1 1.3 1.4");

await makePromiseWithConstructor(true)
    .then(result => console.log(' Тест 1.1 (resolve):', result))
    .catch(error => console.log('   Помилка:', error));

await makePromiseWithConstructor(false)
    .then(result => console.log('   Не повинно виконатися'))
    .catch(error => console.log(' Тест 1.1 (reject):', error));

    validateEmail('test@example.com')
    .then(email => console.log(' Тест 1.3 (валідний):', email))
    .catch(err => console.log('   Помилка:', err));

    validateEmail('invalid-email')
    .then(email => console.log('   Не повинно виконатися'))
    .catch(err => console.log(' Тест 1.3 (невалідний):', err));

await authenticateUser('john', 'password123')
    .then(user => console.log(' Тест 1.4 (успіх):', user))
    .catch(err => console.log('   Помилка:', err));

await authenticateUser('', 'password123')
    .then(user => console.log('   Не повинно виконатися'))
    .catch(err => console.log(' Тест 1.4 (немає username):', err));

await authenticateUser('john', '12345')
    .then(user => console.log('   Не повинно виконатися'))
    .catch(err => console.log(' Тест 1.4 (короткий пароль):', err));

    console.log("\n 2: Promise.resolve()");
    await makePromiseResolveWith(5)
    .then(value => console.log(' Тест 2.1:', value)); 

    // Перевірка:
    await sumNumbers([1, 2, 3, 4, 5])
    .then(sum => console.log(' Тест 2.2:', sum)); // Очікується: 15

    console.log("\n 2.3 Adding full name to user object");
    await addFullName({ firstName: 'John', lastName: 'Doe' })
    .then(user => console.log(' Тест 2.3:', user));

    console.log("\n 7: Promise Chaining");
    console.log("\n7.1 Result:", await simpleChain());

    // Перевірка:
await safeCalculation(10)
    .then(result => console.log(' Тест 7.4a:', result));
// Очікується: { original: 10, result: 25 }

await safeCalculation(-5)
    .then(result => console.log(' Тест 7.4b:', result));
// Очікується: { error: 'Number must be positive' }

// Перевірка:
await   placeOrder(101, 2)
    .then(result => console.log(' Тест 7.5a:', result));
// Очікується: { product: 'Laptop', quantity: 2, unitPrice: 1000, total: 2000 }

await placeOrder(103, 1)
    .then(result => console.log(' Тест 7.5b:', result));
// Очікується: { error: 'Out of stock' }

await placeOrder(999, 1)
    .then(result => console.log(' Тест 7.5c:', result));
// Очікується: { error: 'Product not found' }



    console.log("\ 10: Promise.race()");
     getFastestResponse([1000, 500, 2000, 300])
    .then(result => console.log(' Тест 10.1:', result)); // 300
    const slowPromise = new Promise(resolve => setTimeout(() => resolve('Done'), 2000));
const fastPromise = new Promise(resolve => setTimeout(() => resolve('Done'), 500));

await   withTimeout(fastPromise, 1000)
    .then(result => console.log(' Тест 10.2a:', result)); // 'Done'

await withTimeout(slowPromise, 1000)
    .catch(error => console.log(' Тест 10.2b:', error.message)); // 'Timeout'
await   fetchFromFastestServer()
    .then(result => console.log(' Тест 10.3:', result));
// Перевірка:
const queue1 = new PromiseQueue();

queue1.add(() => new Promise(resolve => {
    setTimeout(() => {
        console.log(' Тест 21.1: Task 1 completed');
        resolve(1);
    }, 300);
}));

queue1.add(() => new Promise(resolve => {
    setTimeout(() => {
        console.log(' Тест 21.1: Task 2 completed');
        resolve(2);
    }, 100);
}));

queue1.add(() => new Promise(resolve => {
    setTimeout(() => {
        console.log(' Тест 21.1: Task 3 completed');
        resolve(3);
    }, 200);
}));
// Очікується виконання в порядку: Task 1 → Task 2 → Task 3

// Перевірка:
const queue2 = new PriorityQueue();

queue2.add(() => Promise.resolve(console.log('  Priority 1')), 1);
queue2.add(() => Promise.resolve(console.log('  Priority 5')), 5);
queue2.add(() => Promise.resolve(console.log('  Priority 3')), 3);

console.log(' Тест 21.2: Виконання за пріоритетом:');
// Очікується: Priority 5 → Priority 3 → Priority 1

    await job(1500);
    rl.close();
}

runAllLabs();