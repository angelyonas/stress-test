console.log('Start salesforce Test')

const arrayPayload = []
let endId = 1314880504596
const numPayloads = 20

for (let i = 0; i < numPayloads; i++) {
  arrayPayload.push({
    apiUrl: 'https://heb-oms-dev.eastus.cloudapp.azure.com/salesforce/surveys',
    payload: {
      collections: [
        {
          header: {
            oms: {
              requested_event: 'ORDER_WFM_CLIENT_RECEIVED',
              customer_reference: `${endId++}-01`
            },
            customer: {
              name: 'Jonathan Arredondo',
              email: 'angel.arredondo@valtre.com'
            }
          },
          order_sections: [
            {
              origin: {
                store_id: 'heb_2992'
              }
            }
          ]
        }
      ]
    }
  })
}

console.log('Array payloads: ', JSON.stringify(arrayPayload), '\n')
