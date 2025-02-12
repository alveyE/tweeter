import StatusItemScroller from "./StatusItemScroller";
import { FeedPresenter } from "../../presenters/FeedPresenter";

const FeedScroller = () => {
  return (
    <StatusItemScroller
      presenterGenerator={(view) => new FeedPresenter(view)}
    />
  );
};

export default FeedScroller;
