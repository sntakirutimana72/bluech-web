import { Link } from 'react-router-dom'
import { urls } from '@/config/routes'
import LogoCover from '@/assets/logos/logo.png'

const GetStarted = () => (
  <div className="get-started">
    <section className="get-started--front">
      <img src={LogoCover} className="get-started--dangling-cover" alt="cover" />
      <h1>bluech</h1>
      <p>
        Great experience is our culture. Talk to your friends, family from anywhere in the world.
      </p>
      <Link to={urls.LOGIN}>Join Us</Link>
    </section>
  </div>
)

export default GetStarted
