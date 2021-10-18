import React, { useEffect, useState } from 'react';
import { Statistic, Grid, Card, Icon, Progress } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main(props) {
  const { api } = useSubstrate();
  const [era, setCurrentEra] = useState(0);
  const [blockCountdown, setBlockCountdown] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bestNumber, setBestNumber] = useState(0);
  const [blockPerEra, setBlockPerEra] = useState(0);

  const getBest = () => {
    const perEra = api.consts.dappsStaking.blockPerEra.toNumber();
    setBlockPerEra(perEra);
    const best = api.derive.chain.bestNumber;
    setBestNumber(best);
  }
  useEffect(getBest, [api.consts.dappsStaking.blockPerEra, api.derive.chain.bestNumber]);

  useEffect(() => {
    let unsubscribeAll = null;

    setProgress((bestNumber % blockPerEra) / blockPerEra * 100);
    setBlockCountdown(blockPerEra - (bestNumber % blockPerEra));

    api.query.dappsStaking.currentEra(e => {
      setCurrentEra(e.toNumber());
    }).catch(console.error);


    return () => unsubscribeAll && unsubscribeAll();
  }, [api.query.dappsStaking, blockPerEra, bestNumber]);

  return (
    <Grid.Column>
      <Card color='purple'>
        <Card.Content textAlign='center'>
          <Statistic
            label='Current Era'
            value={era}
          />
        </Card.Content>
        <Card.Content extra>
          <Progress percent={progress} indicating success />
          Blocks until new era :
          <Icon name='time' /> {blockCountdown}
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}

export default function CurrentEra(props) {
  const { api } = useSubstrate();
  return api.query.dappsStaking.currentEra
    ? <Main {...props} />
    : null;
}
