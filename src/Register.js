import React, { useEffect, useState } from 'react';
import { Statistic, Grid, Card, Button } from 'semantic-ui-react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useSubstrate } from './substrate-lib';

function Main(props) {
  const { api } = useSubstrate();
  const [dappsCount, setDappsCount] = useState(0);

  // const registeredDapps = () => {
  //   let unsubscribe;

  //   unsubscribe = api.query.dappsStaking.registeredDapps.keys().then(
  //     result => {
  //       setDappsCount(result.length);
  //     }
  //   )
  //     .catch(console.error);

  //   return () => unsubscribe;
  // } 

  const contract = '0x0000000000000000000000000000000000000002';
  const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

  const getAddressEnum = (address) => (
    { 'Evm': address }
  );

  // Create a extrinsic, transferring randomAmount units to Bob.

  const onRegister = () => {
    const injector = web3FromSource('polkadot-js');
    const register = api.tx.dappsStaking.register(getAddressEnum(contract));
    register.signAndSend(
      ALICE,
      {
        signer: injector?.signer
      },
      ({ events = [], status }) => {
        if (status.isInBlock) {
          console.log('Successful registration of ' + contract + ' with hash ' + status.asInBlock.toHex());
        } else {
          console.log('Status of transfer: ' + status.type);
        }

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(phase.toString() + ' : ' + section + '.' + method + ' ' + data.toString());
        })
          ;
      }).catch(console.error);;
  }

  // useEffect(, []);

  return (
    <Grid.Column>
      <Card>
        <Card.Content textAlign='center'>
          <Button onClick={onRegister}>Register</Button>
        </Card.Content>
        <Card.Content extra>
          dapps: {dappsCount}
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}

export default function Register(props) {
  const { api } = useSubstrate();
  return api.query.dappsStaking &&
    api.query.dappsStaking.registeredDapps
    ? <Main {...props} />
    : null;
}
