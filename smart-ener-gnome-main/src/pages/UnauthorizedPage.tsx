import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">403</h1>
        <p className="mb-4 text-xl text-muted-foreground">You are not authorized to view this page.</p>
        <Link to="/dashboard" className="text-primary underline hover:text-primary/90">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
