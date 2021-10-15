import React, { useEffect, useState } from 'react';
import { Statistic, Grid, Card, Button } from 'semantic-ui-react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useSubstrate } from './substrate-lib';
import { Keyring } from '@polkadot/api';

const INIT_BALANCE = 100_000_000_000_000;
function Main(props) {
  const keyring = new Keyring({ type: 'sr25519' });

  const { api } = useSubstrate();
  const [dappsCount, setDappsCount] = useState(0);

  const contract = '0x0000000000000000000000000000000000000003';
  // const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  const richGirl = keyring.addFromUri('//Alice');
  const developer = keyring.addFromUri('//Bob');

  const getAddressEnum = (address) => (
    { 'Evm': address }
  );

  // Create a extrinsic, transferring randomAmount units to Bob.

  const onRegister = () => {
    const injector = web3FromSource('polkadot-js');
    //endowment(developer);
    const register = api.tx.dappsStaking.register(getAddressEnum(contract));
    register.signAndSend(developer, ({ events = [], status }) => {
      if (status.isInBlock) {
        console.log('Successful registration of ' + contract + ' with hash ' + status.asInBlock.toHex());
      } else {
        console.log('Status of transfer: ' + status.type);
      }

      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log(phase.toString() + ' : ' + section + '.' + method + ' ' + data.toString());
      });
    }
    ).catch(console.error);
  }

  const endowment = async (account) => {
    const unsub = await api.tx.balances
      .transfer(account, INIT_BALANCE).catch(console.error)
      .signAndSend(richGirl, ({ events = [], status }) => {
        if (status.isInBlock) {
          console.log('Successful tx with hash ' + status.asInBlock.toHex());
        } else {
          console.log('Status of transfer: ' + status.type);
        }

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(phase.toString() + ' : ' + section + '.' + method + ' ' + data.toString());
        });
      }
      ).catch(console.error);
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
