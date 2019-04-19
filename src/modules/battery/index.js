// @flow
import * as React from 'react'
import useSpawn from 'hooks/useSpawn'

const BATTERY_STATE_CHANGE: 'BATTERY_STATE_CHANGE' = 'BATTERY_STATE_CHANGE'

type BatteryState = {
  state: 'Charging' | 'Discharging' | 'Unknown' | 'Full',
  charge: number,
}

function Battery() {
  const rawBattery = useSpawn('battery', ['-sn1'])
  if (!rawBattery) {
    return null
  }
  const [state, charge] = rawBattery[0].split(' ')
  let icon = ''
  if(+charge >= 25) {
    icon = "" // quater
  }
  if(+charge >= 50) {
    icon = "" // half
  }
  if(+charge > 95) {
    icon = "" //full
  }
  return (
    <text>
      {icon} {state} {charge && `${charge}%`}
    </text>
  )
}
export default Battery
