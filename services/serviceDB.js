const fs = require('node:fs/promises')
const path = require('node:path')

module.exports = {
    readDB: async () => {
        const buffer = await fs.readFile(path.join(process.cwd(), 'usersDB.json'))
        const data = buffer.toString()
        console.log(data);
        return data? JSON.parse(data) : []
    },
    writeDB: async (data) => {
        await fs.writeFile(path.join(process.cwd(), 'usersDB.json'), JSON.stringify(data))
    }
}