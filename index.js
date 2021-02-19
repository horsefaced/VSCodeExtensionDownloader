const extensions = require("./extensions.json");
const https = require("https");
const fs = require("fs");
const path = require("path");

const extensionsPath = path.resolve(__dirname, 'extensions');
if (fs.existsSync(extensionsPath))
    fs.rmdirSync(extensionsPath, { recursive: true });

fs.mkdirSync(extensionsPath);

for (let extension of extensions) {
    let name = extension.name, publisher = extension.publisher, version = extension.version;
    let downloadLink = `https://${publisher}.gallery.vsassets.io/_apis/public/gallery/publisher/${publisher}/extension/${name}/${version}/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`;
    const filePath = path.resolve(extensionsPath, `${name}.vsix`);
    const file = fs.createWriteStream(filePath);
    const request = https.get(downloadLink, (response) => {
        console.log(`start downloading ${name}.vsix`);
        response.pipe(file);
    }).on('error', (error) => {
        fs.unlink(filePath);
        console.log(`${name}.vsix download with error in ${error.message}`);
    });

    file.on('finish', () => {
        console.log(`${name}.vsix downloaded`);
    });

    file.on('error', (err) => {
        fs.unlink(filePath);
        console.log(`${name}.vsix download with error in ${err.message}`);
    });
}