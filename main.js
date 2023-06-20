// npm run dev file1 txt dolar 250

const https = require('https');
const fs = require('fs');

const [, , fileName, ext, economicIndicator, pesos] = process.argv;

https
  .get(`https://mindicador.cl/api/${economicIndicator}`, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      const result = JSON.parse(data).serie[0];
      const fileContent = `
        A la fecha: ${result.fecha}\n
        Fue realizada cotización con los siguientes datos:\n
        Cantidad de pesos a convertir: ${pesos} pesos\n
        Convertido a ${economicIndicator} da un total de: $${result.valor}`;
      fs.writeFile(fileName + '.' + ext, fileContent, (error) => {
        if (error) {
          console.log('writeFile error:', error);
          return;
        }
        fs.readFile(fileName + '.' + ext, 'utf8', (err, data) => {
          if (err) {
            console.log('readFile error:', error);
            return;
          }
          console.log(data);
        });
      });
    });
  })
  .on('error', (err) => {
    console.log('http.get error:', err);
  });
/*
La casa de cambios BlueMoney Spa está interesada en ofrecer una plataforma web por lo
que solicitó contratar a un desarrollador para la creación de una aplicación que calcule los
montos de las cotizaciones y registre las consultas en un archivo de texto usando el
siguiente template:
A la fecha: Thu Sep 03 2022 18:41:00 GMT-0400 (GMT-04:00)
Fue realizada cotización con los siguientes datos:
Cantidad de pesos a convertir: 250000 pesos
Convertido a "dólar" da un total de:
$324,06
Deberás construir una aplicación en Node que reciba los datos para la cotización por la línea de comandos, como
argumentos y consulte la API mindicador (https://mindicador.cl/api) para los cálculos correspondientes.
Por ejemplo para:
https://mindicador.cl/api/dolar/31-05-2023
Responde:
{"version":"1.7.0","autor":"mindicador.cl","codigo":"dolar","nombre":"Dólar
observado","unidad_medida":"Pesos","serie":[{"fecha":"2023-05-31T04:00:00.000Z","valor":803.94}]}
Consideraciones generales
1. Recibir por la línea de comando los siguientes argumentos:
a. Nombre del archivo que se creará.
b. Extensión del archivo.
c. Indicador económico que se desea convertir.
d. Cantidad de pesos que se quiere cambiar.
2. Consultar la API (https://mindicador.cl/api) con el módulo https y almacenar la respuesta en una variable.
3. Crear un archivo con el módulo fs cuyos datos están formados por los argumentos recibidos por línea
de comando y su contenido basado en el template de la descripción.
4. Enviar por consola el contenido del archivo luego de que haya sido creado.
*/
