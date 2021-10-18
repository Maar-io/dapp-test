import React, { useState, createRef } from 'react';
import { Dimmer, Loader, Grid, Message, Divider } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';

import NodeInfo from './NodeInfo';
import EraNumber from './EraNumber';
import DappsCount from './DappsCount';
import EraStaked from './EraStaked';

import Register from './Register';
import Stake from './Stake';
import Unstake from './Unstake';
import Claim from './Claim';
import ForceEra from './ForceEra';


function Main () {
  const [accountAddress] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef();

  return (
    <div className="App">
      <Grid stackable columns='equal'>
          <Grid.Row stretched>
            <EraNumber/>
              <NodeInfo/>
              <DappsCount/>
              <EraStaked/>
          </Grid.Row>
          <Divider/>
          <Grid.Row>
              <Register/>
          </Grid.Row>
          <Grid.Row>
              <Stake/>
              <Unstake/>
              <Claim/>
          </Grid.Row>
          <Grid.Row>
              <ForceEra/>
          </Grid.Row>
      </Grid>
    </div>
  );
}

export default function App () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}