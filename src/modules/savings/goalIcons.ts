import type { SvgIconComponent } from '@mui/icons-material'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import ChairIcon from '@mui/icons-material/Chair'
import LaptopMacIcon from '@mui/icons-material/LaptopMac'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import SchoolIcon from '@mui/icons-material/School'
import HomeIcon from '@mui/icons-material/Home'
import CelebrationIcon from '@mui/icons-material/Celebration'
import PetsIcon from '@mui/icons-material/Pets'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import FlagIcon from '@mui/icons-material/Flag'

export const GOAL_ICON_OPTIONS: Array<{ value: string; label: string; Icon: SvgIconComponent }> = [
  { value: 'flag', label: 'Meta general', Icon: FlagIcon },
  { value: 'beach_access', label: 'Vacaciones', Icon: BeachAccessIcon },
  { value: 'chair', label: 'Muebles y hogar', Icon: ChairIcon },
  { value: 'laptop_mac', label: 'Tecnología', Icon: LaptopMacIcon },
  { value: 'directions_car', label: 'Vehículo', Icon: DirectionsCarIcon },
  { value: 'school', label: 'Estudios', Icon: SchoolIcon },
  { value: 'home', label: 'Vivienda', Icon: HomeIcon },
  { value: 'celebration', label: 'Evento', Icon: CelebrationIcon },
  { value: 'pets', label: 'Mascotas', Icon: PetsIcon },
  { value: 'medical_services', label: 'Salud', Icon: MedicalServicesIcon }
]

export function getGoalIcon(icon: string): SvgIconComponent {
  return GOAL_ICON_OPTIONS.find((option) => option.value === icon)?.Icon ?? FlagIcon
}
