import PropTypes from 'prop-types';
import { useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
  const err = useRouteError();
  if (err)
    return (
      <div>
        <h1>{err.status}</h1>
        {err.data}
      </div>
    );
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};
