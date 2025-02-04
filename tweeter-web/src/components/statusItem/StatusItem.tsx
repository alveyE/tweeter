import React from "react";
import { Link } from "react-router-dom";
import { Status } from "tweeter-shared";
import Post from "./Post";
import useUserNavigation from "../../hooks/userNavigationHook";

interface Props {
  status: Status;
}

const StatusItem: React.FC<Props> = (props: Props) => {
  const { navigateToUser } = useUserNavigation();

  return (
    <div className="row mb-3 mx-0 px-0 border rounded bg-white">
      <div className="col bg-light mx-0 px-0">
        <div className="container px-0">
          <div className="row mx-0 px-0">
            <div className="col-auto p-3">
              <img
                src={props.status.user.imageUrl}
                className="img-fluid"
                width="80"
                alt="Posting user"
              />
            </div>
            <div className="col">
              <h2>
                <b>
                  {props.status.user.firstName} {props.status.user.lastName}
                </b>{" "}
                -{" "}
                <Link
                  to={props.status.user.alias}
                  onClick={(event) => navigateToUser(event)}
                >
                  {props.status.user.alias}
                </Link>
              </h2>
              {props.status.formattedDate}
              <br />
              <Post status={props.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;
