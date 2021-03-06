import React, { useEffect, useState } from 'react';
import { Card, Form, Grid } from 'semantic-ui-react';
import { Keyring } from '@polkadot/api';

import { useSubstrate } from './substrate-lib';
const keyring = new Keyring({ type: 'sr25519' });


function Main(props) {
  const { api } = useSubstrate();
  const [allContracts, setAllContracts] = useState([]);
  // const [numClaims, setNumClaims] = useState(0);

  const getAddressEnum = (address) => (
    { 'Evm': address }
  );

  const claimAllContracts = () => {
    let i = 0;
    const claimerList = props.list;

    allContracts.forEach(contract => {
      const claimer = keyring.addFromUri(claimerList[i][0]);
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
        console.log("getAllContracts", contractList);
      }
    )
      .catch(console.error);

    return () => unsubscribe;
  };

  useEffect(getAllContracts, [api.query.dappsStaking.registeredDapps]);
  // useEffect( () => {
  //   setNumClaims(props.list.length);
  // }, []);

  return (
    <Grid.Column>
      <Card>
        <Form widths='equal'>
          <Form.Group widths='equal'>
            <Form.Input fluid label='Contracts to claim (1-7)' placeholder={'2'} />
          </Form.Group>
          <Form.Button onClick={claimAllContracts}>Claim</Form.Button>
        </Form>
      </Card>
    </Grid.Column>
  );
}

export default function Claim(props) {
  const { api } = useSubstrate();
  return api.query.dappsStaking &&
    api.query.dappsStaking.registeredDapps
    ? <Main {...props} />
    : null;
}
