const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configura tus credenciales, por ejemplo, a través de una configuración de entorno o un perfil config.
AWS.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAZZA64KBJTH5CS2GQ",
    secretAccessKey: "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"
});

// Crea una instancia del SDK S3.
const s3 = new AWS.S3();

// Leer el contenido del archivo JSON
const jsonFilePath = path.join(__dirname, 'transfers_back_test.json');
const transferencias = JSON.parse(fs.readFileSync(jsonFilePath));

function convertToDynamoDBJson(json) {
    return AWS.DynamoDB.Converter.marshall(json);
}

// Función que sube un archivo a S3
const uploadToS3 = (bucketName, key, body) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: body
    };

    return new Promise((resolve, reject) => {
        s3.putObject(params, (err, data) => {
            if (err) {
                console.error(`Error al subir ${key}:`, err);
                return reject(err);
            }
            console.log(`Subida exitosa - ${key}`);
            resolve(data);
        });
    });
};

// Función para subir todas las transferencias a S3
const saveTransferencias = async (bucketName) => {
    for (const transferencia of transferencias) {
        const key = `transferencias/${transferencia.id}.json`;
        const dynamoDbJson = convertToDynamoDBJson(transferencia);
        const uploadJson = { "Item": dynamoDbJson };
        const body = JSON.stringify(uploadJson);
        // console.log(body);
        // fs.writeFile(`./${transferencia.id}.json`, body, (err) => {
        //     if (!err) {
        //         console.log('done');
        //     }
        // });
        try {
            await uploadToS3(bucketName, key, body);
        } catch (error) {
            console.error(`Error al subir la transferencia ${transferencia.id}`, error);
        }
    }
};

const bucketName = 'transfers-bucket'; // Reemplaza con el nombre de tu bucket S3
saveTransferencias(bucketName).then(() => {
    console.log('Todas las transferencias han sido guardadas');
});