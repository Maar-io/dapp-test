import React, { useEffect, useState } from 'react';
import { Card, Form } from 'semantic-ui-react';
import { Keyring } from '@polkadot/api';

import { useSubstrate } from './substrate-lib';
const keyring = new Keyring({ type: 'sr25519' });


function Main (props) {
  const { api } = useSubstrate();
  const [allContracts, setAllContracts] = useState([]);

  const getAddressEnum = (address) => (
    { 'Evm': address }
  );

  const claimAllContracts = () => {
    const claimerList = [
      '//Alice', '//Bob'
    ];    
    let i = 0;
    
    allContracts.forEach(contract => {
      const claimer = keyring.addFromUri(claimerList[i]);
      console.log("claim contract", i, contract);
      i += 1;
      const claim = api.tx.dappsStaking.claim(getAddressEnum(contract));
      claim.signAndSend(claimer, ({ events = [], status }) => {
        if (status.isInBlock) {
          console.log('Successful claim of ' + contract);
        } else {
          console.log('Status of transfer: ' + status.type);
        }
        

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(phase.toString() + ' : ' + section + '.' + method + ' ' + data.toString());
        });
      }
      ).catch(console.error);
    });
  };
  
  const getAllContracts = () => {
    let unsubscribe;
    
    unsubscribe = api.query.dappsStaking.registeredDapps.keys().then(
      result => {
        const contractList = result.map(c => '0x' + c.toString().slice(-40))
        setAllContracts(contractList);
        console.log("claim get all contractList", contractList);
      }
      )
      .catch(console.error);

    return () => unsubscribe;
  };

  useEffect(getAllContracts, []);

  return (
    <Card>
      <Form widths='equal'>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Contracts to claim' placeholder='num contracts (1-7)' />
        </Form.Group>
        <Form.Button onClick={claimAllContracts}>Claim</Form.Button>
      </Form>
    </Card>
  );
}

export default function Claim (props) {
  const { api } = useSubstrate();
  return api.query.dappsStaking &&
    api.query.dappsStaking.registeredDapps
    ? <Main {...props} />
    : null;
}
