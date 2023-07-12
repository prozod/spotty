import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();
  console.error(error);
  if (isRouteErrorResponse(error)) {
    return (
      <section className="flex items-center justify-center w-full h-screen gap-8 bg-gradient-to-t from-grack-900 to-grack-800">
        <img
          src="https://i.imgur.com/PfA0M2o.gif?noredirect"
          className="rounded-lg"
        />
        <div className="flex flex-col gap-12">
          <span>
            <p className="flex items-center gap-2 px-3 py-1 text-sm font-bold text-black bg-white rounded-full w-fit">
              <span className="w-[10px] h-[10px] bg-red-500 rounded-full block before:rounded-full before:bg-red-500 before:animate-ping before:w-[10px] before:h-[10px] before:content-[''] before:absolute relative"></span>
              {error.status}
            </p>
            <p className="text-3xl font-bold">Woah there buddy!</p>
            <p className="text-3xl font-bold leading-[20px] mb-4">
              You look lost!
            </p>
            <p className="mb-4 font-semibold w-[300px]">
              This page doesn't exist, make sure the URL is correct.
            </p>
          </span>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-sm font-bold text-black rounded-full w-fit bg-spotify"
          >
            Take me back
          </button>
        </div>
      </section>
    );
  } else {
    return <p>{(error as Error).message || "Unknown Error"}</p>;
  }
}

export default ErrorPage;
