import { Link } from 'react-router-dom';

export default function IndexPage() {
  return (
    <div>
      Hello World
      <ul>
        <li>
          <Link to="/test">To Test</Link>
        </li>
        <li>
          <Link to="/nested">To Nested Route</Link>
        </li>
      </ul>
    </div>
  );
}
