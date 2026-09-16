import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import BarChartIcon from '@mui/icons-material/BarChart'
import PieChartIcon from '@mui/icons-material/PieChart'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { ReportChartType } from '../typings/enums'
import type { ChartTypeToggleProps } from '../typings/props'

export function ChartTypeToggle({ value, onChange }: ChartTypeToggleProps): React.JSX.Element {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      onChange={(_event, next: ReportChartType | null) => next && onChange(next)}
      size="small"
      aria-label="Tipo de gráfico"
    >
      <ToggleButton value={ReportChartType.BAR} aria-label="Gráfico de barras">
        <BarChartIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value={ReportChartType.PIE} aria-label="Gráfico de torta">
        <PieChartIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value={ReportChartType.LINE} aria-label="Gráfico de líneas">
        <ShowChartIcon fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
