import { Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { ProjectionAreaChart } from './components/ProjectionAreaChart'
import { ProjectionStepList } from './components/ProjectionStepList'
import { ProjectionRecommendationCard } from './components/ProjectionRecommendationCard'
import { useProjectionData } from './useProjectionData'

export function ProjectionPage(): React.JSX.Element {
  const projectionData = useProjectionData()

  return (
    <Grid container spacing={4} component="section" aria-label="Proyección del mes">
      <Grid size={{ xs: 12, md: 7 }}>
        <Stack spacing={3}>
          <ProjectionAreaChart series={projectionData.series} />
          <ProjectionRecommendationCard data={projectionData} />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <ProjectionStepList data={projectionData} />
      </Grid>
    </Grid>
  )
}
