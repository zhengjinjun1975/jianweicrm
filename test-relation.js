const fs = require('fs');
const token = fs.readFileSync('token.txt', 'utf8').trim();

const projectId = '8d64381d-6246-4f87-a82e-81141ca520f6';
const companyId = 'a59775b2-0b62-4b46-98ec-c88302621924';

const payload = {
  type: 'MANY_TO_ONE',
  targetObjectMetadataId: companyId,
  targetFieldLabel: '项目',
  targetFieldIcon: 'IconBuildingSkyscraper'
};

const query = 'mutation CreateRelation($payload: JSON!) {' +
  '  createOneField(input: {' +
  '    field: {' +
  '      name: "sypjtcompany"' +
  '      label: "客户公司"' +
  '      type: RELATION' +
  '      objectMetadataId: "' + projectId + '"' +
  '      isLabelSyncedWithName: false' +
  '      relationCreationPayload: $payload' +
  '    }' +
  '  }) {' +
  '    id' +
  '    name' +
  '    relation {' +
  '      type' +
  '      targetFieldMetadata { id name }' +
  '    }' +
  '  }' +
  '}';

const body = JSON.stringify({ query, variables: { payload } });

const http = require('http');
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/metadata',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data));
});
req.on('error', (e) => console.error(e));
req.write(body);
req.end();
