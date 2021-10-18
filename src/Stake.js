import { Card, Form, Grid } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import { Keyring } from '@polkadot/api';
import BN from 'bn.js';

function Main(props) {
  const keyring = new Keyring({ type: 'sr25519' });
  const { api } = useSubstrate();
  const STAKE_AMOUNT = new BN('100000000000000000000');

  const getAddressEnum = (address) => (
    { 'Evm': address }
  );

  const onStake = () => {
    const stakerList = [
      ['//Alice', '0x0000000000000000000000000000000000000005'],
      ['//Bob', '0x0000000000000000000000000000000000000006'],
    ];
    stakerList.forEach((s) => {
      const staker = keyring.addFromUri(s[0]);
      const contract = s[1];
      const stake = api.tx.dappsStaking.bondAndStake(getAddressEnum(contract), STAKE_AMOUNT);
      stake.signAndSend(staker, ({ events = [], status }) => {
        if (status.isInBlock) {
          console.log('Successful stake of ' + contract + ' with balance ' + STAKE_AMOUNT);
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

  return (
    <Grid.Column>
      <Card>
        <Form widths='equal'>
          <Form.Group widths='equal'>
            <Form.Input fluid label='stakers' placeholder='num stakers (1-7)' />
            <Form.Input fluid label='amount' placeholder='amount' />
          </Form.Group>
          <Form.Button onClick={onStake}>Stake</Form.Button>
        </Form>
      </Card>
    </Grid.Column>
  );
}

export default function Stake(props) {
  const { api } = useSubstrate();
  return api.tx.dappsStaking &&
    api.tx.dappsStaking.bondAndStake
    ? <Main {...props} />
    : null;
}
