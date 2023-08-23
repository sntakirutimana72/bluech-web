import { Link } from 'react-router-dom'

const GetStarted = () => (
  <div className="get-started">
    <section className="get-started__front">
      <h1 className="text-gradient">bluech</h1>
      <p>
        Great experience is our culture. Talk to your friends, family from anywhere in the world.
      </p>
      <Link to="users/login">Join Us</Link>
      <div className="get-started__dangling-cover">
        <img src="" alt="cover" />
      </div>
    </section>
  </div>
)

export default GetStarted
