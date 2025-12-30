const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');

const root = protobuf.loadSync('employee.proto');
const EmployeeList = root.lookupType('Employees');

const employees = [];

employees.push({
  id: 1,
  name: 'Ali',
  salary: 9000
});

employees.push({
  id: 2,
  name: 'Kamal',
  salary: 22000
});

employees.push({
  id: 3,
  name: 'Amal',
  salary: 23000
});

let jsonObject = { employee: employees };

const jsonData = JSON.stringify(jsonObject);

const options = {
  compact: true,
  ignoreComment: true,
  spaces: 0
};

const xmlData = "<root>\n" + convert.json2xml(jsonObject, options) + "\n</root>";

let errMsg = EmployeeList.verify(jsonObject);
if (errMsg) {
  throw Error(errMsg);
}

const message = EmployeeList.create(jsonObject);
const buffer = EmployeeList.encode(message).finish();

fs.writeFileSync('data.json', jsonData);
fs.writeFileSync('data.xml', xmlData);
fs.writeFileSync('data.proto', buffer);

const jsonFileSize = fs.statSync('data.json').size;
const xmlFileSize = fs.statSync('data.xml').size;
const protoFileSize = fs.statSync('data.proto').size;

console.log(`Taille de 'data.json' : ${jsonFileSize} octets`);
console.log(`Taille de 'data.xml'  : ${xmlFileSize} octets`);
console.log(`Taille de 'data.proto': ${protoFileSize} octets`);
