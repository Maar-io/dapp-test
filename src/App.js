import React, { useState } from 'react';
import { Dimmer, Loader, Grid, Message, Divider, Container } from 'semantic-ui-react';
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
  const [contractList] = useState(null);
  const { apiState, keyringState, apiError } = useSubstrate();

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

  // const contextRef = createRef();

  return (
    <div className="App">
      <Container>
        <h1>dApps Staking tester</h1>
      <style>
          {`
            html, body {
              background-color: #283925 !important;
            }
          }
          `}
        </style>
      <Grid stackable columns='equal'>
          <Grid.Row stretched>
            <EraNumber/>
            <DappsCount/>
            <EraStaked/>
            <NodeInfo/>
          </Grid.Row>
          <Divider/>
          <Grid.Row stretched>
            <Register/>
            <Stake/>
            <Unstake/>
          </Grid.Row>
          <Grid.Row stretched>
            <ForceEra/>
            <Claim/>
          </Grid.Row>

      </Grid>
      </Container>
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