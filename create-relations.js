const fs = require('fs');
const token = fs.readFileSync('token.txt', 'utf8').trim();

const projectId = '8d64381d-6246-4f87-a82e-81141ca520f6';
const quoteId = 'e4e7555b-4daf-4558-bc60-2e10444a95d4';
const contractId = '98380c32-2a4f-4d0d-a644-5501773ba30d';
const companyId = 'a59775b2-0b62-4b46-98ec-c88302621924';
const personId = '5d992d57-b690-4038-bbdd-97979e73916d';
const workspaceMemberId = '7541742a-2d0f-43bf-8c6c-226135561629';

const relations = [
  { name: 'sypjtcompany', label: '客户公司', source: projectId, target: companyId, targetLabel: '项目', icon: 'IconBuildingSkyscraper' },
  { name: 'sypjtcontact', label: '客户联系人', source: projectId, target: personId, targetLabel: '项目', icon: 'IconBuildingSkyscraper' },
  { name: 'sypjtowner', label: '负责人', source: projectId, target: workspaceMemberId, targetLabel: '负责项目', icon: 'IconBuildingSkyscraper' },
  { name: 'syqotproject', label: '所属项目', source: quoteId, target: projectId, targetLabel: '报价', icon: 'IconFileDescription' },
  { name: 'syqotcompany', label: '客户公司', source: quoteId, target: companyId, targetLabel: '报价', icon: 'IconFileDescription' },
  { name: 'syctrproject', label: '所属项目', source: contractId, target: projectId, targetLabel: '合同', icon: 'IconFileText' },
  { name: 'syctrquote', label: '关联报价', source: contractId, target: quoteId, targetLabel: '合同', icon: 'IconFileText' },
  { name: 'syctrcompany', label: '客户公司', source: contractId, target: companyId, targetLabel: '合同', icon: 'IconFileText' },
];

function makeRequest(query, variables) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
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
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  for (const rel of relations) {
    const payload = {
      type: 'MANY_TO_ONE',
      targetObjectMetadataId: rel.target,
      targetFieldLabel: rel.targetLabel,
      targetFieldIcon: rel.icon
    };

    const query = 'mutation CreateRelation($payload: JSON!) {' +
      '  createOneField(input: {' +
      '    field: {' +
      '      name: "' + rel.name + '"' +
      '      label: "' + rel.label + '"' +
      '      type: RELATION' +
      '      objectMetadataId: "' + rel.source + '"' +
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

    try {
      const result = await makeRequest(query, { payload });
      if (result.data && result.data.createOneField) {
        console.log('✅ ' + rel.name + ' (' + rel.label + ') created');
      } else {
        console.log('❌ ' + rel.name + ' error: ' + JSON.stringify(result.errors));
      }
    } catch(e) {
      console.log('❌ ' + rel.name + ' error: ' + e.message);
    }
  }
  console.log('');
  console.log('=== Step 2 DONE ===');
}

main();
