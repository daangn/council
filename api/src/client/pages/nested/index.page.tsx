import { Link } from 'react-router-dom';

export default function NestedPage() {
  return (
    <div>
      Nested
      <Link to="/">Back to home</Link>
    </div>
  );
}
