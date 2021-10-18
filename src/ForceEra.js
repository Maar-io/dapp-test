import { Grid, Card, Button } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import { Keyring } from '@polkadot/api';

const INIT_BALANCE = parseInt(100_000_000_000_000);
function Main(props) {
  const keyring = new Keyring({ type: 'sr25519' });

  const { api } = useSubstrate();
  const admin = keyring.addFromUri('//Alice');

  
  const getAddressEnum = (address) => (
    { 'Evm': address }
    );
    
    // Create a extrinsic, transferring randomAmount units to Bob.
    
    const onForce = () => {
      const forceNewEra = api.tx.sudo.sudo( api.tx.dappsStaking.forceNewEra() );
      forceNewEra.signAndSend(admin, ({ events = [], status }) => {
        if (status.isInBlock) {
          console.log('Successful forceNewEra with hash ' + status.asInBlock.toHex());
        } else {
          console.log('Status of transfer: ' + status.type);
        }

        events.forEach(({ phase, event: { data, method, section } }) => {
          console.log(phase.toString() + ' : ' + section + '.' + method + ' ' + data.toString());
        });
      }
      ).catch(console.error);
  }

  return (
    <Grid.Column>
      <Card>
        <Card.Content textAlign='center'>
          <Button onClick={onForce}>Force New Era</Button>
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
