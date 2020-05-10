const fs = require('fs');

const files = process.argv.slice(2);

files.forEach((filePath) => {
    console.log(`Replacing bad character in ${filePath}`);
    const contents = fs.readFileSync(filePath).toString().replace('.test("￿")', '.test("")');

    fs.writeFileSync(filePath, contents);
});
