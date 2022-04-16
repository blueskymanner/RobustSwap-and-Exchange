import React from 'react'
import Grid from '@material-ui/core/Grid'
import FarmStakingCard from './FarmStakingCard'
import LotteryCard from './LotteryCard'
// import CakeWinnings from './CakeWinnings'

const FarmJoinCard = () => {

  return (
    <Grid container spacing={2} style={{ marginBottom: 24 }}>
      <Grid item sm={6} xs={12}>
        <FarmStakingCard />
      </Grid>
      <Grid item sm={6} xs={12}>
        <LotteryCard />
      </Grid>
    </Grid>
  )
}

export default FarmJoinCard
