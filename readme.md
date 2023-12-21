# ETpay Transfer Service Deployment Guide

Esta guía describe los pasos para implementar el servicio de transferencia ETpay mediante Amazon Web Services (AWS), que incluye la creación de una tabla DynamoDB, la carga de datos JSON a S3 y su importación a DynamoDB.

## 1. Crea un Bucket en S3

Crea un Bucket en S3 con la configuración predeterminada y el nombre de tu elección.

## 2. Sube los datos a S3

Ejecute el script `uploadJsonsS3.js` para dividir y convertir el JSON `transfers_back_test.json` en varios JSON de DynamoDB individuales y cargarlos al bucket en el paso 1. Asegúrate de tener las dependencias necesarias corriendo el siguiente comando:

    ```bash
    npm install
    ```

## 3. Importa datos a DynamoDB

Usando el portal de AWS, dirígete a DynamoDB. En el servicio de DynamoDB sigue los siguientes pasos:

- Selecciona la opción "Importaciones de S3".
- Da click en el botón "Importación de S3".
- En el campo en el que piden la URL de S3 fuente, escribe lo siguiente: s3://<nombre del bucket en el paso 1>/transferencias/
- Completa los siguientes pasos con la configuración predeterminada.

O sigue los pasos en el siguiente link: https://aws.amazon.com/es/blogs/database/amazon-dynamodb-can-now-import-amazon-s3-data-into-a-new-table/

El resultado debería de ser la siguiente tabla en DynamoDB con seis documentos:

### Table: `Transfers`

| Nombre del atributo  | Data Type  | Descripción                                       | Key |
|----------------------|------------|---------------------------------------------------|-----|
| `id`                 | String     | Identificador único de la transferencia           | PK  |
| `validated`          | Boolean    | Estado de validación de la transferencia          |     |
| `inUse`              | Boolean    | Indica si la transferencia está en uso            |     |
| `monto`              | Number     | Importe de la transferencia                       |     |
| `tipo`               | String     | Tipo de transferencia (crédito/débito)            |     |
| `fechaMovimiento`    | Number     | Timestamp de la transacción                       |     |
| `fecha`              | String     | Fecha de la transacción en un formato específico  |     |
| `originName`         | String     | Nombre de la empresa de origen                    |     |
| `originRut`          | String     | RUT del ordenante                                 |     |
| `originAccount`      | String     | Número de cuenta del ordenante                    |     |
| `receiverRut`        | String     | RUT del receptor                                  |     |
| `receiverAccount`    | String     | Número de cuenta del receptor                     |     |
| `originBankCode`     | String     | Código del banco de origen                        |     |
| `originBankName`     | String     | Nombre del banco de origen                        |     |
| `comment`            | String     | Comentario sobre la transferencia                 |     |
| `originAccountType`  | String     | Tipo de cuenta del ordenante                      |     |
| `validatedAt`        | String     | Fecha de validación de la transferencia           |     |
| `createdAt`          | String     | Fecha de creación de la transferencia             |     |
| `updatedAt`          | String     | Última fecha de actualización de la transferencia |     |

PK: Primary Key

# Ahora siguen los pasos para crear la api, probarla y desplegarla

## Prerequisitos

1. Node.js y npm instalados.
2. Una cuenta de AWS.
3. AWS CLI configurada en tu computadora.
4. Serverless CLI instalado globalmente con `npm install -g serverless`.

## 4. Configuración inicial

1. Instala las dependencias en package.json:

    ```bash
    npm install
    ```

## 5. Pruebas Locales

Inicia el entorno local con el comando:

```bash
serverless offline
```

Podrás acceder a las funciones emuladas en la rutas definidas en `serverless.yml` mediante tu navegador o utilizando herramientas como `curl` o `postman`.

Por ejemplo:

```bash
curl http://localhost:3000/dev/transfers/insert
```

Las rutas son las siguientes:
1. Para leer una transferencia: `/transfers/{id}` => GET
2. Para insertar una transferencia: `/transfers/insert` con el la transferencia en el body de la llamada en formato json => POST
3. Para editar el monto de una transferencia: `/transfers/{id}` => PUT
4. Para borrar una transferencia: `/transfers/{id}` => DELETE

## 6. Despliegue en AWS

Antes de desplegar asegúrate de tener las credenciales de AWS correctamente configuradas.

1. Despliega la aplicación a AWS con el siguiente comando:

    ```bash
    serverless deploy
    ```

    Este proceso puede tardar varios minutos. Serverless creará todos los recursos necesarios en AWS para ti, como las funciones Lambda, API Gateway, IAM roles, etc.

2. Una vez finalizado el despliegue, el CLI mostrará las rutas de acceso al servicio.

## 7. Actualizaciones

Si haces cambios en el código o en la configuración y quieres actualizar la función en AWS, simplemente ejecuta nuevamente:

```bash
serverless deploy
```

## 8. Limpieza

Para eliminar los recursos creados en AWS y evitar incurrir en posibles costos, puedes utilizar el comando:

```bash
serverless remove
```

Esto eliminará el stack de CloudFormation y todos los recursos asociados con el servicio.

Con estos pasos puedes probar localmente y desplegar eficientemente esta aplicación Node.js a AWS Lambda utilizando el Serverless Framework. Asegúrate de leer la documentación oficial de Serverless para funciones más avanzadas y configuraciones específicas según tus necesidades.

https://www.serverless.com/framework/docs