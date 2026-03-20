import '../App.css'
import { EmbeddedPageFrame } from '../components/EmbeddedPageFrame'
import { APP_TITLE, TRANSVIET_CLONE_PATH } from '../config'

export function HomePage() {
  return <EmbeddedPageFrame src={TRANSVIET_CLONE_PATH} title={APP_TITLE} />
}
