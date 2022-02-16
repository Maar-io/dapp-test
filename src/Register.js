import React, { useEffect, useState } from 'react';

import { Form, Card, Grid} from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import { Keyring } from '@polkadot/api';

function Main(props) {
  const keyring = new Keyring({ type: 'sr25519' });
  const [numRegistrations, setNumRegistrations] = useState(0);


  const { api } = useSubstrate();

  const getAddressEnum = (address) => (
    { 'Evm': address }
  );

  const onRegister = () => {
    const devList = props.list;

    // endowment(developer);
    devList.forEach((dev) => {
      const developer = keyring.addFromUri(dev[0]);
      console.log('try register from developer: ', developer, developer.address);
      const contract = dev[1];
      const register = api.tx.dappsStaking.register(getAddressEnum(contract));
      register.signAndSend(developer, ({ events = [], status }) => {
        if (status.isInBlock) {
          console.log('registering developer: ' + developer.address);
          console.log('Successful registration of ' + contract + ' with hash ' + status.asInBlock.toHex());
        } else {
          console.log('Status of transfer: ' + status.type);
        }

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(phase.toString() + ' : ' + section + '.' + method + ' ' + data.toString());
        });
      }
      ).catch(console.error);
    });
  }

  // const endowment = async (account) => {
  //   const INIT_BALANCE = parseInt(100_000_000_000_000);
  //   const richGirl = keyring.addFromUri('//Alice');
  //   const unsub = await api.tx.balances
  //     .transfer(account, INIT_BALANCE).catch(console.error)
  //     .signAndSend(richGirl, ({ events = [], status }) => {
  //       if (status.isInBlock) {
  //         console.log('Successful tx with hash ' + status.asInBlock.toHex());
  //       } else {
  //         console.log('Status of transfer: ' + status.type);
  //       }

  //       events.forEach(({ phase, event: { data, method, section } }) => {
  //         console.log(phase.toString() + ' : ' + section + '.' + method + ' ' + data.toString());
  //       });
  //     }
  //     ).catch(console.error);
  // }

  useEffect( () => {
    setNumRegistrations(props.list.length);
  }, [props.list.length]);

  return (
    <Grid.Column>
      <Card>
        <Form widths='equal'>
          <Form.Group widths='equal'>
            <Form.Input fluid label='Register contracts (1-7)' placeholder={numRegistrations} />
          </Form.Group>
          <Form.Button onClick={onRegister}>Register</Form.Button>
        </Form>
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
