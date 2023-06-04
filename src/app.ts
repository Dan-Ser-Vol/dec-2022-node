const express = require('express')
const app = express()

const fileService = require('../services/serviceDB.js')


app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/users', async function (req, res) {
    const users = await fileService.readDB()
    if (!users) {
        res.status(404).json({message: 'Користувачі не знайдені'})
    }
    res.json(users)
})



app.post('/users', async function (req, res) {
    const { name, age, gender } = req.body;

    if (!name || !age || !gender) {
        return res.status(400).json({ message: 'Немає всіх полів' });
    }

    if (typeof name !== 'string' || typeof gender !== 'string') {
        return res.status(400).json({ message: 'Не валідні дані' });
    }

    if (age < 5 || age > 150) {
        return res.status(400).json({ message: 'Не валідні дані для віку' });
    }

    const users = await fileService.readDB();
    if (!users) {
        return res.status(404).json({ message: 'Помилка при створенні користувача' });
    }

    const existingUser = users.find(user => user.name === name);
    if (existingUser) {
        return res.status(409).json({ message: 'Користувач з таким ім\'ям вже існує' });
    }

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        age,
        gender
    };

    users.push(newUser);
    await fileService.writeDB(users);
    res.status(201).json({ message: 'Success', newUser });
});



app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    const users = await fileService.readDB();
    if (!users) {
        return res.status(404).json({ message: 'Помилка при отриманні користувача' });
    }

    const user = users.find(user => user.id === +id);
    if (!user) {
        return res.status(404).json({ message: 'Користувач не знайдений' });
    }

    await fileService.writeDB(users);
    res.status(200).json({ message: 'Користувач знайдений', user });
});



app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, gender } = req.body;

    if (!name || !age || !gender) {
        return res.status(400).json({ message: 'Немає всіх полів' });
    }

    if (typeof name !== 'string' || typeof gender !== 'string') {
        return res.status(400).json({ message: 'Не валідні дані' });
    }

    if (age < 5 || age > 150) {
        return res.status(400).json({ message: 'Не валідні дані для віку' });
    }

    const users = await fileService.readDB();
    if (!users) {
        return res.status(404).json({ message: 'Помилка при оновленні користувача' });
    }

    const user = users.find(user => user.id === +id);
    if (!user) {
        return res.status(404).json({ message: 'Користувач не знайдений' });
    }

    user.name = name;
    user.age = age;
    user.gender = gender;

    await fileService.writeDB(users);
    res.status(200).json({ message: 'Користувач був оновлений', user });
});




app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    const users = await fileService.readDB();
    if (!users) {
        return res.status(404).json({ message: 'Помилка при видаленні користувача' });
    }

    const index = users.findIndex(user => user.id === +id);
    if (index === -1) {
        return res.status(422).json({ message: 'Користувач не знайдений' });
    }

    users.splice(index, 1);

    await fileService.writeDB(users);
    res.status(200).json({ message: 'Користувач був видалений' });
});




app.listen(3000, () => console.log('server working on port 3000!'))