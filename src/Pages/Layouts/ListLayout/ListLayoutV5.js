import { Outlet } from "react-router-dom";
import {
  FullScreenLoader,
  SongsListContainer,
  Navigator,
  MusicPlayer,
} from ".";
import { useGetStatus } from "../../../API/status/queryHooks";

const ListLayoutV5 = () => {
  const { isLoading, isError } = useGetStatus();

  if (isError) return <div>Something went wrong on server side</div>;

  if (isLoading) return <FullScreenLoader />;

  return (
    <div className="flex w-screen h-screen">
      <SongsListContainer />
      <div className="flex-grow flex flex-col">
        <div className="flex-grow relative">
          <Navigator />
          <Outlet />
        </div>
        <MusicPlayer />
      </div>
    </div>
  );
};

export default ListLayoutV5;
