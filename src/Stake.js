import { Grid, Card, Button } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import { Keyring } from '@polkadot/api';
import BN from 'bn.js';

function Main(props) {
  const keyring = new Keyring({ type: 'sr25519' });
  const { api } = useSubstrate();
  const STAKE_AMOUNT = new BN(10 ** 20);

  const getAddressEnum = (address) => (
    { 'Evm': address }
  );

  const onStake = () => {
    const stakerList = [
      ['//Alice', '0x0000000000000000000000000000000000000006'],
      ['//Bob', '0x0000000000000000000000000000000000000007'],
      ['//Charlie', '0x0000000000000000000000000000000000000005']
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
        <Card.Content textAlign='center'>
          <Button onClick={onStake}>Stake</Button>
        </Card.Content>
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
