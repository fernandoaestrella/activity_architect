import { Loader2 } from 'lucide-react';

const LoadingScreen = ({ error }) => {
  if (error) {
    return (
      <div className="loading-screen error">
        <div className="loading-content">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <Loader2 className="loading-spinner" />
        <h2>Loading Activity Architect</h2>
        <p>Fetching dimensions and activities...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
